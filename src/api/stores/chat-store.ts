// stores/chat-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, ConversationState } from '@/types/chat.types';

interface ChatState {
    conversations: Map<string, ConversationState>;
    activeConversationId: string | null;

    // Actions
    setActiveConversation: (conversationId: string) => void;
    addMessage: (conversationId: string, message: ChatMessage) => void;
    setMessages: (conversationId: string, messages: ChatMessage[]) => void;
    clearConversation: (conversationId: string) => void;
    createNewConversation: () => string;
    setLoading: (conversationId: string, isLoading: boolean) => void;
    getConversation: (conversationId: string) => ConversationState | undefined;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: new Map(),
            activeConversationId: null,

            setActiveConversation: (conversationId: string) => {
                set({ activeConversationId: conversationId });
            },

            addMessage: (conversationId: string, message: ChatMessage) => {
                set((state) => {
                    const conversations = new Map(state.conversations);
                    const conversation = conversations.get(conversationId) || {
                        messages: [],
                        conversationId,
                        isLoading: false,
                    };

                    conversations.set(conversationId, {
                        ...conversation,
                        messages: [...conversation.messages, message],
                    });

                    return { conversations };
                });
            },

            setMessages: (conversationId: string, messages: ChatMessage[]) => {
                set((state) => {
                    const conversations = new Map(state.conversations);
                    conversations.set(conversationId, {
                        messages,
                        conversationId,
                        isLoading: false,
                    });
                    return { conversations };
                });
            },

            clearConversation: (conversationId: string) => {
                set((state) => {
                    const conversations = new Map(state.conversations);
                    conversations.delete(conversationId);
                    return { conversations };
                });
            },

            createNewConversation: () => {
                const conversationId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                set((state) => {
                    const conversations = new Map(state.conversations);
                    conversations.set(conversationId, {
                        messages: [],
                        conversationId,
                        isLoading: false,
                    });
                    return {
                        conversations,
                        activeConversationId: conversationId
                    };
                });
                return conversationId;
            },

            setLoading: (conversationId: string, isLoading: boolean) => {
                set((state) => {
                    const conversations = new Map(state.conversations);
                    const conversation = conversations.get(conversationId);
                    if (conversation) {
                        conversations.set(conversationId, {
                            ...conversation,
                            isLoading,
                        });
                    }
                    return { conversations };
                });
            },

            getConversation: (conversationId: string) => {
                return get().conversations.get(conversationId);
            },
        }),
        {
            name: 'chat-storage',
            partialize: (state) => ({
                activeConversationId: state.activeConversationId,
            }),
        }
    )
);