const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
export const API_BASE_URL = (configuredApiUrl || (import.meta.env.DEV ? 'http://localhost:5000' : '')).replace(/\/+$/, '');

const tokenStore = {
  get access() { return window.sessionStorage.getItem('accessToken'); },
  get refresh() { return window.sessionStorage.getItem('refreshToken'); },
  save({ accessToken, refreshToken }) {
    if (accessToken) window.sessionStorage.setItem('accessToken', accessToken);
    if (refreshToken) window.sessionStorage.setItem('refreshToken', refreshToken);
  },
  clear() {
    window.sessionStorage.removeItem('accessToken');
    window.sessionStorage.removeItem('refreshToken');
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  },
};

export function clearSession() { tokenStore.clear(); }
export function saveSession(tokens) { tokenStore.clear(); tokenStore.save(tokens); }

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status}).`);
  return payload;
}

async function refreshSession() {
  if (!tokenStore.refresh || !API_BASE_URL) return false;
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokenStore.refresh }),
    });
    const tokens = await parseResponse(response);
    tokenStore.save(tokens);
    return Boolean(tokens.accessToken);
  } catch {
    tokenStore.clear();
    return false;
  }
}

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) throw new Error('The API URL is not configured for this deployment. Set VITE_API_URL and rebuild the site.');
  const { auth = false, retry = true, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});
  if (fetchOptions.body && !(fetchOptions.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (auth && tokenStore.access) headers.set('Authorization', `Bearer ${tokenStore.access}`);
  let response;
  try { response = await fetch(`${API_BASE_URL}${path}`, { ...fetchOptions, headers }); }
  catch { throw new Error(`Cannot reach the HAILANG service at ${API_BASE_URL}. Check that the backend is running.`); }
  if (response.status === 401 && auth && retry && await refreshSession()) return apiRequest(path, { ...options, retry: false });
  if (response.status === 401 && auth) tokenStore.clear();
  return parseResponse(response);
}

export { tokenStore };
