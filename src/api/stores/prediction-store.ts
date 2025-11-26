import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import type { SearchResult } from '../hooks/useSearch';
import type { PredictionData, SearchResult } from '@/types/prediction';
// import type { PredictionData, SearchResult } from '../types/prediction';

interface PredictionState {
    // Search state
    recentSearches: SearchResult[];
    searchHistory: string[];

    // Prediction cache
    predictionCache: Record<string, {
        data: PredictionData;
        timestamp: number;
        symbol: string;
    }>;

    // Actions
    addRecentSearch: (result: SearchResult) => void;
    addSearchHistory: (term: string) => void;
    clearRecentSearches: () => void;
    cachePrediction: (symbol: string, data: PredictionData) => void;
    getCachedPrediction: (symbol: string) => PredictionData | null;
    clearPredictionCache: () => void;
}

export const usePredictionStore = create<PredictionState>()(
    persist(
        (set, get) => ({
            // Initial state
            recentSearches: [],
            searchHistory: [],
            predictionCache: {},

            // Actions
            addRecentSearch: (result: SearchResult) => {
                set((state) => {
                    const filtered = state.recentSearches.filter(
                        (item) => item.id !== result.id || item.itemType !== result.itemType
                    );
                    return {
                        recentSearches: [result, ...filtered].slice(0, 10), // Keep last 10
                    };
                });
            },

            addSearchHistory: (term: string) => {
                if (term.trim().length < 2) return;

                set((state) => {
                    const filtered = state.searchHistory.filter((t) => t !== term);
                    return {
                        searchHistory: [term, ...filtered].slice(0, 20), // Keep last 20
                    };
                });
            },

            clearRecentSearches: () => {
                set({ recentSearches: [] });
            },

            cachePrediction: (symbol: string, data: PredictionData) => {
                set((state) => ({
                    predictionCache: {
                        ...state.predictionCache,
                        [symbol.toUpperCase()]: {
                            data,
                            timestamp: Date.now(),
                            symbol: symbol.toUpperCase(),
                        },
                    },
                }));
            },

            getCachedPrediction: (symbol: string) => {
                const cache = get().predictionCache[symbol.toUpperCase()];
                if (!cache) return null;
                console.log("Getting Cache", cache)

                // Check if cache is still valid (1 hour)
                const isExpired = Date.now() - cache.timestamp > 60 * 60 * 1000;
                return isExpired ? null : cache.data;
            },

            clearPredictionCache: () => {
                set({ predictionCache: {} });
            },
        }),
        {
            name: 'prediction-storage',
            partialize: (state) => ({
                recentSearches: state.recentSearches,
                searchHistory: state.searchHistory,
                predictionCache: state.predictionCache,
            }),
        }
    )
);