import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/api/stores/auth-store';
import { toast } from 'sonner';
import { api } from '@/api/helpers/request';

interface CancelSubscriptionRequest {
    reason?: string;
}

interface CancelSubscriptionResponse {
    message: string;
    previousPlan: string;
    currentPlan: string;
    cancelledAt: string;
}

export const useCancelSubscription = () => {
    const queryClient = useQueryClient();
    const { user, setUser } = useAuthStore();

    return useMutation({
        mutationFn: async (payload: CancelSubscriptionRequest) => {
            const response = await api.post<CancelSubscriptionResponse>(
                '/subscriptions/cancel',
                payload
            );
            return (response as any).data;
        },
        onSuccess: (data) => {
            if (user) {
                setUser({
                    ...user,
                    subscription: data.currentPlan
                });
            }

            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.invalidateQueries({ queryKey: ['subscription'] });

            toast.success('Subscription Cancelled', {
                description: `Your subscription has been downgraded to ${data.currentPlan} plan.`
            });
        },
        onError: (error: any) => {
            toast.error('Cancellation Failed', {
                description: error?.response?.data?.message || 'Failed to cancel subscription. Please try again.'
            });
            console.error('Cancel subscription error:', error);
        }
    });
};

// Hook to check if user can cancel subscription
export const useCanCancelSubscription = () => {
    const { user } = useAuthStore();

    // User can cancel if they have a paid plan (not basic)
    return user?.subscription && user.subscription !== 'basic';
};