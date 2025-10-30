import { create } from 'zustand';

interface UserWithColor {
  name: string;
  email: string;
  token?: string;
  color?: string;
}

interface UserState {
  user: UserWithColor | null;
  login: (userData: UserWithColor) => void;
  logout: () => void;
  setUserColor: (color: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,

  login: (userData) => {
    set({ user: { ...userData, color: userData.color || '#33A1FF' } });
  },

  logout: () => set({ user: null }),

  setUserColor: (color) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, color } });
    }
  },
}));
