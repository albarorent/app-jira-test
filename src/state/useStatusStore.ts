import { create } from 'zustand';



export const useStatusStore = create<{
  status: string | null;
  setStatus: (status: string | null) => void;
}>(set => ({
  status: null,
  setStatus: status => set({ status }),
}));
