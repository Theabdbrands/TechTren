import type { MutationConfig, QueryConfig } from '@/api/helpers/client';
import { api } from '@/api/helpers/request';
import type {
    LogPredictionRequest,
    LogPredictionResponse,
    ListPredictionsParams,
    ListPredictionsResponse,
    // GetPredictionResponse
} from '@/types/prediction';
import { useQuery, useMutation } from '@tanstack/react-query';

export const predictionLogsKeys = {
    all: ['predictionLogs'] as const,
    lists: () => [...predictionLogsKeys.all, 'list'] as const,
    list: (params: ListPredictionsParams) => [...predictionLogsKeys.lists(), params] as const,
    details: () => [...predictionLogsKeys.all, 'detail'] as const,
    detail: (id: string) => [...predictionLogsKeys.details(), id] as const,
};

export const usePredictionLogs = (
    params: ListPredictionsParams = { page: 1, limit: 20 },
    config?: QueryConfig<typeof api.get<ListPredictionsResponse>>
) => {
    return useQuery({
        queryKey: predictionLogsKeys.list(params),
        queryFn: () => api.get<ListPredictionsResponse>('/apiProxy/predictions', params),
        staleTime: 2 * 60 * 1000,
        ...config,
    });
};

// export const usePredictionLog = (
//     predictionId: string,
//     config?: QueryConfig<typeof api.get<GetPredictionResponse>>
// ) => {
//     return useQuery({
//         queryKey: predictionLogsKeys.detail(predictionId),
//         queryFn: () => api.get<GetPredictionResponse>(`/apiProxy/predictions/${predictionId}`),
//         enabled: !!predictionId,
//         staleTime: 5 * 60 * 1000,
//         ...config,
//     });
// };

export const useLogPrediction = (
    config?: MutationConfig<(data: LogPredictionRequest) => Promise<LogPredictionResponse>>
) => {
    return useMutation({
        mutationFn: (data: LogPredictionRequest) =>
            api.post<LogPredictionResponse>('/apiProxy/predictions', data),
        ...config,
    });
};