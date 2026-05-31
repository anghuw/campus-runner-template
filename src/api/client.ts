/**
 * API Client
 *
 * When EXPO_PUBLIC_API_BASE_URL is set, all requests go to the backend.
 * When it's empty/undefined, the app uses mock data (no network calls).
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';

export function isApiMode(): boolean {
  return !!BASE_URL;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error('API mode not enabled. Set EXPO_PUBLIC_API_BASE_URL.');
  }

  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || '请求失败');
  }

  return data.data as T;
}

// Convenience methods
export const api = {
  get: <T>(path: string, token?: string) => apiRequest<T>(path, { token }),
  post: <T>(path: string, body: any, token?: string) => apiRequest<T>(path, { method: 'POST', body, token }),
};
