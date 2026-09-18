const { lawMappings, cases, precedentRelationships } = require('../data/seedData');

// POST /api/law-comparison (compareLaw) { section }
exports.compareLaw = (req, res) => {
  try {
    const { section } = req.body;
    if (!section || !String(section).trim()) {
      return res.status(400).json({
        success: false,
        error: 'Section parameter is required for law comparison.'
      });
    }

    const secQuery = String(section).toLowerCase().replace(/[^a-z0-9]/gi, ' ').trim();
    const queryTokens = secQuery.split(/\s+/).filter(Boolean);

    // Find match across oldSection, newSection, oldTitle, newTitle, etc.
    const mapping = lawMappings.find(m => {
      const oldSec = (m.oldSection || '').toLowerCase();
      const newSec = (m.newSection || '').toLowerCase();
      const oldTitle = (m.oldTitle || '').toLowerCase();
      const newTitle = (m.newTitle || '').toLowerCase();
      const id = (m.id || '').toLowerCase();

      // Exact match check
      if (oldSec.includes(secQuery) || newSec.includes(secQuery) || id === secQuery) return true;

      // Token match check (e.g. "302", "103", "378", "305", "420", "318", "498a", "85")
      return queryTokens.some(token => {
        if (token.length < 2) return false;
        return oldSec.includes(token) || newSec.includes(token) || oldTitle.includes(token) || newTitle.includes(token);
      });
    });

    if (!mapping) {
      return res.status(404).json({
        error: `No statutory reform mapping found for section: ${section}`
      });
    }

    // Determine relationship type: replaced | amended | equivalent | superseded
    let relationshipType = 'replaced';
    if (mapping.category && mapping.category.toLowerCase().includes('procedural')) {
      relationshipType = 'amended';
    } else if (mapping.category && mapping.category.toLowerCase().includes('evidence')) {
      relationshipType = 'superseded';
    } else if (mapping.punishmentChange && mapping.punishmentChange.toLowerCase().includes('restructured')) {
      relationshipType = 'amended';
    }

    // Resolve related precedents
    const relatedPrecedents = (mapping.relatedPrecedentIds || []).map(pId => {
      const c = cases.find(item => item.id === pId);
      if (!c) return null;
      const rel = precedentRelationships.find(r => r.sourceCaseId === c.id || r.targetCaseId === c.id);
      return {
        caseId: c.id,
        name: c.caseName || c.name,
        caseName: c.caseName || c.name,
        court: c.court,
        year: c.year,
        relationshipType: rel ? rel.relationshipType : 'Followed',
        relevanceStatus: rel && rel.relationshipType === 'Overruled' ? 'Overturned' : 'Affirmed'
      };
    }).filter(Boolean);

    // If no explicit relatedPrecedentIds, provide topic-linked landmark precedents
    if (relatedPrecedents.length === 0) {
      const topicMatches = cases.filter(c => {
        const topics = (c.legalTopics || []).map(t => t.toLowerCase()).join(' ');
        return (
          (mapping.oldSection.includes('302') && topics.includes('basic structure')) ||
          (mapping.oldSection.includes('498A') && topics.includes('arrest')) ||
          (mapping.oldSection.includes('65B') && topics.includes('evidence')) ||
          (mapping.category.toLowerCase().includes('privacy') && topics.includes('privacy'))
        );
      }).slice(0, 2);

      topicMatches.forEach(c => {
        const rel = precedentRelationships.find(r => r.sourceCaseId === c.id || r.targetCaseId === c.id);
        relatedPrecedents.push({
          caseId: c.id,
          name: c.caseName || c.name,
          caseName: c.caseName || c.name,
          court: c.court,
          year: c.year,
          relationshipType: rel ? rel.relationshipType : 'Followed',
          relevanceStatus: 'Affirmed'
        });
      });
    }

    const response = {
      oldLaw: {
        act: mapping.oldAct,
        section: mapping.oldSection,
        title: mapping.oldTitle,
        provision: mapping.oldProvision,
        punishment: mapping.oldPunishment || 'As prescribed under historical penal code'
      },
      newLaw: {
        act: mapping.newAct,
        section: mapping.newSection,
        title: mapping.newTitle,
        provision: mapping.newProvision,
        punishment: mapping.newPunishment || mapping.punishmentChange
      },
      relationshipType,
      whatChanged: mapping.importantDifferences || [
        mapping.punishmentChange,
        mapping.notes
      ],
      relatedPrecedents
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to process law comparison'
    });
  }
};
