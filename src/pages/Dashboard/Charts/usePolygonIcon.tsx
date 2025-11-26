// usePolygonIcon.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';

interface PolygonTickerDetails {
    ticker: string;
    name: string;
    branding?: {
        logo_url: string;
        icon_url: string;
    };
}

interface TickerDetailsPayload {
    request_id: string;
    results: PolygonTickerDetails;
    status: string;
}

interface PolygonApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        payload: T;
    };
}

interface ImageResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        payload: {
            contentType: string;
            data: string; // base64 string
            size: number;
            encoding: string;
        };
    };
}

// Fetch ticker details (company name, branding info)
const fetchTickerDetails = async (ticker: string): Promise<PolygonTickerDetails> => {
    const queryUrl = encodeURIComponent(
        `https://api.polygon.io/v3/reference/tickers/${ticker}`
    );

    const response = await api.get<PolygonApiResponse<TickerDetailsPayload>>(
        `/apiProxy/pl?queryUrl=${queryUrl}&asset_class=stocks`
    );

    return response.data.payload.results;
};

// Fetch image and convert to base64
const fetchImageAsBase64 = async (imageUrl: string): Promise<string | null> => {
    try {
        const queryUrl = encodeURIComponent(imageUrl);
        const response = await api.get<ImageResponse>(
            `/apiProxy/pl?queryUrl=${queryUrl}&asset_class=stocks`
        );
        const { contentType, data } = response.data.payload;
        return `data:${contentType};base64,${data}`;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
};

// Hook to get ticker details and icon
export const useTickerDetails = (ticker: string) => {
    const detailsQuery = useQuery({
        queryKey: ['ticker-details-chart', ticker],
        queryFn: () => fetchTickerDetails(ticker),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        enabled: !!ticker,
    });

    const iconQuery = useQuery({
        queryKey: ['ticker-icon-chart', ticker, detailsQuery.data?.branding?.icon_url],
        queryFn: () => fetchImageAsBase64(detailsQuery.data?.branding?.icon_url!),
        staleTime: 30 * 60 * 1000, // 30 minutes
        retry: 1,
        enabled: !!detailsQuery.data?.branding?.icon_url && detailsQuery.isSuccess,
    });

    const logoQuery = useQuery({
        queryKey: ['ticker-logo-chart', ticker, detailsQuery.data?.branding?.logo_url],
        queryFn: () => fetchImageAsBase64(detailsQuery.data?.branding?.logo_url!),
        staleTime: 30 * 60 * 1000, // 30 minutes
        retry: 1,
        enabled: !!detailsQuery.data?.branding?.logo_url && detailsQuery.isSuccess,
    });

    return {
        details: detailsQuery,
        icon: iconQuery,
        logo: logoQuery,
        isLoading: detailsQuery.isLoading || iconQuery.isLoading || logoQuery.isLoading,
        isError: detailsQuery.isError || iconQuery.isError || logoQuery.isError,
    };
};