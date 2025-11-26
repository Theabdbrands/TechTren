// stores/conversation-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import type { Message } from '@/types/conversation';

// type Message as any

interface ConversationState {
    // Active conversation
    activeConversationId: string | null;
    activeMessages: Message[];

    // Loading states
    isLoading: boolean;
    isStreaming: boolean;

    // Actions
    setActiveConversation: (conversationId: string, messages?: Message[]) => void;
    addMessage: (message: Message) => void;
    setMessages: (messages: Message[]) => void;
    clearActiveConversation: () => void;
    setLoading: (isLoading: boolean) => void;
    setStreaming: (isStreaming: boolean) => void;

    // New conversation
    startNewConversation: () => string;
}
export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    timestamp: Date;
    conversationId: string;
    metadata?: {
        [key: string]: any;
    };
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
    metadata?: {
        [key: string]: any;
    };
}

// Optional: Message types for different roles
export type MessageRole = 'user' | 'assistant' | 'system';

// Optional: For creating new messages
export interface CreateMessageRequest {
    content: string;
    role: MessageRole;
    conversationId: string;
    metadata?: {
        [key: string]: any;
    };
}

export const useConversationStore = create<ConversationState>()(
    persist(
        (set) => ({
            // Initial state
            activeConversationId: null,
            activeMessages: [],
            isLoading: false,
            isStreaming: false,

            // Set active conversation
            setActiveConversation: (conversationId: string, messages: Message[] = []) => {
                set({
                    activeConversationId: conversationId,
                    activeMessages: messages,
                    isLoading: false,
                });
            },

            // Add a single message
            addMessage: (message: Message) => {
                set((state) => ({
                    activeMessages: [...state.activeMessages, message],
                }));
            },

            // Replace all messages
            setMessages: (messages: Message[]) => {
                set({ activeMessages: messages });
            },

            // Clear current conversation
            clearActiveConversation: () => {
                set({
                    activeConversationId: null,
                    activeMessages: [],
                    isLoading: false,
                    isStreaming: false,
                });
            },

            // Set loading state
            setLoading: (isLoading: boolean) => {
                set({ isLoading });
            },

            // Set streaming state
            setStreaming: (isStreaming: boolean) => {
                set({ isStreaming });
            },

            // Start a new conversation with generated ID
            startNewConversation: () => {
                const newId = `chat_session_${new Date().toISOString()}`;
                set({
                    activeConversationId: newId,
                    activeMessages: [],
                    isLoading: false,
                    isStreaming: false,
                });
                return newId;
            },
        }),
        {
            name: 'conversation-storage',
            partialize: (state) => ({
                activeConversationId: state.activeConversationId,
                activeMessages: state.activeMessages,
            }),
        }
    )
);