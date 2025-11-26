import { useQueries } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';

interface PolygonTickerDetails {
    ticker: string;
    name: string;
    market: string;
    locale: string;
    primary_exchange: string;
    type: string;
    active: boolean;
    currency_name: string;
    market_cap: number;
    description: string;
    homepage_url: string;
    total_employees: number;
    list_date: string;
    branding?: {
        logo_url: string;
        icon_url: string;
    };
}

interface PolygonPrevClose {
    T: string;
    v: number;
    vw: number;
    o: number;
    c: number;
    h: number;
    l: number;
    t: number;
    n: number;
}

interface TickerDetailsPayload {
    request_id: string;
    results: PolygonTickerDetails;
    status: string;
}

interface PrevClosePayload {
    ticker: string;
    queryCount: number;
    resultsCount: number;
    adjusted: boolean;
    results: PolygonPrevClose[];
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

const fetchTickerDetails = async (ticker: string): Promise<PolygonTickerDetails> => {
    const queryUrl = encodeURIComponent(
        `https://api.polygon.io/v3/reference/tickers/${ticker}`
    );

    const response = await api.get<PolygonApiResponse<TickerDetailsPayload>>(
        `/apiProxy/pl?queryUrl=${queryUrl}&asset_class=stocks`
    );

    return response.data.payload.results;
};

const fetchPrevClose = async (ticker: string): Promise<PolygonPrevClose> => {
    const queryUrl = encodeURIComponent(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true`
    );

    const response = await api.get<PolygonApiResponse<PrevClosePayload>>(
        `/apiProxy/pl?queryUrl=${queryUrl}&asset_class=stocks`
    );

    return response.data.payload.results[0];
};

// New function to fetch images through proxy and convert to base64 data URL
const fetchImageAsBase64 = async (imageUrl: string): Promise<string | null> => {
    try {
        const queryUrl = encodeURIComponent(imageUrl);

        const response = await api.get<ImageResponse>(
            `/apiProxy/pl?queryUrl=${queryUrl}&asset_class=stocks`
        );

        const { contentType, data } = response.data.payload;

        // Convert base64 to data URL
        return `data:${contentType};base64,${data}`;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
};

export const useTickerDetailsMultiple = (tickers: string[]) => {
    // Fetch ticker details
    const detailsQueries = useQueries({
        queries: tickers.map((ticker) => ({
            queryKey: ['ticker-details', ticker],
            queryFn: () => fetchTickerDetails(ticker),
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            enabled: !!ticker,
        })),
    });

    // Fetch price data
    const priceQueries = useQueries({
        queries: tickers.map((ticker) => ({
            queryKey: ['ticker-price', ticker],
            queryFn: () => fetchPrevClose(ticker),
            staleTime: 1 * 60 * 1000, // 1 minute
            retry: 1,
            enabled: !!ticker,
        })),
    });

    // Fetch icon images (converted to base64)
    const iconQueries = useQueries({
        queries: tickers.map((ticker, index) => {
            const details = detailsQueries[index];
            const iconUrl = details.data?.branding?.icon_url;

            return {
                queryKey: ['ticker-icon', ticker, iconUrl],
                queryFn: () => fetchImageAsBase64(iconUrl!),
                staleTime: 30 * 60 * 1000, // 30 minutes (images don't change often)
                retry: 1,
                enabled: !!iconUrl && details.isSuccess,
            };
        }),
    });

    // Fetch logo images (converted to base64) - optional, if you want logos too
    const logoQueries = useQueries({
        queries: tickers.map((ticker, index) => {
            const details = detailsQueries[index];
            const logoUrl = details.data?.branding?.logo_url;

            return {
                queryKey: ['ticker-logo', ticker, logoUrl],
                queryFn: () => fetchImageAsBase64(logoUrl!),
                staleTime: 30 * 60 * 1000, // 30 minutes
                retry: 1,
                enabled: !!logoUrl && details.isSuccess,
            };
        }),
    });

    return tickers.map((ticker, index) => ({
        ticker,
        details: detailsQueries[index],
        price: priceQueries[index],
        icon: iconQueries[index],
        logo: logoQueries[index],
    }));
};

export const useTickerDetails = (ticker: string) => {
    const results = useTickerDetailsMultiple([ticker]);
    return results[0];
};