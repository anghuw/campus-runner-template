import { api } from './client';
import type { Order as Task } from '../types';

export async function getTasks(params?: { status?: string; type?: string; keyword?: string }): Promise<Task[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.type) query.set('type', params.type);
  if (params?.keyword) query.set('keyword', params.keyword);
  const qs = query.toString();
  return api.get<Task[]>(`/api/tasks${qs ? `?${qs}` : ''}`);
}

export async function getTaskById(id: string): Promise<Task> {
  return api.get<Task>(`/api/tasks/${id}`);
}

export async function createTask(payload: {
  title: string;
  type: string;
  pickupLocation: string;
  deliveryLocation: string;
  reward: number;
  contactInfo: string;
  description?: string;
}, token: string): Promise<Task> {
  return api.post<Task>('/api/tasks', payload, token);
}

export async function acceptTask(id: string, token: string): Promise<Task> {
  return api.post<Task>(`/api/tasks/${id}/accept`, {}, token);
}

export async function startTask(id: string, token: string): Promise<Task> {
  return api.post<Task>(`/api/tasks/${id}/start`, {}, token);
}

export async function completeTask(id: string, token: string): Promise<Task> {
  return api.post<Task>(`/api/tasks/${id}/complete`, {}, token);
}

export async function cancelTask(id: string, token: string): Promise<Task> {
  return api.post<Task>(`/api/tasks/${id}/cancel`, {}, token);
}
