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
  }
};
