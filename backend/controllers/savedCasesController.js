const { cases, users } = require('../data/seedData');

// Shared savedCases storage ensuring Case Details & Dashboard stay synchronized
let savedCasesStore = [
  {
    id: 'sc-1',
    userId: 'user-1',
    caseId: 'case-puttaswamy',
    savedAt: '2026-02-20T10:00:00Z',
    case: {
      caseId: 'case-puttaswamy',
      id: 'case-puttaswamy',
      name: 'Justice K.S. Puttaswamy (Retd.) v. Union of India',
      caseName: 'Justice K.S. Puttaswamy (Retd.) v. Union of India',
      court: 'Supreme Court of India',
      year: 2017
    }
  },
  {
    id: 'sc-2',
    userId: 'user-1',
    caseId: 'case-kesavananda',
    savedAt: '2026-02-21T14:30:00Z',
    case: {
      caseId: 'case-kesavananda',
      id: 'case-kesavananda',
      name: 'Kesavananda Bharati Sripadagalvaru v. State of Kerala',
      caseName: 'Kesavananda Bharati Sripadagalvaru v. State of Kerala',
      court: 'Supreme Court of India',
      year: 1973
    }
  }
];

// Helper to find case by any ID variant
const findCase = (caseId) => {
  if (!caseId) return null;
  const targetId = String(caseId).toLowerCase();
  return cases.find(c =>
    c.id.toLowerCase() === targetId ||
    String(c.numericId) === targetId ||
    c.caseName.toLowerCase().includes(targetId)
  );
};

// POST /api/saved-cases - Save a case (idempotent-friendly)
exports.saveCase = (req, res) => {
  try {
    const { caseId } = req.body;
    if (!caseId) {
      return res.status(400).json({ success: false, error: 'caseId is required' });
    }

    const userId = req.user ? req.user.id : 'user-1';
    const foundCase = findCase(caseId);

    if (!foundCase) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    // Check if already saved
    const existingIndex = savedCasesStore.findIndex(
      sc => sc.userId === userId && sc.caseId === foundCase.id
    );

    if (existingIndex > -1) {
      return res.status(200).json({
        success: true,
        message: 'Case is already saved',
        savedCase: savedCasesStore[existingIndex]
      });
    }

    const savedEntry = {
      id: 'sc-' + Date.now(),
      userId,
      caseId: foundCase.id,
      savedAt: new Date().toISOString(),
      case: {
        caseId: foundCase.id,
        id: foundCase.id,
        name: foundCase.caseName || foundCase.name,
        caseName: foundCase.caseName || foundCase.name,
        court: foundCase.court,
        year: foundCase.year
      }
    };

    savedCasesStore.push(savedEntry);

    // Synchronize with user bookmarks array
    const user = users.find(u => u.id === userId);
    if (user) {
      if (!user.bookmarks) user.bookmarks = [];
      if (!user.bookmarks.includes(foundCase.id)) {
        user.bookmarks.push(foundCase.id);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Case saved successfully',
      savedCase: savedEntry
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to save case' });
  }
};

// DELETE /api/saved-cases/:caseId - Remove a saved case
exports.removeSavedCase = (req, res) => {
  try {
    const { caseId } = req.params;
    if (!caseId) {
      return res.status(400).json({ success: false, error: 'caseId is required' });
    }

    const userId = req.user ? req.user.id : 'user-1';
    const foundCase = findCase(caseId);
    const targetCaseId = foundCase ? foundCase.id : caseId;

    const initialLength = savedCasesStore.length;
    savedCasesStore = savedCasesStore.filter(
      sc => !(sc.userId === userId && (sc.caseId === targetCaseId || sc.caseId === caseId))
    );

    // Synchronize with user bookmarks
    const user = users.find(u => u.id === userId);
    if (user && user.bookmarks) {
      user.bookmarks = user.bookmarks.filter(b => b !== targetCaseId && b !== caseId);
    }

    return res.status(200).json({
      success: true,
      message: 'Saved case removed successfully',
      removed: savedCasesStore.length < initialLength
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to remove saved case' });
  }
};

// GET /api/saved-cases - Get all saved cases for current user
exports.getSavedCases = (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'user-1';
    const userSaved = savedCasesStore
      .filter(sc => sc.userId === userId)
      .map(sc => ({
        caseId: sc.case.caseId || sc.caseId,
        id: sc.case.caseId || sc.caseId,
        name: sc.case.name || sc.case.caseName,
        caseName: sc.case.name || sc.case.caseName,
        court: sc.case.court,
        year: sc.case.year,
        savedAt: sc.savedAt
      }));

    return res.status(200).json(userSaved);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch saved cases' });
  }
};

// Export helper for cross-controller sync
exports.syncBookmarkWithSavedCases = (userId, itemId, isBookmarking) => {
  const foundCase = findCase(itemId);
  if (!foundCase) return;

  if (isBookmarking) {
    const exists = savedCasesStore.some(sc => sc.userId === userId && sc.caseId === foundCase.id);
    if (!exists) {
      savedCasesStore.push({
        id: 'sc-' + Date.now(),
        userId,
        caseId: foundCase.id,
        savedAt: new Date().toISOString(),
        case: {
          caseId: foundCase.id,
          id: foundCase.id,
          name: foundCase.caseName,
          caseName: foundCase.caseName,
          court: foundCase.court,
          year: foundCase.year
        }
      });
    }
  } else {
    savedCasesStore = savedCasesStore.filter(
      sc => !(sc.userId === userId && sc.caseId === foundCase.id)
    );
  }
};

exports.getSavedCasesCount = (userId) => {
  return savedCasesStore.filter(sc => sc.userId === userId).length;
};
