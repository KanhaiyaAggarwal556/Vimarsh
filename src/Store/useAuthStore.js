import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (newUser) => set({ currentUser: newUser }),
      removeAllUser: () => set({ currentUser: null }),
      updateCurrentUser: (updateUser) => set({ currentUser: updateUser }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ currentUser: state.currentUser }), // only persist currentUser
    }
  )
)

export default useAuthStore;