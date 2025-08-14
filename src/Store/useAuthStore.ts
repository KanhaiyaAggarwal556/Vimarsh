// store/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define user interface
export interface User {
  _id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add other user properties as needed
}

// Define the auth store state
interface AuthState {
  currentUser: User | null;
}

// Define the auth store actions
interface AuthActions {
  setCurrentUser: (newUser: User | null) => void;
  removeAllUser: () => void;
  updateCurrentUser: (updateUser: Partial<User>) => void;
}

// Combine state and actions
type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      currentUser: null,

      // Actions
      setCurrentUser: (newUser: User | null) => set({ currentUser: newUser }),
      
      removeAllUser: () => set({ currentUser: null }),
      
      updateCurrentUser: (updateUser: Partial<User>) => set((state) => ({
        currentUser: state.currentUser 
          ? { ...state.currentUser, ...updateUser }
          : null
      })),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ currentUser: state.currentUser }), // only persist currentUser
    }
  )
);

export default useAuthStore;