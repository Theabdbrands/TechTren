// stores/watchlist-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistState {
    recentlyViewed: string[];
    addToRecentlyViewed: (ticker: string) => void;
    clearRecentlyViewed: () => void;
    selectedTicker: string | null;
    setSelectedTicker: (ticker: string | null) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
    persist(
        (set, get) => ({
            recentlyViewed: [],
            selectedTicker: null,

            addToRecentlyViewed: (ticker: string) => {
                const { recentlyViewed } = get();
                const updated = [ticker, ...recentlyViewed.filter(t => t !== ticker)].slice(0, 10);
                set({ recentlyViewed: updated });
            },

            clearRecentlyViewed: () => {
                set({ recentlyViewed: [] });
            },

            setSelectedTicker: (ticker: string | null) => {
                set({ selectedTicker: ticker });
            },
        }),
        {
            name: 'watchlist-storage',
            partialize: (state) => ({
                recentlyViewed: state.recentlyViewed,
            }),
        }
    )
);