import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';
import type { ExtractFnReturnType, QueryConfig } from '@/api/helpers/client';
import type {
    BaseApiResponse,
    StockNewsResponse,
    StockNewsStatsResponse
} from '../../../types/api-proxy';

interface StocksNewsParams {
    queryUrl: string;
}

export const stocksNewsQuery = ({
    queryUrl,
}: StocksNewsParams): Promise<BaseApiResponse<StockNewsResponse>> => {
    return api.get('/apiProxy/sn', {
        queryUrl: queryUrl,
    });
};

export const stocksNewsSentimentQuery = ({
    queryUrl,
}: StocksNewsParams): Promise<BaseApiResponse<StockNewsStatsResponse>> => {
    return api.get('/apiProxy/sn', {
        queryUrl: queryUrl,
    });
};

type QueryFnType = typeof stocksNewsQuery;
// type SentimentQueryFnType = typeof stocksNewsSentimentQuery;

interface UseStocksNewsOptions {
    params: StocksNewsParams;
    config?: QueryConfig<QueryFnType>;
}

export const useStocksNews = ({ params, config }: UseStocksNewsOptions) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        queryKey: ['stocks-news', params],
        queryFn: () => stocksNewsQuery(params),
        enabled: Boolean(params.queryUrl),
        retry: (failureCount, error: any) => {
            if (error?.status === 403 || error?.status === 429) {
                return false;
            }
            return failureCount < 2;
        },
        ...config,
    });
};

export const useStockNewsByTicker = (
    ticker: string,
    items: number = 10,
    page: number = 1,
    config?: QueryConfig<QueryFnType>
) => {
    const queryUrl = `https://stocknewsapi.com/api/v1?tickers=${ticker}&items=${items}&page=${page}`;

    return useStocksNews({
        params: { queryUrl },
        config,
    });
};
