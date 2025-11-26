export interface BlogAsset {
    asset_id: string;
    asset_url: string;
    alt_text: string;
}

export interface Blog {
    id: string;
    contentType: string;
    ownerUserId: string;
    title: string;
    subtitle: string | null;
    body: string;
    tickers: string[];
    communityId: string;
    assets: BlogAsset[];
    replyToContentId: string | null;
    seriesRootId: string;
    createdAt: string;
    updatedAt: string;
    owner_user_id?: string;
    reply_to_content_id?: string | null;
    series_root_id?: string;
    community_id?: string;
    votes?: any[];
}

export interface CreateBlogRequest {
    title: string;
    subtitle?: string;
    body: string;
    tickers: string[];
    community_id: string;
    assets: BlogAsset[];
}

export interface BlogListResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: Blog[];
}

export interface BlogResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: Blog;
}

export interface BlogListParams {
    author_id?: string;
    community_id?: string;
    ticker?: string;
    sort_by?: 'latest' | 'hot';
    limit?: number;
    offset?: number;
}

// As Fallbacks.ts
export const FALLBACK_IMAGES = {
    BLOG_HERO: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    BLOG_CARD: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    BLOG_DETAIL: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
    MARKET_NEWS: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
} as const;