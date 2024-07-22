import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
const useGlobalState = create(
    persist(
        set => ({
            authenticated: false,
            setAuthenticated: value => set({ authenticated: value })
        }),
        {
            name: 'global-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useGlobalState;
