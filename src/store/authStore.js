import { create } from 'zustand';
import {
  fetchCurrentUser,
  restoreAuthSession,
  signIn,
  signOut,
  signUp,
} from '@/lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  ready: false,

  initialize: async () => {
    if (get().ready) {
      return;
    }

    try {
      const auth = await restoreAuthSession();
      set({
        user: auth?.user ?? null,
        ready: true,
      });
    } catch {
      set({ user: null, ready: true });
    }
  },

  login: async (email, password) => {
    const auth = await signIn(email, password);
    set({ user: auth.user, ready: true });
    return auth.user;
  },

  register: async (username, email, password) => {
    const auth = await signUp(username, email, password);
    set({ user: auth.user, ready: true });
    return auth.user;
  },

  logout: async () => {
    await signOut();
    set({ user: null, ready: true });
  },

  refreshUser: async () => {
    const auth = await fetchCurrentUser();
    set({ user: auth?.user ?? null });
    return auth?.user ?? null;
  },
}));
