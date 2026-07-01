import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token from cookie on every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('alpha_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear auth and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('alpha_token');
      Cookies.remove('alpha_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────

export const authApi = {
  register: (data: {
    firstName: string; lastName: string; email: string;
    password: string; role: string;
    nationality?: string; countryOfResidence?: string;
  }) => api.post('/auth/register', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

// ── Opportunities ─────────────────────────────────────────────

export const opportunitiesApi = {
  listPublic: () => api.get('/opportunities/public'),
  getById: (id: number) => api.get(`/opportunities/${id}`),
  post: (data: object) => api.post('/opportunities/post', data),
};

// ── Businesses ────────────────────────────────────────────────

export const businessApi = {
  register: (data: object) => api.post('/businesses', data),
  myBusinesses: () => api.get('/businesses/my'),
};

// ── Applications ──────────────────────────────────────────────

export const applicationsApi = {
  submit: (data: {
    businessId: number; opportunityId?: number; preferredFundingType: string;
  }) => api.post('/applications/submit', data),
  myApplications: () => api.get('/applications/my'),
  getMatches: (id: number) => api.get(`/applications/${id}/matches`),
};

// ── Messages ──────────────────────────────────────────────────

export const messagesApi = {
  send: (recipientId: number, content: string) =>
    api.post('/messages/send', { recipientId, content }),
  inbox: () => api.get('/messages/inbox'),
  unreadCount: () => api.get('/messages/unread-count'),
};

// ── Admin ─────────────────────────────────────────────────────

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  users: () => api.get('/admin/users'),
};

export default api;
