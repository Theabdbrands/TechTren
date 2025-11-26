export interface WatchlistItem {
    id: string;
    ticker: string;
    user_id: string;
    createdAt: string;
    updatedAt: string;
}

export interface PriceAlert {
    id: string;
    ticker: string;
    current_price: number;
    target_price: number;
    direction: 'BELOW' | 'ABOVE';
    delivery_channels: string[];
    is_recurring: boolean;
    is_outstanding: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAlertPayload {
    currentPrice: number;
    threshold: number;
    direction: 'BELOW' | 'ABOVE';
    delivery: string[];
    is_recurring: boolean;
    asset_class: string;
}

// API Response Types
export interface WatchlistResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        items: WatchlistItem[];
    };
}

export interface AddToWatchlistResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        item: WatchlistItem;
    };
}

export interface DeleteWatchlistResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: null;
}

export interface CreateAlertResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        alert: PriceAlert;
    };
}

export interface AlertsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        items: PriceAlert[];
    };
}