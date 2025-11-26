import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';
import type { MutationConfig, QueryConfig } from '@/api/helpers/client';

export interface PredictionLog {
    id: string;
    userId: string;
    conversationHistoryId: string;
    conversationId: string;
    predictionJson: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePredictionRequest {
    conversationId: string;
    predictionJson: string;
}

export interface CreatePredictionResponse {
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

export const predictionKeys = {
    all: ['predictions'] as const,
    lists: () => [...predictionKeys.all, 'list'] as const,
    list: (params: ListPredictionsParams) => [...predictionKeys.lists(), params] as const,
    details: () => [...predictionKeys.all, 'detail'] as const,
    detail: (predictionId: string) => [...predictionKeys.details(), predictionId] as const,
};

export const useCreatePrediction = (
    config?: MutationConfig<(data: CreatePredictionRequest) => Promise<CreatePredictionResponse>>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePredictionRequest) => {
            return api.post<CreatePredictionResponse>('/apiProxy/predictions', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: predictionKeys.lists() });
        },
        ...config,
    });
};


export const useListPredictions = (
    params: ListPredictionsParams = {},
    config?: QueryConfig<typeof api.get<ListPredictionsResponse>>
) => {
    const queryFn = async () => {
        const response = await api.get<ListPredictionsResponse>('/apiProxy/predictions', params);
        return response;
    };
    return useQuery({
        queryKey: predictionKeys.list(params),
        queryFn,
        ...config,
    });
};



// Add this to your existing usePredictions.ts file
export const useGetPrediction = (
    predictionId: string,
    config?: QueryConfig<typeof api.get<GetPredictionResponse>>
) => {
    const queryFn = async () => {
        const response = await api.get<GetPredictionResponse>(`/apiProxy/predictions/${predictionId}`);

        console.log('🟢 [useGetPrediction] Prediction fetched:', response);

        return response;
    };

    return useQuery({
        queryKey: predictionKeys.detail(predictionId),
        queryFn,
        enabled: !!predictionId,
        ...config,
    });
};