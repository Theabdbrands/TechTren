// DashboardHeader.tsx - Update the notifications section
import { useTopbar } from "@/api/hooks/TopbarContext";
import { Bell, Search, CheckCheck, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/api/stores/auth-store";

import { useSearch } from "@/api/hooks/predictions/useSearch"
import { usePolygonProxyMutation } from "@/api/hooks/news/usePolygonProxy";
import type { SearchResult } from "@/types/prediction";
import { useAddToWatchlist } from "@/api/hooks/watchlist/useWatchlist";
import { toast } from "sonner";

// Add notifications hooks import
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useUnreadNotificationsCount } from "@/api/hooks/notifications/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

// Custom hook for watchlist search
const useWatchlistSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);

    const { data: searchResults, isLoading: isSearching } = useSearch(
        {
            searchTerm: searchQuery,
            cap: 8
        },
        { enabled: searchQuery.length >= 2 }
    );

    return {
        searchQuery,
        setSearchQuery,
        showResults,
        setShowResults,
        searchResults,
        isSearching
    };
}

// Custom hook for charts search
const useChartsSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);

    const { data: searchResults, isLoading: isSearching } = useSearch(
        {
            searchTerm: searchQuery,
            itemType: 'stock_ticker',
            cap: 8
        },
        { enabled: searchQuery.length >= 2 }
    );

    return {
        searchQuery,
        setSearchQuery,
        showResults,
        setShowResults,
        searchResults,
        isSearching
    };
}

interface DashboardHeaderProps {
    setChartData?: (data: any) => void;
    onNewsSearch?: (query: string) => void;
    onSearchActiveChange?: (active: boolean) => void;
}

