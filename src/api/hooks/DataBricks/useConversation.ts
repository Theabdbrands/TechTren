import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationConfig } from '@/api/helpers/client';
import { api } from '@/api/helpers/request';
import { useAuthStore } from '@/api/stores/auth-store';

export interface ConversationMessage {
    role: string;
    content: string;
}

export interface ConversationPayload {
    conversationId: string;
    contentJson: string;
}

export interface ConversationResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        id: string;
        userId: string;
        conversationId: string;
        contentJson: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface ConversationsListResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: ConversationResponse['data'][];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}


export const useUpdateConversation = (
    config?: MutationConfig<
        (params: { conversationId: string; contentJson: string }) => Promise<ConversationResponse>
    >
) => {
    const { isAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ conversationId, contentJson }: { conversationId: string; contentJson: string }) => {
            if (!isAuthenticated) {
                throw new Error('Authentication required to update conversations');
            }

            return await api.put<ConversationResponse>(
                `/apiProxy/conversations/${conversationId}`,
                { contentJson }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
        ...config,
    });
};

// Delete conversation
export const useDeleteConversation = (
    config?: MutationConfig<(conversationId: string) => Promise<{ success: boolean; message: string }>>
) => {
    const { isAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (conversationId: string) => {
            if (!isAuthenticated) {
                throw new Error('Authentication required to delete conversations');
            }

            return await api.delete<{ success: boolean; message: string }>(
                `/apiProxy/conversations/${conversationId}`
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
        ...config,
    });
};

// __CURRENTLY--NOT--USING__
// export const useSaveConversation = (
//     config?: MutationConfig<(payload: ConversationPayload) => Promise<ConversationResponse>>
// ) => {
//     const { isAuthenticated } = useAuthStore();
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async (payload: ConversationPayload) => {
//             if (!isAuthenticated) {
//                 throw new Error('Authentication required to save conversations');
//             }

//             try {
//                 return await api.post<ConversationResponse>('/apiProxy/conversations', payload);
//             } catch (error: any) {
//                 if (error.status === 409 || error.message?.includes('Conflict')) {
//                     return await api.put<ConversationResponse>(
//                         `/apiProxy/conversations/${payload.conversationId}`,
//                         { contentJson: payload.contentJson }
//                     );
//                 }
//                 throw error;
//             }
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['conversations'] });
//         },
//         ...config,
//     });
// };

// Update existing conversation


// Fetch all conversations
// export const useFetchConversations = (page = 1, limit = 50) => {
//     const { isAuthenticated } = useAuthStore();

//     return useQuery({
//         queryKey: ['conversations', page, limit],
//         queryFn: async () => {
//             if (!isAuthenticated) {
//                 throw new Error('Authentication required to fetch conversations');
//             }

//             return await api.get<ConversationsListResponse>(
//                 `/apiProxy/conversations?page=${page}&limit=${limit}`
//             );
//         },
//         enabled: isAuthenticated,
//         staleTime: 1000 * 60 * 5, // 5 minutes
//         retry: (failureCount, error: any) => {
//             if (error?.message?.includes('Authentication required')) return false;
//             return failureCount < 3;
//         },
//     });
// };

// Fetch single conversation
// export const useFetchConversation = (conversationId: string | null) => {
//     const { isAuthenticated } = useAuthStore();

//     return useQuery({
//         queryKey: ['conversation', conversationId],
//         queryFn: async () => {
//             if (!conversationId) return null;
//             if (!isAuthenticated) {
//                 throw new Error('Authentication required to fetch conversation');
//             }

//             return await api.get<ConversationResponse>(
//                 `/apiProxy/conversations/${conversationId}`
//             );
//         },
//         enabled: !!conversationId && isAuthenticated,
//         staleTime: 1000 * 60 * 5,
//     });
// };

// Helper: Convert chat store format to API format
// export const convertChatToConversationPayload = (
//     conversationId: string,
//     messages: Array<{ sender: 'user' | 'ai'; text: string }>,
//     userRole?: string
// ): ConversationPayload => {
//     const apiMessages: ConversationMessage[] = messages.map((msg) => ({
//         role: msg.sender === 'user' ? (userRole || 'user') : 'assistant',
//         content: msg.text,
//     }));

//     return {
//         conversationId,
//         contentJson: JSON.stringify({ messages: apiMessages }),
//     };
// };


// Helper: Convert API format to chat store format
// export const convertConversationToChat = (
//     conversation: ConversationResponse['data']
// ): Array<{ sender: 'user' | 'ai'; text: string; id: number }> => {
//     try {
//         const parsed = JSON.parse(conversation.contentJson);
//         const messages = parsed.messages || [];

//         console.log('Converting conversation to chat:', {
//             conversationId: conversation.conversationId,
//             rawMessages: messages,
//             parsedMessages: messages.map((msg: any) => ({
//                 role: msg.role,
//                 content: msg.content,
//                 sender: msg.role.toLowerCase() === 'user' ? 'user' : 'ai'
//             }))
//         });

//         return messages.map(
//             (msg: ConversationMessage, index: number) => ({
//                 id: index + 1,
//                 // CRITICAL FIX: Map roles properly
//                 sender: msg.role.toLowerCase() === 'user' ? 'user' as const : 'ai' as const,
//                 text: msg.content,
//             })
//         );
//     } catch (error) {
//         console.error('Failed to parse conversation:', error);
//         return [];
//     }
// };