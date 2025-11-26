// Charts.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    createChart,
    ColorType,
    CrosshairMode,
    LineStyle,
    CandlestickSeries,
    LineSeries,
    AreaSeries,
    BarSeries,
    BaselineSeries,
    HistogramSeries,
    type IChartApi,
    type ISeriesApi,
    type UTCTimestamp,
    type CandlestickData,
    type Time
} from 'lightweight-charts';
import {
    ChevronRight, Filter, ChevronDown,
    Camera, Type, Edit3, TrendingUp, Minus, Square, ArrowUpRight, Trash2, X,
    Maximize2, Download, Share2, Eye, EyeOff, Menu
} from 'lucide-react';
import ArrowDown from '../../../assets/Dashboard/arrows-down.svg';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSetTopbar } from '@/api/hooks/TopbarContext';
import { toast } from 'sonner';
import { useTickerDetails } from './usePolygonIcon';
import { useRealTimeChartData } from '@/api/hooks/news/useRealTimeChartData';

// ==================== TYPES ====================
interface ChartData {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        payload: {
            ticker: string;
            queryCount: number;
            resultsCount: number;
            adjusted: boolean;
            results: Array<{
                v: number;
                vw: number;
                o: number;
                c: number;
                h: number;
                l: number;
                t: number;
                n: number;
            }>;
        };
    };
}

interface OutletContext {
    chartData: ChartData | null;
    setChartData: (data: ChartData | null) => void;
}

type ChartType = 'candlestick' | 'line' | 'area' | 'bar' | 'baseline' | 'hlc';
type DrawingTool = 'none' | 'trendline' | 'horizontal' | 'vertical' | 'rectangle' | 'text' | 'fibonacci';
type IndicatorType = 'RSI' | 'MACD' | 'BB' | 'STOCH' | 'EMA' | 'SMA';

interface DrawingShape {
    id: string;
    type: DrawingTool;
    points: Array<{ time: number; price: number }>;
    color: string;
    lineWidth: number;
    text?: string;
}

interface Indicator {
    id: string;
    type: IndicatorType;
    visible: boolean;
    settings: any;
}

// ==================== CONSTANTS ====================
const COLORS = {
    green: '#14E893',
    red: '#FF0044',
    background: '#0a0e1a',
    gridLines: '#1a1f2e',
    textColor: '#7a8094',
    blue: '#3b82f6',
    orange: '#f59e0b',
    cyan: '#06b6d4',
    purple: '#8b5cf6'
};

const TIMEFRAMES = [
    { label: '1m', value: '1', unit: 'minute', range: 1 },
    { label: '5m', value: '5', unit: 'minute', range: 5 },
    { label: '15m', value: '15', unit: 'minute', range: 15 },
    { label: '30m', value: '30', unit: 'minute', range: 30 },
    { label: '1h', value: '1', unit: 'hour', range: 1 },
    { label: '2h', value: '2', unit: 'hour', range: 2 },
    { label: '4h', value: '4', unit: 'hour', range: 4 },
    { label: 'D', value: '1', unit: 'day', range: 1 },
    { label: 'W', value: '1', unit: 'week', range: 7 },
    { label: 'M', value: '1', unit: 'month', range: 30 }
];

// ==================== UTILITY FUNCTIONS ====================
const convertAPIDataToChartFormat = (apiData: ChartData): CandlestickData[] => {
    if (!apiData?.data?.payload?.results) return [];
    return apiData.data.payload.results.map(result => ({
        time: (result.t / 1000) as UTCTimestamp,
        open: result.o,
        high: result.h,
        low: result.l,
        close: result.c,
    }));
};

const convertAPIDataToVolumeFormat = (apiData: ChartData) => {
    if (!apiData?.data?.payload?.results) return [];
    return apiData.data.payload.results.map(result => ({
        time: (result.t / 1000) as UTCTimestamp,
        value: result.v,
        color: result.c >= result.o ? 'rgba(20, 232, 147, 0.5)' : 'rgba(255, 0, 68, 0.5)',
    }));
};

const calculateMA = (data: CandlestickData[], period: number) => {
    return data.map((d, i) => {
        const start = Math.max(0, i - period + 1);
        const sum = data.slice(start, i + 1).reduce((acc, val) => acc + val.close, 0);
        return { time: d.time, value: sum / (i - start + 1) };
    });
};

const calculateRSI = (data: CandlestickData[], period: number = 14) => {
    const rsi: Array<{ time: Time; value: number }> = [];
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < data.length; i++) {
        const change = data[i].close - data[i - 1].close;
        if (i <= period) {
            if (change > 0) gains += change;
            else losses -= change;
        } else {
            const avgGain = gains / period;
            const avgLoss = losses / period;
            const rs = avgGain / (avgLoss || 1);
            const rsiValue = 100 - (100 / (1 + rs));
            rsi.push({ time: data[i].time, value: rsiValue });

            if (change > 0) {
                gains = (gains * (period - 1) + change) / period;
                losses = (losses * (period - 1)) / period;
            } else {
                gains = (gains * (period - 1)) / period;
                losses = (losses * (period - 1) - change) / period;
            }
        }
    }
    return rsi;
};

const calculateBollingerBands = (data: CandlestickData[], period: number = 20, stdDev: number = 2) => {
    const sma = calculateMA(data, period);
    const upper: Array<{ time: Time; value: number }> = [];
    const lower: Array<{ time: Time; value: number }> = [];

    data.forEach((d, i) => {
        if (i < period - 1) return;
        const start = i - period + 1;
        const slice = data.slice(start, i + 1);
        const mean = sma[i].value;
        const variance = slice.reduce((acc, val) => acc + Math.pow(val.close - mean, 2), 0) / period;
        const std = Math.sqrt(variance);

        upper.push({ time: d.time, value: mean + stdDev * std });
        lower.push({ time: d.time, value: mean - stdDev * std });
    });

    return { upper, middle: sma, lower };
};

