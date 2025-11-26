import { Card, CardContent } from "@/components/ui/card";

import { Loader2 } from "lucide-react";

import { useState, useEffect } from "react";

import { useStockNewsByTicker } from "../../../api/hooks/news/useStocksNews";

import { useCryptoNewsByTicker } from "../../../api/hooks/news/useCryptoNews";

import { useSetTopbar } from "@/api/hooks/TopbarContext";

import { useInView } from 'react-intersection-observer';

import { useOutletContext } from "react-router-dom";

// New category structure

const CATEGORIES = ['All News', 'Stocks', 'Crypto'] as const;

type Category = typeof CATEGORIES[number];

function ErrorCard({ message }: { message: string }) {

    return (

        <Card className="group relative h-full min-h-[200px] overflow-hidden rounded-lg border border-red-500/20 bg-gradient-to-br from-[#1a1f2e] to-[#0d111c] shadow-lg flex items-center justify-center">

            <CardContent className="text-center px-4 py-6">

                <p className="text-red-400 text-sm sm:text-base">Error loading news</p>

                <p className="text-white/70 text-xs sm:text-sm mt-2">{message}</p>

            </CardContent>

        </Card>

    );

}

function NewsCard({ news, type = "list" }: { news: any; type?: "featured" | "side" | "list" }) {

    const formatDate = (dateString: string) => {

        const date = new Date(dateString);

        const now = new Date();

        const diffTime = Math.abs(now.getTime() - date.getTime());

        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

        if (diffHours < 1) {

            return `${Math.floor(diffTime / (1000 * 60))}m ago`;

        } else if (diffHours < 24) {

            return `${diffHours}h ago`;

        } else {

            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        }

    };

    const CardWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (

        <a

            href={news.news_url}

            target="_blank"

            rel="noopener noreferrer"

            className={className}

            onClick={(e) => e.stopPropagation()}

            style={{ background: "rgba(20, 20, 20, 0.30)" }}

        >

            {children}

        </a>

    );

    if (type === "featured") {

        return (

            <CardWrapper className="block group relative h-full min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-xl cursor-pointer">

                <img

                    src={news.image_url || ""}

                    alt={news.title}

                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"

                />

                <div className="absolute inset-0 bg-gradient-to-t" />

                <CardContent className="relative z-10 flex h-full flex-col justify-end gap-2 sm:gap-3 p-4 sm:p-5 md:p-6">

                    <div className="inline-flex w-fit items-center gap-2 rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-white">

                        {news.source_name}

                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight text-white line-clamp-2 sm:line-clamp-3">

                        {news.title}

                    </h2>

                    <p className="text-xs sm:text-sm leading-relaxed text-white/80 line-clamp-2 hidden sm:block">

                        {news.text || news.title.substring(0, 120)}...

                    </p>

                    <div className="flex items-center justify-between gap-3 text-[10px] sm:text-xs text-white/60 pt-1 sm:pt-2">

                        <div className="flex items-center gap-2">

                            <span>{formatDate(news.date)}</span>

                        </div>

                    </div>

                </CardContent>

            </CardWrapper>

        );

    }

    if (type === "side") {

        return (

            <CardWrapper className="block group relative h-[100px] sm:h-[110px] md:h-[120px] overflow-hidden rounded-lg border border-white/5 glass transition-all duration-300 hover:shadow-xl cursor-pointer"

            >

                <div className="flex h-full">

                    <div className="relative w-1/3 sm:w-2/5 overflow-hidden flex-shrink-0">

                        <img

                            src={news.image_url || ''}

                            alt={news.title}

                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"

                        />

                    </div>

                    <CardContent className="flex-1 flex flex-col justify-between p-3 sm:p-4 min-w-0">

                        <h3 className="text-xs sm:text-sm leading-snug text-white line-clamp-2 sm:line-clamp-3">

                            {news.title}

                        </h3>

                        <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/60 gap-1 sm:gap-2 mt-1 sm:mt-0">

                            <span className="truncate">{news.source_name}</span>

                            <span className="flex-shrink-0">{formatDate(news.date)}</span>

                        </div>

                    </CardContent>

                </div>

            </CardWrapper>

        );

    }

    // Default list view (Yahoo News style)

    return (

        <CardWrapper className="block glass group relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer hover:!bg-white/5">

            <div className="flex flex-col sm:flex-row h-auto sm:h-[160px] md:h-[180px]">

                <div className="relative w-full sm:w-1/4 h-[180px] sm:h-full overflow-hidden flex-shrink-0">

                    <img

                        src={news.image_url || ""}

                        alt={news.title}

                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"

                    />

                </div>

                <CardContent className="flex-1 flex flex-col justify-between p-4 sm:p-5 min-w-0">

                    <div className="flex-1">

                        <h3 className="text-base sm:text-lg font-semibold leading-snug text-white mb-2 line-clamp-2">

                            {news.title}

                        </h3>

                        <p className="text-xs sm:text-sm leading-relaxed text-white/70 line-clamp-2 mb-2 sm:mb-3 hidden sm:block">

                            {news.text || news.title.substring(0, 100)}...

                        </p>

                    </div>

                    <div className="flex items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-xs text-white/60 flex-wrap">

                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">

                            <span className="font-medium text-green-600">{news.source_name}</span>

                            <span>•</span>

                            <span>{formatDate(news.date)}</span>

                        </div>

                        {/* <MetricsRow metrics={getRandomMetrics()} /> */}

                    </div>

                </CardContent>

            </div>

        </CardWrapper>

    );

}

