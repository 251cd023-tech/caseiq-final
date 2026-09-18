const { cases, precedentRelationships } = require('../data/seedData');

// Helper to format case object with all requested schema fields
const formatCaseObject = (c) => {
  if (!c) return null;
  const analysis = c.analysis || {};
  const argumentsData = analysis.arguments || {};
  const formattedArguments = typeof argumentsData === 'string'
    ? argumentsData
    : `Petitioner: ${argumentsData.petitioner || 'N/A'}\nRespondent: ${argumentsData.respondent || 'N/A'}`;

  return {
    id: c.id,
    numericId: c.numericId,
    name: c.caseName || c.name,
    caseName: c.caseName || c.name,
    court: c.court,
    year: c.year || (c.judgmentDate ? parseInt(c.judgmentDate.slice(-4)) : 2020),
    judgmentDate: c.judgmentDate,
    caseNumber: c.citation || c.caseNumber || `SC/${c.year || 2020}/${c.numericId || 1}`,
    citation: c.citation || c.caseNumber,
    judges: c.bench || c.judges,
    bench: c.bench || c.judges,
    summary: analysis.decision || c.summary || c.description || '',
    importantFacts: analysis.facts || c.importantFacts || '',
    keyLegalPrinciples: analysis.reasoning || c.keyLegalPrinciples || '',
    issues: analysis.issues || c.issues || '',
    arguments: formattedArguments,
    decision: analysis.decision || c.decision || '',
    reasoning: analysis.reasoning || c.reasoning || '',
    judgmentText: c.judgmentText || `[Full Text of Judgment - ${c.court}]\n\nCitation: ${c.citation}\nBench: ${c.bench}\n\nFacts:\n${analysis.facts}\n\nIssues:\n${analysis.issues}\n\nDecision:\n${analysis.decision}\n\nRatio Decidendi:\n${analysis.reasoning}`,
    relevanceAnalysis: c.relevanceAnalysis !== undefined ? c.relevanceAnalysis : null,
    analysis: c.analysis,
    legalTopics: c.legalTopics || [],
    source: c.source,
    sourceUrl: c.sourceUrl,
    verified: c.verified
  };
};

// GET /api/cases
exports.getCases = (req, res) => {
  try {
    const { court, topic, search } = req.query;
    let results = [...cases];

    if (court) {
      results = results.filter(c => c.court.toLowerCase().includes(court.toLowerCase()));
    }

    if (topic && topic !== 'all') {
      results = results.filter(c =>
        c.legalTopics && c.legalTopics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
      );
    }

    if (search) {
      const s = search.toLowerCase();
      results = results.filter(c =>
        c.caseName.toLowerCase().includes(s) ||
        c.citation.toLowerCase().includes(s) ||
        c.bench.toLowerCase().includes(s) ||
        (c.analysis && (
          c.analysis.decision.toLowerCase().includes(s) ||
          c.analysis.facts.toLowerCase().includes(s)
        ))
      );
    }

    const formattedCases = results.map(formatCaseObject);

    return res.status(200).json({
      success: true,
      count: formattedCases.length,
      cases: formattedCases
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch cases' });
  }
};

// GET /api/cases/:id
exports.getCaseById = (req, res) => {
  try {
    const { caseId, id } = req.params;
    const targetId = (caseId || id || '').toLowerCase();

    const caseItem = cases.find(c =>
      c.id.toLowerCase() === targetId ||
      String(c.numericId) === targetId ||
      c.caseName.toLowerCase().includes(targetId)
    ) || cases[parseInt(targetId) - 1];

    if (!caseItem) {
      return res.status(404).json({
        success: false,
        error: `Case with id '${targetId}' not found in the legal repository.`,
        message: `Case with id '${targetId}' not found in the legal repository.`
      });
    }

    const formattedCase = formatCaseObject(caseItem);
    const relationships = precedentRelationships.filter(
      r => r.sourceCaseId === caseItem.id || r.targetCaseId === caseItem.id
    );

    // If request accepts frontend standard format or direct object format
    return res.status(200).json({
      ...formattedCase,
      success: true,
      case: formattedCase,
      relationships
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch case details' });
  }
};

// GET /api/cases/:id/precedents (getCasePrecedents)
exports.getCasePrecedents = (req, res) => {
  try {
    const { caseId, id } = req.params;
    const targetId = (caseId || id || '').toLowerCase();

    const caseItem = cases.find(c =>
      c.id.toLowerCase() === targetId ||
      String(c.numericId) === targetId ||
      c.caseName.toLowerCase().includes(targetId)
    ) || cases[parseInt(targetId) - 1];

    if (!caseItem) {
      return res.status(404).json({
        error: `Case '${targetId}' not found.`
      });
    }

    // Find all precedent relations where this case is source or target
    const linkedRels = precedentRelationships.filter(
      r => r.sourceCaseId === caseItem.id || r.targetCaseId === caseItem.id
    );

    const validRelationshipTypes = ['Followed', 'Referred', 'Distinguished', 'Overruled'];

    const precedents = linkedRels.map(rel => {
      const isSource = rel.sourceCaseId === caseItem.id;
      const otherCaseId = isSource ? rel.targetCaseId : rel.sourceCaseId;
      const otherCase = cases.find(c => c.id === otherCaseId);

      const relType = validRelationshipTypes.includes(rel.relationshipType)
        ? rel.relationshipType
        : 'Referred';

      let relevanceStatus = 'Affirmed';
      if (relType === 'Overruled') relevanceStatus = 'Overturned';
      else if (relType === 'Distinguished') relevanceStatus = 'Distinguished';
      else if (relType === 'Referred') relevanceStatus = 'Cited';

      return {
        caseId: otherCase ? otherCase.id : otherCaseId,
        name: otherCase ? (otherCase.caseName || otherCase.name) : (isSource ? rel.targetCaseName : rel.sourceCaseName),
        court: otherCase ? otherCase.court : 'Supreme Court of India',
        year: otherCase ? otherCase.year : (rel.citation && rel.citation.match(/\b(19\d\d|20\d\d)\b/) ? parseInt(rel.citation.match(/\b(19\d\d|20\d\d)\b/)[0]) : 2015),
        relationshipType: relType,
        relevanceStatus,
        citation: rel.citation,
        notes: rel.notes
      };
    });

    return res.status(200).json(precedents);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch precedents' });
  }
};

// GET /api/cases/:id/relationships & GET /api/cases/relationships
exports.getCaseRelationships = (req, res) => {
  try {
    const { caseId, id } = req.params;
    const targetId = req.query.caseId || caseId || id;

    if (!targetId || targetId === 'all') {
      return res.status(200).json({
        success: true,
        caseName: 'All Precedent Relationships',
        count: precedentRelationships.length,
        relationships: precedentRelationships
      });
    }

    const foundCase = cases.find(c =>
      c.id.toLowerCase() === targetId.toLowerCase() ||
      String(c.numericId) === targetId ||
      c.caseName.toLowerCase().includes(targetId.toLowerCase())
    ) || cases[parseInt(targetId) - 1];

    const actualId = foundCase ? foundCase.id : targetId;

    const relationships = precedentRelationships.filter(
      r => r.sourceCaseId === actualId || r.targetCaseId === actualId
    );

    return res.status(200).json({
      success: true,
      caseName: foundCase ? foundCase.caseName : 'Precedent Graph',
      caseId: actualId,
      count: relationships.length,
      relationships
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch relationships' });
  }
};
