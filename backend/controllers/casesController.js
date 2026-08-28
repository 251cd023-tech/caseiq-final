const { cases, precedentRelationships } = require('../data/seedData');

exports.getCases = (req, res) => {
  const { court, topic, search } = req.query;
  let results = [...cases];

  if (court) {
    results = results.filter(c => c.court.toLowerCase().includes(court.toLowerCase()));
  }

  if (topic) {
    results = results.filter(c => c.legalTopics && c.legalTopics.some(t => t.toLowerCase().includes(topic.toLowerCase())));
  }

  if (search) {
    const s = search.toLowerCase();
    results = results.filter(c =>
      c.caseName.toLowerCase().includes(s) ||
      c.citation.toLowerCase().includes(s) ||
      c.bench.toLowerCase().includes(s) ||
      (c.analysis && (c.analysis.decision.toLowerCase().includes(s) || c.analysis.facts.toLowerCase().includes(s)))
    );
  }

  return res.json({ success: true, count: results.length, cases: results });
};

exports.getCaseById = (req, res) => {
  const { caseId, id } = req.params;
  const targetId = (caseId || id || '').toLowerCase();

  const caseItem = cases.find(c =>
    c.id.toLowerCase() === targetId ||
    String(c.numericId) === targetId ||
    c.caseName.toLowerCase().includes(targetId)
  ) || cases[parseInt(targetId) - 1];

  if (!caseItem) {
    return res.status(404).json({ success: false, message: 'Case not found' });
  }

  const relationships = precedentRelationships.filter(
    r => r.sourceCaseId === caseItem.id || r.targetCaseId === caseItem.id
  );

  return res.json({
    success: true,
    case: caseItem,
    relationships
  });
};

exports.getCaseRelationships = (req, res) => {
  const { caseId, id } = req.params;
  const targetId = caseId || id;

  if (!targetId || targetId === 'all') {
    return res.json({
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

  return res.json({
    success: true,
    caseName: foundCase ? foundCase.caseName : 'Precedent Graph',
    caseId: actualId,
    count: relationships.length,
    relationships
  });
};
