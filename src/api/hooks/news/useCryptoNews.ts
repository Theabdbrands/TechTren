import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';
import type { ExtractFnReturnType, QueryConfig } from '@/api/helpers/client';
import type {
    BaseApiResponse,
    CryptoNewsResponse,
    CryptoNewsStatsResponse
} from '../../../types/api-proxy';

interface CryptoNewsParams {
    queryUrl: string;
}

type QueryFnType = typeof cryptoNewsQuery;
// type SentimentQueryFnType = typeof cryptoNewsSentimentQuery;

interface UseCryptoNewsOptions {
    params: CryptoNewsParams;
    config?: QueryConfig<QueryFnType>;
}


export const cryptoNewsQuery = ({
    queryUrl,
}: CryptoNewsParams): Promise<BaseApiResponse<CryptoNewsResponse>> => {
    return api.get('/apiProxy/cn', {
        queryUrl: queryUrl,
    });
};

export const cryptoNewsSentimentQuery = ({
    queryUrl,
}: CryptoNewsParams): Promise<BaseApiResponse<CryptoNewsStatsResponse>> => {
    return api.get('/apiProxy/cn', {
        queryUrl: queryUrl,
    });
};

export const useCryptoNews = ({ params, config }: UseCryptoNewsOptions) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        queryKey: ['crypto-news', params],
        queryFn: () => cryptoNewsQuery(params),
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

// Hook for fetching crypto news by ticker
export const useCryptoNewsByTicker = (
    ticker: string,
    items: number = 10,
    page: number = 1,
    config?: QueryConfig<QueryFnType>
) => {
    const queryUrl = `https://cryptonews-api.com/api/v1?tickers=${ticker}&items=${items}&page=${page}`;

    return useCryptoNews({
        params: { queryUrl },
        config,
    });
};

// Hook for fetching crypto news sentiment stats
// export const useCryptoNewsSentiment = (
//     ticker: string,
//     config?: QueryConfig<SentimentQueryFnType>
// ) => {
//     const queryUrl = `https://cryptonews-api.com/api/v1/stat?tickers=${ticker}`;

//     return useQuery<ExtractFnReturnType<SentimentQueryFnType>>({
//         queryKey: ['crypto-news-sentiment', { ticker, queryUrl }],
//         queryFn: () => cryptoNewsSentimentQuery({ queryUrl }),
//         enabled: Boolean(ticker),
//         retry: (failureCount, error: any) => {
//             if (error?.status === 403 || error?.status === 429) {
//                 return false;
//             }
//             return failureCount < 2;
//         },
//         ...config,
//     });
// };