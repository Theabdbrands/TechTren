export interface SearchParams {
    searchTerm: string;
    itemType?: 'stock_ticker' | 'crypto_ticker' | 'user' | 'community' | 'threadpost' | string;
    cap?: number;
}

export interface SearchResult {
    itemType: string;
    desc: string;
    id: string;
    metadata: {
        symbol?: string;
        name?: string;
        market?: string;
        primary_exchange?: string;
        userName?: string;
        displayName?: string;
        avatar?: string;
        // communityId?: string;
        isPrivate?: boolean;
        description?: string;
        contentId?: string;
        ownerUserId?: string;
        communityId?: string | null;
        tickers?: string[];
    };
}

export interface SearchResponse {
    data: SearchResult[];
    // total?: number;
    // page?: number;
}

export interface DatabricksProxyParams {
    endpoint?: string;
}

export interface DatabricksProxyRequest {
    input: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
    }>;
    max_tokens?: number;
}

export interface TimeHorizonPrediction {
    price_change_category: string;
    confidence_interval_size_pct: number;
    risk_level: 'High' | 'Medium' | 'Low';
    trend: 'Bullish' | 'Neutral' | 'Bearish';
    price_change_prediction_justification: string;
    confidence_interval_size_prediction_justification: string;
    predicted_price: number;
    predicted_price_upper: number;
    predicted_price_lower: number;
    report: string;
}

export interface PredictionData {
    [key: string]: TimeHorizonPrediction;
}

export interface DatabricksProxyResponse {
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

// Prediction Log Types
export interface LogPredictionRequest {
    conversationId: string;
    predictionJson: string;
}

export interface PredictionLog {
    id: string;
    userId: string;
    conversationHistoryId: string;
    conversationId: string;
    predictionJson: string;
    createdAt: string;
    updatedAt: string;
}

export interface LogPredictionResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: PredictionLog;
}

export interface ListPredictionsParams {
    page?: number;
    limit?: number;
    conversationId?: string;
}

export interface ListPredictionsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: PredictionLog[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface GetPredictionResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: PredictionLog;
}


export interface TimeHorizonData {
    price_change_category: string;
    confidence_interval_size_pct: number;
    risk_level: 'Low' | 'Medium' | 'High';
    trend: 'Bullish' | 'Bearish' | 'Neutral';
    price_change_prediction_justification: string;
    confidence_interval_size_prediction_justification: string;
    predicted_price: number;
    predicted_price_upper: number;
    predicted_price_lower: number;
    report: string;
}

export interface DataBricksResponse {
    '1_day': TimeHorizonData;
    '1_week': TimeHorizonData;
    '1_month': TimeHorizonData;
    'long_term': TimeHorizonData;
}