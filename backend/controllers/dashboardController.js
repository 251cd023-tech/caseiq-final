const { searchHistory, lawMappings, users } = require('../data/seedData');
const { getSavedCasesCount } = require('./savedCasesController');

// GET /api/dashboard/stats (getDashboardStats) -> 200 + { searches: n, saved: n, comparisons: n, history: n }
exports.getDashboardStats = (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'user-1';

    // Compute user-specific or platform counts efficiently
    const userSearches = searchHistory.filter(h => h.userId === userId || h.userId === 'user-1');
    const searchesCount = userSearches.length;
    const savedCount = getSavedCasesCount(userId);
    const comparisonsCount = lawMappings.length;
    const historyCount = userSearches.length;

    return res.status(200).json({
      searches: searchesCount,
      saved: savedCount,
      comparisons: comparisonsCount,
      history: historyCount
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to compute dashboard stats' });
  }
};

// GET /api/dashboard/recent-searches (getRecentSearches) -> 200 + paginated array of { query, createdAt, ... }
exports.getRecentSearches = (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'user-1';
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));

    const userSearches = searchHistory
      .filter(h => h.userId === userId || h.userId === 'user-1')
      .map(h => ({
        id: h.id,
        query: h.query,
        resultsCount: h.resultsCount,
        topMatch: h.topMatch,
        createdAt: h.createdAt || h.timestamp,
        timestamp: h.timestamp || h.createdAt
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = userSearches.length;
    const startIndex = (page - 1) * limit;
    const paginated = userSearches.slice(startIndex, startIndex + limit);

    return res.status(200).json(paginated);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch recent searches' });
  }
};

// GET /api/dashboard/research-history (getResearchHistory) -> 200 + paginated array grouped/groupable by date
exports.getResearchHistory = (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'user-1';
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20));

    const historyItems = searchHistory
      .filter(h => h.userId === userId || h.userId === 'user-1')
      .map(h => ({
        id: h.id,
        query: h.query,
        resultsCount: h.resultsCount,
        topMatch: h.topMatch,
        createdAt: h.createdAt || h.timestamp,
        timestamp: h.timestamp || h.createdAt,
        date: (h.createdAt || h.timestamp || '').split('T')[0]
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = historyItems.length;
    const startIndex = (page - 1) * limit;
    const paginated = historyItems.slice(startIndex, startIndex + limit);

    return res.status(200).json(paginated);
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch research history' });
  }
};
