import api from './axios';
import { AuthResponse, LoginFormData, RegisterFormData } from '../types/auth';

export const authApi = {
  register: async (data: Omit<RegisterFormData, 'confirmPassword'>): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },
};

export const contentApi = {
  getPublic: async () => {
    const response = await api.get('/api/public');
    return response.data;
  },

  getUserContent: async () => {
    const response = await api.get('/api/user');
    return response.data;
  },

  getAdminContent: async () => {
    const response = await api.get('/api/admin');
    return response.data;
  },
};
