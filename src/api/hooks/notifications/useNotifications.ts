import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';
import type { MutationConfig, QueryConfig } from '@/api/helpers/client';

export interface NotificationData {
    message: string;
    ticker: string;
    asset_class: string;
    direction: 'BELOW' | 'ABOVE';
    target_price: number;
    trigger_price: number;
    triggered_at: string;
    delivery_channels: string[];
    fallback_note: string | null;
}

export interface Notification {
    id: string;
    name: string;
    user_id: string;
    type: string | 'WATCHLIST_ALERT';
    isRead: boolean;
    readAt: string | null;
    data: NotificationData;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: Notification[];
}

export interface MarkAsReadResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: Notification;
}

export interface MarkAllAsReadResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        count: number;
    };
}

export const notificationKeys = {
    all: ['notifications'] as const,
    lists: () => [...notificationKeys.all, 'list'] as const,
    list: (filters?: any) => [...notificationKeys.lists(), filters] as const,
    details: () => [...notificationKeys.all, 'detail'] as const,
    detail: (id: string) => [...notificationKeys.details(), id] as const,
    unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
};

export const useNotifications = (
    config?: QueryConfig<typeof api.get<NotificationsResponse>>
) => {
    return useQuery({
        queryKey: notificationKeys.list(),
        queryFn: () => api.get<NotificationsResponse>('/notifications'),
        ...config,
    });
};

export const useMarkNotificationAsRead = (
    config?: MutationConfig<(notificationId: string) => Promise<MarkAsReadResponse>>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId: string) =>
            api.patch<MarkAsReadResponse>(`/notifications/${notificationId}/read`),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
            queryClient.invalidateQueries({
                queryKey: notificationKeys.detail(data.data.id)
            });
            queryClient.invalidateQueries({
                queryKey: notificationKeys.unreadCount()
            });
        },
        ...config,
    });
};

export const useMarkAllNotificationsAsRead = (
    config?: MutationConfig<() => Promise<MarkAllAsReadResponse>>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            api.patch<MarkAllAsReadResponse>('/notifications/mark-all-read'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
            queryClient.invalidateQueries({
                queryKey: notificationKeys.unreadCount()
            });
        },
        ...config,
    });
};

export const useUnreadNotificationsCount = (
    config?: QueryConfig<typeof api.get<NotificationsResponse>>
) => {
    return useQuery({
        queryKey: notificationKeys.unreadCount(),
        queryFn: () => api.get<NotificationsResponse>('/notifications'),
        select: (data): any => data.data.filter(n => !n.isRead).length,
        ...config,
    });
};

export const useNotification = (
    notificationId: string,
    config?: QueryConfig<typeof api.get<{ data: Notification }>>
) => {
    return useQuery({
        queryKey: notificationKeys.detail(notificationId),
        queryFn: () => api.get<{ data: Notification }>(`/notifications/${notificationId}`),
        enabled: !!notificationId,
        ...config,
    });
};