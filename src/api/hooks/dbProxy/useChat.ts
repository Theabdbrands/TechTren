import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';
import { useChatStore } from '@/api/stores/chat-store';
import type {
    ChatRequest,
    ChatResponse,
    ChatMessage,
    ConversationCreateRequest,
    ConversationUpdateRequest,
    ConversationResponse,
    ConversationsListResponse,
} from '@/types/chat.types';
import type { MutationConfig, QueryConfig } from '@/api/helpers/client';
import { useCallback } from 'react';

export const chatKeys = {
    all: ['chat'] as const,
    conversations: () => [...chatKeys.all, 'conversations'] as const,
    conversationsList: (page?: number, limit?: number) =>
        [...chatKeys.conversations(), { page, limit }] as const,
    conversation: (id: string) => [...chatKeys.conversations(), id] as const,
};



export const useSendMessage = (
    config?: MutationConfig<(data: { request: ChatRequest; conversationId: string }) => Promise<ChatResponse>>
) => {
    const queryClient = useQueryClient();
    const { addMessage, setLoading, getConversation } = useChatStore();

    return useMutation({
        mutationFn: async ({ request, conversationId }) => {
            // Set loading state
            setLoading(conversationId, true);

            const response = await api.post<ChatResponse>(
                '/apiProxy/db?endpoint=agents_techtren-main-financialgptv2/invocations',
                request
            );

            const assistantText = response.data.payload.output[0].content
                .map((c: any) => c.text)
                .filter(Boolean)
                .join(' ');

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: assistantText
            };

            addMessage(conversationId, assistantMessage);

            const conversation = getConversation(conversationId);
            if (conversation) {
                const contentJson = JSON.stringify({ messages: conversation.messages });

                try {
                    await api.get(`/apiProxy/conversations/${conversationId}`);
                    await api.put(`/apiProxy/conversations/${conversationId}`, {
                        contentJson
                    });
                } catch (error: any) {
                    if (error.status === 404) {
                        await api.post('/apiProxy/conversations', {
                            conversationId,
                            contentJson
                        });
                    }
                }
            }

            queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });

            return response;
        },
        onSettled: (_, __, { conversationId }) => {
            setLoading(conversationId, false);
        },
        ...config,
    });
};

// Chat SutoSave
export const useChatWithAutoSave = () => {
    const sendMessage = useSendMessage();
    const { addMessage, getConversation, createNewConversation } = useChatStore();

    const sendAndSave = useCallback(async (
        message: string,
        conversationId?: string
    ) => {
        const activeConversationId = conversationId || createNewConversation();

        const userMessage: ChatMessage = {
            role: 'user',
            content: message
        };

        addMessage(activeConversationId, userMessage);
        const conversation = getConversation(activeConversationId);
        const allMessages = conversation?.messages || [userMessage];

        const request: ChatRequest = {
            input: allMessages,
            max_tokens: 2000
        };

        return sendMessage.mutateAsync({
            request,
            conversationId: activeConversationId
        });
    }, [sendMessage, addMessage, getConversation, createNewConversation]);

    return {
        sendMessage: sendAndSave,
        isLoading: sendMessage.isPending,
        error: sendMessage.error,
        reset: sendMessage.reset
    };
};

// Conversation History
export const useConversationsList = (
    page: number = 1,
    limit: number = 20,
    config?: QueryConfig<typeof api.get<ConversationsListResponse>>
) => {
    return useQuery({
        queryKey: chatKeys.conversationsList(page, limit),
        queryFn: () => api.get<ConversationsListResponse>('/apiProxy/conversations', { page, limit }),
        staleTime: 30 * 1000,
        ...config,
    });
};

// Get Conversation
export const useConversation = (
    conversationId: string,
    config?: QueryConfig<typeof api.get<ConversationResponse>>
) => {
    const { setMessages } = useChatStore();

    return useQuery({
        queryKey: chatKeys.conversation(conversationId),
        queryFn: async () => {
            const response = await api.get<ConversationResponse>(`/apiProxy/conversations/${conversationId}`);

            if (response.data.contentJson) {
                const parsed = JSON.parse(response.data.contentJson);
                if (parsed.messages) {
                    setMessages(conversationId, parsed.messages);
                }
            }

            return response;
        },
        enabled: !!conversationId,
        ...config,
    });
};


export const useCreateConversation = (
    config?: MutationConfig<(data: ConversationCreateRequest) => Promise<ConversationResponse>>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ConversationCreateRequest) =>
            api.post<ConversationResponse>('/apiProxy/conversations', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
        },
        ...config,
    });
};

// Update Recent Conversation
export const useUpdateConversation = (
    config?: MutationConfig<(data: { conversationId: string; payload: ConversationUpdateRequest }) => Promise<ConversationResponse>>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ conversationId, payload }) =>
            api.put<ConversationResponse>(`/apiProxy/conversations/${conversationId}`, payload),
        onSuccess: (_, { conversationId }) => {
            queryClient.invalidateQueries({ queryKey: chatKeys.conversation(conversationId) });
            queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
        },
        ...config,
    });
};

// Delete Conversation
export const useDeleteConversation = (
    config?: MutationConfig<(conversationId: string) => Promise<void>>
) => {
    const queryClient = useQueryClient();
    const { clearConversation } = useChatStore();

    return useMutation({
        mutationFn: async (conversationId: string): Promise<void> => {
            await api.delete(`/apiProxy/conversations/${conversationId}`);
        },
        onSuccess: (_, conversationId) => {
            clearConversation(conversationId);
            queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
            queryClient.removeQueries({ queryKey: chatKeys.conversation(conversationId) });
        },
        ...config,
    });
};

// Quick Fetch Conversation
export const usePrefetchConversations = () => {
    const queryClient = useQueryClient();

    return useCallback(() => {
        queryClient.prefetchQuery({
            queryKey: chatKeys.conversationsList(1, 20),
            queryFn: () => api.get<ConversationsListResponse>('/apiProxy/conversations', { page: 1, limit: 20 }),
            staleTime: 30 * 1000,
        });
    }, [queryClient]);
};