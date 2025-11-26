import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    // ChevronLeft,
    // ChevronRight as RightIcon,
    SendHorizonal,
    Plus,
    Send,
    Calendar,
    ExternalLink,
    ChevronLeft,
    MoveRightIcon,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from 'react';
import arrowUp from '../../../assets/Home/arrow-up.svg';
import logoSm from '../../../assets/Home/logosm.svg';
import noise from '../../../assets/Home/noise.svg';
import EllipseMobile from '../../../assets/Home/EllipseMobile.svg';
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    // CarouselNext,
    // CarouselPrevious,
} from "@/components/ui/carousel";

// NEW: Import CarouselApi for pagination
import { type CarouselApi } from "@/components/ui/carousel";
import Oracle from '../../../assets/Dashboard/Oracle.png';
import MicrosoftInvestment from '../../../assets/Dashboard/MicrosoftInvestment.png';
import GoogleAiMan from '../../../assets/Dashboard/GoogleAiMan.png';
import AmazonIntroMan from '../../../assets/Dashboard/AmazonIntroMan.png';
import AppleMan from '../../../assets/Dashboard/AppleMan.png';
import { useSetTopbar } from '@/api/hooks/TopbarContext';
import { useWatchlist } from '@/api/hooks/watchlist/useWatchlist';
import MessageFinancial from '../../../assets/Dashboard/message.svg';
import { useChatStore } from '@/api/stores/chat-store';
// import { useApiErrorHandler } from '@/api/hooks/news/useApiErrorHandler';
import { useStockNewsByTicker } from '@/api/hooks/news/useStocksNews';
import { useCryptoNewsByTicker } from '@/api/hooks/news/useCryptoNews';
import { useListPredictions } from '@/api/hooks/new/usePredictions';
import { useAlerts, type PriceAlert } from '@/api/hooks/alerts/useAlerts';
import AiStrategiesGIF from '../../../assets/Home/aiBlendedGif.gif';
import Ellipse from '../../../assets/Home/EllipseMobile.svg';
import PredictionArrowUp from '../../../assets/Home/arrows-up.svg';
import PredictionArrowDown from '../../../assets/Home/arrows-down.svg';
import { motion } from "framer-motion";
// NEW IMPORT: Add ticker details hook
import { useTickerDetailsMultiple } from '@/api/hooks/watchlist/useTickerDetails';
import { cn } from "@/lib/utils"; // NEW: Import cn utility
import { useAuthStore } from '@/api/stores/auth-store';

// Fallback images for news items
const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=400&q=80"
];


// NEW COMPONENT: Watchlist Carousel Item with icon/logo support
interface WatchlistCarouselItemProps {
    item: any;
    iconBase64: string | null;
    logoBase64: string | null;
    isLoadingIcon: boolean;
    firstLetter: string;
    isActive?: boolean;
    tickerData?: any; // Add this to receive full ticker data
}

const colorRed = '#FF0044';
const colorGreen = '#14E893';


