const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const detail = data.detail;
    const message = Array.isArray(detail)
      ? detail.map((d) => d.msg || JSON.stringify(d)).join('; ')
      : detail || data.message || res.statusText;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function apiHealth() {
  return request('/api/health');
}

export function apiStatus() {
  return request('/api/status');
}

export function apiMetrics() {
  return request('/api/metrics');
}

export function apiSessionInit() {
  return request('/api/session/init', { method: 'POST' });
}

export function apiSessionVerify(submitted, stored) {
  return request('/api/session/verify', {
    method: 'POST',
    body: JSON.stringify({ submitted, stored }),
  });
}

export function apiSessionKey(token) {
  return request('/api/session/key', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function apiContact(payload) {
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
