import { useEffect, useRef, memo } from 'react';
import {
    createChart,
    ColorType,
    type IChartApi,
    type UTCTimestamp,
    AreaSeries,
} from 'lightweight-charts';
import type { ChartDataResult } from '@/api/hooks/SwingTrade/useSwingTrade';

interface MiniChartProps {
    data: ChartDataResult[];
    isPositive?: boolean;
    height?: number;
    width?: string;
}

const COLORS = {
    green: '#14E893',
    red: '#FF0044',
    background: 'transparent',
};

const MiniChart = memo(({ data, isPositive = true, height = 60, width = '100%' }: MiniChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current || !data || data.length === 0) return;

        // Cleanup previous chart
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }

        try {
            const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: height,
                layout: {
                    background: { type: ColorType.Solid, color: COLORS.background },
                    textColor: 'transparent',
                },
                grid: {
                    vertLines: { visible: false },
                    horzLines: { visible: false },
                },
                rightPriceScale: {
                    visible: false,
                },
                timeScale: {
                    visible: false,
                    borderVisible: false,
                },
                crosshair: {
                    mode: 0, // Disabled
                    vertLine: { visible: false },
                    horzLine: { visible: false },
                },
                handleScale: false,
                handleScroll: false,
            });

            chartRef.current = chart;

            const color = isPositive ? COLORS.green : COLORS.red;

            const areaSeries = chart.addSeries(AreaSeries, {
                topColor: `${color}40`,
                bottomColor: `${color}00`,
                lineColor: color,
                lineWidth: 2,
                priceLineVisible: false,
                lastValueVisible: false,
            });

            const chartData = data.map(d => ({
                time: (d.t / 1000) as UTCTimestamp,
                value: d.c,
            }));

            areaSeries.setData(chartData);
            chart.timeScale().fitContent();

        } catch (error) {
            console.warn('Error creating mini chart:', error);
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [data, isPositive, height]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!data || data.length === 0) {
        return (
            <div
                className="flex items-center justify-center bg-white/5 rounded"
                style={{ height, width }}
            >
                <span className="text-xs text-gray-500">No chart data</span>
            </div>
        );
    }

    return (
        <div
            ref={chartContainerRef}
            style={{ width, height }}
            className="rounded overflow-hidden"
        />
    );
});

MiniChart.displayName = 'MiniChart';

export default MiniChart;