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
      m.oldSection.toLowerCase().includes(s) ||
      m.newSection.toLowerCase().includes(s) ||
      m.oldTitle.toLowerCase().includes(s) ||
      m.newTitle.toLowerCase().includes(s) ||
      m.changesSummary.toLowerCase().includes(s) ||
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
  const { mappingId } = req.params;
  const mapping = lawMappings.find(m => m.id === mappingId);
  if (!mapping) {
    return res.status(404).json({ success: false, message: 'Law mapping not found' });
  }

  return res.json({
    success: true,
    mapping
  });
};
