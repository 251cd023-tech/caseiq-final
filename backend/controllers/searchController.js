const { acts, sections, cases, precedentRelationships, lawMappings, searchHistory } = require('../data/seedData');

// Multi-attribute legal relevance scoring engine
function calculateRelevance(item, queryTokens, queryLower) {
  let score = 0;
  const searchableParts = [
    item.title || item.caseName || item.name || '',
    item.sectionNumber || item.citation || item.caseNumber || '',
    item.content || item.description || item.oldTitle || item.newTitle || '',
    item.chapter || item.court || item.bench || '',
    item.punishment || item.punishmentChange || '',
    item.predecessorSection || item.oldSection || item.newSection || '',
    ...(item.legalTopics || []),
    ...(item.keyPoints || []),
    ...(item.importantDifferences || []),
    ...(item.relevanceTags || []),
    item.analysis ? `${item.analysis.facts} ${item.analysis.issues} ${item.analysis.decision} ${item.analysis.reasoning}` : ''
  ];
  const searchableText = searchableParts.join(' ').toLowerCase();

  // Exact phrase match bonus
  if (queryLower && searchableText.includes(queryLower)) {
    score += 50;
  }

  // Multi-token matches with positional/semantic weighting
  queryTokens.forEach(token => {
    if (token.length < 2) return;
    if (searchableText.includes(token)) {
      score += 15;
      const titleLower = (item.title || item.caseName || item.name || item.newTitle || item.oldTitle || '').toLowerCase();
      if (titleLower.includes(token)) score += 20;

      const secLower = (item.sectionNumber || item.oldSection || item.newSection || '').toLowerCase();
      if (secLower.includes(token)) score += 25;

      const tags = (item.relevanceTags || []).map(t => t.toLowerCase());
      if (tags.some(t => t.includes(token))) score += 15;
    }
  });

  // Domain specific heuristics
  if (queryLower) {
    if (queryLower.includes('theft') && queryLower.includes('dwelling')) {
      if ((item.sectionNumber && item.sectionNumber.includes('305')) || (item.oldSection && item.oldSection.includes('380'))) score += 35;
    }
    if (queryLower.includes('anticipatory bail') || (queryLower.includes('bail') && queryLower.includes('rules'))) {
      if ((item.sectionNumber && item.sectionNumber.includes('482')) || (item.caseName && item.caseName.includes('Arnesh'))) score += 35;
    }
    if (queryLower.includes('privacy') || queryLower.includes('article 21')) {
      if ((item.caseName && item.caseName.includes('Puttaswamy')) || (item.sectionNumber && item.sectionNumber.includes('Article 21'))) score += 40;
    }
    if (queryLower.includes('65b') || queryLower.includes('63') || queryLower.includes('electronic evidence')) {
      if ((item.sectionNumber && item.sectionNumber.includes('63')) || (item.oldSection && item.oldSection.includes('65B'))) score += 40;
    }
  }

  return Math.min(score, 99);
}

