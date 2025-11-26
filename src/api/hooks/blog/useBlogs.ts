import type { QueryConfig } from '@/api/helpers/client';
import { api } from '@/api/helpers/request';
import { useQuery } from '@tanstack/react-query';

export interface BlogAsset {
    asset_id: string;
    asset_url: string;
    alt_text: string;
}

export interface Blog {
    id: string;
    ownerUserId: string;
    contentType: 'blog';
    tickers: string[];
    title: string;
    subtitle: string | null;
    body: string;
    assets: BlogAsset[];
    communityId: string;
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
    assets?: BlogAsset[];
}

export interface BlogsListResponse {
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

export interface ListBlogsParams {
    author_id?: string;
    community_id?: string;
    ticker?: string;
    sort_by?: 'latest' | 'hot';
    limit?: number;
    offset?: number;
}

export const blogKeys = {
    all: ['blogs'] as const,
    lists: () => [...blogKeys.all, 'list'] as const,
    list: (params: ListBlogsParams) => [...blogKeys.lists(), params] as const,
    details: () => [...blogKeys.all, 'detail'] as const,
    detail: (id: string) => [...blogKeys.details(), id] as const,
};

export const useBlogs = (
    params: ListBlogsParams = {},
    config?: QueryConfig<typeof api.get<BlogsListResponse>>
) => {
    return useQuery({
        queryKey: blogKeys.list(params),
        queryFn: () => api.get<BlogsListResponse>('/blogs', params),
        ...config,
    });
};

export const useBlog = (
    contentId: string,
    config?: QueryConfig<typeof api.get<BlogResponse>>
) => {
    return useQuery({
        queryKey: blogKeys.detail(contentId),
        queryFn: () => api.get<BlogResponse>(`/blogs/${contentId}`),
        enabled: !!contentId,
        ...config,
    });
};
