const API_BASE_URL = '/api';

export function getStoredToken() {
  return localStorage.getItem('skillbridge_token');
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('skillbridge_token', token);
  } else {
    localStorage.removeItem('skillbridge_token');
  }
}

export function getStoredUser() {
  const user = localStorage.getItem('skillbridge_user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('skillbridge_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('skillbridge_user');
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    ...options.headers,
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type if sending FormData (browser sets boundary)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If unauthorized, clear token if stored
    if (token) {
      setStoredToken(null);
      setStoredUser(null);
    }
  }

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data?.message || (typeof data === 'string' ? data : `Request failed with status ${response.status}`);
    throw new Error(errorMsg);
  }

  return data;
}

// Authentication APIs
export const authApi = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getCurrentUser: () => apiRequest('/auth/me'),
};

// Profile APIs
export const profileApi = {
  getProfile: () => apiRequest('/profile'),
  updateProfile: (profileData) => apiRequest('/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  getDashboard: () => apiRequest('/profile/dashboard'),
};

// Resume Analysis APIs
export const resumeApi = {
  analyze: (formData) => apiRequest('/resume/analyze', { method: 'POST', body: formData }),
  atsCheck: (formData) => apiRequest('/resume/ats-check', { method: 'POST', body: formData }),
  getHistory: () => apiRequest('/resume/history'),
  getMyResumes: () => apiRequest('/resume/my-resumes'),
  checkAiStatus: () => apiRequest('/resume/status'),
};

// Skill-Gap APIs
export const skillGapApi = {
  analyze: (gapData) => apiRequest('/skills/analyze', { method: 'POST', body: JSON.stringify(gapData) }),
  getGaps: () => apiRequest('/skills'),
  updateProficiency: (id, proficiency) => apiRequest(`/skills/${id}/proficiency`, { method: 'PATCH', body: JSON.stringify({ currentProficiency: proficiency }) }),
};

// Roadmap APIs
export const roadmapApi = {
  generate: (roadmapData) => apiRequest('/roadmaps/generate', { method: 'POST', body: JSON.stringify(roadmapData) }),
  getRoadmaps: () => apiRequest('/roadmaps'),
  getActiveRoadmap: () => apiRequest('/roadmaps/active'),
  getRoadmapById: (id) => apiRequest(`/roadmaps/${id}`),
  toggleTask: (taskId, isCompleted) => apiRequest(`/roadmaps/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify({ isCompleted }) }),
  askAssistant: (queryData) => apiRequest('/roadmaps/assistant', { method: 'POST', body: JSON.stringify(queryData) }),
};

// Job APIs
export const jobApi = {
  getJobs: (search = '') => apiRequest(`/jobs${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getJobById: (id) => apiRequest(`/jobs/${id}`),
  applyJob: (jobId, data = {}) => apiRequest(`/jobs/${jobId}/apply`, { method: 'POST', body: JSON.stringify(data) }),
  getApplications: () => apiRequest('/jobs/applications'),
};
