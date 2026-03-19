import { create } from 'zustand';

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: (user, token) => {
    setCookie('jwt', token, 30);
    set({ user, token });
  },
  logout: () => {
    deleteCookie('jwt');
    set({ user: null, token: null });
  },
  setUser: (user) => set({ user }),
}));
