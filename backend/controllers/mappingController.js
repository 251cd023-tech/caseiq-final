const { lawMappings } = require('../data/seedData');

exports.getMappings = (req, res) => {
  const { category, search, actType } = req.query;
  let results = [...lawMappings];

  if (category) {
    results = results.filter(m => m.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (actType) {
    results = results.filter(m =>
      m.oldAct.toLowerCase().includes(actType.toLowerCase()) ||
      m.newAct.toLowerCase().includes(actType.toLowerCase())
    );
  }

  if (search) {
    const s = search.toLowerCase();
    results = results.filter(m =>
      (m.oldSection && m.oldSection.toLowerCase().includes(s)) ||
      (m.newSection && m.newSection.toLowerCase().includes(s)) ||
      (m.oldTitle && m.oldTitle.toLowerCase().includes(s)) ||
      (m.newTitle && m.newTitle.toLowerCase().includes(s)) ||
      (m.changesSummary && m.changesSummary.toLowerCase().includes(s)) ||
      (m.punishmentChange && m.punishmentChange.toLowerCase().includes(s)) ||
      (m.relevanceTags && m.relevanceTags.some(t => t.toLowerCase().includes(s)))
    );
  }

  return res.json({
    success: true,
    count: results.length,
    mappings: results
  });
};

exports.getMappingById = (req, res) => {
  const { mappingId, id } = req.params;
  const targetId = mappingId || id;
  const mapping = lawMappings.find(m =>
    m.id === targetId ||
    String(m.numericId) === targetId ||
    (m.oldSection && m.oldSection.toLowerCase() === targetId.toLowerCase())
  );

  if (!mapping) {
    return res.status(404).json({ success: false, message: 'Law mapping not found' });
  }

  return res.json({
    success: true,
    mapping
  });
};
