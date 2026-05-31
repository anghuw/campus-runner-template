import { api } from './client';

export interface AuthResponse {
  token: string;
  user: { id: string; phone: string; nickname: string; studentId?: string };
}

export async function register(data: { phone: string; nickname: string; password: string; studentId?: string }): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/register', data);
}

export async function login(data: { phone: string; password: string }): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/login', data);
}

export async function getMe(token: string): Promise<{ id: string; phone: string; nickname: string; studentId?: string; avatarUrl?: string; bio?: string }> {
  return api.get(`/api/auth/me`, token);
}
