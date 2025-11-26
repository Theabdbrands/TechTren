import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, RotateCw } from "lucide-react"
import Logo from "../../../assets/Home/logosm.svg";
import { useSetTopbar } from '@/api/hooks/TopbarContext';
import { useSearch } from '@/api/hooks/predictions/useSearch';
import { useMutationState } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SearchResult, TimeHorizonData, DataBricksResponse } from '@/types/prediction';
import JSON5 from 'json5';
// import ResponseFormatter from '../FinancialGPT/ResponseFormatter';
import LowGraph from "../../../assets/Home/Solid (1).svg"
import RiseGraph from "../../../assets/Home/Solid (2).svg"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import the proper hooks for the complete flow
import { usePredictionFlow, type SentimentData } from '@/api/hooks/predictions/usePredictionFlow';
import { useListPredictions, useGetPrediction } from '@/api/hooks/new/usePredictions';
import { useAuthStore } from '@/api/stores/auth-store';
import { useNavigate } from 'react-router-dom';
// import { useCreateConversation } from '@/api/hooks/new/useConversations';

// FIXED: Helper function to extract data from DataBricks response
const extractDataBricksData = (response: any): DataBricksResponse | null => {
    try {
        const textContent = response?.data?.payload?.data?.payload?.output?.[0]?.content?.[0]?.text;

        // If it's already an object, return it directly
        if (typeof textContent === 'object' && textContent !== null) {
            // console.log("Content is already an object, returning directly");
            return textContent as DataBricksResponse;
        }

        // If it's a string, extract and parse JSON
        if (typeof textContent === 'string') {
            // Try to find the JSON object in the string
            const jsonStart = textContent.indexOf('{');
            const jsonEnd = textContent.lastIndexOf('}') + 1;

            if (jsonStart === -1 || jsonEnd === 0) {
                console.error("No JSON object found in text content");
                return null;
            }

            const jsonText = textContent.substring(jsonStart, jsonEnd);

            // Use JSON5 for lenient parsing (handles single quotes, trailing commas, etc.)
            const parsed = JSON5.parse(jsonText);

            return parsed as DataBricksResponse;
        }

        return null;

    } catch (e) {
        console.error("Parsing error:", e);
        return null;
    }
};

// Analysis Report Component
interface AnalysisReportProps {
    content: string;
}

