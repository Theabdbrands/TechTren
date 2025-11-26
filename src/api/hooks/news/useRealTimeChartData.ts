import { useCallback, useEffect, useRef } from 'react';
import { usePolygonProxy } from './usePolygonProxy';
import { toast } from 'sonner';

interface UseRealTimeChartDataProps {
    symbol: string;
    assetClass: 'stocks' | 'crypto';
    timeframe: {
        value: string;
        unit: string;
        label: string;
        range: number;
    };
    enableRealTime?: boolean;
}

export const useRealTimeChartData = ({
    symbol,
    assetClass,
    timeframe,
    enableRealTime = true
}: UseRealTimeChartDataProps) => {
    const previousDataRef = useRef<any>(null);
    const updateCountRef = useRef(0);

    const buildQueryUrl = useCallback(() => {
        const now = new Date();
        const startDate = new Date();

        // Calculate date range based on timeframe
        if (timeframe.unit === 'minute' || timeframe.unit === 'hour') {
            startDate.setDate(startDate.getDate() - 7); // Last 7 days for intraday
        } else if (timeframe.unit === 'day') {
            startDate.setFullYear(startDate.getFullYear() - 2); // Last 2 years for daily
        } else if (timeframe.unit === 'week') {
            startDate.setFullYear(startDate.getFullYear() - 3); // Last 3 years for weekly
        } else {
            startDate.setFullYear(startDate.getFullYear() - 5); // Last 5 years for monthly
        }

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        if (assetClass === 'stocks') {
            return `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${timeframe.value}/${timeframe.unit}/${formatDate(startDate)}/${formatDate(now)}?adjusted=true&sort=asc&limit=5000`;
        } else {
            return `https://api.polygon.io/v2/aggs/ticker/X:${symbol}USD/range/${timeframe.value}/${timeframe.unit}/${formatDate(startDate)}/${formatDate(now)}?adjusted=true&sort=asc&limit=5000`;
        }
    }, [symbol, assetClass, timeframe]);

    const queryParams = {
        queryUrl: buildQueryUrl(),
        assetClass,
        timeframeUnit: timeframe.unit
    };

    // const query = usePolygonProxy({
    //     params: queryParams,
    //     config: {
    //         enableRealTime,
    //         refetchOnWindowFocus: true,
    //         staleTime: timeframe.unit === 'minute' ? 10000 : 30000,
    //     }
    // });
    const query = usePolygonProxy({
        params: queryParams,
        enableRealTime,
        timeframeUnit: timeframe.unit,
        config: {
            refetchOnWindowFocus: true,
            staleTime: timeframe.unit === 'minute' ? 10000 : 30000,
        }
    });


    // Show toast on data updates (only for real-time mode)
    useEffect(() => {
        if (enableRealTime && query.data && query.isSuccess) {
            updateCountRef.current++;

            // Only show toast for significant updates (not on initial load)
            if (updateCountRef.current > 1) {
                const newData = query.data.data?.payload?.results;
                const oldData = previousDataRef.current;

                if (newData && oldData && newData.length > 0 && oldData.length > 0) {
                    const latestNew = newData[newData.length - 1];
                    const latestOld = oldData[oldData.length - 1];

                    // Check if price actually changed
                    if (latestNew.c !== latestOld.c) {
                        const change = latestNew.c - latestOld.c;
                        const changePercent = ((change / latestOld.c) * 100).toFixed(2);

                        toast.info(`${symbol}: $${latestNew.c.toFixed(2)} (${change >= 0 ? '+' : ''}${changePercent}%)`, {
                            duration: 3000,
                        });
                    }
                }

                previousDataRef.current = newData;
            } else if (updateCountRef.current === 1) {
                previousDataRef.current = query.data.data?.payload?.results;
            }
        }
    }, [query.data, query.isSuccess, enableRealTime, symbol]);

    return {
        ...query,
        isRealTime: enableRealTime && !query.isError,
        lastUpdate: new Date().toISOString()
    };
};