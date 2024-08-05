import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
const useGlobalState = create(
    persist(
        set => ({
            authenticated: false,
            order: 'asc',
            showGameTitle: false,
            showAppID: false,
            steamid : null,
            setSteamID: value => set({steamid: value}),
            setAuthenticated: value => set({ authenticated: value }),
            setGames: value => set({ games: value }),
            setBackground: value => set({ background: value }),
            setOrder: value => set({ order: value }),
            setShowGameTitle: value => set({ showGameTitle: value }),
            setShowAppID: value => set({ showAppID: value })
        }),
        {
            name: 'global-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useGlobalState;
