import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const tokenStorageKey = 'dd_access_token';

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

async function fetchCsrfToken(): Promise<string> {
  if (csrfToken) {
    return csrfToken;
  }

  if (!csrfPromise) {
    csrfPromise = axios
      .get<{ csrfToken: string }>(`${apiBaseUrl}/auth/csrf`, {
        withCredentials: true,
      })
      .then((response) => {
        csrfToken = response.data.csrfToken;
        return csrfToken;
      })
      .finally(() => {
        csrfPromise = null;
      });
  }

  return csrfPromise;
}

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(tokenStorageKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = (config.method || 'get').toLowerCase();
    const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(method);

    if (needsCsrf) {
      const tokenValue = await fetchCsrfToken();
      config.headers['X-CSRF-Token'] = tokenValue;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 403) {
      csrfToken = null;
    }

    return Promise.reject(error);
  },
);

export function clearClientSession() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(tokenStorageKey);
  }
  csrfToken = null;
}

export function storeClientToken(token: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(tokenStorageKey, token);
  }
}

export function getStoredClientToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(tokenStorageKey);
}

export default api;