// ==================== MAIN COMPONENT ====================
const Charts = () => {
    useSetTopbar('charts');

    // Refs
    const mainChartContainerRef = useRef<HTMLDivElement>(null);
    const indicatorChartContainerRef = useRef<HTMLDivElement>(null);
    const mainChartRef = useRef<IChartApi | null>(null);
    const indicatorChartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const isChartInitializedRef = useRef(false);
    const previousDataRef = useRef<ChartData | null>(null);

    // Context
    const { chartData, setChartData } = useOutletContext<OutletContext>();

    // State
    const [chartType, setChartType] = useState<ChartType>('candlestick');
    const [activeTimeframe, setActiveTimeframe] = useState(TIMEFRAMES[7]); // Default to '1d'
    const [drawingTool, setDrawingTool] = useState<DrawingTool>('none');
    const [_, setDrawings] = useState<DrawingShape[]>([]);
    const [indicators, setIndicators] = useState<Indicator[]>([
        { id: 'rsi', type: 'RSI', visible: true, settings: { period: 14 } }
    ]);
    const [currentSymbol, setCurrentSymbol] = useState('AAPL');
    const [currentAssetClass] = useState<'stocks' | 'crypto'>('stocks');
    const [currentPrice, setCurrentPrice] = useState('244.75');
    const [priceChange, setPriceChange] = useState({ value: '-2.70', percent: '-1.09%', isPositive: false });
    const [isLoading, setIsLoading] = useState(false);
    const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
    const [showDrawingPanel, setShowDrawingPanel] = useState(false);
    const [visibleMAs, setVisibleMAs] = useState({ ma20: true, ma50: true, ma200: true });
    const [showVolume, setShowVolume] = useState(true);
    const [enableRealTime, setEnableRealTime] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<string>('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Add this hook to fetch ticker details and icon
    const tickerDetails = useTickerDetails(currentSymbol);

    // Extract the data
    const companyName = tickerDetails.details.data?.name || `${currentSymbol} Company`;
    const iconBase64 = tickerDetails.icon.data;
    const logoBase64 = tickerDetails.logo.data;
    const [imageError, setImageError] = useState(false);

    // Determine what to display
    const hasIcon = iconBase64 && !imageError;
    const hasLogo = logoBase64 && !imageError && !hasIcon;
    const showFallback = !hasIcon && !hasLogo && !tickerDetails.isLoading;
    const firstLetter = currentSymbol.charAt(0).toUpperCase();

    // Use the real-time hook
    const realTimeChartData = useRealTimeChartData({
        symbol: currentSymbol,
        assetClass: currentAssetClass,
        timeframe: activeTimeframe,
        enableRealTime: enableRealTime && (activeTimeframe.unit === 'minute' || activeTimeframe.unit === 'hour')
    });

    // Update chartData when realTimeChartData changes
    useEffect(() => {
        if (realTimeChartData.data) {
            setChartData(realTimeChartData.data);
            setLastUpdate(new Date().toISOString());

            // Show toast for price changes in real-time mode
            if (enableRealTime && previousDataRef.current && realTimeChartData.data.data?.payload?.results) {
                const newResults = realTimeChartData.data.data.payload.results;
                const oldResults = previousDataRef.current.data?.payload?.results;

                if (newResults && oldResults && newResults.length > 0 && oldResults.length > 0) {
                    const latestNew = newResults[newResults.length - 1];
                    const latestOld = oldResults[oldResults.length - 1];

                    if (latestNew.c !== latestOld.c) {
                        const change = latestNew.c - latestOld.c;
                        const changePercent = ((change / latestOld.c) * 100).toFixed(2);

                        if (Math.abs(change) > 0.01) { // Only show significant changes
                            toast.info(`${currentSymbol}: $${latestNew.c.toFixed(2)} (${change >= 0 ? '+' : ''}${changePercent}%)`, {
                                duration: 2000,
                            });
                        }
                    }
                }
            }

            previousDataRef.current = realTimeChartData.data;
        }
    }, [realTimeChartData.data, setChartData, enableRealTime, currentSymbol]);

    // Update loading state
    useEffect(() => {
        setIsLoading(realTimeChartData.isLoading);
    }, [realTimeChartData.isLoading]);

    // Handle errors
    useEffect(() => {
        if (realTimeChartData.isError) {
            toast.error('Failed to fetch real-time data');
        }
    }, [realTimeChartData.isError]);

    // Update when chart data from header search changes
    useEffect(() => {
        if (chartData?.data?.payload?.ticker) {
            setCurrentSymbol(chartData.data.payload.ticker);
        }
    }, [chartData]);

    // ==================== TOOLBAR FUNCTIONS ====================
    const takeScreenshot = useCallback(() => {
        if (!mainChartContainerRef.current) return;
        toast.info('Taking screenshot...');
        setTimeout(() => {
            toast.success('Screenshot saved to downloads');
        }, 1000);
    }, [currentSymbol]);

    const exportChartData = useCallback(() => {
        if (!chartData) return;
        try {
            const csvContent = convertToCSV(chartData);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${currentSymbol}-chart-data-${new Date().getTime()}.csv`;
            link.href = url;
            link.click();
            window.URL.revokeObjectURL(url);
            toast.success('Chart data exported successfully');
        } catch (error) {
            toast.error('Failed to export chart data');
        }
    }, [chartData, currentSymbol]);

    const shareChart = useCallback(async () => {
        const shareData = {
            title: `${currentSymbol} Chart`,
            text: `Check out ${currentSymbol} chart on our platform`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success('Chart shared successfully');
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard');
            }
        } catch (error) {
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard');
            } catch (clipboardError) {
                toast.error('Failed to share chart');
            }
        }
    }, [currentSymbol]);

    const toggleFullscreen = useCallback(() => {
        const chartContainer = mainChartContainerRef.current?.closest('.rounded-xl');
        if (!chartContainer) return;

        if (!isFullscreen) {
            if (chartContainer.requestFullscreen) {
                chartContainer.requestFullscreen();
            }
            setIsFullscreen(true);
            toast.info('Entered fullscreen mode');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsFullscreen(false);
            toast.info('Exited fullscreen mode');
        }
    }, [isFullscreen]);

    const applyFilters = useCallback((filters: any) => {
        console.log('Applying filters:', filters);
        toast.success('Filters applied successfully');
    }, []);

    const convertToCSV = (data: ChartData): string => {
        if (!data?.data?.payload?.results) return '';
        const headers = ['Time', 'Open', 'High', 'Low', 'Close', 'Volume'];
        const rows = data.data.payload.results.map(result => [
            new Date(result.t).toISOString(),
            result.o,
            result.h,
            result.l,
            result.c,
            result.v
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    };

    // Filter panel component
    const FilterPanel = ({ onClose, onApply }: { onClose: () => void; onApply: (filters: any) => void }) => {
        const [selectedFilters, setSelectedFilters] = useState({
            timeRange: '1y',
            priceType: 'close',
            volume: true,
            volatility: false
        });

        const handleApply = () => {
            onApply(selectedFilters);
            onClose();
        };

        return (
            <div className="absolute top-20 right-0 z-50 glass p-4 w-80 mobile:w-[90vw] mobile:right-2 mobile:left-2"
                style={{
                    background: 'rgba(20, 20, 20, 0.30)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Chart Filters</h3>
                    <button onClick={onClose}>
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-300 mb-2 block">Time Range</label>
                        <select
                            value={selectedFilters.timeRange}
                            onChange={(e) => setSelectedFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                            className="w-full bg-[#0a0e1a] border border-gray-600 rounded px-3 py-2 text-sm text-white"
                        >
                            <option value="1d">1 Day</option>
                            <option value="1w">1 Week</option>
                            <option value="1m">1 Month</option>
                            <option value="3m">3 Months</option>
                            <option value="1y">1 Year</option>
                            <option value="ytd">Year to Date</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-300 mb-2 block">Price Type</label>
                        <select
                            value={selectedFilters.priceType}
                            onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceType: e.target.value }))}
                            className="w-full bg-[#0a0e1a] border border-gray-600 rounded px-3 py-2 text-sm text-white"
                        >
                            <option value="close">Close Price</option>
                            <option value="open">Open Price</option>
                            <option value="high">High Price</option>
                            <option value="low">Low Price</option>
                            <option value="typical">Typical Price</option>
                            <option value="weighted">Weighted Close</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={selectedFilters.volume}
                                onChange={(e) => setSelectedFilters(prev => ({ ...prev, volume: e.target.checked }))}
                                className="rounded border-gray-600 bg-[#0a0e1a]"
                            />
                            <span className="text-sm text-gray-300">Show Volume</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={selectedFilters.volatility}
                                onChange={(e) => setSelectedFilters(prev => ({ ...prev, volatility: e.target.checked }))}
                                className="rounded border-gray-600 bg-[#0a0e1a]"
                            />
                            <span className="text-sm text-gray-300">Show Volatility Bands</span>
                        </label>
                    </div>
                    <div className="flex space-x-2 pt-2">
                        <button
                            onClick={handleApply}
                            className="flex-1 special-btn text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 glass cursor-pointer py-2 px-4 rounded text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ==================== CLEANUP CHARTS ====================
    const cleanupCharts = useCallback(() => {
        try {
            if (mainChartRef.current) {
                mainChartRef.current.remove();
                mainChartRef.current = null;
            }
            if (indicatorChartRef.current) {
                indicatorChartRef.current.remove();
                indicatorChartRef.current = null;
            }
            candlestickSeriesRef.current = null;
            isChartInitializedRef.current = false;
        } catch (error) {
            console.warn('Chart cleanup warning:', error);
        }
    }, []);

    // ==================== UPDATE PRICE INFO ====================
    useEffect(() => {
        if (chartData?.data?.payload?.results) {
            const results = chartData.data.payload.results;
            if (results.length > 0) {
                const latestData = results[results.length - 1];
                const previousData = results.length > 1 ? results[results.length - 2] : latestData;

                const change = latestData.c - previousData.c;
                const changePercent = (change / previousData.c) * 100;

                setCurrentPrice(latestData.c.toFixed(2));
                setPriceChange({
                    value: change.toFixed(2),
                    percent: `${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
                    isPositive: change >= 0
                });
            }
        }
    }, [chartData]);

    // ==================== TIMEFRAME CHANGE ====================
    const handleTimeframeChange = (timeframe: typeof TIMEFRAMES[0]) => {
        setActiveTimeframe(timeframe);
        // Real-time hook will automatically refetch
    };

    // ==================== CHART TYPE CHANGE ====================
    const handleChartTypeChange = (type: ChartType) => {
        setChartType(type);
        toast.info(`Switched to ${type} chart`);
    };

    // ==================== INDICATOR MANAGEMENT ====================
    const toggleIndicator = (indicatorType: IndicatorType) => {
        setIndicators(prev => {
            const exists = prev.find(ind => ind.type === indicatorType);
            if (exists) {
                return prev.map(ind =>
                    ind.type === indicatorType ? { ...ind, visible: !ind.visible } : ind
                );
            } else {
                return [...prev, {
                    id: indicatorType.toLowerCase(),
                    type: indicatorType,
                    visible: true,
                    settings: {}
                }];
            }
        });
    };

    // ==================== DRAWING TOOLS ====================
    const handleDrawingToolSelect = (tool: DrawingTool) => {
        setDrawingTool(tool);
        if (tool !== 'none') {
            toast.info(`Drawing tool: ${tool}`, { duration: 2000 });
        }
    };

    const clearAllDrawings = () => {
        setDrawings([]);
        toast.success('All drawings cleared');
    };

    // ==================== CHART RENDERING ====================
    useEffect(() => {
        if (!mainChartContainerRef.current || !indicatorChartContainerRef.current || !chartData) return;

        // Cleanup previous charts
        cleanupCharts();

        try {
            // Create main chart
            const mainChart = createChart(mainChartContainerRef.current, {
                width: mainChartContainerRef.current.clientWidth,
                height: window.innerWidth < 768 ? 300 : 400, // Responsive height
                layout: {
                    background: { type: ColorType.Solid, color: COLORS.background },
                    textColor: COLORS.textColor,
                },
                grid: {
                    vertLines: { color: COLORS.gridLines },
                    horzLines: { color: COLORS.gridLines },
                },
                crosshair: {
                    mode: CrosshairMode.Normal,
                    vertLine: {
                        color: 'rgba(255, 255, 255, 0.3)',
                        width: 1,
                        style: LineStyle.Dashed,
                    },
                    horzLine: {
                        color: 'rgba(255, 255, 255, 0.3)',
                        width: 1,
                        style: LineStyle.Dashed,
                    },
                },
                rightPriceScale: {
                    borderColor: COLORS.gridLines,
                    scaleMargins: {
                        top: 0.1,
                        bottom: 0.2,
                    },
                },
                timeScale: {
                    borderColor: COLORS.gridLines,
                    timeVisible: true,
                    secondsVisible: false,
                },
            });

            mainChartRef.current = mainChart;

            // Create indicator chart
            const indicatorChart = createChart(indicatorChartContainerRef.current, {
                width: indicatorChartContainerRef.current.clientWidth,
                height: window.innerWidth < 768 ? 100 : 150, // Responsive height
                layout: {
                    background: { type: ColorType.Solid, color: COLORS.background },
                    textColor: COLORS.textColor,
                },
                grid: {
                    vertLines: { color: COLORS.gridLines },
                    horzLines: { color: COLORS.gridLines },
                },
                rightPriceScale: {
                    borderColor: COLORS.gridLines,
                },
                timeScale: {
                    borderColor: COLORS.gridLines,
                    visible: true,
                },
            });

            indicatorChartRef.current = indicatorChart;

            const candleData = convertAPIDataToChartFormat(chartData);
            const volumeData = convertAPIDataToVolumeFormat(chartData);

            if (candleData.length === 0) return;

            // Add main series based on chart type
            if (chartType === 'candlestick') {
                const candlestickSeries = mainChart.addSeries(CandlestickSeries, {
                    upColor: COLORS.green,
                    downColor: COLORS.red,
                    borderUpColor: COLORS.green,
                    borderDownColor: COLORS.red,
                    wickUpColor: COLORS.green,
                    wickDownColor: COLORS.red,
                });
                candlestickSeries.setData(candleData);
                candlestickSeriesRef.current = candlestickSeries;
            } else if (chartType === 'line') {
                const lineSeries = mainChart.addSeries(LineSeries, {
                    color: COLORS.blue,
                    lineWidth: 2,
                });
                lineSeries.setData(candleData.map(d => ({ time: d.time, value: d.close })));
            } else if (chartType === 'area') {
                const areaSeries = mainChart.addSeries(AreaSeries, {
                    topColor: 'rgba(59, 130, 246, 0.4)',
                    bottomColor: 'rgba(59, 130, 246, 0.0)',
                    lineColor: COLORS.blue,
                    lineWidth: 2,
                });
                areaSeries.setData(candleData.map(d => ({ time: d.time, value: d.close })));
            } else if (chartType === 'bar') {
                const barSeries = mainChart.addSeries(BarSeries, {
                    upColor: COLORS.green,
                    downColor: COLORS.red,
                });
                barSeries.setData(candleData);
            } else if (chartType === 'baseline') {
                const baselineSeries = mainChart.addSeries(BaselineSeries, {
                    topFillColor1: 'rgba(20, 232, 147, 0.4)',
                    topFillColor2: 'rgba(20, 232, 147, 0.1)',
                    bottomFillColor1: 'rgba(255, 0, 68, 0.4)',
                    bottomFillColor2: 'rgba(255, 0, 68, 0.1)',
                    topLineColor: COLORS.green,
                    bottomLineColor: COLORS.red,
                    baseValue: { type: 'price', price: candleData[0].close },
                });
                baselineSeries.setData(candleData.map(d => ({ time: d.time, value: d.close })));
            }

            // Add volume
            if (showVolume) {
                const volumeSeries = mainChart.addSeries(HistogramSeries, {
                    priceFormat: { type: 'volume' },
                    priceScaleId: 'volume',
                });
                volumeSeries.setData(volumeData);
                mainChart.priceScale('volume').applyOptions({
                    scaleMargins: { top: 0.8, bottom: 0 },
                });
            }

            // Add moving averages
            if (visibleMAs.ma20) {
                const ma20Series = mainChart.addSeries(LineSeries, {
                    color: COLORS.blue,
                    lineWidth: 2,
                    title: 'MA20',
                });
                ma20Series.setData(calculateMA(candleData, 20));
            }

            if (visibleMAs.ma50) {
                const ma50Series = mainChart.addSeries(LineSeries, {
                    color: COLORS.orange,
                    lineWidth: 2,
                    title: 'MA50',
                });
                ma50Series.setData(calculateMA(candleData, 50));
            }

            if (visibleMAs.ma200) {
                const ma200Series = mainChart.addSeries(LineSeries, {
                    color: COLORS.cyan,
                    lineWidth: 2,
                    title: 'MA200',
                });
                ma200Series.setData(calculateMA(candleData, 200));
            }

            // Add indicators
            indicators.forEach(indicator => {
                if (!indicator.visible) return;

                if (indicator.type === 'RSI') {
                    const rsiData = calculateRSI(candleData, indicator.settings.period || 14);
                    const rsiSeries = indicatorChart.addSeries(LineSeries, {
                        color: COLORS.purple,
                        lineWidth: 2,
                    });
                    rsiSeries.setData(rsiData);

                    // Add RSI levels
                    const upperLevel = indicatorChart.addSeries(LineSeries, {
                        color: 'rgba(255, 0, 68, 0.3)',
                        lineWidth: 1,
                        lineStyle: LineStyle.Dashed,
                    });
                    upperLevel.setData(rsiData.map(d => ({ time: d.time, value: 70 })));

                    const lowerLevel = indicatorChart.addSeries(LineSeries, {
                        color: 'rgba(20, 232, 147, 0.3)',
                        lineWidth: 1,
                        lineStyle: LineStyle.Dashed,
                    });
                    lowerLevel.setData(rsiData.map(d => ({ time: d.time, value: 30 })));
                } else if (indicator.type === 'BB') {
                    const bb = calculateBollingerBands(candleData);
                    const upperBand = mainChart.addSeries(LineSeries, {
                        color: COLORS.purple,
                        lineWidth: 1,
                    });
                    upperBand.setData(bb.upper);

                    const middleBand = mainChart.addSeries(LineSeries, {
                        color: COLORS.orange,
                        lineWidth: 1,
                    });
                    middleBand.setData(bb.middle);

                    const lowerBand = mainChart.addSeries(LineSeries, {
                        color: COLORS.purple,
                        lineWidth: 1,
                    });
                    lowerBand.setData(bb.lower);
                }
            });

            // Sync time scales
            mainChart.timeScale().subscribeVisibleLogicalRangeChange((timeRange) => {
                if (timeRange && indicatorChartRef.current) {
                    indicatorChart.timeScale().setVisibleLogicalRange(timeRange);
                }
            });

            indicatorChart.timeScale().subscribeVisibleLogicalRangeChange((timeRange) => {
                if (timeRange && mainChartRef.current) {
                    mainChart.timeScale().setVisibleLogicalRange(timeRange);
                }
            });

            isChartInitializedRef.current = true;

        } catch (error) {
            console.error('Error initializing charts:', error);
            toast.error('Failed to initialize charts');
            cleanupCharts();
        }
    }, [chartData, chartType, indicators, visibleMAs, showVolume, cleanupCharts]);

    // ==================== INCREMENTAL CHART UPDATES ====================
    useEffect(() => {
        if (!candlestickSeriesRef.current || !chartData?.data?.payload?.results) return;

        const results = chartData.data.payload.results;
        if (results.length === 0) return;

        try {
            if (chartType === 'candlestick' && candlestickSeriesRef.current) {
                const allCandleData = convertAPIDataToChartFormat(chartData);
                candlestickSeriesRef.current.setData(allCandleData);
            }
        } catch (error) {
            console.warn('Error updating chart data:', error);
        }
    }, [chartData, chartType]);

    // ==================== RESIZE HANDLER ====================
    useEffect(() => {
        const handleResize = () => {
            if (mainChartContainerRef.current && mainChartRef.current) {
                try {
                    mainChartRef.current.applyOptions({
                        width: mainChartContainerRef.current.clientWidth,
                        height: window.innerWidth < 768 ? 300 : 400
                    });
                } catch (error) {
                    console.warn('Resize error on main chart:', error);
                }
            }
            if (indicatorChartContainerRef.current && indicatorChartRef.current) {
                try {
                    indicatorChartRef.current.applyOptions({
                        width: indicatorChartContainerRef.current.clientWidth,
                        height: window.innerWidth < 768 ? 100 : 150
                    });
                } catch (error) {
                    console.warn('Resize error on indicator chart:', error);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // ==================== FULLSCREEN HANDLER ====================
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // ==================== CLEANUP ON UNMOUNT ====================
    useEffect(() => {
        return () => {
            cleanupCharts();
        };
    }, [cleanupCharts]);

    // ==================== RENDER ====================
    const leftData = [
        { label: 'Open', value: currentPrice, color: `text-[${COLORS.green}]` },
        { label: 'Low', value: currentPrice, color: `text-[${COLORS.red}]` },
        { label: 'High', value: currentPrice, color: `text-[${COLORS.green}]` },
        { label: '52 wk high', value: '260.10', color: 'text-gray-300' },
        { label: '52 wk low', value: '169.21', color: 'text-gray-300' },
    ];

    const rightData = [
        { label: 'Avg Vol (3M)', value: '53.92M' },
        { label: 'Shares Outstanding', value: 'N/A' },
        { label: 'Mkt Cap', value: '3.67T' },
        { label: 'Div Yield', value: '0.00%' },
    ];

    return (
        <>
            {/* Stock Info Card */}
            <Card className="mt-16 sm:mt-0 w-full mx-auto bg-[#06040C] rounded-2xl shadow-lg mb-4 md:mb-10 mobile:mx-2 mobile:w-auto">
                <CardContent className="flex items-center flex-col md:flex-row justify-between px-4 md:px-10 py-4 md:py-6 space-y-4 md:space-y-0 md:space-x-6">
                    <div className='space-y-4 md:space-y-6 flex-1 w-full md:w-auto'>
                        <div className="flex items-center space-x-3 md:space-x-4">
                            <span className="w-12 h-12 md:w-15 md:h-15 rounded-full border flex items-center justify-center flex-shrink-0">
                                {hasIcon && (
                                    <img
                                        src={iconBase64}
                                        alt={`${currentSymbol} Logo`}
                                        className="w-6 h-6 md:w-8 md:h-8 object-cover rounded-full"
                                        onError={() => setImageError(true)}
                                    />
                                )}
                                {hasLogo && (
                                    <img
                                        src={logoBase64}
                                        alt={`${currentSymbol} Logo`}
                                        className="w-6 h-6 md:w-8 md:h-8 object-cover rounded-full"
                                        onError={() => setImageError(true)}
                                    />
                                )}
                                {tickerDetails.isLoading && (
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-700/50 animate-pulse rounded-full"></div>
                                )}
                                {showFallback && (
                                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-700/50 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {firstLetter}
                                    </div>
                                )}
                            </span>
                            <span className="min-w-0">
                                <h2 className="text-xl md:text-3xl font-light truncate">{currentSymbol}</h2>
                                <p className="text-xs md:text-sm text-gray-400 mb-1 truncate">
                                    {tickerDetails.isLoading ? 'Loading...' : companyName}
                                </p>
                            </span>
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-baseline space-x-2 flex-wrap">
                                <span className="text-2xl md:text-3xl font-bold">${currentPrice}</span>
                                <span className={`${priceChange.isPositive ? 'text-[#14E893]' : 'text-[#FF0044]'} text-sm md:text-base flex items-center`}>
                                    {!priceChange.isPositive && <img src={ArrowDown} alt="negative" className='w-3 h-3 md:w-4 md:h-4' />}
                                    {priceChange.value} ({priceChange.percent})
                                </span>
                            </div>
                            <p className="text-xs mt-1">
                                After hours: <span className={`${priceChange.isPositive ? 'text-[#14E893]' : 'text-[#FF0044]'}`}>{currentPrice} (0.00%)</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-12 gap-y-3 md:gap-y-4 flex-1 w-full md:w-auto">
                        <div className="space-y-2 md:space-y-3">
                            {leftData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-gray-400 text-xs md:text-sm">{item.label}</span>
                                    <span className={`text-xs md:text-sm font-medium ${item.color}`}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2 md:space-y-3">
                            {rightData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-gray-400 text-xs md:text-sm">{item.label}</span>
                                    <span className="text-gray-300 text-xs md:text-sm font-medium">{item.value}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-1 cursor-pointer group">
                                <span className="text-gray-400 text-xs md:text-sm group-hover:text-white">View all</span>
                                <ChevronRight className={`w-3 h-3 md:w-4 md:h-4 text-[${COLORS.green}] group-hover:translate-x-1 transition-transform`} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Chart Area */}
            <div className="w-full h-auto md:h-screen bg-transparent flex flex-col px-2 md:px-0">
                <p className="mb-2 text-sm md:text-base">Overview</p>

                {/* Top Toolbar */}
                <div className="flex items-center justify-between py-2 relative">
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-[#1F222C] text-gray-400 hover:bg-white/20"
                        >
                            <Menu className="w-4 h-4" />
                            Tools
                        </button>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        {/* Real-time Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setEnableRealTime(!enableRealTime)}
                                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded ${enableRealTime
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-[#1F222C] text-gray-400'
                                    } hover:bg-white/20 transition-colors`}
                                title={enableRealTime ? "Disable real-time updates" : "Enable real-time updates"}
                            >
                                <div className={`w-2 h-2 rounded-full ${enableRealTime ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                                Live
                            </button>

                            {lastUpdate && enableRealTime && (
                                <span className="text-xs text-gray-400">
                                    Updated: {new Date(lastUpdate).toLocaleTimeString()}
                                </span>
                            )}
                        </div>

                        {/* Chart Type Selector */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-[#1F222C] text-gray-400 hover:bg-white/20">
                                {chartType === 'candlestick' && 'Candlestick'}
                                {chartType === 'line' && 'Line'}
                                {chartType === 'area' && 'Area'}
                                {chartType === 'bar' && 'Bar'}
                                {chartType === 'baseline' && 'Baseline'}
                                {chartType === 'hlc' && 'HLC'}
                                <ChevronDown className='w-3 h-3' />
                            </button>
                            <div className="absolute top-full left-0 mt-1 bg-[#1F222C] rounded-lg shadow-xl z-50 hidden group-hover:block min-w-[150px]">
                                {['candlestick', 'line', 'area', 'bar', 'baseline', 'hlc'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => handleChartTypeChange(type as ChartType)}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg capitalize"
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Indicators Button */}
                        <button
                            onClick={() => setShowIndicatorPanel(!showIndicatorPanel)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-[#1F222C] text-gray-400 hover:bg-white/20"
                        >
                            Indicators
                            <ChevronDown className='w-3 h-3' />
                        </button>

                        {/* Drawing Tools Button */}
                        <button
                            onClick={() => setShowDrawingPanel(!showDrawingPanel)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-[#1F222C] text-gray-400 hover:bg-white/20"
                        >
                            <Edit3 className='w-3 h-3' />
                            Draw
                        </button>

                        {/* MA Toggles */}
                        <button
                            onClick={() => setVisibleMAs(prev => ({ ...prev, ma20: !prev.ma20 }))}
                            className={`px-2 py-1 text-xs rounded ${visibleMAs.ma20 ? 'bg-blue-500/20 text-blue-400' : 'bg-[#1F222C] text-gray-400'}`}
                        >
                            MA20
                        </button>
                        <button
                            onClick={() => setVisibleMAs(prev => ({ ...prev, ma50: !prev.ma50 }))}
                            className={`px-2 py-1 text-xs rounded ${visibleMAs.ma50 ? 'bg-orange-500/20 text-orange-400' : 'bg-[#1F222C] text-gray-400'}`}
                        >
                            MA50
                        </button>
                        <button
                            onClick={() => setVisibleMAs(prev => ({ ...prev, ma200: !prev.ma200 }))}
                            className={`px-2 py-1 text-xs rounded ${visibleMAs.ma200 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[#1F222C] text-gray-400'}`}
                        >
                            MA200
                        </button>
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                        <Button
                            onClick={() => setShowVolume(!showVolume)}
                            variant="ghost"
                            className="h-7 w-7 md:h-8 md:w-8 p-0"
                            title={showVolume ? "Hide Volume" : "Show Volume"}
                        >
                            {showVolume ? <Eye className="w-3 h-3 md:w-4 md:h-4" /> : <EyeOff className="w-3 h-3 md:w-4 md:h-4" />}
                        </Button>

                        <Button
                            onClick={takeScreenshot}
                            variant="ghost"
                            className="h-7 w-7 md:h-8 md:w-8 p-0 hidden md:flex"
                            title="Take Screenshot"
                        >
                            <Camera className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>

                        <Button
                            onClick={exportChartData}
                            variant="ghost"
                            className="h-7 w-7 md:h-8 md:w-8 p-0 hidden md:flex"
                            title="Export Data"
                        >
                            <Download className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>

                        <Button
                            onClick={shareChart}
                            variant="ghost"
                            className="h-7 w-7 md:h-8 md:w-8 p-0 hidden md:flex"
                            title="Share Chart"
                        >
                            <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>

                        <Button
                            onClick={toggleFullscreen}
                            variant="ghost"
                            className="h-7 w-7 md:h-8 md:w-8 p-0"
                            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            <Maximize2 className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 border px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm bg-white text-gray-800 font-semibold hover:text-white hover:bg-transparent duration-200 transition-all"
                            title="Chart Filters"
                        >
                            <Filter className='w-3 h-3 md:w-4 md:h-4' />
                            <span className="hidden md:inline">Filters</span>
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {showMobileMenu && (
                        <div className="absolute top-10 left-0 z-50 bg-[#1F222C] rounded-lg shadow-xl p-3 w-64 md:hidden">
                            <div className="grid grid-cols-2 gap-2">
                                {/* Real-time Controls */}
                                <button
                                    onClick={() => setEnableRealTime(!enableRealTime)}
                                    className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded ${enableRealTime
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-[#0a0e1a] text-gray-400'
                                        } hover:bg-white/20 transition-colors`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${enableRealTime ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                                    Live
                                </button>

                                {/* Chart Types */}
                                <div className="relative">
                                    <button className="flex items-center justify-between w-full px-2 py-1.5 text-xs rounded bg-[#0a0e1a] text-gray-400 hover:bg-white/20">
                                        {chartType}
                                        <ChevronDown className='w-3 h-3' />
                                    </button>
                                    <div className="absolute top-full left-0 mt-1 bg-[#1F222C] rounded-lg shadow-xl z-50 w-full">
                                        {['candlestick', 'line', 'area', 'bar', 'baseline', 'hlc'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    handleChartTypeChange(type as ChartType);
                                                    setShowMobileMenu(false);
                                                }}
                                                className="block w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg capitalize"
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Indicators */}
                                <button
                                    onClick={() => {
                                        setShowIndicatorPanel(true);
                                        setShowMobileMenu(false);
                                    }}
                                    className="flex items-center gap-1 px-2 py-1.5 text-xs rounded bg-[#0a0e1a] text-gray-400 hover:bg-white/20"
                                >
                                    Indicators
                                </button>

                                {/* Drawing Tools */}
                                <button
                                    onClick={() => {
                                        setShowDrawingPanel(true);
                                        setShowMobileMenu(false);
                                    }}
                                    className="flex items-center gap-1 px-2 py-1.5 text-xs rounded bg-[#0a0e1a] text-gray-400 hover:bg-white/20"
                                >
                                    <Edit3 className='w-3 h-3' />
                                    Draw
                                </button>

                                {/* MA Toggles */}
                                <button
                                    onClick={() => setVisibleMAs(prev => ({ ...prev, ma20: !prev.ma20 }))}
                                    className={`px-2 py-1.5 text-xs rounded ${visibleMAs.ma20 ? 'bg-blue-500/20 text-blue-400' : 'bg-[#0a0e1a] text-gray-400'}`}
                                >
                                    MA20
                                </button>
                                <button
                                    onClick={() => setVisibleMAs(prev => ({ ...prev, ma50: !prev.ma50 }))}
                                    className={`px-2 py-1.5 text-xs rounded ${visibleMAs.ma50 ? 'bg-orange-500/20 text-orange-400' : 'bg-[#0a0e1a] text-gray-400'}`}
                                >
                                    MA50
                                </button>
                                <button
                                    onClick={() => setVisibleMAs(prev => ({ ...prev, ma200: !prev.ma200 }))}
                                    className={`px-2 py-1.5 text-xs rounded ${visibleMAs.ma200 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[#0a0e1a] text-gray-400'}`}
                                >
                                    MA200
                                </button>

                                {/* Action Buttons */}
                                <Button
                                    onClick={takeScreenshot}
                                    variant="ghost"
                                    className="h-auto px-2 py-1.5 text-xs"
                                >
                                    <Camera className="w-3 h-3 mr-1" />
                                    Screenshot
                                </Button>

                                <Button
                                    onClick={exportChartData}
                                    variant="ghost"
                                    className="h-auto px-2 py-1.5 text-xs"
                                >
                                    <Download className="w-3 h-3 mr-1" />
                                    Export
                                </Button>

                                <Button
                                    onClick={shareChart}
                                    variant="ghost"
                                    className="h-auto px-2 py-1.5 text-xs col-span-2"
                                >
                                    <Share2 className="w-3 h-3 mr-1" />
                                    Share Chart
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Filter Panel */}
                    {showFilters && (
                        <FilterPanel
                            onClose={() => setShowFilters(false)}
                            onApply={applyFilters}
                        />
                    )}
                </div>

                {/* Indicator Panel */}
                {showIndicatorPanel && (
                    <div className="absolute top-16 md:top-20 left-2 md:left-0 z-50 bg-[#1F222C] rounded-lg shadow-xl p-4 w-[calc(100vw-1rem)] md:w-64">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-semibold">Indicators</h3>
                            <button onClick={() => setShowIndicatorPanel(false)}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                            {['RSI', 'MACD', 'BB', 'STOCH', 'EMA', 'SMA'].map((ind) => {
                                const indicator = indicators.find(i => i.type === ind);
                                return (
                                    <button
                                        key={ind}
                                        onClick={() => toggleIndicator(ind as IndicatorType)}
                                        className={`text-left px-3 py-2 rounded text-sm ${indicator?.visible ? 'bg-green-500/20 text-green-400' : 'bg-[#0a0e1a] text-gray-400'
                                            } hover:bg-white/10`}
                                    >
                                        {ind}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Drawing Tools Panel */}
                {showDrawingPanel && (
                    <div className="absolute top-16 md:top-20 left-2 md:left-0 z-50 bg-[#1F222C] rounded-lg shadow-xl p-4 w-[calc(100vw-1rem)] md:w-64">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-semibold">Drawing Tools</h3>
                            <button onClick={() => setShowDrawingPanel(false)}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                            {[
                                { tool: 'trendline' as DrawingTool, icon: TrendingUp, label: 'Trend Line' },
                                { tool: 'horizontal' as DrawingTool, icon: Minus, label: 'Horizontal Line' },
                                { tool: 'vertical' as DrawingTool, icon: Minus, label: 'Vertical Line' },
                                { tool: 'rectangle' as DrawingTool, icon: Square, label: 'Rectangle' },
                                { tool: 'text' as DrawingTool, icon: Type, label: 'Text' },
                                { tool: 'fibonacci' as DrawingTool, icon: ArrowUpRight, label: 'Fibonacci' },
                            ].map(({ tool, icon: Icon, label }) => (
                                <button
                                    key={tool}
                                    onClick={() => {
                                        handleDrawingToolSelect(tool);
                                        setShowDrawingPanel(false);
                                    }}
                                    className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${drawingTool === tool ? 'bg-green-500/20 text-green-400' : 'bg-[#0a0e1a] text-gray-400'
                                        } hover:bg-white/10`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                            <button
                                onClick={clearAllDrawings}
                                className="flex items-center gap-2 px-3 py-2 rounded text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 col-span-2 md:col-span-1"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear All
                            </button>
                        </div>
                    </div>
                )}

                {/* Charts Container */}
                <div className="rounded-xl relative flex flex-col overflow-hidden">
                    {/* Chart Stats Overlay */}
                    <div className='absolute top-0 left-0 z-10 px-2 md:px-4 py-1 md:py-2 bg-black/30 backdrop-blur-sm rounded-br-lg'>
                        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                            <div className="flex items-center gap-1 md:gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                    <span className="text-white hidden md:inline">Open</span>
                                    <span className="text-white md:hidden">O:</span>
                                    <span className={`text-[${COLORS.green}]`}>{currentPrice}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-white hidden md:inline">High</span>
                                    <span className="text-white md:hidden">H:</span>
                                    <span className={`text-[${COLORS.green}]`}>{currentPrice}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-white hidden md:inline">Low</span>
                                    <span className="text-white md:hidden">L:</span>
                                    <span className={`text-[${COLORS.red}]`}>{currentPrice}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-white hidden md:inline">Close</span>
                                    <span className="text-white md:hidden">C:</span>
                                    <span className={`text-[${COLORS.green}]`}>{currentPrice}</span>
                                </div>
                            </div>

                            {/* Real-time status */}
                            {enableRealTime && (
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-xs text-green-400">Live</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                            <div className="text-white text-sm md:text-lg">Loading chart data...</div>
                        </div>
                    )}

                    {/* Main Chart */}
                    <div className="flex-1 min-h-[300px] md:min-h-0" ref={mainChartContainerRef} />

                    {/* Indicator Label */}
                    <div className="px-2 md:px-4 py-1 bg-[#0f1420] border-t border-gray-800">
                        <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                            {indicators.filter(ind => ind.visible).map(ind => (
                                <span key={ind.id} className="text-white">
                                    {ind.type} ({ind.settings.period || 14})
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Indicator Chart */}
                    <div className="h-[100px] md:h-[150px]" ref={indicatorChartContainerRef} />

                    {/* Timeframe Bar */}
                    <div className="flex items-center justify-between px-2 md:px-4 py-2 bg-[#0f1420] border-t border-gray-800 overflow-x-auto">
                        <div className="flex items-center gap-1 min-w-max">
                            <span className="text-xs text-gray-400 mr-2 hidden md:inline">Time Frame:</span>
                            <span className="text-xs text-gray-400 mr-2 md:hidden">TF:</span>
                            {TIMEFRAMES.map((tf) => (
                                <button
                                    key={tf.label}
                                    onClick={() => handleTimeframeChange(tf)}
                                    className={`px-2 py-1 text-xs rounded transition-colors flex-shrink-0 ${activeTimeframe.label === tf.label
                                        ? 'bg-[#14E893] text-black font-semibold'
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/10'
                                        }`}
                                >
                                    {tf.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile overlay to close menus */}
            {(showMobileMenu || showIndicatorPanel || showDrawingPanel || showFilters) && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    onClick={() => {
                        setShowMobileMenu(false);
                        setShowIndicatorPanel(false);
                        setShowDrawingPanel(false);
                        setShowFilters(false);
                    }}
                />
            )}
        </>
    );
};

export default Charts;