const WatchlistCarouselItem: React.FC<WatchlistCarouselItemProps> = ({
    item,
    iconBase64,
    logoBase64,
    isLoadingIcon,
    firstLetter,
    isActive = true,
    tickerData
}) => {
    const [imageError, setImageError] = useState(false);

    // Extract price data from Polygon API
    const priceData = tickerData?.price?.data;
    const isLoadingPrice = tickerData?.price?.isLoading;
    const hasPriceError = tickerData?.price?.isError;

    // Calculate price and change
    const currentPrice = priceData?.c || 0;
    const openPrice = priceData?.o || 0;
    const priceChange = currentPrice - openPrice;
    const priceChangePercent = openPrice ? ((priceChange / openPrice) * 100) : 0;
    const isPositive = priceChangePercent >= 0;

    const formattedPrice = currentPrice ? `$${currentPrice.toFixed(2)}` : '$0.00';
    const formattedChange = `${isPositive ? '+' : ''}${priceChangePercent.toFixed(2)}%`;

    // Determine what to show
    const hasIcon = iconBase64 && !imageError;
    const hasLogo = logoBase64 && !imageError && !hasIcon;
    const showFallback = !hasIcon && !hasLogo && !isLoadingIcon;

    return (
        <CarouselItem className="pl-2 basis-1/2 md:basis-1/3 lg:basis-1/4 2xl:basis-1/5">
            <div className={cn(
                "min-w-[120px] rounded-xl p-3 text-center glass space-y-1 pt-5 cursor-default transition-all duration-300",
                isActive
                    ? "hover:bg-white/5 scale-100 opacity-100"
                    : "scale-90 opacity-70"
            )}>
                {/* Icon/Logo/Letter Display */}
                <div className="w-10 h-10 border rounded-full mx-auto mb-4 flex items-center justify-center bg-white/5 overflow-hidden">
                    {isLoadingIcon ? (
                        <div className="w-full h-full bg-gray-700/50 animate-pulse rounded-full" />
                    ) : hasIcon ? (
                        <img
                            src={iconBase64}
                            alt={`${item.ticker} icon`}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : hasLogo ? (
                        <img
                            src={logoBase64}
                            alt={`${item.ticker} logo`}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : showFallback ? (
                        <span className="text-lg font-semibold text-white">
                            {firstLetter}
                        </span>
                    ) : null}
                </div>

                <div className="text-xl font-semibold">{item.ticker}</div>

                {/* Price and Change Display */}
                {isLoadingPrice ? (
                    <>
                        <div className="h-6 w-20 bg-gray-700/50 animate-pulse rounded mx-auto"></div>
                        <div className="h-4 w-16 bg-gray-700/50 animate-pulse rounded mx-auto"></div>
                    </>
                ) : hasPriceError ? (
                    <div className="text-xs text-red-400">Price unavailable</div>
                ) : (
                    <>
                        <div className="text-lg font-normal text-white">{formattedPrice}</div>
                        <div
                            className="text-sm font-medium flex items-center justify-center gap-1 py-1"
                            style={{
                                color: isPositive ? colorGreen : colorRed
                            }}
                        >
                            <img src={isPositive ? PredictionArrowUp : PredictionArrowDown} alt="prediction" />
                            {formattedChange}
                        </div>
                    </>
                )}
            </div>
        </CarouselItem>
    );
};


// NEW COMPONENT: Mobile Watchlist Carousel with Pagination
interface MobileWatchlistCarouselProps {
    items: any[];
    tickerDataByTicker: { [ticker: string]: any };
    isLoading: boolean;
    navigate: any;
}

const MobileWatchlistCarousel: React.FC<MobileWatchlistCarouselProps> = ({
    items,
    tickerDataByTicker,
    isLoading,
    navigate
}) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;

        const update = () => {
            setCurrent(api.selectedScrollSnap());
        };

        update();
        api.on("select", update);
    }, [api]);

    const getDotStyle = (index: number) => {
        const distanceFromActive = Math.abs(index - current);

        if (distanceFromActive === 0) {
            return {
                width: "1rem",
                height: "0.5rem",
                opacity: 1
            };
        }
        if (distanceFromActive === 1 || distanceFromActive === (items.length - 1)) {
            return {
                width: "0.6rem",
                height: "0.6rem",
                opacity: 0.8
            };
        }
        if (distanceFromActive === 2 || distanceFromActive === (items.length - 2)) {
            return {
                width: "0.4rem",
                height: "0.4rem",
                opacity: 0.5
            };
        }
        return {
            width: "0.4rem",
            height: "0.4rem",
            opacity: 0.3
        };
    };

    return (
        <div className="relative w-full">
            <Carousel
                setApi={setApi}
                className="w-full"
                opts={{
                    align: "center",
                    loop: items.length > 1,
                }}
            >
                <div className="w-full flex justify-between items-center mt-3 mb-1 pr-6">
                    <p className="text-lg font-medium text-gray-300 pt-1">Recent in watchlist</p>
                    <div className="relative hidden min-[390px]:flex gap-2 items-center">
                        {items.length >= 1 &&
                            <button
                                className="p-1.5 cursor-pointer bg-white text-gray-800 rounded-full ml-14 border border-transparent hover:bg-transparent hover:border-white hover:text-white transition-all duration-300"
                                onClick={() => {
                                    navigate("/dashboard/watchlist");
                                    window.scrollTo(0, 0);
                                }}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        }
                    </div>
                </div>

                <CarouselContent className="-ml-10 mr-0 py-3 min-h-40">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index} className="pl-2 pr-2 basis-3/4 sm:basis-2/5">
                                <div className="min-w-[120px] rounded-xl p-3 text-center glass space-y-1 pt-5 cursor-default animate-pulse">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 mx-auto mb-4"></div>
                                    <div className="h-6 bg-gray-700 rounded mx-auto w-16"></div>
                                    <div className="h-4 bg-gray-700 rounded mx-auto w-12 mt-2"></div>
                                    <div className="h-4 bg-gray-700 rounded mx-auto w-16"></div>
                                </div>
                            </CarouselItem>
                        ))
                    ) : items.length === 0 ? (
                        <CarouselItem className="pl-6 sm:pl-2 pr-2 basis-[100%] sm:basis-2/5">
                            <div className="mt-4 text-center w-full flex items-center justify-center flex-col">
                                <p className="text-base text-gray-400 mb-2">Nothing to show in Watchlist</p>
                                <button
                                    onClick={() => navigate("/dashboard/watchlist")}
                                    className="px-4 py-2 special-btn text-sm font-medium flex items-center justify-center gap-1"
                                >
                                    Create Your Watchlist
                                    <ChevronRight className='w-5 h-5' />
                                </button>
                            </div>
                        </CarouselItem>
                    ) : (
                        items.map((item, index) => {
                            const firstLetter = item.ticker.charAt(0).toUpperCase();
                            const tickerData = tickerDataByTicker[item.ticker];
                            const iconBase64 = tickerData?.icon?.data;
                            const logoBase64 = tickerData?.logo?.data;
                            const isLoadingIcon = tickerData?.icon?.isLoading || tickerData?.logo?.isLoading;
                            const isActive = current === index;

                            return (
                                <CarouselItem
                                    key={item.id}
                                    className="pl-2 pr-2 basis-3/4 sm:basis-2/5"
                                >
                                    <div className={cn(
                                        "transition-all duration-300 transform",
                                        isActive
                                            ? "scale-100 opacity-100"
                                            : "scale-90 opacity-70"
                                    )}>
                                        <WatchlistCarouselItem
                                            item={item}
                                            iconBase64={iconBase64}
                                            logoBase64={logoBase64}
                                            isLoadingIcon={isLoadingIcon}
                                            firstLetter={firstLetter}
                                            isActive={isActive}
                                            tickerData={tickerData}
                                        />
                                    </div>
                                </CarouselItem>
                            );
                        })
                    )}
                </CarouselContent>
            </Carousel>

            {items.length > 0 && !isLoading && (
                <div className="mt-4 flex justify-center">
                    <div className="flex items-center gap-3 px-6 py-3 bg-black/80 border border-gray-700/40 rounded-full">
                        {items.map((_, i) => {
                            const dotStyle = getDotStyle(i);
                            return (
                                <button
                                    key={i}
                                    onClick={() => api?.scrollTo(i)}
                                    className={cn(
                                        "transition-all duration-300 rounded-full bg-gray-600 hover:bg-gray-400",
                                        current === i && "bg-white"
                                    )}
                                    style={{
                                        width: dotStyle.width,
                                        height: dotStyle.height,
                                        opacity: dotStyle.opacity
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const ChatSystem: React.FC = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const { createNewConversation, setActiveConversation } = useChatStore();

    const handleInitiateChat = (messageText?: string) => {
        const text = messageText || input.trim();
        if (!text) return;

        const newConversationId = createNewConversation();
        setActiveConversation(newConversationId);

        navigate('/dashboard/financial-gpt', {
            state: {
                initialMessage: text,
                conversationId: newConversationId
            }
        });

        setInput('');
    };

    const handleResumeChat = () => {
        navigate('/dashboard/financial-gpt');
    };

    const handleInput = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                handleInitiateChat();
            } else {
                handleResumeChat();
            }
        }
    };

    function GetFinancialMessageIcon(icon: any) {
        return <img src={icon} alt="icon" className='w-5 h-5 filter-green opacity-60' />
    }

    return (
        <div className="relative rounded-2xl px-6 xl:px-10 pb-8 pt-4 backdrop-blur w-full flex flex-col items-center justify-between gap-3 border mt-16 sm:mt-0 overflow-hidden">
            <motion.img
                src={Ellipse}
                alt="Ellipse"
                className="absolute block sm:hidden -top-10 left-0 h-[95%] w-[95%] -z-10 scale-125"
                animate={{
                    // x: ["-25%", "25%", "-25%"]
                    x: ["-40%", "40%", "-40%"]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <div className="text-center px-2 md:px-3">
                <img src={logoSm} alt="logo" className="w-12 h-12 mx-auto" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light mb-3 text-white">Ask Financial GPT</h2>
                <p className="text-gray-400 text-sm xl:text-base max-w-[430px]">
                    Financial GPT — Your AI-powered investor and communicator all in one platform.
                </p>
            </div>

            <div className='w-full h-full relative hidden sm:flex justify-center mb-10'>
                <div className='relative w-[420px] h-32'
                    style={{
                        mixBlendMode: "plus-lighter"
                    }}
                >
                    <img
                        src={AiStrategiesGIF}
                        alt="gif"
                        className='w-full h-full object-cover'
                    />
                </div>
            </div>

            <div className="flex-1 w-full flex flex-col justify-end mt-3">
                <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto items-center mb-4">
                    {[
                        { icon: GetFinancialMessageIcon(MessageFinancial), label: "Market analysis & trends" },
                        { icon: GetFinancialMessageIcon(MessageFinancial), label: "Stock and crypto insights" },
                        { icon: GetFinancialMessageIcon(MessageFinancial), label: "Trading strategies" },
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() => handleInitiateChat(item.label)}
                            className="flex items-center cursor-pointer gap-2 px-4 py-1.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-400/20 hover:border-emerald-500/60 transition-all duration-200 text-sm font-medium
                                        justify-center md:justify-start"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                <div
                    className="flex mt-3 items-center gap-3 border rounded-lg md:rounded-full px-2 pl-6 py-2 w-full xl:w-[90%] self-center"
                    style={{
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.05)",
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        placeholder="Type your message..."
                        onInput={handleInput}
                        onKeyPress={handleKeyPress}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={1}
                        className="resize-none overflow-hidden bg-transparent flex-1 text-gray-300 outline-none placeholder-gray-500 text-xs md:text-sm lg:text-base"
                    />
                    <Button
                        onClick={input.trim() ? () => handleInitiateChat() : handleResumeChat}
                        className={`md:bg-[linear-gradient(275.19deg,#14E893_-15.5%,#5131AD_98.25%)] special-btn flex items-center justify-center sm:w-fit px-2 py-2 md:py-5 md:px-5 text-base`}
                    >
                        <span className="hidden md:inline">
                            {input.trim() ? "Send" : "Start Chat"}
                        </span>
                        <span className="ml-1 flex items-center">
                            {input.trim() ? (
                                <Send size={14} className="hidden md:inline" />
                            ) : (
                                <ChevronRight size={14} className="hidden md:inline" />
                            )}
                            <SendHorizonal size={18} className="w-5 md:hidden" />
                        </span>
                    </Button>
                </div>
            </div>

            <img src={EllipseMobile} alt="noise" className="hidden sm:block absolute h-full w-full object-contain -z-[2] -top-72 scale-150" />
            <img src={noise} alt="noise" className="absolute h-full w-full object-cover -z-[2] -top-70 scale-150" />
        </div>
    );
};


// NEW COMPONENT: Alert Item with icon/logo support
interface AlertItemProps {
    alert: PriceAlert;
    iconBase64: string | null;
    logoBase64: string | null;
    isLoadingIcon: boolean;
    firstLetter: string;
    getAlertMessage: (alert: PriceAlert) => string;
    getAlertStatus: (alert: PriceAlert) => string;
}

const AlertItem: React.FC<AlertItemProps> = ({
    alert,
    iconBase64,
    logoBase64,
    isLoadingIcon,
    firstLetter,
    getAlertMessage,
    getAlertStatus
}) => {
    const [imageError, setImageError] = useState(false);

    // Determine what to show
    const hasIcon = iconBase64 && !imageError;
    const hasLogo = logoBase64 && !imageError && !hasIcon;
    const showFallback = !hasIcon && !hasLogo && !isLoadingIcon;

    return (
        <div className="flex items-center gap-2 p-2 rounded-lg duration-300 transition-all cursor-default hover:bg-white/5">
            {/* Icon/Logo/Letter Display */}
            <div className="w-10 h-10 border rounded-full flex items-center justify-center bg-white/5 overflow-hidden flex-shrink-0">
                {isLoadingIcon ? (
                    <div className="w-full h-full bg-gray-700/50 animate-pulse rounded-full" />
                ) : hasIcon ? (
                    <img
                        src={iconBase64}
                        alt={`${alert.ticker} icon`}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : hasLogo ? (
                    <img
                        src={logoBase64}
                        alt={`${alert.ticker} logo`}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : showFallback ? (
                    <span className="text-lg font-semibold text-white">
                        {firstLetter}
                    </span>
                ) : null}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug text-gray-300">
                    {getAlertMessage(alert)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${getAlertStatus(alert) === 'Active'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                        {getAlertStatus(alert)}
                    </span>
                    <span className="text-xs text-gray-500">
                        {alert.asset_class || 'Stock'}
                    </span>
                    {alert.is_recurring && (
                        <span className="text-xs text-blue-400">Recurring</span>
                    )}
                </div>
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
    useSetTopbar('default');
    const navigate = useNavigate();
    // const { handleApiError } = useApiErrorHandler();
    const { user } = useAuthStore();
    console.log("Data of user from Dashboard", user)
    const { data: alertsData, isLoading: alertsLoading } = useAlerts();
    const { data: watchlistData, isLoading: watchlistLoading } = useWatchlist();
    // console.log("alertsData", alertsData)
    const watchlistItems = watchlistData?.data.items || [];
    const recentWatchlist = watchlistItems.slice(0, 7);


    // NEW: Fetch ticker details including icons/logos for all recent watchlist items
    const tickers = useMemo(() => {
        return recentWatchlist.map(item => item.ticker);
    }, [recentWatchlist]);

    const tickerDataList = useTickerDetailsMultiple(tickers);

    // NEW: Create a map of ticker data by ticker for easy lookup
    const tickerDataByTicker = useMemo(() => {
        const map: { [ticker: string]: any } = {};
        tickerDataList.forEach(data => {
            map[data.ticker] = data;
        });
        return map;
    }, [tickerDataList]);

    // Fetch stock news
    const {
        data: stockNewsData,
        isLoading: stockNewsLoading,
        error: stockNewsError,
    } = useStockNewsByTicker('TSLA,AAPL,GOOGL,MSFT', 8, 1);

    const {
        data: cryptoNewsData,
        isLoading: cryptoNewsLoading,
        error: cryptoNewsError,
    } = useCryptoNewsByTicker('BTC,ETH', 4, 1);

    // useEffect(() => {
    //     if (stockNewsError) {
    //         handleApiError(stockNewsError);
    //     }
    // }, [stockNewsError]);

    // useEffect(() => {
    //     if (cryptoNewsError) {
    //         handleApiError(cryptoNewsError);
    //     }
    // }, [cryptoNewsError]);

    const realNewsData = [
        ...(stockNewsData?.data?.payload?.data || []).slice(0, 6).map((news: any, index: number) => ({
            id: `stock-${index}`,
            title: news.title,
            description: news.text,
            image_url: news.image_url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
            source_name: news.source_name,
            date: news.date,
            sentiment: news.sentiment,
            news_url: news.news_url,
            type: 'stock',
            tickers: news.tickers,
        })),
        ...(cryptoNewsData?.data?.payload?.data || []).slice(0, 2).map((news: any, index: number) => ({
            id: `crypto-${index}`,
            title: news.title,
            description: news.text,
            image_url: news.image_url || FALLBACK_IMAGES[(index + 3) % FALLBACK_IMAGES.length],
            source_name: news.source_name,
            date: news.date,
            sentiment: news.sentiment,
            news_url: news.news_url,
            type: 'crypto',
            tickers: news.tickers,
        })),
    ];

    const newsData = realNewsData.length > 0 ? realNewsData : [
        {
            id: '1',
            title: "Oracle CEO Says 'Of Course' OpenAI Can Handle $60B",
            description: "Oracle CEO remains confident in OpenAI's capabilities",
            image_url: Oracle,
            source_name: "Tech News",
            date: new Date().toISOString(),
            news_url: "https://www.example.com/news/1"
        },
        {
            id: '2',
            title: "Microsoft Invests Further in OpenAI Amidst Market Expansion",
            description: "Microsoft continues its investment in AI technology",
            image_url: MicrosoftInvestment,
            source_name: "Business Insider",
            date: new Date().toISOString(),
            news_url: "https://www.example.com/news/2"
        },
        {
            id: '3',
            title: "Google's AI Innovations Challenge Traditional Search",
            description: "Google introduces new AI features in search",
            image_url: GoogleAiMan,
            source_name: "TechCrunch",
            date: new Date().toISOString(),
            news_url: "https://www.example.com/news/3"
        },
        {
            id: '4',
            title: "Amazon Introduces AI-Powered Tools for E-Commerce",
            description: "Amazon launches new AI features for sellers",
            image_url: AmazonIntroMan,
            source_name: "Reuters",
            date: new Date().toISOString(),
            news_url: "https://www.example.com/news/4"
        },
        {
            id: '5',
            title: "Apple's New AI Features Enhance User Privacy and Control",
            description: "Apple focuses on privacy in AI implementation",
            image_url: AppleMan,
            source_name: "Apple News",
            date: new Date().toISOString(),
            news_url: "https://www.example.com/news/5"
        },
    ];

    const handleNewsClick = (newsUrl: string) => {
        window.open(newsUrl, '_blank', 'noopener,noreferrer');
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Recent';
        }
    };

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment?.toLowerCase()) {
            case 'positive': return 'text-green-400';
            case 'negative': return 'text-red-400';
            case 'neutral': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    const isLoading = stockNewsLoading || cryptoNewsLoading || alertsLoading;
    const hasError = stockNewsError || cryptoNewsError;

    const { data: predictionLogs } = useListPredictions();

    const getLatestPrediction = () => {
        if (!predictionLogs?.data || predictionLogs.data.length === 0) {
            return null;
        }

        const sortedPredictions = [...predictionLogs.data].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const latestPrediction = sortedPredictions[0];

        try {
            const predictionData = JSON.parse(latestPrediction.predictionJson);
            const ticker = predictionData.ticker || 'Unknown';
            const sentimentData = predictionData.sentimentData;

            const timeHorizonKeys = ['1_day', '1_week', '1_month', 'long_term'];
            let prediction = null;
            let foundKey = null;

            for (const key of timeHorizonKeys) {
                if (predictionData[key] && typeof predictionData[key] === 'object') {
                    prediction = predictionData[key];
                    foundKey = key;
                    break;
                }
            }

            if (!prediction) {
                if (predictionData.predicted_price !== undefined) {
                    prediction = {
                        predicted_price: predictionData.predicted_price,
                        predicted_price_lower: predictionData.predicted_price_lower,
                        predicted_price_upper: predictionData.predicted_price_upper,
                        trend: predictionData.trend,
                        risk_level: predictionData.risk_level,
                        confidence_interval_size_pct: predictionData.confidence_interval_size_pct
                    };
                } else {
                    if (sentimentData && ticker !== 'Unknown') {
                        return {
                            predictionId: latestPrediction.id,
                            ticker: ticker,
                            prediction: null,
                            sentimentData: sentimentData,
                            createdAt: latestPrediction.createdAt,
                            hasPrediction: false
                        };
                    }
                    return null;
                }
            }

            if (prediction && prediction.predicted_price === undefined) {
                console.warn("⚠️ Prediction object exists but missing predicted_price");
                return null;
            }

            const result = {
                predictionId: latestPrediction.id,
                ticker: ticker,
                prediction: prediction,
                sentimentData: sentimentData,
                createdAt: latestPrediction.createdAt,
                hasPrediction: true,
                timeHorizon: foundKey
            };

            return result;

        } catch (error) {
            console.error('❌ Error parsing latest prediction:', error);
            return null;
        }
    };

    const latestPrediction = getLatestPrediction();

    const alertTickers = useMemo(() => {
        return (alertsData?.data?.items || []).map(alert => alert.ticker);
    }, [alertsData]);

    const alertTickerDataList = useTickerDetailsMultiple(alertTickers);

    // Create a map of ticker data by ticker for alerts
    const alertTickerDataByTicker = useMemo(() => {
        const map: { [ticker: string]: any } = {};
        alertTickerDataList.forEach(data => {
            map[data.ticker] = data;
        });
        return map;
    }, [alertTickerDataList]);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-26 xl:grid-cols-12 gap-6 w-full overflow-x-hidden">
            {/* Left Section */}
            <div className="w-full lg:col-span-16 xl:col-span-9 space-y-6">
                <div className="">
                    <ChatSystem />
                </div>

                {/* Bottom Row */}
                <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Recent in Watchlist - UPDATED WITH INFINITE CAROUSEL */}
                    <div className="w-full xl:col-span-8 rounded-2xl border pl-6 relative overflow-hidden bg-[#06040C] z-10">
                        {/* Desktop Version with INFINITE LOOP */}
                        <div className="hidden lg:block">
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                }}
                                className="w-full"
                            >
                                <div className="w-full flex justify-between items-center mt-3 mb-1 pr-6">
                                    <p className="text-lg font-medium text-gray-300 pt-1">Recent in watchlist</p>
                                    <div className="relative hidden min-[390px]:flex gap-2 items-center">
                                        {recentWatchlist.length >= 1 &&
                                            <button
                                                className="p-1.5 cursor-pointer bg-white text-gray-800 rounded-full ml-14 border border-transparent hover:bg-transparent hover:border-white hover:text-white transition-all duration-300"
                                                onClick={() => {
                                                    navigate("/dashboard/watchlist");
                                                    window.scrollTo(0, 0);
                                                }}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        }
                                        {/* {recentWatchlist.length >= 1 && */}
                                        <>
                                            <CarouselPrevious className="absolute hidden cursor-pointer right-0 top-1/2 -translate-y-1/2 z-20 size-6 md:size-8 border hover:border-white/50">
                                                <ChevronLeft className="h-4 w-4" />
                                            </CarouselPrevious>
                                            <CarouselNext className="absolute hidden cursor-pointer right-2 top-1/2 -translate-y-1/2 z-20 size-6 md:size-8 border hover:border-white/50 mr-10">
                                                <MoveRightIcon className="h-4 w-4" />
                                            </CarouselNext>
                                        </>
                                        {/* } */}
                                    </div>
                                </div>

                                <div className="relative">
                                    <CarouselContent className="-ml-2 -mr-14 py-3 min-h-40">
                                        {watchlistLoading ? (
                                            Array.from({ length: 5 }).map((_, index) => (
                                                <CarouselItem key={index} className="pl-2 basis-1/2 md:basis-1/3 lg:basis-1/4 2xl:basis-1/5">
                                                    <div className="min-w-[120px] rounded-xl p-3 text-center glass space-y-1 pt-5 cursor-default animate-pulse">
                                                        <div className="w-10 h-10 rounded-full bg-gray-700 mx-auto mb-4"></div>
                                                        <div className="h-6 bg-gray-700 rounded mx-auto w-16"></div>
                                                        <div className="h-4 bg-gray-700 rounded mx-auto w-12 mt-2"></div>
                                                        <div className="h-4 bg-gray-700 rounded mx-auto w-16"></div>
                                                    </div>
                                                </CarouselItem>
                                            ))
                                        ) : recentWatchlist.length === 0 ? (
                                            <CarouselItem className="">
                                                <div className="mt-4 text-center w-full flex items-center justify-center flex-col pr-10">
                                                    <p className="text-base text-gray-400 mb-2">Nothing to show in Watchlist</p>
                                                    <button
                                                        onClick={() => navigate("/dashboard/watchlist")}
                                                        className="px-4 py-2 special-btn text-sm font-medium flex items-center justify-center gap-1 hover:scale-110 transition-all duration-200"
                                                    >
                                                        Create Your Watchlist
                                                        <ChevronRight className='w-5 h-5' />
                                                    </button>
                                                </div>
                                            </CarouselItem>
                                        ) : (
                                            // Real watchlist data with icons/logos
                                            recentWatchlist.map((item) => {
                                                const firstLetter = item.ticker.charAt(0).toUpperCase();
                                                const tickerData = tickerDataByTicker[item.ticker];
                                                const iconBase64 = tickerData?.icon?.data;
                                                const logoBase64 = tickerData?.logo?.data;
                                                const isLoadingIcon = tickerData?.icon?.isLoading || tickerData?.logo?.isLoading;

                                                return (
                                                    <WatchlistCarouselItem
                                                        key={item.id}
                                                        item={item}
                                                        iconBase64={iconBase64}
                                                        logoBase64={logoBase64}
                                                        isLoadingIcon={isLoadingIcon}
                                                        firstLetter={firstLetter}
                                                        tickerData={tickerData}
                                                    />
                                                );
                                            })
                                        )}
                                    </CarouselContent>
                                </div>
                            </Carousel>
                        </div>

                        {/* Mobile Version with Pagination */}
                        <div className="block lg:hidden overflow-visible">
                            <MobileWatchlistCarousel
                                items={recentWatchlist}
                                tickerDataByTicker={tickerDataByTicker}
                                isLoading={watchlistLoading}
                                navigate={navigate}
                            />
                        </div>

                        <div className="">
                            <div className="ai-strategy-shade-green -top-76 -right-[350px] sm:block hidden z-20"></div>
                        </div>
                    </div>

                    {/* Last Price Prediction */}
                    <div className="w-full xl:col-span-4 rounded-3xl backdrop-blur-2xl border border-slate-700/50 p-4 flex items-start flex-col py-6">
                        <div className="flex justify-between items-center mb-4 w-full">
                            <p className="text-lg font-medium text-gray-300">Last price prediction</p>
                            <span
                                className="cursor-pointer"
                                onClick={() => navigate("/dashboard/predictions")}
                            >
                                <img src={arrowUp} alt="arrow" className="w-3 h-3 sm:ml-3 ml-1" />
                            </span>
                        </div>

                        {!latestPrediction ? (
                            <div className="mt-8 text-center w-full flex items-center justify-center flex-col">
                                <p className="text-base text-gray-400 mb-2">No predictions yet</p>
                                <button
                                    onClick={() => navigate("/dashboard/predictions")}
                                    className="px-4 py-2 special-btn text-sm font-medium flex items-center justify-center gap-1 hover:scale-110 transition-all duration-200"
                                >
                                    Predict Now
                                    <ChevronRight className='w-5 h-5' />
                                </button>
                            </div>
                        ) : !latestPrediction.hasPrediction ? (
                            <div className=" w-full">
                                <p className="text-base text-gray-400 mb-1">{latestPrediction.ticker}</p>
                                {latestPrediction.sentimentData?.total?.[latestPrediction.ticker] && (
                                    <div className="mt-2 relative">
                                        <p className="text-5xl font-medium text-gray-300 mb-2">$237</p>
                                        <p className="text-sm text-gray-400 absolute top-0 left-32">
                                            {Math.round(latestPrediction.sentimentData.total[latestPrediction.ticker]["Sentiment Score"] * 100)}%
                                        </p>
                                        <p className='mb-2 '>Pricted by EOD</p>
                                        <div className="flex items-center gap-4 text-xs">
                                            <p>Latest:</p>
                                            <span className="text-green-400">
                                                ↑ {latestPrediction.sentimentData.total[latestPrediction.ticker]["Total Positive"]}
                                            </span>
                                            <span className="text-yellow-400">
                                                → {latestPrediction.sentimentData.total[latestPrediction.ticker]["Total Neutral"]}
                                            </span>
                                            <span className="text-red-400">
                                                ↓ {latestPrediction.sentimentData.total[latestPrediction.ticker]["Total Negative"]}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="mt-6 w-full">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-base text-gray-400">{latestPrediction.ticker}</p>
                                    {(latestPrediction as any).timeHorizon && (
                                        <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-400">
                                            {(latestPrediction as any).timeHorizon.replace('_', ' ')}
                                        </span>
                                    )}
                                </div>

                                <p className={`text-4xl font-semibold ${latestPrediction.prediction?.trend === 'Bullish' ? 'text-green-400' :
                                    latestPrediction.prediction?.trend === 'Bearish' ? 'text-red-400' :
                                        'text-yellow-400'
                                    }`}>
                                    ${latestPrediction.prediction?.predicted_price?.toFixed(2) || 'N/A'}
                                    <span className={`text-sm ${latestPrediction.prediction?.trend === 'Bullish' ? 'text-green-400' :
                                        latestPrediction.prediction?.trend === 'Bearish' ? 'text-red-400' :
                                            'text-yellow-400'
                                        }`}>
                                        {latestPrediction.prediction?.trend === 'Bullish' ? ' ↗' :
                                            latestPrediction.prediction?.trend === 'Bearish' ? ' ↘' : ' →'}
                                    </span>
                                </p>

                                <p className="text-sm text-gray-400 mt-4">
                                    Predicted range:{" "}
                                    <span className="text-gray-300">
                                        ${latestPrediction.prediction?.predicted_price_lower?.toFixed(2) || 'N/A'} - ${latestPrediction.prediction?.predicted_price_upper?.toFixed(2) || 'N/A'}
                                    </span>
                                </p>

                                <div className="mt-3 flex items-center gap-2 flex-wrap">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${latestPrediction.prediction?.trend === 'Bullish'
                                        ? 'bg-green-900/40 text-green-400 border border-green-700' :
                                        latestPrediction.prediction?.trend === 'Bearish'
                                            ? 'bg-red-900/40 text-red-400 border border-red-700' :
                                            'bg-yellow-900/40 text-yellow-400 border border-yellow-700'
                                        }`}>
                                        {latestPrediction.prediction?.trend || 'Neutral'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {latestPrediction.prediction?.risk_level || 'Medium'} risk
                                    </span>
                                </div>

                                {latestPrediction.sentimentData?.total?.[latestPrediction.ticker] && (
                                    <div className="mt-3 p-3 bg-white/5 rounded-lg">
                                        <p className="text-xs font-medium text-gray-300 mb-2">
                                            Sentiment: {Math.round(latestPrediction.sentimentData.total[latestPrediction.ticker]["Sentiment Score"] * 100)}%
                                        </p>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="text-green-400">
                                                ↑ {latestPrediction.sentimentData.total[latestPrediction.ticker]["Total Positive"]}
                                            </span>
                                            <span className="text-yellow-400">
                                                → {latestPrediction.sentimentData.total[latestPrediction.ticker]["Total Neutral"]}
                                            </span>
                                            <span className="text-red-400">
                                                ↓ {latestPrediction.sentimentData.total[latestPrediction.ticker]["Total Negative"]}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 mt-4">
                                    Updated: {new Date(latestPrediction.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:col-span-10 xl:col-span-3 space-y-6">
                {/* Recent Alerts */}
                <div className="rounded-2xl border backdrop-blur-2xl p-4 relative h-[380px] flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-base text-gray-300 font-semibold flex items-center gap-2">
                            Recent alerts
                        </p>
                    </div>

                    <div className="scrollbar-hide space-y-1 overflow-y-auto pr-2 flex-1">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 rounded-lg">
                                    <div className="rounded-full h-10 w-10 border bg-gray-700/50 animate-pulse flex-shrink-0" />
                                    <div className="flex-1 space-y-1">
                                        <div className="h-4 bg-gray-700/50 rounded animate-pulse" />
                                        <div className="h-3 bg-gray-700/30 rounded animate-pulse w-3/4" />
                                    </div>
                                </div>
                            ))
                        ) : alertsData?.data?.items && alertsData.data.items.length > 0 ? (
                            alertsData.data.items.map((alert: PriceAlert) => {
                                const getAlertMessage = (alert: PriceAlert) => {
                                    const currentPrice = alert.current_price?.toFixed(2) || 'N/A';
                                    const targetPrice = alert.target_price?.toFixed(2) || 'N/A';

                                    if (alert.direction === 'BELOW') {
                                        return `${alert.ticker} is currently at ${currentPrice}. Alert when price drops below ${targetPrice}`;
                                    } else {
                                        return `${alert.ticker} is currently at ${currentPrice}. Alert when price rises above ${targetPrice}`;
                                    }
                                };

                                const getAlertStatus = (alert: PriceAlert) => {
                                    if (alert.outstanding || alert.is_outstanding) {
                                        return 'Active';
                                    }
                                    return 'Inactive';
                                };

                                // Get ticker data for this alert
                                const tickerData = alertTickerDataByTicker[alert.ticker];
                                const iconBase64 = tickerData?.icon?.data;
                                const logoBase64 = tickerData?.logo?.data;
                                const isLoadingIcon = tickerData?.icon?.isLoading || tickerData?.logo?.isLoading;
                                const firstLetter = alert.ticker.charAt(0).toUpperCase();

                                return (
                                    <AlertItem
                                        key={alert.id}
                                        alert={alert}
                                        iconBase64={iconBase64}
                                        logoBase64={logoBase64}
                                        isLoadingIcon={isLoadingIcon}
                                        firstLetter={firstLetter}
                                        getAlertMessage={getAlertMessage}
                                        getAlertStatus={getAlertStatus}
                                    />
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-12 h-12 rounded-full glass flex items-center justify-center mb-4">
                                    <Plus className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="text-base font-semibold text-gray-300 mb-2">No alerts yet</div>
                                <p className="text-sm text-gray-400 mb-4 max-w-[200px]">
                                    Set up price alerts to get notified about market movements
                                </p>
                                <Button
                                    onClick={() => navigate("/dashboard/watchlist")}
                                    className="special-btn !py-2 !px-4 font-medium text-xs hover:scale-110 transition-all duration-200"
                                >
                                    Set Up Alerts
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-t from-[#0D0A18]/90 via-[#0D0A18]/40 to-transparent rounded-b-2xl" />
                </div>

                {/* Recent News */}
                <div className="rounded-2xl border p-4 relative h-[470px] flex flex-col backdrop-blur-2xl">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-base text-gray-300 font-semibold flex items-center gap-2">
                            Recent news
                            {isLoading && (
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                            )}
                        </p>
                        <span
                            className="cursor-pointer py-2 pr-2"
                            onClick={() => navigate('/dashboard/news')}
                        >
                            <img src={arrowUp} alt="arrow" className="w-2 h-2 sm:ml-3 ml-1" />
                        </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-hide">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-start gap-3 p-2 rounded-lg">
                                    <div className="rounded-lg h-12 w-16 bg-gray-700/50 animate-pulse flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-700/50 rounded animate-pulse" />
                                        <div className="h-3 bg-gray-700/30 rounded animate-pulse w-3/4" />
                                    </div>
                                </div>
                            ))
                        ) : hasError ? (
                            newsData.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleNewsClick(item.news_url)}
                                    className="flex items-start gap-3 hover:bg-white/5 p-2 rounded-lg duration-300 transition-all cursor-pointer group"
                                >
                                    <img
                                        src={item.image_url}
                                        alt="news"
                                        className="rounded-lg h-12 w-16 border border-slate-700/60 object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-300 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                                            {item.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                            <Calendar size={12} />
                                            <span>{formatDate(item.date)}</span>
                                            <span>•</span>
                                            <span className="truncate">{item.source_name}</span>
                                        </div>
                                    </div>
                                    <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                                </div>
                            ))
                        ) : (
                            realNewsData.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleNewsClick(item.news_url)}
                                    className="flex items-start gap-3 hover:bg-white/5 p-2 rounded-lg duration-300 transition-all cursor-pointer group"
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={item.image_url}
                                            alt="news"
                                            className="rounded-lg h-12 w-16 border border-slate-700/60 object-cover"
                                        />
                                        {item.sentiment && (
                                            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-[#0D0A18] ${getSentimentColor(item.sentiment).replace('text-', 'bg-')}`} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-300 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                                            {item.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                            <Calendar size={12} />
                                            <span>{formatDate(item.date)}</span>
                                            <span>•</span>
                                            <span className="truncate">{item.source_name}</span>
                                        </div>
                                        {item.tickers && item.tickers.length > 0 && (
                                            <div className="flex items-center gap-1 mt-1">
                                                {item.tickers.slice(0, 2).map((ticker: string, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className="px-1 py-0.5 text-xs bg-white/10 rounded text-gray-400"
                                                    >
                                                        {ticker}
                                                    </span>
                                                ))}
                                                {item.tickers.length > 2 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{item.tickers.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                                </div>
                            ))
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-16 pointer-events-none bg-gradient-to-t from-[#0D0A18]/90 via-[#0D0A18]/40 to-transparent rounded-b-2xl" />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;