// Unified search execution handler
function executeSearchInternal(queryParam, typeParam, limitParam, reqUser) {
  const query = (queryParam || '').trim();
  const type = (typeParam || 'all').toLowerCase();
  const limit = Math.max(1, Math.min(100, parseInt(limitParam) || 25));

  if (!query) {
    return {
      success: true,
      query: '',
      totalResults: 0,
      results: [],
      suggestions: [
        'Theft in dwelling house',
        'Anticipatory bail rules',
        'Right to Privacy Article 21',
        'Electronic Evidence Section 65B vs 63',
        'Medical negligence Jacob Mathew',
        'Workplace sexual harassment Vishaka'
      ]
    };
  }

  const queryLower = query.toLowerCase();
  const queryTokens = queryLower
    .replace(/[^a-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2 && !['what', 'which', 'when', 'where', 'how', 'under', 'with', 'from', 'this', 'that', 'laws', 'legal', 'tell', 'about'].includes(t));

  const results = [];

  // 1. Search Sections
  if (type === 'all' || type === 'section' || type === 'sections') {
    sections.forEach(sec => {
      const score = calculateRelevance(sec, queryTokens, queryLower);
      if (score > 10 || queryTokens.length === 0) {
        const act = acts.find(a => a.id === sec.actId);
        results.push({
          id: sec.id,
          numericId: sec.numericId,
          type: 'section',
          title: `${sec.actCode} ${sec.sectionNumber}: ${sec.title}`,
          sectionNumber: sec.sectionNumber,
          actName: act ? act.name : sec.actCode,
          actCode: sec.actCode,
          chapter: sec.chapter,
          snippet: sec.content ? (sec.content.length > 240 ? sec.content.slice(0, 240) + '...' : sec.content) : '',
          punishment: sec.punishment,
          bailable: sec.bailable,
          cognizable: sec.cognizable,
          predecessorSection: sec.predecessorSection,
          relevanceScore: score > 0 ? (score / 100).toFixed(2) : '0.75',
          source: sec.source,
          sourceUrl: sec.sourceUrl,
          verified: sec.verified,
          rawItem: sec
        });
      }
    });
  }

  // 2. Search Cases & Judgments
  if (type === 'all' || type === 'case' || type === 'cases') {
    cases.forEach(c => {
      const score = calculateRelevance(c, queryTokens, queryLower);
      if (score > 10 || queryTokens.length === 0) {
        results.push({
          id: c.id,
          numericId: c.numericId,
          type: 'case',
          name: c.caseName || c.name,
          caseName: c.caseName || c.name,
          title: c.caseName || c.name,
          citation: c.citation,
          caseNumber: c.citation,
          court: c.court,
          year: c.year,
          judgmentDate: c.judgmentDate,
          legalTopics: c.legalTopics || [],
          bench: c.bench,
          judges: c.bench,
          summary: c.analysis ? c.analysis.decision : (c.summary || ''),
          snippet: c.analysis ? c.analysis.decision : (c.summary || ''),
          keyHolding: c.analysis ? c.analysis.reasoning.slice(0, 220) + '...' : '',
          relevanceScore: score > 0 ? (score / 100).toFixed(2) : '0.70',
          source: c.source,
          sourceUrl: c.sourceUrl,
          verified: c.verified,
          rawItem: c
        });
      }
    });
  }

  // 3. Search Law Mappings (Old -> New)
  if (type === 'all' || type === 'mapping' || type === 'mappings') {
    lawMappings.forEach(m => {
      const score = calculateRelevance(m, queryTokens, queryLower);
      if (score > 10 || queryTokens.length === 0) {
        results.push({
          id: m.id,
          numericId: m.numericId,
          type: 'mapping',
          title: `Reform Map: ${m.oldAct.split(',')[0]} ${m.oldSection} ➔ ${m.newAct.split(',')[0]} ${m.newSection}`,
          oldAct: m.oldAct,
          oldSection: m.oldSection,
          oldTitle: m.oldTitle,
          newAct: m.newAct,
          newSection: m.newSection,
          newTitle: m.newTitle,
          category: m.category,
          snippet: m.punishmentChange,
          punishmentChange: m.punishmentChange,
          relevanceScore: score > 0 ? (score / 100).toFixed(2) : '0.65',
          source: m.source,
          verified: m.verified,
          rawItem: m
        });
      }
    });
  }

  // 4. Search Precedent Relationships
  if (type === 'all' || type === 'precedent' || type === 'precedents') {
    precedentRelationships.forEach(rel => {
      const score = calculateRelevance(rel, queryTokens, queryLower);
      if (score > 10) {
        results.push({
          id: rel.id,
          numericId: rel.numericId,
          type: 'precedent',
          title: `Precedent Link: ${rel.sourceCaseName} [${rel.relationshipType}] ${rel.targetCaseName}`,
          sourceCaseName: rel.sourceCaseName,
          targetCaseName: rel.targetCaseName,
          relationshipType: rel.relationshipType,
          snippet: rel.notes,
          citation: rel.citation,
          relevanceScore: score > 0 ? (score / 100).toFixed(2) : '0.60',
          source: 'Supreme Court Precedent Doctrine Repository',
          verified: rel.verified,
          rawItem: rel
        });
      }
    });
  }

  // Sort by relevance score descending
  results.sort((a, b) => parseFloat(b.relevanceScore) - parseFloat(a.relevanceScore));
  const slicedResults = results.slice(0, limit);

  // Save to search history if query provided
  if (query) {
    const historyEntry = {
      id: 'hist-' + Date.now(),
      userId: reqUser ? reqUser.id : 'user-1',
      query,
      resultsCount: slicedResults.length,
      topMatch: slicedResults[0] ? (slicedResults[0].title || slicedResults[0].name) : 'No direct matches',
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString()
    };
    searchHistory.unshift(historyEntry);
    if (searchHistory.length > 50) searchHistory.pop();
  }

  return {
    success: true,
    query,
    totalResults: slicedResults.length,
    results: slicedResults,
    suggestions: [
      'Theft in dwelling house',
      'Anticipatory bail rules',
      'Right to Privacy Article 21',
      'Electronic Evidence Section 65B vs 63',
      'Medical negligence Jacob Mathew',
      'Workplace sexual harassment Vishaka',
      'Narco analysis Selvi Article 20(3)'
    ]
  };
}

// POST /api/search/legal (frontend contract)
exports.searchLegal = (req, res) => {
  try {
    const { query = '', type = 'all', limit = 25 } = req.body;
    const searchData = executeSearchInternal(query, type, limit, req.user);
    return res.status(200).json(searchData);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Legal search failed' });
  }
};

// GET /api/search & GET /api/search/legal
exports.searchGet = (req, res) => {
  try {
    const { q, query = q || '', type = 'all', limit = 25 } = req.query;
    const searchData = executeSearchInternal(query, type, limit, req.user);
    return res.status(200).json(searchData);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Search failed' });
  }
};

// GET /api/search/history
exports.getSearchHistory = (req, res) => {
  const userId = req.user ? req.user.id : 'user-1';
  const history = searchHistory.filter(h => h.userId === userId || h.userId === 'user-1');
  return res.status(200).json({ success: true, history: history.slice(0, 20) });
};
