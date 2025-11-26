import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';
import type { MutationConfig, QueryConfig } from '@/api/helpers/client';

export interface PriceAlert {
    id: string;
    ticker: string;
    current_price: number;
    target_price: number;
    direction: 'BELOW' | 'ABOVE';
    delivery_channels: string[];
    asset_class: string;
    is_recurring: boolean;
    is_outstanding: boolean;
    outstanding: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AlertsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        items: PriceAlert[];
    };
}

export interface DeleteAlertResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: null;
}


export const alertKeys = {
    all: ['alerts'] as const,
    lists: () => [...alertKeys.all, 'list'] as const,
    list: (filters?: any) => [...alertKeys.lists(), filters] as const,
    details: () => [...alertKeys.all, 'detail'] as const,
    detail: (id: string) => [...alertKeys.details(), id] as const,
};

// Hook for getting active price alerts
export const useAlerts = (
    config?: QueryConfig<typeof api.get<AlertsResponse>>
) => {
    return useQuery({
        queryKey: alertKeys.list(),
        queryFn: () => api.get<AlertsResponse>('/watchlist/alerts'),
        ...config,
    });
};

// Hook for deleting a price alert
export const useDeleteAlert = (
    config?: MutationConfig<(alertId: string) => Promise<DeleteAlertResponse>>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (alertId: string) =>
            api.delete<DeleteAlertResponse>(`/watchlist/alerts/${alertId}`),
        onSuccess: () => {
            // Invalidate and refetch alerts list
            queryClient.invalidateQueries({ queryKey: alertKeys.list() });
        },
        ...config,
    });
};