export default function YahooNewsLayout() {

    useSetTopbar('news');

    const [selectedCategory, setSelectedCategory] = useState<Category>('All News');

    const [page, setPage] = useState(1);

    const [allNews, setAllNews] = useState<any[]>([]);

    const [hasMore, setHasMore] = useState(true);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Get search query from context

    const { newsSearchQuery } = useOutletContext<{

        newsSearchQuery: string;

        setNewsSearchQuery: (query: string) => void;

    }>();

    const { ref, inView } = useInView({ threshold: 0 });

    // Fetch stock news - add search query parameter if available

    const {

        data: stockNewsData,

        isLoading: stockNewsLoading,

        error: stockNewsError,

        refetch: refetchStockNews

    } = useStockNewsByTicker(

        newsSearchQuery || 'AAPL', // Use search query or default to AAPL

        20,

        page

    );

    // Fetch crypto news - add search query parameter if available

    const {

        data: cryptoNewsData,

        isLoading: cryptoNewsLoading,

        error: cryptoNewsError,

        refetch: refetchCryptoNews

    } = useCryptoNewsByTicker(

        newsSearchQuery || 'BTC', // Use search query or default to BTC

        20,

        page

    );

    // Reset and refetch when search query changes

    useEffect(() => {

        if (!isInitialLoad) {

            setPage(1);

            setAllNews([]);

            setHasMore(true);

            // Trigger refetch with new search query

            refetchStockNews();

            refetchCryptoNews();

        }

    }, [newsSearchQuery, selectedCategory]);

    // Combine news data

    useEffect(() => {

        if (stockNewsData?.data?.payload?.data || cryptoNewsData?.data?.payload?.data) {

            const newNews = [

                ...(stockNewsData?.data?.payload?.data || []).map((news: any) => ({

                    ...news,

                    type: 'stock' as const,

                })),

                ...(cryptoNewsData?.data?.payload?.data || []).map((news: any) => ({

                    ...news,

                    type: 'crypto' as const,

                })),

            ];

            if (page === 1) {

                setAllNews(newNews);

            } else {

                setAllNews(prev => [...prev, ...newNews]);

            }

            setHasMore(newNews.length >= 20);

            setIsInitialLoad(false);

        }

    }, [stockNewsData, cryptoNewsData, page]);

    // Load more when scroll to bottom

    useEffect(() => {

        if (inView && hasMore && !stockNewsLoading && !cryptoNewsLoading && !isInitialLoad) {

            setPage(prev => prev + 1);

        }

    }, [inView, hasMore, stockNewsLoading, cryptoNewsLoading, isInitialLoad]);

    // Filter news based on category ONLY (search is handled by API)

    const filteredNews = allNews.filter(news => {

        const matchesCategory = selectedCategory === 'All News' ||

            (selectedCategory === 'Stocks' && news.type === 'stock') ||

            (selectedCategory === 'Crypto' && news.type === 'crypto');

        return matchesCategory;

    });

    const isLoading = stockNewsLoading || cryptoNewsLoading;

    const hasError = stockNewsError || cryptoNewsError;

    console.log("This is the hasError", hasError)

    // Clear search when component unmounts or category changes

    useEffect(() => {

        return () => {

            // Optional: Clear search when leaving News tab

            // You might want to keep this commented if you want search to persist

            // setNewsSearchQuery('');

        };

    }, []);

    // Show appropriate message based on search state

    const getEmptyStateMessage = () => {

        if (newsSearchQuery && filteredNews.length === 0 && !isLoading) {

            return `No news found for "${newsSearchQuery}"`;

        }

        return "No news found matching your criteria.";

    };

    const featuredNews = filteredNews.slice(0, 1);

    const sideNews = filteredNews.slice(1, 4);

    const mainNews = filteredNews.slice(4);

    return (

        <main className="min-h-screen mt-16 sm:mt-0">

            {/* Header */}

            <div className="rounded-lg w-fit px-1 py-1 glass ml-2 sm:ml-4 mb-4 sm:mb-6"

                style={{ background: "rgba(20, 20, 20, 0.30)" }}>

                {/* Category Tabs */}

                <div className="flex space-x-1 overflow-x-auto scrollbar-hide">

                    {CATEGORIES.map((category) => (

                        <button

                            key={category}

                            onClick={() => setSelectedCategory(category)}

                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${selectedCategory === category

                                ? 'special-btn !rounded-lg'

                                : 'text-white/70 hover:cursor-pointer hover:bg-white/10'

                                }`}

                        >

                            {category}

                        </button>

                    ))}

                </div>

            </div>

            {/* {newsSearchQuery && (

                <div className="mb-3 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">

                    <p className="text-blue-400 text-sm">

                        Showing results for: <strong>"{newsSearchQuery}"</strong>

                        <button

                            onClick={() => {

                                setNewsSearchQuery('');

                                setPage(1);

                                setAllNews([]);

                            }}

                            className="ml-2 text-blue-300 hover:text-white underline text-xs"

                        >

                            Clear search

                        </button>

                    </p>

                </div>

            )} */}

            <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-4 py-4 sm:py-6">

                {/* Main Grid Layout */}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">

                    {/* Featured News */}

                    <div className="lg:col-span-3">

                        {featuredNews.length > 0 && (

                            <NewsCard news={featuredNews[0]} type="featured" />

                        )}

                    </div>

                    {/* Side News */}

                    <div className="flex flex-col gap-3 sm:gap-4">

                        {sideNews.map((news, index) => (

                            <NewsCard key={`side-${index}`} news={news} type="side" />

                        ))}

                    </div>

                </div>

                {/* Main News List */}

                <div className="space-y-3 sm:space-y-4">

                    {mainNews.map((news, index) => (

                        <NewsCard key={`main-${index}`} news={news} type="list" />

                    ))}

                </div>

                {/* Loading and End Messages */}

                <div ref={ref} className="py-6 sm:py-8 text-center">

                    {isLoading && (

                        <div className="flex items-center justify-center gap-2 sm:gap-3">

                            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-green-600" />

                            <span className="text-white/70 text-xs sm:text-sm">

                                {newsSearchQuery ? `Searching for "${newsSearchQuery}"...` : "Loading more news..."}

                            </span>

                        </div>

                    )}

                    {!hasMore && mainNews.length > 0 && (

                        <p className="text-white/50 text-xs sm:text-sm">

                            {newsSearchQuery

                                ? `End of results for "${newsSearchQuery}"`

                                : "You've reached the end of today's news"

                            }

                        </p>

                    )}

                    {hasError && (
                        <ErrorCard message={stockNewsError?.message || cryptoNewsError?.message || "Failed to load news"} />

                    )}

                    {filteredNews.length === 0 && !isLoading && (

                        <div className="text-center py-8 sm:py-12">

                            <p className="text-white/70 text-sm sm:text-base">{getEmptyStateMessage()}</p>

                        </div>

                    )}

                </div>

            </div>

        </main>

    );

}
