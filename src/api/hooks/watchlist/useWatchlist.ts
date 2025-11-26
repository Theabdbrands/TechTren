import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';
import type { MutationConfig, QueryConfig } from '@/api/helpers/client';
import { useAuthStore } from '@/api/stores/auth-store';
import type {
    CreateAlertPayload,
    WatchlistResponse,
    AddToWatchlistResponse,
    DeleteWatchlistResponse,
    CreateAlertResponse,
    AlertsResponse
} from '@/types/watchlist';

export const watchlistKeys = {
    all: ['watchlist'] as const,
    lists: () => [...watchlistKeys.all, 'list'] as const,
    list: (filters?: any) => [...watchlistKeys.lists(), { filters }] as const,
    alerts: () => [...watchlistKeys.all, 'alerts'] as const,
    alertsList: (filters?: any) => [...watchlistKeys.alerts(), { filters }] as const,
    details: () => [...watchlistKeys.all, 'detail'] as const,
    detail: (id: string) => [...watchlistKeys.details(), id] as const,
};

export const useWatchlist = (config?: QueryConfig<typeof api.get<WatchlistResponse>>) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: watchlistKeys.list(),
        queryFn: () => api.get<WatchlistResponse>('/watchList'),
        enabled: isAuthenticated,
        staleTime: 2 * 60 * 1000,
        ...config,
    });
};

export const useWatchlistAlerts = (config?: QueryConfig<typeof api.get<AlertsResponse>>) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: watchlistKeys.alertsList(),
        queryFn: () => api.get<AlertsResponse>('/watchList/alerts'),
        enabled: isAuthenticated,
        staleTime: 2 * 60 * 1000,
        ...config,
    });
};

export const useAddToWatchlist = (config?: MutationConfig<(ticker: string) => Promise<AddToWatchlistResponse>>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ticker: string) =>
            api.post<AddToWatchlistResponse>('/watchList', { ticker }),
        onSuccess: (data) => {
            console.log("Data of he watchList Add", data)
            queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
        },
        ...config,
    });
};

export const useRemoveFromWatchlist = (config?: MutationConfig<(ticker: string) => Promise<DeleteWatchlistResponse>>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ticker: string) =>
            api.delete<DeleteWatchlistResponse>(`/watchList/${ticker}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: watchlistKeys.lists() });
        },
        ...config,
    });
};

export const useCreatePriceAlert = (config?: MutationConfig<(data: { ticker: string; alertData: CreateAlertPayload }) => Promise<CreateAlertResponse>>) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticker, alertData }: { ticker: string; alertData: CreateAlertPayload }) =>
            api.post<CreateAlertResponse>(`/watchList/${ticker}/alert`, alertData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: watchlistKeys.alerts() });
        },
        ...config,
    });
};

export const useDeletePriceAlert = (config?: MutationConfig<(alertId: string) => Promise<DeleteWatchlistResponse>>) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (alertId: string) =>
            api.delete<DeleteWatchlistResponse>(`/watchList/alerts/${alertId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: watchlistKeys.alerts() });
        },
        ...config,
    });
};


// JUST FOR TEST GONNA REMOVE

// export const useWatchlistActions = () => {
//     const { mutate: addToWatchlist, isPending: isAdding } = useAddToWatchlist();
//     const { mutate: removeFromWatchlist, isPending: isRemoving } = useRemoveFromWatchlist();
//     const { mutate: createAlert, isPending: isCreatingAlert } = useCreatePriceAlert();
//     return {
//         addToWatchlist,
//         removeFromWatchlist,
//         createAlert,
//         isAdding,
//         isRemoving,
//         isCreatingAlert,
//     };
// };

// export const useRecentWatchlist = (limit: number = 7) => {
//     const { data: watchlistData, isLoading, error } = useWatchlist();

//     const recentWatchlist = useMemo(() => {
//         if (!watchlistData?.data.items) return [];

//         const sortedItems = [...watchlistData.data.items].sort((a, b) =>
//             new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//         );

//         return sortedItems.slice(0, limit);
//     }, [watchlistData, limit]);

//     return {
//         recentWatchlist,
//         isLoading,
//         error,
//         isEmpty: !isLoading && recentWatchlist.length === 0
//     };
// };