const AnalysisReport = ({ content }: AnalysisReportProps) => {
    return (
        <Card className="glass mt-5"
            style={{
                background: 'rgba(20, 20, 20, 0.30)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
            <CardContent className="p-6">
                <div className="rounded-2xl">
                    <h4 className="text-xl font-medium text-white mb-4">Analysis Report</h4>
                    <div className="text-slate-400 text-sm leading-relaxed">
                        {/* <ResponseFormatter aiResponse={content} /> */}
                        <div className="markdown-content text-xs sm:text-sm leading-relaxed">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}
                                components={{
                                    // Customize heading styles
                                    h1: ({ node, ...props }) => (
                                        <h1 className="text-xl sm:text-2xl font-bold mb-3 mt-4 text-emerald-400" {...props} />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <h2 className="text-lg sm:text-xl font-bold mb-2 mt-3 text-emerald-400" {...props} />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3 className="text-base sm:text-lg font-semibold mb-2 mt-2 text-emerald-300" {...props} />
                                    ),
                                    // Customize paragraph spacing
                                    p: ({ node, ...props }) => (
                                        <p className="mb-3 last:mb-0" {...props} />
                                    ),
                                    // Customize lists
                                    ul: ({ node, ...props }) => (
                                        <ul className="list-disc list-inside mb-3 space-y-1 ml-2" {...props} />
                                    ),
                                    ol: ({ node, ...props }) => (
                                        <ol className="list-decimal list-inside mb-3 space-y-1 ml-2" {...props} />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li className="ml-2" {...props} />
                                    ),
                                    // Customize links
                                    a: ({ node, ...props }) => (
                                        <a
                                            className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                        />
                                    ),
                                    // Customize code blocks
                                    code: ({ node, inline, ...props }: any) =>
                                        inline ? (
                                            <code
                                                className="bg-slate-800/60 text-emerald-300 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono"
                                                {...props}
                                            />
                                        ) : (
                                            <code
                                                className="block bg-slate-900/60 text-emerald-300 p-3 rounded-lg overflow-x-auto text-xs sm:text-sm font-mono my-2"
                                                {...props}
                                            />
                                        ),
                                    // Customize blockquotes
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote
                                            className="border-l-4 border-emerald-500/50 pl-4 py-2 my-3 bg-slate-800/30 rounded-r italic"
                                            {...props}
                                        />
                                    ),
                                    // Customize tables
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto my-3">
                                            <table className="min-w-full border-collapse border border-slate-700" {...props} />
                                        </div>
                                    ),
                                    th: ({ node, ...props }) => (
                                        <th className="border border-slate-700 bg-slate-800/60 px-3 py-2 text-left font-semibold" {...props} />
                                    ),
                                    td: ({ node, ...props }) => (
                                        <td className="border border-slate-700 px-3 py-2" {...props} />
                                    ),
                                    // Customize horizontal rules
                                    hr: ({ node, ...props }) => (
                                        <hr className="my-4 border-slate-700" {...props} />
                                    ),
                                    // Strong/Bold text
                                    strong: ({ node, ...props }) => (
                                        <strong className="font-bold text-emerald-300" {...props} />
                                    ),
                                    // Emphasis/Italic text
                                    em: ({ node, ...props }) => (
                                        <em className="italic text-gray-300" {...props} />
                                    ),
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// KPIs Section Component
function KpisSection({ ticker = "AAPL", trend = "Bearish", volatility = "Normal" }) {
    return (
        <Card className="glass"
            style={{
                background: 'rgba(20, 20, 20, 0.30)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
            <CardContent className="p-6">
                <div className="grid grid-cols-5 gap-4">
                    {[
                        { k: "Interval", v: "EOD" },
                        { k: "Volatility", v: volatility },
                        { k: "Indicator", v: ticker },
                        { k: "Volume", v: "Normal" },
                        {
                            k: "Trend",
                            v: `${trend} ${trend === 'Bearish' ? '↘' : trend === 'Bullish' ? '↗' : '→'}`,
                            c: trend === 'Bearish' ? "text-[#E03D51]" : trend === 'Bullish' ? "text-[#14E893]" : "text-yellow-400"
                        },
                    ].map((i) => (
                        <div key={i.k} className="text-center">
                            <p className="mb-1 text-sm text-slate-400">{i.k}</p>
                            <p className={`text-lg font-semibold ${i.c ?? "text-white"}`}>{i.v}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// Range Section Component
function RangeSection({ predictionData }: { predictionData?: TimeHorizonData; ticker?: string }) {
    const defaultRange: [number, number] = [241.49, 258.09];
    const [range, setRange] = useState<[number, number]>(defaultRange);

    useEffect(() => {
        if (predictionData) {
            setRange([predictionData.predicted_price_lower, predictionData.predicted_price_upper]);
        }
    }, [predictionData]);

    return (
        <Card className="glass rounded-2xl relative" style={{
            background: "rgba(20, 20, 20, 0.30)",
            boxShadow: `
                5px 0px 15px 0px rgba(81, 49, 173, 0.3),
                -5px 0px 10px 0px rgba(20, 232, 147, 0.3),
                0px 4px 20px 0px rgba(81, 49, 173, 0.2)
            `
        }}>
            <CardContent className="p-6">
                <div className="rounded-2xl shadow-xl">
                    <p className='text-3xl font-semibold mb-3'>
                        AI predicted price:
                        <span className={`text-3xl mt-2 inline-block pl-2 ${predictionData?.risk_level === 'Medium' || predictionData?.risk_level === 'Low' ? 'text-red-500' : 'text-emerald-500'}`}> {" "}
                            ${predictionData?.predicted_price.toFixed(2) || '0.00'}
                            <img src={predictionData?.risk_level === 'Medium' || predictionData?.risk_level === 'Low' ? LowGraph : RiseGraph} alt="graph" className='inline-block pl-1' />
                        </span>
                    </p>
                    <h3 className="text-sm font-medium text-slate-300 mb-3 py-2 pt-3">Predicted range</h3>

                    <div className="relative">
                        <div className="relative">
                            <Slider
                                value={range}
                                min={predictionData ? predictionData.predicted_price_lower * 0.90 : 240}
                                max={predictionData ? predictionData.predicted_price_upper * 1.10 : 260}
                                step={0.01}
                                className="mt-2 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-xl"
                            />
                        </div>
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[8px] bg-gradient-to-r from-[#5131AD] via-[#4F48B3] to-[#14E893] rounded-full -z-10" />
                    </div>

                    <div className="flex justify-between text-3xl font-semibold mt-3 tracking-wider">
                        <span>${range[0].toFixed(2)}</span>
                        <span>${range[1].toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Technical Analysis Component
function TechnicalAnalysis({ predictionData }: { predictionData?: TimeHorizonData }) {
    return (
        <Card className="glass p-6"
            style={{
                background: 'rgba(20, 20, 20, 0.30)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-zinc-100">
                    Technical Analysis Result
                </h2>
                <Badge
                    variant="outline"
                    className={`${predictionData?.trend === 'Bullish'
                        ? 'bg-green-900/40 text-green-400 border-green-700'
                        : predictionData?.trend === 'Bearish'
                            ? 'bg-red-900/40 text-red-400 border-red-700'
                            : 'bg-yellow-900/40 text-yellow-400 border-yellow-700'
                        } text-xs px-3 py-1 rounded-md`}
                >
                    {predictionData?.trend || 'Neutral'} {predictionData?.trend === 'Bullish' ? '↗' : predictionData?.trend === 'Bearish' ? '↘' : '→'}
                </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-5 text-sm leading-relaxed text-zinc-300">
                    <div>
                        <h3 className="text-white font-semibold mb-2">Price Prediction Analysis:</h3>
                        <p>{predictionData?.price_change_prediction_justification || "No analysis available yet."}</p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-2">Confidence Analysis:</h3>
                        <p>{predictionData?.confidence_interval_size_prediction_justification || "Additional analysis pending."}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                    <div>
                        <p className="text-zinc-400">Support</p>
                        <p className="text-emerald-400 text-lg font-semibold">
                            ${predictionData?.predicted_price_lower.toFixed(2) || '0.00'}
                        </p>
                    </div>
                    <div>
                        <p className="text-zinc-400">Price Change</p>
                        <p className="text-amber-400 text-lg font-semibold">
                            {predictionData?.price_change_category || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-zinc-400">Resistance</p>
                        <p className="text-amber-400 text-lg font-semibold">
                            ${predictionData?.predicted_price_upper.toFixed(2) || '0.00'}
                        </p>
                    </div>
                    <div>
                        <p className="text-zinc-400">Risk Level</p>
                        <p className={`text-lg font-semibold ${predictionData?.risk_level === 'High' ? 'text-rose-500' :
                            predictionData?.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                            }`}>
                            {predictionData?.risk_level || 'N/A'}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-zinc-400">Confidence Interval</p>
                        <p className="text-rose-500 text-lg font-semibold">
                            ±{predictionData?.confidence_interval_size_pct || 0}%
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Sentiment Analysis Component
interface SentimentAnalysisProps {
    sentimentScore: number;
    scoreDelta: number;
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
    trend?: string;
}

const SentimentAnalysis = ({
    sentimentScore,
    scoreDelta,
    positiveCount,
    neutralCount,
    negativeCount,
    trend = "Bearish"
}: SentimentAnalysisProps) => {
    const getTrendColor = (trend: string) => {
        switch (trend.toLowerCase()) {
            case 'bullish': return 'bg-green-900/40 text-green-400 border-green-700';
            case 'bearish': return 'bg-red-900/40 text-red-400 border-red-700';
            default: return 'bg-yellow-900/40 text-yellow-400 border-yellow-700';
        }
    };

    return (
        <Card className="glass rounded-2xl"
            style={{
                background: 'rgba(20, 20, 20, 0.30)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
            <CardContent className="p-6">
                <div className="rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-medium text-white">Sentiment Analysis</h4>
                        <Badge className={getTrendColor(trend)}>
                            {trend} ↘
                        </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Gauge */}
                        <div className="flex items-center justify-center">
                            <div className="relative w-[260px] h-[140px]">
                                <svg viewBox="0 0 260 140" className="w-full h-full" aria-hidden="true">
                                    {Array.from({ length: 24 }).map((_, i) => {
                                        const t = i / 23;
                                        const angle = Math.PI * (1 - t);
                                        const rOuter = 120;
                                        const rInner = 92;
                                        const cx = 130;
                                        const cy = 130;

                                        const x1 = cx + rInner * Math.cos(angle);
                                        const y1 = cy - rInner * Math.sin(angle);
                                        const x2 = cx + rOuter * Math.cos(angle);
                                        const y2 = cy - rOuter * Math.sin(angle);

                                        const filled = i < Math.round((sentimentScore / 100) * 24);

                                        return (
                                            <line
                                                key={i}
                                                x1={x1}
                                                y1={y1}
                                                x2={x2}
                                                y2={y2}
                                                stroke={filled ? "#E11D48" : "#1F1B2C"}
                                                strokeWidth={10}
                                                strokeLinecap="round"
                                                opacity={filled ? 1 : 0.9}
                                            />
                                        );
                                    })}
                                </svg>

                                {/* center value */}
                                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                                    <div className="text-4xl font-semibold leading-none">
                                        {sentimentScore}
                                        <span className="align-super text-rose-400 text-xl pl-1">↓↓</span>
                                    </div>
                                    <p className="text-slate-400 mt-1">Sentiment score</p>
                                </div>
                            </div>
                        </div>

                        {/* Right texts */}
                        <div className="flex flex-col justify-center space-y-6">
                            <div>
                                <p className="text-slate-300 font-medium">Sentiment score</p>
                                <p className="text-slate-400 mt-1">
                                    This is <span className="text-rose-400 font-semibold">{scoreDelta}</span> compared to previous score.
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-300 font-medium mb-2">Summary</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-3">
                                        <span className="inline-block size-2 rounded-full bg-emerald-500" />
                                        <span>
                                            <span className="text-emerald-400 font-semibold">{positiveCount}</span> with positive sentiments.
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="inline-block size-2 rounded-full bg-yellow-500" />
                                        <span>
                                            <span className="text-yellow-400 font-semibold">{neutralCount}</span> with neutral sentiments.
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="inline-block size-2 rounded-full bg-rose-500" />
                                        <span>
                                            <span className="text-rose-400 font-semibold">{negativeCount}</span> with negative sentiments.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Recent Predictions Log Component
type RecentPredictionItem = {
    id: number;
    dot: "red" | "green";
    text: string;
    date: string;
    predictionId?: string;
    ticker?: string;
};

function RecentPredictionsLog({
    items,
    onRefresh,
    // onPredictionClick
}: {
    items: RecentPredictionItem[];
    onRefresh?: () => void;
    onPredictionClick?: (prediction: any) => void;
}) {
    return (
        <div className="flex h-fit flex-col">
            <div className="mb-5 flex items-center justify-between px-6">
                <div className="flex flex-col">
                    <h3 className="text-xl font-semibold leading-tight text-slate-100">Recent predictions log</h3>
                    <span className="mt-1 text-xs text-slate-400">Latest forecasts and sentiment</span>
                </div>

                <button
                    onClick={onRefresh}
                    aria-label="Refresh"
                    className="group inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 cursor-pointer"
                >
                    <RotateCw className="h-5 w-5 transition-transform group-hover:rotate-180" />
                </button>
            </div>

            <div className="rounded-xl py-3">
                <ScrollArea className="h-[520px] rounded-md">
                    <ul className="space-y-2 text-slate-300">
                        {items.map((it) => (
                            <li
                                key={it.id}
                                className="flex items-start justify-between gap-4 border-b border-white/6 pb-4 last:border-b-0 cursor-default p-2 rounded transition-colors duration-200 px-5 py-4"
                            // onClick={() => onPredictionClick?.(it)}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`mt-2 inline-block h-2.5 w-2.5 rounded-full flex-shrink-0 ${it.dot === "red" ? "bg-red-500" : "bg-emerald-400"
                                            }`}
                                        aria-hidden
                                    />
                                    <span className="max-w-[420px] text-sm leading-snug text-slate-300 line-clamp-2">
                                        {it.text}
                                    </span>
                                </div>

                                <div className="shrink-0 text-right">
                                    <span className="block text-xs font-medium text-slate-500">{it.date}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </div>
        </div>
    );
}

// Main Component
export default function PredictionChat() {
    useSetTopbar('prediction');
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [selectedSymbol, setSelectedSymbol] = useState<string>('');
    const [currentTimeHorizon, setCurrentTimeHorizon] = useState<'1_day' | '1_week' | '1_month' | 'long_term'>('1_day');
    const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null);
    const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
    const [currentPrediction, setCurrentPrediction] = useState<any>(null);

    // const { executePredictionFlow, isPending: isPredicting, isError } = usePredictionFlow();
    const {
        executePredictionFlow,
        isPending: isPredicting,
        isError,
        error  // Add this to get the actual error object
    } = usePredictionFlow();
    const { data: searchResults, isLoading: isSearching } = useSearch(
        { searchTerm: searchQuery, itemType: 'stock_ticker', cap: 8 },
        { enabled: searchQuery.length >= 2 }
    );

    // console.log("This one is the searchResults", executePredictionFlow)

    // Get prediction logs
    const { data: predictionLogs, refetch: refetchPredictionLogs } = useListPredictions();

    // Hook for getting specific prediction
    const { data: specificPrediction, isLoading: isLoadingSpecific } = useGetPrediction(
        selectedPredictionId!,
        { enabled: !!selectedPredictionId }
    );

    // Get DataBricks response from mutation state
    const databricksData = useMutationState({
        filters: {
            mutationKey: ['databricksProxy'],
            status: 'success'
        },
        select: (mutation) => mutation.state.data,
    });

    const latestResponse = databricksData[databricksData.length - 1];
    const predictionData = extractDataBricksData(latestResponse);

    // Effect to handle when specific prediction data is loaded
    useEffect(() => {
        if (specificPrediction?.data) {
            // console.log('🟢 Specific prediction loaded:', specificPrediction.data);

            try {
                const predictionJson = JSON.parse(specificPrediction.data.predictionJson);
                // console.log('📊 Parsed specific prediction data:', predictionJson);

                // Extract ticker
                if (predictionJson.ticker) {
                    setSelectedSymbol(predictionJson.ticker);
                }

                // Extract sentiment data if it exists
                if (predictionJson.sentimentData) {
                    setSentimentData(predictionJson.sentimentData);
                }

                // Set the current prediction data
                setCurrentPrediction(predictionJson);

            } catch (error) {
                console.error('❌ Error parsing specific prediction JSON:', error);
            }
        }
    }, [specificPrediction]);

    // Enhanced console logging
    // useEffect(() => {
    //     if (latestResponse) {
    //         console.log('🎯 Latest DataBricks Response:', latestResponse);
    //     }
    //     if (predictionData) {
    //         console.log('📊 Full Prediction Data:', predictionData);
    //         console.log('⏰ Current Time Horizon:', currentTimeHorizon);
    //         console.log('📈 Current Time Horizon Data:', predictionData[currentTimeHorizon]);
    //     }
    //     if (sentimentData) {
    //         console.log('📊 Sentiment Data:', sentimentData);
    //     }
    // }, [latestResponse, predictionData, currentTimeHorizon, sentimentData]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFocus = () => {
        setIsFocused(true);
        setShowSearchResults(true);
    };

    const handleSearch = async () => {
        // Check if user is on basic plan and show appropriate message
        if (user?.subscription === 'basic' && !user?.isVerifiedEmail) {
            // You might want to show a verification prompt here
            console.log('Basic user with unverified email - limited access');
        }

        if (searchQuery.trim() && searchResults && searchResults.data && searchResults.data.length > 0) {
            await handleSearchResultClick(searchResults.data[0]);
        } else if (searchQuery.trim()) {
            const symbol = searchQuery.trim().toUpperCase();
            setSelectedSymbol(symbol);
            setSelectedPredictionId(null); // Reset specific prediction
            await fetchPredictionData(symbol);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearchResultClick = async (result: SearchResult) => {
        setSearchQuery(result.desc);
        setSelectedSymbol(result.id);
        setShowSearchResults(false);
        setSelectedPredictionId(null); // Reset specific prediction
        await fetchPredictionData(result.id);
    };

    const fetchPredictionData = async (ticker: string) => {
        // console.log('🚀 Starting complete prediction flow for:', ticker);

        try {
            const conversationId = `prediction_${ticker}_${Date.now()}`;

            const resultData = await executePredictionFlow({
                ticker: ticker,
                conversationId,
                onSuccess: (data) => {
                    setCurrentPrediction(data.predictionData);
                    setSentimentData(data.sentimentData);
                },
                onError: (error) => {
                    console.error('❌ Prediction flow failed:', error);
                }
            });

            setCurrentPrediction(resultData.predictionData);
            setSentimentData(resultData.sentimentData);
            refetchPredictionLogs();

        } catch (error) {
            console.error('❌ Failed to get prediction:', error);
        }
    };

    const handleTimeHorizonChange = (horizon: '1_day' | '1_week' | '1_month' | 'long_term') => {
        // console.log('⏰ Changing time horizon to:', horizon);
        setCurrentTimeHorizon(horizon);
    };

    // Handle clicking on a recent prediction
    const handlePredictionClick = (predictionItem: any) => {
        // console.log('🟡 Clicked on prediction:', predictionItem);

        if (predictionItem.predictionId) {
            setSelectedPredictionId(predictionItem.predictionId);
            setSearchQuery(predictionItem.ticker || '');
            setSelectedSymbol(predictionItem.ticker || '');
        }
    };

    // Convert prediction logs to display format with prediction IDs
    const recentItems = predictionLogs?.data?.map((log: any, index: number) => {
        try {
            const prediction = JSON.parse(log.predictionJson);
            const dayPrediction = prediction['1_day'] || Object.values(prediction)[0];
            const ticker = prediction.ticker || 'Unknown';

            return {
                id: index,
                dot: dayPrediction?.trend === 'Bullish' ? 'green' as const : 'red' as const,
                text: `Predict price of ${ticker} is ${dayPrediction?.trend || 'neutral'}`,
                date: new Date(log.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                predictionId: log.id, // Store the prediction ID for retrieval
                ticker: ticker
            };
        } catch (error) {
            console.error('Error parsing prediction log:', error);
            return {
                id: index,
                dot: 'red' as const,
                text: 'Error parsing prediction data',
                date: new Date(log.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                predictionId: log.id
            };
        }
    }) || [];

    // Get sentiment data for the selected ticker
    const tickerSentimentTotal = sentimentData?.total?.[selectedSymbol];
    const sentimentScore = tickerSentimentTotal ?
        Math.round(tickerSentimentTotal["Sentiment Score"] * 100) : 78.5;

    // Use current prediction data or fallback to databricks response
    const currentPredictionData = currentPrediction?.[currentTimeHorizon] || predictionData?.[currentTimeHorizon];

    const shadowStyle = isFocused
        ? "0px 0px 5px 0px rgba(40, 173, 155, 0.3), -0px 0px 5px 0px rgba(78, 58, 172, 0.3)"
        : "0px 0px 10px 0px rgba(40, 173, 155, 0.5), -0px 0px 10px 0px rgba(78, 58, 172, 0.5)";

    const timeHorizons = ['1_day', '1_week', '1_month', 'long_term'] as const;
    const timeHorizonLabels = {
        '1_day': '1 Day',
        '1_week': '1 Week',
        '1_month': '1 Month',
        'long_term': 'Long Term'
    };

    // Determine if we have any prediction data to show
    const hasPredictionData = currentPrediction || predictionData;

    return (
        <div className="flex flex-col items-center justify-center mt-16 sm:mt-0">
            {/* Logo + Heading */}
            <div className="text-center mb-10">
                <img src={Logo} alt="logo" className="mx-auto mb-4" />
                <h1 className="text-3xl md:text-[40px] font-medium">Price prediction</h1>
                <p className="text-gray-400 mt-2 text-sm md:text-base w-80">
                    Your AI-powered investor and communicator all in one platform.
                </p>
            </div>

            {/* Search Input */}
            <div className="w-full max-w-2xl mb-8 relative">
                {/* {console.log("Details of user", user)} */}
                <div
                    className="flex items-center justify-center rounded-full overflow-hidden p-[2px] bg-gradient-to-r from-[#4e3aac] to-[#28ad9b] transition-all duration-300 ease-in-out"
                    style={{ boxShadow: shadowStyle }}
                >
                    <div className="flex items-center justify-center w-full bg-[#06040C] rounded-full px-4 gap-3">
                        <Input
                            type="text"
                            placeholder="Search stocks and cryptos"
                            className="!bg-transparent py-6 !border-none !outline-none focus:!outline-none focus:!ring-0 focus:!border-transparent w-full"
                            onFocus={handleFocus}
                            // disabled={isPredicting || isError}
                            disabled={user?.subscription === 'basic' || isPredicting}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <Search
                            // className={`w-5 h-5 cursor-pointer ${(isPredicting || isError) ? '!opacity-50 !cursor-not-allowed' : ''}`}
                            className={`w-5 h-5 cursor-pointer ${(user?.subscription === 'basic' || isPredicting) ? '!opacity-50 !cursor-not-allowed' : ''}`}
                            onClick={!(isPredicting || isError) ? handleSearch : undefined}
                        />
                    </div>
                </div>

                {/* Search Results Dropdown */}
                {/* Search Results Dropdown */}
                {showSearchResults && searchQuery.length >= 2 && !isError && (
                    <div className="absolute top-full left-0 right-0 mt-2 glass rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto scrollbar-hide"
                        style={{
                            background: 'rgba(20, 20, 20, 0.30)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                        {isSearching ? (
                            <div className="p-4 text-center text-gray-400">Searching...</div>
                        ) : isError && error ? (
                            // Show error message in dropdown when there's an error
                            <div className="p-4 text-center">
                                <div className="text-red-400 mb-2 text-sm">
                                    <strong>Error:</strong> {error.message || 'Search failed'}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {error.message?.includes('quota') && (
                                        <div>
                                            <p>Basic plan users have limited predictions.</p>
                                            <p className="mt-1">Verify your email or upgrade to unlock more features.</p>
                                        </div>
                                    )}
                                    {error.message?.includes('requests') && 'Too many requests. Please wait a moment.'}
                                    {error.message?.includes('Authentication') && 'Please log in to continue.'}
                                    {error.message?.includes('Service temporarily') && 'Service temporarily unavailable.'}
                                </div>
                            </div>
                        ) : searchResults && searchResults.data.length > 0 ? (
                            searchResults.data.map((result: SearchResult) => (
                                <div
                                    key={`${result.itemType}-${result.id}`}
                                    className="p-3 hover:bg-white/5 cursor-pointer border-b border-white/10 last:border-b-0"
                                    onClick={() => handleSearchResultClick(result)}
                                >
                                    <div className="font-medium text-white">{result.metadata?.name || result.desc}</div>
                                    <div className="text-sm text-gray-400">
                                        {result.id} • {result.itemType}
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Show no results message when search returns empty
                            <div className="p-4 text-center text-gray-400">
                                No results found for "{searchQuery}"
                                {user?.subscription === 'basic' && (
                                    <div className="mt-2 text-xs text-amber-400">
                                        Basic plan users have limited access. Upgrade your plan for full features.
                                        <span onClick={() => navigate('/dashboard/account-settings?tab=subscription')} className='underline cursor-pointer ml-1 text-gray-400 font-semibold'>Upgrade now?</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {user?.subscription === 'basic' &&
                    <div className="mt-4 text-sm text-red-500 mx-auto text-center">
                        Basic plan users have limited access. Upgrade your plan for full features
                        <span onClick={() => navigate('/dashboard/account-settings?tab=subscription')} className='underline cursor-pointer ml-1 text-gray-400 font-semibold'>Upgrade now?</span>
                    </div>
                }
            </div>

            {/* Loading States */}
            {/* {(isPredicting || isLoadingSpecific) && (
                <div className="text-center text-gray-400 mb-4">
                    {isPredicting && `Getting AI prediction for ${selectedSymbol}...`}
                    {isLoadingSpecific && `Loading prediction data...`}
                </div>
            )} */}
            {/* Loading States & Error Display */}
            {(isPredicting || isLoadingSpecific || isError) && (
                <div className="text-center mb-4">
                    {isPredicting && (
                        <div className="text-gray-400">
                            Getting AI prediction for {selectedSymbol}...
                        </div>
                    )}
                    {isLoadingSpecific && (
                        <div className="text-gray-400">
                            Loading prediction data...
                        </div>
                    )}

                    {/* {console.log("This is the error messahe from DataBrickProxy of PredictionChat", error)} */}
                    {isError && error && (
                        <div className="error-message max-w-2xl mx-auto" style={{
                            padding: '12px',
                            margin: '10px 0',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            color: '#ef4444'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    {/* <strong>Error:</strong> */}
                                    {/* <div style={{ marginTop: '4px', fontSize: '14px' }}>
                                        {error.message || 'Something went wrong while fetching the prediction'}
                                    </div> */}
                                    {user?.subscription === 'basic' &&
                                        <div className="mt-2 text-xs">
                                            Basic plan users have limited access. Upgrade your plan for full features
                                            <span onClick={() => navigate('/dashboard/account-settings?tab=subscription')} className='underline cursor-pointer ml-1 text-gray-400 font-semibold'>Upgrade now?</span>
                                        </div>
                                    }
                                    {/* <div className="mt-2 text-xs">
                                        Basic plan users have limited access. Upgrade your plan for full features
                                        <span onClick={() => navigate('/dashboard/account-settings?tab=subscription')} className='underline cursor-pointer ml-1 text-gray-400 font-semibold'>Upgrade now?</span>
                                    </div> */}

                                    {/* Show specific error messages based on error type */}
                                    {/* {error.message?.includes('quota') && (
                                        <div style={{ marginTop: '6px', fontSize: '13px', opacity: 0.9 }}>
                                            {user?.subscription === 'basic' ? (
                                                <div>
                                                    <p>Basic plan users have limited predictions per day.</p>
                                                    <p className="mt-1">
                                                        {(user as any)?.isVerifiedEmail
                                                            ? 'Upgrade your plan to unlock unlimited predictions.'
                                                            : 'Verify your email and upgrade for unlimited access.'
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                'Please verify your account or upgrade your plan.'
                                            )}
                                        </div>
                                    )} */}
                                    {error.message?.includes('requests') && (
                                        <div style={{ marginTop: '6px', fontSize: '13px', opacity: 0.9 }}>
                                            Too many requests. Please wait a moment and try again.
                                        </div>
                                    )}
                                    {/* {error.message?.includes('Authentication') && (
                                        <div style={{ marginTop: '6px', fontSize: '13px', opacity: 0.9 }}>
                                            Please log in to continue.
                                        </div>
                                    )}
                                    {error.message?.includes('Service temporarily') && (
                                        <div style={{ marginTop: '6px', fontSize: '13px', opacity: 0.9 }}>
                                            Service is temporarily unavailable. Please try again later.
                                        </div>
                                    )}
                                    {error.message?.includes('Failed to parse') && (
                                        <div style={{ marginTop: '6px', fontSize: '13px', opacity: 0.9 }}>
                                            Failed to process the prediction data. Please try again.
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Duration Selection */}
            {hasPredictionData && (
                <div className="flex justify-center w-full mb-6">
                    {/* Desktop Buttons */}
                    <div className="hidden sm:flex gap-2 flex-wrap justify-center">
                        {timeHorizons.map((horizon) => (
                            // <button
                            //     key={horizon}
                            //     disabled={isPredicting}
                            //     className={`!rounded-md cursor-pointer glass !px-5 !py-1 flex items-center justify-center transition-all duration-300 ${currentTimeHorizon === horizon
                            //         ? "bg-gradient-to-r from-[#4e3aac] to-[#28ad9b] text-white !border-0"
                            //         : "bg-white/10 hover:!bg-white/20"
                            //         } ${isPredicting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            //     style={{
                            //         background: currentTimeHorizon === horizon
                            //             ? "linear-gradient(90deg, #4e3aac 0%, #28ad9b 100%)"
                            //             : "rgba(20, 20, 20, 0.30)",
                            //     }}
                            //     onClick={() => handleTimeHorizonChange(horizon)}
                            // >
                            //     {timeHorizonLabels[horizon]}
                            // </button>
                            <button
                                key={horizon}
                                disabled={isPredicting || isError}  // Add isError here
                                className={`!rounded-md cursor-pointer glass !px-5 !py-1 flex items-center justify-center transition-all duration-300 ${currentTimeHorizon === horizon
                                    ? "bg-gradient-to-r from-[#4e3aac] to-[#28ad9b] text-white !border-0"
                                    : "bg-white/10 hover:!bg-white/20"
                                    } ${(isPredicting || isError) ? 'opacity-50 cursor-not-allowed' : ''}`}  // Add isError here
                                style={{
                                    background: currentTimeHorizon === horizon
                                        ? "linear-gradient(90deg, #4e3aac 0%, #28ad9b 100%)"
                                        : "rgba(20, 20, 20, 0.30)",
                                }}
                                onClick={() => handleTimeHorizonChange(horizon)}
                            >
                                {timeHorizonLabels[horizon]}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Dropdown */}
                    <div className="sm:hidden w-full max-w-xs relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full rounded-lg bg-[#1A1A1A] text-white px-4 py-3 flex items-center justify-between border border-gray-800 hover:border-gray-700 transition-all duration-200"
                        >
                            <span className="text-base font-medium">
                                {timeHorizonLabels[currentTimeHorizon]}
                            </span>
                            <ChevronDown
                                className={`w-5 h-5 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-[#1A1A1A] border border-gray-800 shadow-lg z-50 overflow-hidden">
                                {timeHorizons.map((horizon) => (
                                    <button
                                        key={horizon}
                                        type="button"
                                        onClick={() => {
                                            handleTimeHorizonChange(horizon);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-white text-base hover:bg-white/10 transition-colors duration-150 ${currentTimeHorizon === horizon ? 'bg-white/10' : ''
                                            }`}
                                    >
                                        {timeHorizonLabels[horizon]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Conditional Rendering */}
            {!hasPredictionData ? (
                <div className='w-full relative flex justify-center -z-10 mb-8'>
                    <div className='relative mx-auto w-[80%] sm:w-[40%] md:w-[30%]'>
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className='w-full h-full object-cover rounded-lg'
                        >
                            <source src="https://res.cloudinary.com/dbzbetuin/video/upload/v1762975516/mcr1pup4ibyrpeimh1xj.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div
                            className='absolute inset-0 rounded-lg'
                            style={{
                                background: 'linear-gradient(275.19deg, #14E893 -15.5%, #5131AD 98.25%)',
                                mixBlendMode: 'hue'
                            }}
                        ></div>
                        <div
                            className='absolute inset-0 rounded-lg pointer-events-none'
                            style={{
                                background: 'radial-gradient(circle at center, transparent 1%, #06040C 80%)',
                            }}
                        ></div>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-[1200px] px-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* LEFT COLUMN */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Predicted range */}
                            <RangeSection predictionData={currentPredictionData} ticker={selectedSymbol} />

                            {/* Small KPIs row */}
                            <KpisSection
                                ticker={selectedSymbol}
                                trend={currentPredictionData?.trend}
                                volatility="Normal"
                            />

                            {/* Sentiment Analysis with real data */}
                            <SentimentAnalysis
                                sentimentScore={sentimentScore}
                                scoreDelta={-5} // You can calculate this dynamically
                                positiveCount={tickerSentimentTotal?.["Total Positive"] || 0}
                                neutralCount={tickerSentimentTotal?.["Total Neutral"] || 0}
                                negativeCount={tickerSentimentTotal?.["Total Negative"] || 0}
                                trend={currentPredictionData?.trend}
                            />
                        </div>

                        {/* RIGHT COLUMN - Recent Predictions Log */}
                        <div>
                            <Card className="glass rounded-2xl h-fit"
                                style={{ background: "rgba(20, 20, 20, 0.30)" }}>
                                <CardContent className="py-6 h-full px-0">
                                    <RecentPredictionsLog
                                        items={recentItems}
                                        onRefresh={refetchPredictionLogs}
                                        onPredictionClick={handlePredictionClick}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Technical analysis */}
                    <TechnicalAnalysis predictionData={currentPredictionData} />

                    {/* Analysis report */}
                    <AnalysisReport content={currentPredictionData?.report || "Analysis report will be generated based on the prediction data."} />
                </div>
            )}
        </div>
    );
}