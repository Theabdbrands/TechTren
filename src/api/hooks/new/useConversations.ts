import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';
import type { MutationConfig } from '@/api/helpers/client';

export interface Conversation {
    id: string;
    userId: string;
    conversationId: string;
    contentJson: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateConversationRequest {
    conversationId: string;
    contentJson: string;
}

export interface CreateConversationResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: Conversation;
}

export interface ListConversationsParams {
    page?: number;
    limit?: number;
}

export interface ListConversationsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: Conversation[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface GetConversationResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: Conversation;
}

export const conversationKeys = {
    all: ['conversations'] as const,
    lists: () => [...conversationKeys.all, 'list'] as const,
    list: (params: ListConversationsParams) => [...conversationKeys.lists(), params] as const,
    details: () => [...conversationKeys.all, 'detail'] as const,
    detail: (conversationId: string) => [...conversationKeys.details(), conversationId] as const,
};

export const useCreateConversation = (
    config?: MutationConfig<(data: CreateConversationRequest) => Promise<CreateConversationResponse>>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateConversationRequest) => {
            return api.post<CreateConversationResponse>('/apiProxy/conversations', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
        },
        ...config,
    });
};

// export const useListConversations = (
//     params: ListConversationsParams = {},
//     config?: QueryConfig<typeof api.get<ListConversationsResponse>>
// ) => {
//     const queryFn = async () => {
//         const response = await api.get<ListConversationsResponse>('/apiProxy/conversations', params);
//         return response;
//     };

//     return useQuery({
//         queryKey: conversationKeys.list(params),
//         queryFn,
//         ...config,
//     });
// };

// export const useGetConversation = (
//     conversationId: string,
//     config?: QueryConfig<typeof api.get<GetConversationResponse>>
// ) => {
//     const queryFn = async () => {
//         const response = await api.get<GetConversationResponse>(`/apiProxy/conversations/${conversationId}`);
//         return response;
//     };

//     return useQuery({
//         queryKey: conversationKeys.detail(conversationId),
//         queryFn,
//         enabled: !!conversationId,
//         ...config,
//     });
// };