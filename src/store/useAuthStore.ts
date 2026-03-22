import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiLogin, apiRegister, apiGetMe } from '../api/auth';
import { setAuthToken } from '../api/client';
import { User } from '../types';

const TOKEN_KEY = 'lmr_auth_token';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await apiLogin(username, password);
      await AsyncStorage.setItem(TOKEN_KEY, token);
      setAuthToken(token);
      set({
        user: { id: user.id, username: user.username, displayName: user.displayName },
        token,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  register: async (username, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await apiRegister(username, password, displayName);
      await AsyncStorage.setItem(TOKEN_KEY, token);
      setAuthToken(token);
      set({
        user: { id: user.id, username: user.username, displayName: user.displayName },
        token,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    set({ user: null, token: null, error: null });
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        set({ isLoading: false });
        return;
      }
      setAuthToken(token);
      const user = await apiGetMe();
      set({
        user: { id: user.id, username: user.username, displayName: user.displayName },
        token,
        isLoading: false,
      });
    } catch {
      // Token invalid — clear it
      await AsyncStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
      set({ user: null, token: null, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
