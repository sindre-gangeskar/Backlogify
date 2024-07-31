import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
const useGlobalState = create(
    persist(
        set => ({
            authenticated: false,
            setAuthenticated: value => set({ authenticated: value }),
            setGames: value => set({ games: value }),
            setBackground: value => set({ background: value }),
        }),
        {
            name: 'global-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useGlobalState;