const DashboardHeader = ({ setChartData, onNewsSearch, onSearchActiveChange }: DashboardHeaderProps) => {
    const { variant } = useTopbar();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // Separate search states for charts and watchlist
    const chartsSearch = useChartsSearch();
    const watchlistSearch = useWatchlistSearch();

    const [newsSearchQuery, setNewsSearchQuery] = useState("");
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);

    // Refs for click outside detection
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const chartsSearchRef = useRef<HTMLDivElement | null>(null);
    const watchlistSearchRef = useRef<HTMLDivElement | null>(null);

    const { mutateAsync: fetchChartData } = usePolygonProxyMutation();

    // Use notifications hooks
    const { data: notificationsData, isLoading: notificationsLoading } = useNotifications();
    const { mutate: markAsRead } = useMarkNotificationAsRead();
    const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();
    const { data: unreadCount } = useUnreadNotificationsCount();

    const { mutate: addToWatchlist, isPending: isAddingToWatchlist } = useAddToWatchlist();

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Close notification dropdown
            if (!dropdownRef.current?.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }

            // Close charts search dropdown
            if (!chartsSearchRef.current?.contains(event.target as Node)) {
                chartsSearch.setShowResults(false);
                setIsSearchActive(false);
                onSearchActiveChange?.(false);
            }

            // Close watchlist search dropdown
            if (!watchlistSearchRef.current?.contains(event.target as Node)) {
                watchlistSearch.setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onSearchActiveChange]);

    const handleChartsSearchResultClick = async (result: SearchResult) => {
        chartsSearch.setSearchQuery(result.desc);
        const symbol = result.id;

        try {
            let queryUrl = '';
            let assetClass: 'stocks' | 'crypto' = 'stocks';

            if (result.itemType === 'stock_ticker') {
                queryUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/2023-01-01/2025-12-31?adjusted=true`;
                assetClass = 'stocks';
            } else if (result.itemType === 'crypto_ticker') {
                queryUrl = `https://api.polygon.io/v2/aggs/ticker/X:${symbol}USD/range/1/day/2024-01-01/2025-01-31?adjusted=true`;
                assetClass = 'crypto';
            }

            const data = await fetchChartData({ queryUrl, assetClass });
            console.log("Clicked ticker data:", data);
            if (setChartData) {
                setChartData(data);
            }
        } catch (error: any) {
            console.error("Error fetching chart data:", error);
            if (error?.status === 403) {
                alert("API quota exceeded. Please try again later.");
            } else if (error?.status === 429) {
                alert("Rate limit exceeded. Please slow down your requests.");
            }
        }

        chartsSearch.setShowResults(false);
        setIsSearchActive(false);
        onSearchActiveChange?.(false);
    };

    const handleAddToWatchlist = (result: SearchResult) => {
        const ticker = result.id;

        addToWatchlist(ticker, {
            onSuccess: () => {
                toast.success(`${ticker} added to watchlist successfully!`);
                watchlistSearch.setSearchQuery('');
                watchlistSearch.setShowResults(false);
            },
            onError: (error: any) => {
                toast.error(error?.message || `Failed to add ${ticker} to watchlist`);
            }
        });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            // Handle news search enter key if needed
        }
    };

    const handleNewsSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setNewsSearchQuery(query);

        if (onNewsSearch) {
            onNewsSearch(query);
        }
    };

    const handleMarkAsRead = (notificationId: string) => {
        markAsRead(notificationId, {
            onSuccess: () => {
                console.log("Notification marked as read");
            },
            onError: (error) => {
                console.error("Failed to mark as read:", error);
            }
        });
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead(undefined, {
            onSuccess: () => {
                console.log("All notifications marked as read");
            },
            onError: (error) => {
                console.error("Failed to mark all as read:", error);
            }
        });
    };

    const notifications = notificationsData?.data || [];
    const displayNotifications = notifications.slice(0, 4);

    const renderLeftContent = () => {
        const [searchParams] = useSearchParams();
        const activeTab = searchParams.get('tab') || 'account';
        switch (variant) {
            case "default":
                return (
                    <div className="flex items-center gap-4">
                        <p className="text-lg font-semibold">Welcome again {user?.user_name}!</p>
                    </div>
                );

            case "charts":
                return (
                    <div className="flex items-center gap-10">
                        <p className="text-xl text-white font-semibold">Charts</p>
                        <div className="relative w-1/2" ref={chartsSearchRef}>
                            <div className="flex glass items-center gap-3 border rounded-full px-5 py-2 w-full"
                                style={{ background: "rgba(20, 20, 20, 0.30)" }}>
                                <input
                                    type="text"
                                    placeholder="Search stocks and cryptos"
                                    value={chartsSearch.searchQuery}
                                    onChange={(e) => chartsSearch.setSearchQuery(e.target.value)}
                                    onFocus={() => {
                                        chartsSearch.setShowResults(true);
                                        setIsSearchActive(true);
                                        onSearchActiveChange?.(true);
                                    }}
                                    className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                                    onKeyPress={handleKeyPress}
                                />
                                <Search size={18} className="text-gray-400" />
                            </div>

                            {/* Charts Search Results Dropdown */}
                            {chartsSearch.searchQuery.length >= 1 && chartsSearch.showResults && (
                                <div className="scrollbar-hide !bg-[#06040C] absolute top-full left-0 right-0 mt-2 glass !rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                    {chartsSearch.isSearching ? (
                                        <div className="p-4 text-center text-gray-400">Searching...</div>
                                    ) : chartsSearch.searchResults && chartsSearch.searchResults.data.length > 0 ? (
                                        chartsSearch.searchResults.data.map((result: SearchResult) => (
                                            <div
                                                key={`${result.itemType}-${result.id}`}
                                                className="p-3 hover:!bg-[#14E893] cursor-pointer border-b border-white/10 last:border-b-0 border-dashed transition-all duration-300 group"
                                                onClick={() => handleChartsSearchResultClick(result)}
                                            >
                                                <div className="font-semibold text-white group-hover:text-black transition-all duration-300">
                                                    {result.metadata?.name || result.desc}
                                                </div>
                                                <div className="text-sm text-gray-400 group-hover:text-gray-900 transition-all duration-300">
                                                    {result.id} • {result.itemType.replace('_', ' ')}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-400">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case "watchlist":
                return (
                    <div className="flex items-center gap-10">
                        <p className="text-xl text-white font-semibold">Watchlist</p>
                        <div className="relative w-1/2" ref={watchlistSearchRef}>
                            <div
                                className="flex glass items-center gap-3 border rounded-full px-5 py-2 w-full"
                                style={{ background: "rgba(20, 20, 20, 0.30)" }}
                            >
                                <input
                                    type="text"
                                    placeholder="Search stocks and cryptos"
                                    value={watchlistSearch.searchQuery}
                                    onChange={(e) => watchlistSearch.setSearchQuery(e.target.value)}
                                    onFocus={() => {
                                        watchlistSearch.setShowResults(true)
                                        setIsSearchActive(true);
                                        onSearchActiveChange?.(true);
                                    }}
                                    className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                                    disabled={isAddingToWatchlist}
                                    onKeyPress={handleKeyPress}
                                />
                                <Search size={18} className="text-gray-400" />
                                {isAddingToWatchlist && (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                )}
                            </div>

                            {/* Watchlist Search Results Dropdown */}
                            {watchlistSearch.searchQuery.length >= 1 && watchlistSearch.showResults && (
                                <div className="scrollbar-hide !bg-[#06040C] absolute top-full left-0 right-0 mt-2 glass !rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
                                // style={{
                                //     background: 'rgba(20, 20, 20, 0.95)',
                                //     border: '1px solid rgba(255, 255, 255, 0.1)',
                                //     backdropFilter: 'blur(10px)',
                                // }}
                                >
                                    {watchlistSearch.isSearching ? (
                                        <div className="p-4 text-center text-gray-400">Searching...</div>
                                    ) : watchlistSearch.searchResults && watchlistSearch.searchResults.data.length > 0 ? (
                                        watchlistSearch.searchResults.data.map((result: SearchResult) => (
                                            <div
                                                key={`${result.itemType}-${result.id}`}
                                                className="p-3 hover:!bg-[#14E893] cursor-pointer border-b border-white/10 last:border-b-0 border-dashed transition-all duration-300 group"
                                                onClick={() => handleAddToWatchlist(result)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-semibold text-white group-hover:text-black transition-all duration-300">
                                                            {result.metadata?.name || result.desc}
                                                        </div>
                                                        <div className="text-sm text-gray-400 group-hover:text-gray-900 transition-all duration-300">
                                                            {result.id} • {result.itemType.replace('_', ' ')}
                                                        </div>
                                                    </div>
                                                    <div className="p-1 border rounded-full mx-2 border-green-400 group-hover:border-gray-900">
                                                        <Plus className="w-3 h-3 text-green-400 group-hover:text-gray-900" />
                                                    </div>
                                                    {/* <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                                        Add to watchlist
                                                    </div> */}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-400">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case "news":
                return (
                    <div className="flex items-center gap-10">
                        <p className="text-xl text-white font-semibold">News</p>
                        <div className="relative w-1/2">
                            <div className="flex glass items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 w-full">
                                <Search className="text-white/50 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search news..."
                                    value={newsSearchQuery}
                                    onChange={handleNewsSearchChange}
                                    className="bg-transparent outline-none w-full text-white placeholder-white/50"
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                        </div>
                    </div>
                );

            case "journal":
                return (
                    <div className="flex items-center gap-10">
                        <p className="text-xl text-white font-semibold">Journals</p>
                    </div >
                );

            case "settings":
                return (
                    <div className="flex items-center gap-2 text-white">
                        <span>Settings / {" "}
                            <span className="capitalize" style={{ color: '#14E893' }}>
                                {activeTab}
                            </span>
                        </span>
                    </div>
                )

            default:
                return null;
        }
    };

    return (
        <div className="px-6 py-3 flex items-center justify-between" data-search-active={isSearchActive}>
            <div className="flex-1">{renderLeftContent()}</div>

            {/* Right content with notification dropdown */}
            <div className="flex items-center gap-4">
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="p-2 hover:bg-white/20 rounded-lg relative transition-colors cursor-pointer"
                    >
                        <Bell size={20} />
                        {(unreadCount as any) > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    <div
                        className={`z-10 absolute right-0 mt-2 w-96 !bg-[#06040C] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${isNotificationOpen
                            ? "opacity-100 translate-y-0 visible"
                            : "opacity-0 -translate-y-2 invisible"
                            }`}
                        style={{ background: "rgba(10, 10, 10, 0.95)" }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-semibold">Notifications</h3>
                                {notifications.length > 0 && (unreadCount as any) > 0 && (
                                    <Button
                                        onClick={handleMarkAllAsRead}
                                        variant="ghost"
                                        size="sm"
                                        disabled={isMarkingAll}
                                        className="text-white/70 hover:text-white text-xs h-7"
                                    >
                                        <CheckCheck className="w-3 h-3 mr-1" />
                                        {isMarkingAll ? "..." : "Mark all"}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto scrollbar-hide">
                            {notificationsLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="p-4 border-b border-white/10 animate-pulse">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : displayNotifications.length === 0 ? (
                                <div className="p-6 text-center">
                                    <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-white text-sm mb-1">No notifications</p>
                                    <p className="text-gray-400 text-xs">You're all caught up!</p>
                                </div>
                            ) : (
                                displayNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-500/5' : ''
                                            }`}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notification.isRead ? 'bg-gray-600' : 'bg-blue-500'
                                                }`}>
                                                <Bell className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-white text-sm font-medium leading-tight">
                                                        {notification.data.ticker} Alert
                                                    </p>
                                                    {!notification.isRead && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    )}
                                                </div>
                                                <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">
                                                    {notification.data.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-gray-500 text-xs">
                                                        {formatDistanceToNow(new Date(notification.createdAt))} ago
                                                    </span>
                                                    <span className="text-gray-500 text-xs">•</span>
                                                    <span className={`text-xs ${notification.data.direction === 'BELOW'
                                                        ? 'text-red-400'
                                                        : 'text-green-400'
                                                        }`}>
                                                        {notification.data.direction}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {/* {notifications.length > 4 && (
                            <div className="p-3 border-t border-white/10">
                                <button
                                    onClick={() => navigate("/dashboard/notification")}
                                    className="w-full text-center text-cyan-400 hover:text-cyan-300 text-sm font-medium py-2"
                                >
                                    View all notifications
                                </button>
                            </div>
                        )} */}
                    </div>
                </div>

                <div
                    onClick={() => navigate("/dashboard/account-settings")}
                    className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-bold text-white cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 overflow-hidden"
                    title="Go to Account Settings"
                >
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.user_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-lg">
                            {user?.user_name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;