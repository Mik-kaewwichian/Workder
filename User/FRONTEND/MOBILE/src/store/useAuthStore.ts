import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../lib/storage';

export type UserRole = 'user' | 'employer';

export interface AuthState {
  userId: string | null;
  email: string | null;
  role: UserRole | null;
  profileCompleted: boolean;
  employerRegistered: boolean;
  name: string | null;
  accessToken: string | null;
  
  // Actions
  setSession: (session: Partial<AuthState>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      email: null,
      role: null,
      profileCompleted: false,
      employerRegistered: false,
      name: null,
      accessToken: null,

      setSession: (session) => set((state) => ({ ...state, ...session })),
      
      logout: () => set({
        userId: null,
        email: null,
        role: null,
        profileCompleted: false,
        employerRegistered: false,
        name: null,
        accessToken: null,
      }),
    }),
    {
      name: 'workder_auth_session', // As requested to match web keys perfectly
      storage: createJSONStorage(() => storage),
    }
  )
);
