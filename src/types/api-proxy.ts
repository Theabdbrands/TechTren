export interface BaseApiResponse<T = any> {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        payload: T;
    };
}

// Polygon Types
export interface PolygonAggsResponse {
    ticker: string;
    queryCount: number;
    resultsCount: number;
    adjusted: boolean;
    results: Array<{
        v: number;
        vw: number;
        o: number;
        c: number;
        h: number;
        l: number;
        t: number;
        n: number;
    }>;
}

// Stocks News Types
export interface StockNewsItem {
    title: string;
    news_url: string;
    image_url: string;
    source_name: string;
    date: string;
    tickers: string[];
    sentiment: string;
    type: string;
}

export interface StockNewsResponse {
    data: StockNewsItem[];
    total_pages: number;
    total_records: number;
}

export interface StockNewsStatsResponse {
    sentiment_counts: {
        Positive: number;
        Negative: number;
        Neutral: number;
    };
    sentiment_score: number;
    news_score: number;
}

// Crypto News Types
export interface CryptoNewsItem {
    title: string;
    news_url: string;
    image_url: string;
    source_name: string;
    date: string;
    tickers: string[];
    sentiment: string;
}

export interface CryptoNewsResponse {
    data: CryptoNewsItem[];
    total_pages: number;
    total_records: number;
}

export interface CryptoNewsStatsResponse {
    positive_sentiments: number;
    negative_sentiments: number;
    sentiment_score: number;
}

export type AssetClass = 'stocks' | 'crypto';