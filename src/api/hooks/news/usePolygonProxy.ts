// usePolygonProxy.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import type { BaseApiResponse, PolygonAggsResponse, AssetClass } from '../../../types/api-proxy';
import { api } from '@/api/helpers/request';
import type { ExtractFnReturnType, QueryConfig } from '@/api/helpers/client';

interface PolygonProxyParams {
    queryUrl: string;
    assetClass: AssetClass;
}

type QueryFnType = typeof polygonProxyQuery;

interface UsePolygonProxyOptions {
    params: PolygonProxyParams;
    config?: QueryConfig<QueryFnType>;
}

// Real-time update intervals based on timeframe
const getRefetchInterval = (timeframeUnit: string): number => {
    switch (timeframeUnit) {
        case 'minute':
            return 10000; // 10 seconds for minute data
        case 'hour':
            return 30000; // 30 seconds for hour data
        case 'day':
            return 60000; // 1 minute for daily data
        default:
            return 30000; // Default 30 seconds
    }
};

export const polygonProxyQuery = ({
    queryUrl,
    assetClass,
}: PolygonProxyParams): Promise<BaseApiResponse<PolygonAggsResponse>> => {
    console.log("Original queryUrl:", queryUrl);
    const cleanQueryUrl = queryUrl.replace(/[?&]apiKey=[^&]*/, '');
    console.log("Clean queryUrl:", cleanQueryUrl);

    const params = {
        queryUrl: cleanQueryUrl,
        asset_class: assetClass,
    };

    console.log("Params being sent to api.get:", params);

    return api.get('/apiProxy/pl', params);
};

export const usePolygonProxy = ({
    params,
    config
}: UsePolygonProxyOptions & {
    enableRealTime?: boolean;
    timeframeUnit?: string;
}) => {
    const refetchInterval = getRefetchInterval((params as any).timeframeUnit || 'minute');

    return useQuery<ExtractFnReturnType<QueryFnType>>({
        queryKey: ['polygon-proxy', params],
        queryFn: () => polygonProxyQuery(params),
        enabled: Boolean(params.queryUrl && params.assetClass),
        refetchInterval: (config as any)?.enableRealTime ? refetchInterval : false,
        retry: (failureCount, error: any) => {
            if (error?.status === 403 || error?.status === 429) {
                return false;
            }
            return failureCount < 2;
        },
        ...config,
    });
};

export const usePolygonProxyMutation = () => {
    return useMutation<ExtractFnReturnType<QueryFnType>, Error, PolygonProxyParams>({
        mutationFn: polygonProxyQuery,
        retry: (failureCount, error: any) => {
            if (error?.status === 403 || error?.status === 429) {
                return false;
            }
            return failureCount < 2;
        },
    });
};