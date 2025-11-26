import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/helpers/request';
import type { QueryConfig } from '@/api/helpers/client';
import { useAuthStore } from '@/api/stores/auth-store';

// Summary Types
export interface SwingSummaryMetric {
    value: number;
    testValue: number;
    overallValue: number;
    source: string;
    strategyId: string;
}

export interface SwingSummaryNotes {
    tradeFrequencyPerDay: number;
    sharpe: number;
    sortino: number;
}

export interface SwingSummarySignalsToday {
    openCount: number;
    closedCount: number;
    createdSince: string;
}

export interface SwingSummaryData {
    winRate: SwingSummaryMetric;
    annualizedReturn: SwingSummaryMetric;
    averageReturn: SwingSummaryMetric;
    maxDrawdown: SwingSummaryMetric;
    notes: SwingSummaryNotes;
    signalsToday: SwingSummarySignalsToday;
}

export interface SwingSummaryResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: SwingSummaryData;
}

// Signals Types
export interface SignalPrices {
    entry: number;
    stopLoss: number;
    mostRecentExit: number | null;
    target1: number;
    target2: number;
}

export interface SignalReturns {
    realized: number;
    realizedIS: number;
    unrealized: number;
    unrealizedIS: number;
    total: number;
    totalIS: number;
}

export interface SwingSignal {
    id: string;
    strategyId: string;
    ticker: string;
    assetClass: string;
    entryBarStart: string;
    status: string;
    tpType: string;
    prices: SignalPrices;
    returns: SignalReturns;
    mostRecentExitAt: string | null;
    takeProfit1At: string | null;
    takeProfit2At: string | null;
    highestHighSinceEntry: number;
    lowestLowSinceEntry: number;
}

export interface SwingSignalsData {
    items: SwingSignal[];
    nextCursor: string | null;
}

export interface SwingSignalsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: SwingSignalsData;
}

// Query params for signals
export interface SwingSignalsParams {
    status?: 'open' | 'closed' | 'all';
    dropdownSort?: 'Latest' | 'HighestPotential';
    search?: string;
    limit?: number;
    assetClass?: 'stocks' | 'crypto';
    timeframe?: 'today' | 'history';
}

// Chart data types (for mini charts)
export interface ChartDataResult {
    v: number;  // volume
    vw: number; // volume weighted average price
    o: number;  // open
    c: number;  // close
    h: number;  // high
    l: number;  // low
    t: number;  // timestamp
    n: number;  // number of transactions
}

export interface ChartDataPayload {
    ticker: string;
    queryCount: number;
    resultsCount: number;
    adjusted: boolean;
    results: ChartDataResult[];
}

export interface ChartDataResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        payload: ChartDataPayload;
    };
}

// ==================== QUERY KEYS ====================

export const swingKeys = {
    all: ['swing'] as const,
    summary: () => [...swingKeys.all, 'summary'] as const,
    signals: () => [...swingKeys.all, 'signals'] as const,
    signalsList: (params?: SwingSignalsParams) => [...swingKeys.signals(), { params }] as const,
    chart: (ticker: string) => [...swingKeys.all, 'chart', ticker] as const,
};

// ==================== API FUNCTIONS ====================

const fetchSwingSummary = async (): Promise<SwingSummaryResponse> => {
    return api.get<SwingSummaryResponse>('/swing/summary');
};

const fetchSwingSignals = async (params?: SwingSignalsParams): Promise<SwingSignalsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.status) searchParams.append('status', params.status);
    if (params?.dropdownSort) searchParams.append('dropdownSort', params.dropdownSort);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.assetClass) searchParams.append('assetClass', params.assetClass);
    if (params?.timeframe) searchParams.append('timeframe', params.timeframe);

    const queryString = searchParams.toString();
    const url = queryString ? `/swing/signals?${queryString}` : '/swing/signals';

    return api.get<SwingSignalsResponse>(url);
};

const fetchSignalChartData = async (ticker: string, assetClass: 'stocks' | 'crypto' = 'stocks'): Promise<ChartDataResponse> => {
    // Get data for last 7 days with 1-hour intervals for mini chart
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    let polygonUrl: string;
    if (assetClass === 'stocks') {
        polygonUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/hour/${formatDate(startDate)}/${formatDate(now)}?adjusted=true&sort=asc&limit=500`;
    } else {
        polygonUrl = `https://api.polygon.io/v2/aggs/ticker/X:${ticker}USD/range/1/hour/${formatDate(startDate)}/${formatDate(now)}?adjusted=true&sort=asc&limit=500`;
    }

    const queryUrl = encodeURIComponent(polygonUrl);
    return api.get<ChartDataResponse>(`/apiProxy/pl?queryUrl=${queryUrl}&asset_class=${assetClass}`);
};

// ==================== HOOKS ====================

/**
 * Hook to fetch swing trade summary metrics
 * Used in Stats Section of SwingTrade page
 */
export const useSwingSummary = (config?: QueryConfig<typeof fetchSwingSummary>) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: swingKeys.summary(),
        queryFn: fetchSwingSummary,
        enabled: isAuthenticated,
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchOnWindowFocus: true,
        ...config,
    });
};

/**
 * Hook to fetch swing trade signals
 * Used in Trading Cards Grid of SwingTrade page
 */
export const useSwingSignals = (
    params?: SwingSignalsParams,
    config?: QueryConfig<typeof fetchSwingSignals>
) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: swingKeys.signalsList(params),
        queryFn: () => fetchSwingSignals(params),
        enabled: isAuthenticated,
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchOnWindowFocus: true,
        ...config,
    });
};

/**
 * Hook to fetch chart data for a specific signal/ticker
 * Used for mini charts in signal cards
 */
export const useSignalChartData = (
    ticker: string,
    assetClass: 'stocks' | 'crypto' = 'stocks',
    config?: QueryConfig<typeof fetchSignalChartData>
) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: swingKeys.chart(ticker),
        queryFn: () => fetchSignalChartData(ticker, assetClass),
        enabled: isAuthenticated && !!ticker,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        ...config,
    });
};

/**
 * Hook to fetch chart data for multiple tickers at once
 * Useful for batch loading charts for visible signal cards
 */
export const useSignalChartDataMultiple = (
    tickers: string[],
    assetClass: 'stocks' | 'crypto' = 'stocks'
) => {
    const { isAuthenticated } = useAuthStore();

    const queries = tickers.map(ticker => ({
        queryKey: swingKeys.chart(ticker),
        queryFn: () => fetchSignalChartData(ticker, assetClass),
        enabled: isAuthenticated && !!ticker,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    }));

    // Return array of query results
    return queries.map(query => useQuery(query));
};