export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatRequest {
    input: ChatMessage[];
    max_tokens?: number;
}

export interface ConversationCreateRequest {
    conversationId: string;
    contentJson: string;
}

export interface ConversationUpdateRequest {
    contentJson: string;
}

export interface ChatResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        payload: {
            object: string;
            output: Array<{
                type: string;
                id: string;
                content: Array<{
                    text: string;
                    type: string;
                }>;
                role: string;
            }>;
            id: string;
            databricks_output: {
                databricks_request_id: string;
            };
        };
    };
}

export interface Conversation {
    id: string;
    userId: string;
    conversationId: string;
    contentJson: string;
    createdAt: string;
    updatedAt: string;
    user_id?: string;
}

export interface ConversationResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: Conversation;
}

export interface ConversationsListResponse {
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

export interface DeleteConversationResponse {
    success: boolean;
    statusCode: number;
    message: string;
}

// ============== Store Types ==============
export interface ConversationState {
    messages: ChatMessage[];
    conversationId: string;
    isLoading: boolean;
}