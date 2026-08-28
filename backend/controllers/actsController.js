const { acts, sections } = require('../data/seedData');

exports.getActs = (req, res) => {
  const { category, search } = req.query;
  let filtered = [...acts];

  if (category) {
    filtered = filtered.filter(a => a.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(a =>
      a.name.toLowerCase().includes(s) ||
      a.code.toLowerCase().includes(s) ||
      a.description.toLowerCase().includes(s)
    );
  }

  return res.json({ success: true, count: filtered.length, acts: filtered });
};

exports.getActById = (req, res) => {
  const { actId, id } = req.params;
  const targetId = (actId || id || '').toLowerCase();

  const act = acts.find(a =>
    a.id.toLowerCase() === targetId ||
    a.code.toLowerCase() === targetId ||
    String(a.numericId) === targetId ||
    a.name.toLowerCase().includes(targetId)
  ) || acts[parseInt(targetId) - 1];

  if (!act) {
    return res.status(404).json({ success: false, message: 'Act not found' });
  }

  const actSections = sections.filter(s => s.actId === act.id);

  return res.json({
    success: true,
    act,
    sectionsCount: actSections.length,
    sections: actSections
  });
};

exports.getSectionById = (req, res) => {
  const { sectionId, id } = req.params;
  const targetId = (sectionId || id || '').toLowerCase();

  const section = sections.find(s =>
    s.id.toLowerCase() === targetId ||
    String(s.numericId) === targetId ||
    s.sectionNumber.toLowerCase().replace(/\s+/g, '') === targetId.replace(/\s+/g, '')
  ) || sections[parseInt(targetId) - 1];

  if (!section) {
    return res.status(404).json({ success: false, message: 'Section not found' });
  }

  const parentAct = acts.find(a => a.id === section.actId);

  return res.json({
    success: true,
    section,
    act: parentAct
  });
};

exports.searchSections = (req, res) => {
  const { q = '', actCode = '', actId = '' } = req.query;
  const qLower = q.toLowerCase().trim();

  let results = sections.filter(sec => {
    const matchAct = (!actCode || sec.actCode.toLowerCase() === actCode.toLowerCase()) &&
                     (!actId || sec.actId.toLowerCase() === actId.toLowerCase());
    const matchQuery = !qLower ||
      sec.title.toLowerCase().includes(qLower) ||
      sec.sectionNumber.toLowerCase().includes(qLower) ||
      sec.content.toLowerCase().includes(qLower) ||
      (sec.explanation && sec.explanation.toLowerCase().includes(qLower)) ||
      (sec.predecessorSection && sec.predecessorSection.toLowerCase().includes(qLower)) ||
      (sec.relevanceTags && sec.relevanceTags.some(t => t.toLowerCase().includes(qLower)));
    return matchAct && matchQuery;
  });

  return res.json({
    success: true,
    count: results.length,
    sections: results
  });
};
