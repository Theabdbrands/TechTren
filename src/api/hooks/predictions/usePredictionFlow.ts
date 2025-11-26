// usePredictionFlow.tsx
import { useCallback, useState } from 'react';
import { useDatabricksProxy } from './useDatabricksProxy';
import { useCreateConversation } from '../new/useConversations';
import { useCreatePrediction } from '../new/usePredictions';
import { api } from '@/api/helpers/request';
import type { PredictionData } from '@/types/prediction';

interface PredictionFlowParams {
    ticker: string;
    conversationId: string;
    onSuccess?: (predictionData: any) => void;
    onError?: (error: any) => void;
}

export interface SentimentData {
    total: {
        [ticker: string]: {
            "Total Positive": number;
            "Total Negative": number;
            "Total Neutral": number;
            "Sentiment Score": number;
        }
    };
    data: {
        [date: string]: {
            [ticker: string]: {
                Neutral: number;
                Positive: number;
                Negative: number;
                sentiment_score: number;
            }
        }
    };
}

// Cache for storing full prediction responses
const predictionCache = new Map<string, {
    data: PredictionData;
    sentimentData: SentimentData | null;
    timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000;

export const usePredictionFlow = () => {
    const {
        mutateAsync: proxyDatabricks,
        isError: isDatabricksError,
        error: databricksError
    } = useDatabricksProxy();

    const {
        mutateAsync: createConversation,
        isError: isConversationError,
        error: conversationError
    } = useCreateConversation();

    const {
        mutateAsync: createPrediction,
        isError: isPredictionError,
        error: predictionError
    } = useCreatePrediction();

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<any>(null);

    const executePredictionFlow = useCallback(async ({
        ticker,
        conversationId,
        onSuccess,
        onError
    }: PredictionFlowParams) => {
        try {
            setIsPending(true);
            setError(null); // Clear previous errors

            // Check cache first
            const cached = predictionCache.get(ticker.toUpperCase());
            if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
                console.log('📦 Using cached prediction for:', ticker);
                if (onSuccess) {
                    onSuccess({
                        conversationId,
                        predictionData: cached.data,
                        sentimentData: cached.sentimentData
                    });
                }
                return {
                    conversationId,
                    predictionData: cached.data,
                    sentimentData: cached.sentimentData
                };
            }

            // 1. Create conversation first
            const conversationContent = {
                messages: [
                    {
                        role: 'user' as const,
                        content: `analyse stocks ${ticker}___TTAGENT_PP2___`
                    }
                ]
            };

            await createConversation({
                conversationId,
                contentJson: JSON.stringify(conversationContent)
            });

            // 2. Fetch sentiment data in parallel with LLM analysis
            const sentimentUrl = `https://stocknewsapi.com/api/v1/stat?tickers=${ticker}`;

            const [databricksResponse, sentimentResponse] = await Promise.all([
                // Get LLM analysis - this returns ALL timeframes at once
                proxyDatabricks({
                    request: {
                        input: [
                            {
                                role: 'user',
                                content: `analyse stocks ${ticker}___TTAGENT_PP2___`
                            }
                        ],
                        max_tokens: 4000
                    },
                    params: {
                        endpoint: 'agents_techtren-main-financialgptv2/invocations'
                    }
                }),
                // Get sentiment data
                api.get<any>('/apiProxy/sn', {
                    queryUrl: sentimentUrl
                }).catch(error => {
                    console.warn('⚠️ Failed to fetch sentiment data:', error);
                    return null;
                })
            ]);

            // 3. Extract and parse ALL timeframes from the response
            let predictionData: PredictionData = {};
            if (databricksResponse.data?.payload?.output?.[0]?.content?.[0]) {
                const content: any = databricksResponse.data.payload.output[0].content[0];

                // The prediction data is directly in the content object, not in text field
                if (content['1_day'] || content['1_week'] || content['1_month'] || content['long_term']) {
                    predictionData = {
                        '1_day': content['1_day'],
                        '1_week': content['1_week'],
                        '1_month': content['1_month'],
                        'long_term': content['long_term']
                    };
                    console.log('✅ Successfully extracted all timeframes:', Object.keys(predictionData));
                } else if (content.text) {
                    // Fallback: try to parse from text if the structure is different
                    try {
                        const predictionText = content.text;
                        const validJsonString = predictionText
                            .replace(/'/g, '"')
                            .replace(/\n/g, '\\n')
                            .replace(/\r/g, '\\r');
                        predictionData = JSON.parse(validJsonString);
                        console.log('✅ Successfully parsed prediction JSON:', Object.keys(predictionData));
                    } catch (parseError) {
                        console.error('❌ Failed to parse prediction JSON:', parseError);
                        throw new Error('Failed to parse prediction data');
                    }
                } else {
                    console.error('❌ No prediction data found in response:', content);
                    throw new Error('No prediction data found in response');
                }
            }

            // 4. Extract sentiment data
            let sentimentData: SentimentData | null = null;
            if (sentimentResponse?.data?.payload) {
                sentimentData = sentimentResponse.data.payload;
            }

            // 5. Cache the complete response
            predictionCache.set(ticker.toUpperCase(), {
                data: predictionData,
                sentimentData,
                timestamp: Date.now()
            });

            // 6. Save prediction to database with ALL timeframes and sentiment data
            const predictionResponse = await createPrediction({
                conversationId,
                predictionJson: JSON.stringify({
                    ticker,
                    ...predictionData, // This includes ALL timeframes
                    sentimentData
                })
            });

            if (onSuccess) {
                onSuccess({
                    conversationId,
                    predictionId: predictionResponse.data.id,
                    predictionData, // ALL timeframes
                    sentimentData
                });
            }

            return {
                conversationId,
                predictionId: predictionResponse.data.id,
                predictionData, // ALL timeframes
                sentimentData
            };

        } catch (error) {
            console.error('❌ [usePredictionFlow] Prediction flow failed:', error);
            setError(error); // Store the error
            if (onError) {
                onError(error);
            }
            throw error;
        } finally {
            setIsPending(false);
        }
    }, [createConversation, proxyDatabricks, createPrediction]);

    // Check if any mutation has error
    const isError = isDatabricksError || isConversationError || isPredictionError || !!error;

    // Get the actual error object (prefer the most recent one)
    const errorObject = error || databricksError || conversationError || predictionError;

    // Helper to clear cache for a specific ticker
    const clearCache = (ticker?: string) => {
        if (ticker) {
            predictionCache.delete(ticker.toUpperCase());
        } else {
            predictionCache.clear();
        }
    };

    // Helper to clear errors
    const clearError = () => {
        setError(null);
    };

    return {
        executePredictionFlow,
        clearCache,
        clearError,
        isPending,
        isError,
        error: errorObject
    };
};