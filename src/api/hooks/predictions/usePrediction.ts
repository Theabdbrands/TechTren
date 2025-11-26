import { useCallback } from 'react';
import { useDatabricksProxy, createPricePredictionPrompt, extractPredictionData } from './useDatabricksProxy';
import { useLogPrediction } from './usePredictionLogs';
import { useSearch } from './useSearch';
import type { SearchParams, PredictionData, TimeHorizonPrediction } from '@/types/prediction';
import { usePredictionStore } from '@/api/stores/prediction-store';

export const usePrediction = () => {
    const {
        cachePrediction,
        getCachedPrediction,
        addRecentSearch,
        addSearchHistory,
        recentSearches,
        searchHistory,
    } = usePredictionStore();

    const searchMutation = useSearch;
    const databricksProxyMutation = useDatabricksProxy();
    const logPredictionMutation = useLogPrediction();

    const search = useCallback((params: SearchParams) => {
        addSearchHistory(params.searchTerm);
        return searchMutation(params);
    }, [searchMutation, addSearchHistory]);

    const getPricePrediction = useCallback(async (
        symbol: string,
        context?: string
    ): Promise<PredictionData> => {
        const cached = getCachedPrediction(symbol);
        if (cached) {
            console.log('Using cached prediction for:', symbol);
            return cached;
        }

        const prompt = createPricePredictionPrompt(symbol, context);
        console.log('Getting prediction for symbol:', symbol);

        try {
            const response = await databricksProxyMutation.mutateAsync({
                request: prompt
            });

            console.log('Databricks full response:', response);

            if (response.success && response.data.payload) {
                const predictionData = extractPredictionData(response.data.payload);
                console.log('Extracted prediction data:', predictionData);
                cachePrediction(symbol, predictionData);
                console.log('Prediction cached successfully');
                return predictionData;
            }

            throw new Error(response.message || 'Failed to get prediction');
        } catch (error) {
            console.error('Error in getPricePrediction:', error);
            throw error;
        }
    }, [databricksProxyMutation, getCachedPrediction, cachePrediction]);

    const getTimeHorizonPrediction = useCallback((
        predictionData: PredictionData,
        timeHorizon: '1_day' | '1_week' | '1_month' | 'long_term'
    ): TimeHorizonPrediction | null => {
        return predictionData[timeHorizon] || null;
    }, []);

    const logPrediction = useCallback(async (
        conversationId: string,
        predictionData: PredictionData
    ) => {
        return logPredictionMutation.mutateAsync({
            conversationId,
            predictionJson: JSON.stringify(predictionData)
        });
    }, [logPredictionMutation]);

    return {
        // Search
        search,
        recentSearches,
        searchHistory,
        addRecentSearch,

        // Predictions
        getPricePrediction,
        getTimeHorizonPrediction,
        logPrediction,

        // Mutation states
        isPredicting: databricksProxyMutation.isPending,
        isLogging: logPredictionMutation.isPending,
        predictionError: databricksProxyMutation.error,
        logError: logPredictionMutation.error,
    };
};