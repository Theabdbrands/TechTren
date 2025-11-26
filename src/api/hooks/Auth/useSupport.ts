import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';
import type { MutationConfig, QueryConfig } from '@/api/helpers/client';
import type { SupportTicket, CreateSupportTicketRequest } from '@/types/user.types';

export const supportKeys = {
    all: ['support'] as const,
    tickets: () => [...supportKeys.all, 'tickets'] as const,
    ticket: (id: string) => [...supportKeys.all, 'ticket', id] as const,
};

export const useCreateSupportTicket = (
    config?: MutationConfig<(data: CreateSupportTicketRequest) => Promise<SupportTicket>>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ subject, body, files }) => {
            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('body', body);

            if (files && files.length > 0) {
                files.slice(0, 5).forEach((file) => {
                    formData.append('files', file);
                });
            }
            return api.post<SupportTicket>('/support', formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
        },
        ...config,
    });
};

export const useSupportTickets = (
    config?: QueryConfig<typeof api.get<SupportTicket[]>>
) => {
    return useQuery({
        queryKey: supportKeys.tickets(),
        queryFn: () => api.get<SupportTicket[]>('/support'),
        staleTime: 30 * 1000,
        ...config,
    });
};

export const useSupportTicket = (
    ticketId: string,
    config?: QueryConfig<typeof api.get<SupportTicket>>
) => {
    return useQuery({
        queryKey: supportKeys.ticket(ticketId),
        queryFn: () => api.get<SupportTicket>(`/support/${ticketId}`),
        enabled: !!ticketId,
        staleTime: 30 * 1000,
        ...config,
    });
};

export const useSupportManagement = () => {
    const createTicket = useCreateSupportTicket();
    const { data: ticketsData, isLoading: ticketsLoading, refetch } = useSupportTickets();
    const tickets = Array.isArray(ticketsData)
        ? ticketsData
        : Array.isArray((ticketsData as any)?.data)
            ? (ticketsData as any).data
            : [];

    const groupedTickets = {
        open: tickets.filter((t: SupportTicket) => t.status === 'open'),
        inProgress: tickets.filter((t: SupportTicket) => t.status === 'in_progress'),
        resolved: tickets.filter((t: SupportTicket) => t.status === 'resolved'),
        closed: tickets.filter((t: SupportTicket) => t.status === 'closed'),
    };

    const ticketCounts = {
        total: tickets.length,
        open: groupedTickets.open.length,
        inProgress: groupedTickets.inProgress.length,
        resolved: groupedTickets.resolved.length,
        closed: groupedTickets.closed.length,
    };

    return {
        tickets,
        groupedTickets,
        ticketCounts,
        createTicket: createTicket.mutateAsync,
        refetchTickets: refetch,
        isLoading: ticketsLoading || createTicket.isPending,
        error: createTicket.error,
    };
};

export const usePrefetchSupport = () => {
    const queryClient = useQueryClient();

    return () => {
        queryClient.prefetchQuery({
            queryKey: supportKeys.tickets(),
            queryFn: () => api.get<SupportTicket[]>('/support'),
            staleTime: 30 * 1000,
        });
    };
};