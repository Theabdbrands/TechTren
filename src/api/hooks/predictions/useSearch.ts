import type { QueryConfig } from '@/api/helpers/client';
import { api } from '@/api/helpers/request';
import type { SearchParams, SearchResponse } from '@/types/prediction';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const searchKeys = {
    all: ['search'] as const,
    lists: () => [...searchKeys.all, 'list'] as const,
    list: (params: SearchParams) => [...searchKeys.lists(), params] as const,
};

export const useSearch = (
    params: SearchParams,
    config?: QueryConfig<typeof api.get<SearchResponse>>
) => {
    const [debouncedParams, setDebouncedParams] = useState(params);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedParams(params);
        }, 700);

        return () => {
            clearTimeout(handler);
        };
    }, [params]);

    const queryFn = async () => {
        const response = await api.get<SearchResponse>('/api/search', debouncedParams);
        return response;
    };

    return useQuery({
        queryKey: searchKeys.list(debouncedParams),
        queryFn,
        enabled: !!debouncedParams.searchTerm && debouncedParams.searchTerm.length >= 2,
        ...config,
    });
};