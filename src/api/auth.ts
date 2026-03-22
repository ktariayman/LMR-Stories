import { api } from './client';
import { User } from '../types';

interface AuthResponse {
  token: string;
  user: { id: string; username: string; displayName: string | null };
}

export async function apiRegister(username: string, password: string, displayName?: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/register', { username, password, display_name: displayName });
}

export async function apiLogin(username: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/login', { username, password });
}

export async function apiGetMe(): Promise<{ id: string; username: string; displayName: string | null }> {
  return api.get('/api/auth/me');
}
