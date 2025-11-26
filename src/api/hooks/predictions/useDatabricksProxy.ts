import { useMutation } from '@tanstack/react-query';
// import { useAuthStore } from '@/api/stores/auth-store';
import type { MutationConfig } from '@/api/helpers/client';
import type {
    DatabricksProxyParams,
    DatabricksProxyRequest,
    DatabricksProxyResponse,
    PredictionData
} from '@/types/prediction';
import { api } from '@/api/helpers/request';

export const useDatabricksProxy = (
    config?: MutationConfig<(data: {
        request: DatabricksProxyRequest;
        params?: DatabricksProxyParams
    }) => Promise<DatabricksProxyResponse>>
) => {

    return useMutation({
        mutationKey: ['databricksProxy'],
        retry: 3,
        retryDelay: attemptIndex => 2000 * attemptIndex,

        mutationFn: async ({ request }: {
            request: DatabricksProxyRequest;
            params?: DatabricksProxyParams;
        }) => {
            try {
                const endpoint =
                    '/apiProxy/db?endpoint=agents_techtren-main-financialgptv2/invocations';

                const payload = {
                    input: request.input,
                    max_tokens: request.max_tokens || 4000
                };

                const response = await api.post<any>(endpoint, payload);

                return {
                    success: true,
                    statusCode: 200,
                    message: 'Databricks response received successfully',
                    data: {
                        payload: response,
                        raw: response
                    }
                } as DatabricksProxyResponse;

            } catch (error: any) {
                console.error('Databricks API error:', error);

                if (error?.status === 403) {
                    throw new Error('Usage quota exceeded. Please verify or upgrade.');
                }
                if (error?.status === 429) {
                    throw new Error('Too many requests. Please wait and try again.');
                }
                if (error?.status === 401) {
                    throw new Error('Authentication required. Please log in.');
                }
                if (error?.status === 400) {
                    throw new Error(error.message || 'Invalid Databricks request.');
                }
                if (error?.status >= 500) {
                    throw new Error('Service temporarily unavailable.');
                }

                throw new Error(error.message || 'Failed to get AI response');
            }
        },

        onError: (error, _variables, _ctx, context) => {
            console.log("Retries exausted", error)
            if (config?.onError) {
                config.onError(
                    new (Error as any)("The AI service is taking longer than expected. Please try again after some time."),
                    _variables,
                    _ctx,
                    context
                );
            }
        },
        ...config,
    });
};




export function extractPredictionData(apiJson: any): PredictionData {
    const payload = apiJson?.data?.payload ?? apiJson;
    const messages = payload?.messages ?? payload?.output ?? [];
    const last = Array.isArray(messages) ? messages[messages.length - 1] : payload;
    const text = last?.content ?? last?.output ?? '';

    if (typeof text !== 'string') throw new Error('LLM content missing');

    let parsed: Record<string, any>;
    try {
        parsed = JSON.parse(text);
    } catch {
        parsed = JSON.parse(text.replace(/'/g, '"'));
    }

    return parsed as PredictionData;
}

export const createPricePredictionPrompt = (symbol: string, context?: string): DatabricksProxyRequest => {
    const basePrompt = `analyse stocks ${symbol}___TTAGENT_PP2___`;
    const fullPrompt = context ? `${context} ${basePrompt}` : basePrompt;

    return {
        input: [
            {
                role: 'user',
                content: fullPrompt
            }
        ],
        max_tokens: 4000
    };
};