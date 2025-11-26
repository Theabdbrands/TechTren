import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';
import type { MutationConfig } from '@/api/helpers/client';
import type {
    DatabricksProxyRequest,
    DatabricksProxyResponse,
    DatabricksProxyParams
} from '@/types/prediction';

export const useDatabricksProxy = (
    config?: MutationConfig<
        (data: {
            request: DatabricksProxyRequest;
            params?: DatabricksProxyParams
        }) => Promise<DatabricksProxyResponse>
    >
) => {
    return useMutation({
        mutationFn: async ({ request }: {
            request: DatabricksProxyRequest;
            params?: DatabricksProxyParams
        }) => {
            const url = 'https://apiv2.techtren.com/api/apiProxy/db/public?endpoint=agents_techtren-main-financialgptv2/invocations'

            const response = await api.post<DatabricksProxyResponse>(url, request);
            if (response.data?.payload?.output?.[0]?.content?.[0]?.text) {
                const predictionText = response.data.payload.output[0].content[0].text;
                const validJsonString = predictionText.replace(/'/g, '"');
                const parsedPredictions = JSON.parse(validJsonString);
                console.log('Parsed predictions:', parsedPredictions);
            }

            return response;
        },
        ...config,
    });
};