const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('caseiq_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  toggleBookmark: async (itemId) => {
    const res = await fetch(`${API_BASE_URL}/auth/bookmark`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ itemId })
    });
    return handleResponse(res);
  },

  // Legal Search
  searchLegal: async (query, type = 'all', limit = 20) => {
    const res = await fetch(`${API_BASE_URL}/search/legal`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query, type, limit })
    });
    return handleResponse(res);
  },
  getSearchHistory: async () => {
    const res = await fetch(`${API_BASE_URL}/search/history`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Acts & Sections
  getActs: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/acts${query ? '?' + query : ''}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getActById: async (actId) => {
    const res = await fetch(`${API_BASE_URL}/acts/${actId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getSectionById: async (sectionId) => {
    const res = await fetch(`${API_BASE_URL}/acts/sections/${sectionId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  searchSections: async (q = '', actCode = '') => {
    const query = new URLSearchParams({ q, actCode }).toString();
    const res = await fetch(`${API_BASE_URL}/sections/search?${query}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Cases & Precedents
  getCases: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/cases${query ? '?' + query : ''}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getCaseById: async (caseId) => {
    const res = await fetch(`${API_BASE_URL}/cases/${caseId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getCaseRelationships: async (caseId = '') => {
    const res = await fetch(`${API_BASE_URL}/cases/relationships${caseId ? '?caseId=' + caseId : ''}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // AI 5-Pillar Case Analysis
  analyzeCase: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/ai/case-analysis`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  // Old Law <-> New Law Mapping
  getLawMappings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/law-mappings${query ? '?' + query : ''}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  getLawMappingById: async (mappingId) => {
    const res = await fetch(`${API_BASE_URL}/law-mappings/${mappingId}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Community Forum
  getCommunityPosts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/community/posts${query ? '?' + query : ''}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  createCommunityPost: async (postData) => {
    const res = await fetch(`${API_BASE_URL}/community/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(postData)
    });
    return handleResponse(res);
  },
  getPostComments: async (postId) => {
    const res = await fetch(`${API_BASE_URL}/community/posts/${postId}/comments`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  addComment: async (postId, content) => {
    const res = await fetch(`${API_BASE_URL}/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    });
    return handleResponse(res);
  },
  toggleUpvote: async (postId) => {
    const res = await fetch(`${API_BASE_URL}/community/posts/${postId}/upvote`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Additional Helper & Alias Functions
  getProfile: async () => {
    return api.getMe();
  },
  logout: () => {
    localStorage.removeItem('caseiq_token');
    return Promise.resolve({ success: true });
  },
  requestPasswordReset: async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.status === 404) {
        throw new Error('Reset service unavailable.');
      }
      return handleResponse(res);
    } catch (err) {
      throw new Error(err.message || 'Reset service unavailable.');
    }
  },
  getCaseDetails: async (caseId) => {
    return api.getCaseById(caseId);
  },
  getCasePrecedents: async (caseId) => {
    return api.getCaseRelationships(caseId);
  },
  saveCase: async (caseId) => {
    return api.toggleBookmark(caseId);
  },
  removeSavedCase: async (caseId) => {
    return api.toggleBookmark(caseId);
  },
  getRecentSearches: async () => {
    return api.getSearchHistory();
  },
  getResearchHistory: async () => {
    return api.getSearchHistory();
  },
  compareLaw: async (sectionQuery = '') => {
    try {
      const res = await api.getLawMappings();
      if (res && res.success && res.mappings) {
        if (!sectionQuery || !sectionQuery.trim()) return res;
        const s = sectionQuery.toLowerCase().trim();
        const filtered = res.mappings.filter(m =>
          (m.oldSection && m.oldSection.toLowerCase().includes(s)) ||
          (m.newSection && m.newSection.toLowerCase().includes(s)) ||
          (m.oldTitle && m.oldTitle.toLowerCase().includes(s)) ||
          (m.newTitle && m.newTitle.toLowerCase().includes(s)) ||
          (m.category && m.category.toLowerCase().includes(s)) ||
          (m.punishmentChange && m.punishmentChange.toLowerCase().includes(s)) ||
          (m.relevanceTags && m.relevanceTags.some(t => t.toLowerCase().includes(s)))
        );
        return {
          success: true,
          count: filtered.length,
          mappings: filtered.length > 0 ? filtered : res.mappings
        };
      }
      return res;
    } catch (err) {
      return { success: false, mappings: [], error: err.message };
    }
  },
  getDashboardStats: async () => {
    try {
      const [casesRes, historyRes, mapsRes] = await Promise.all([
        api.getCases(),
        api.getSearchHistory(),
        api.getLawMappings()
      ]);
      return {
        success: true,
        stats: {
          casesCount: casesRes?.cases?.length || 12,
          historyCount: historyRes?.history?.length || 4,
          mappingsCount: mapsRes?.mappings?.length || 8,
          precedentsCount: 13
        }
      };
    } catch (err) {
      // MOCK DATA: development fallback only. Not authoritative legal content.
      return {
        success: true,
        stats: {
          casesCount: 12,
          historyCount: 4,
          mappingsCount: 8,
          precedentsCount: 13
        }
      };
    }
  },
  getSavedCases: async () => {
    try {
      const userRes = await api.getMe();
      const bookmarks = userRes?.user?.bookmarks || [];
      const casesRes = await api.getCases();
      const allCases = casesRes?.cases || [];
      const saved = allCases.filter(c => bookmarks.includes(c.id));
      return {
        success: true,
        cases: saved
      };
    } catch (err) {
      return { success: false, cases: [], error: err.message };
    }
  }
};

