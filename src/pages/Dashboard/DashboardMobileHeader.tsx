import { useState, useRef, useEffect } from "react";
import { X, Bell, CheckCheck, Search, Plus } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "@/api/hooks/Auth/useAuth";
import { toast } from "sonner";
import MenuIcon from "@/assets/Home/menu-02.svg";
import { useAuthStore } from "@/api/stores/auth-store";

// Import notifications hooks
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useUnreadNotificationsCount } from "@/api/hooks/notifications/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import noise from "../../assets/Home/noise.svg"

// Import search hooks and types
import { useSearch } from "@/api/hooks/predictions/useSearch"
import { usePolygonProxyMutation } from "@/api/hooks/news/usePolygonProxy";
import type { SearchResult } from "@/types/prediction";
import { useAddToWatchlist } from "@/api/hooks/watchlist/useWatchlist";

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

interface DashboardMobileHeaderProps {
    setChartData?: (data: any) => void;
    onNewsSearch?: (query: string) => void;
    onSearchActiveChange?: (active: boolean) => void;
}

export default function DashboardMobileHeader({ setChartData, onNewsSearch, onSearchActiveChange }: DashboardMobileHeaderProps) {
    const [open, setOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [currentVariant, setCurrentVariant] = useState("default");
    const [newsSearchQuery, setNewsSearchQuery] = useState("");

    const navigate = useNavigate();
    const location = useLocation(); // Add this hook
    const { mutate: logout, isPending } = useLogout();
    const { user } = useAuthStore();

    // Separate search states for charts and watchlist
    const chartsSearch = useChartsSearch();
    const watchlistSearch = useWatchlistSearch();

    const { mutateAsync: fetchChartData } = usePolygonProxyMutation();
    const { mutate: addToWatchlist, isPending: isAddingToWatchlist } = useAddToWatchlist();

    // Notifications hooks
    const { data: notificationsData, isLoading: notificationsLoading } = useNotifications();
    const { mutate: markAsRead } = useMarkNotificationAsRead();
    const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsAsRead();
    const { data: unreadCount } = useUnreadNotificationsCount();

    // Refs for click outside detection
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const chartsSearchRef = useRef<HTMLDivElement | null>(null);
    const watchlistSearchRef = useRef<HTMLDivElement | null>(null);
    const searchContainerRef = useRef<HTMLDivElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    // Determine current variant based on route - UPDATED VERSION
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/dashboard/charts')) setCurrentVariant('charts');
        else if (path.includes('/dashboard/watchlist')) setCurrentVariant('watchlist');
        else if (path.includes('/dashboard/news')) setCurrentVariant('news');
        else if (path.includes('/dashboard/journal')) setCurrentVariant('journal');
        else if (path.includes('/dashboard/predictions')) setCurrentVariant('predictions');
        else if (path.includes('/dashboard/account-settings')) setCurrentVariant('settings');
        else setCurrentVariant('default');

        // Reset search states when navigating
        setShowSearch(false);
        chartsSearch.setShowResults(false);
        watchlistSearch.setShowResults(false);
        onSearchActiveChange?.(false);
    }, [location.pathname]); // Watch for route changes

    // Auto-focus search input when search overlay opens
    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [showSearch]);

    // Close dropdown when clicking outside - FIXED VERSION
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Close notification dropdown
            if (!dropdownRef.current?.contains(target)) {
                setIsNotificationOpen(false);
            }

            // Close search overlay - only if clicking on the overlay background, not the content
            if (showSearch && searchContainerRef.current && !searchContainerRef.current.contains(target)) {
                setShowSearch(false);
                onSearchActiveChange?.(false);
            }

            // Close charts search dropdown - only if clicking outside both input and results
            if (chartsSearch.showResults && chartsSearchRef.current && !chartsSearchRef.current.contains(target)) {
                chartsSearch.setShowResults(false);
            }

            // Close watchlist search dropdown - only if clicking outside both input and results
            if (watchlistSearch.showResults && watchlistSearchRef.current && !watchlistSearchRef.current.contains(target)) {
                watchlistSearch.setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showSearch, chartsSearch.showResults, watchlistSearch.showResults, onSearchActiveChange]);

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
        setShowSearch(false);
        onSearchActiveChange?.(false);
        navigate('/dashboard/charts');
    };

    const handleAddToWatchlist = (result: SearchResult) => {
        const ticker = result.id;

        addToWatchlist(ticker, {
            onSuccess: () => {
                toast.success(`${ticker} added to watchlist successfully!`);
                watchlistSearch.setSearchQuery('');
                watchlistSearch.setShowResults(false);
                setShowSearch(false);
                onSearchActiveChange?.(false);
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

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                toast.success("Logged out successfully!");
                setOpen(false);
            },
            onError: (error: any) => {
                toast.error(error?.message || "Logout failed. Please try again.");
            }
        });
    };

    const handleLogoutClick = () => {
        setOpen(false);
        handleLogout();
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

    // Mobile Search Component
    const renderMobileSearch = () => {
        switch (currentVariant) {
            case "charts":
                return (
                    <div className="relative w-full" ref={chartsSearchRef}>
                        <div className="flex glass items-center gap-3 border rounded-full px-4 py-3 w-full"
                            style={{ background: "rgba(20, 20, 20, 0.30)" }}>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search stocks and cryptos"
                                value={chartsSearch.searchQuery}
                                onChange={(e) => chartsSearch.setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    chartsSearch.setShowResults(true);
                                }}
                                className="bg-transparent outline-none w-full text-white placeholder-gray-500 text-base"
                                onKeyPress={handleKeyPress}
                            />
                            <Search size={20} className="text-gray-400" />
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
                );

            case "watchlist":
                return (
                    <div className="relative w-full" ref={watchlistSearchRef}>
                        <div
                            className="flex glass items-center gap-3 border rounded-full px-4 py-3 w-full"
                            style={{ background: "rgba(20, 20, 20, 0.30)" }}
                        >
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search stocks and cryptos"
                                value={watchlistSearch.searchQuery}
                                onChange={(e) => watchlistSearch.setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    watchlistSearch.setShowResults(true);
                                }}
                                className="bg-transparent outline-none w-full text-white placeholder-gray-500 text-base"
                                disabled={isAddingToWatchlist}
                                onKeyPress={handleKeyPress}
                            />
                            <Search size={20} className="text-gray-400" />
                            {isAddingToWatchlist && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                        </div>

                        {/* Watchlist Search Results Dropdown */}
                        {watchlistSearch.searchQuery.length >= 1 && watchlistSearch.showResults && (
                            <div className="scrollbar-hide !bg-[#06040C] absolute top-full left-0 right-0 mt-2 glass !rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
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
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-400">No results found</div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case "news":
                return (
                    <div className="relative w-full">
                        <div className="flex glass items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-3 w-full">
                            <Search className="text-white/50 h-5 w-5" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search news..."
                                value={newsSearchQuery}
                                onChange={handleNewsSearchChange}
                                className="bg-transparent outline-none w-full text-white placeholder-white/50 text-base"
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const getPageTitle = () => {
        switch (currentVariant) {
            case "charts": return "Charts";
            case "watchlist": return "Watchlist";
            case "news": return "News";
            case "journal": return "Journals";
            case "predictions": return "Predictions";
            case "settings": return "Settings";
            default: return "Dashboard";
        }
    };

    const shouldShowSearch = ["charts", "watchlist", "news"].includes(currentVariant);

    return (
        <>
            {/* Mobile Top Navbar */}
            <header
                className="fixed top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl min-h-14 
        px-4 flex items-center justify-between rounded-full z-[100] mt-6 glass"
                style={{ background: "rgba(20, 20, 20, 0.30)" }}>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white z-[150]"
                    onClick={() => setOpen(true)}
                >
                    <img src={MenuIcon} alt="Menu" className="w-7 -scale-x-100" />
                </button>

                {/* Page Title or Logo */}
                <div className="flex-1 flex justify-center">
                    <h1 className="text-white font-semibold text-lg">{getPageTitle()}</h1>
                </div>

                {/* Search Button for relevant pages */}
                {shouldShowSearch && (
                    <button
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer mr-2"
                        onClick={() => setShowSearch(true)}
                    >
                        <Search size={20} className="text-white" />
                    </button>
                )}

                {/* Right content with notification and user avatar */}
                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className="p-2 hover:bg-white/20 rounded-lg relative transition-colors cursor-pointer"
                        >
                            <Bell size={20} className="text-white" />
                            {(unreadCount as any) > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        <div
                            className={`z-10 absolute right-0 mt-2 w-80 !bg-[#06040C] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${isNotificationOpen
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
                        </div>
                    </div>

                    {/* User Avatar */}
                    <div
                        onClick={() => {
                            navigate("/dashboard/account-settings");
                            setOpen(false);
                        }}
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
            </header>

            {/* Mobile Search Overlay */}
            {showSearch && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm z-[110] flex items-start justify-center pt-20 px-4"
                    onClick={(e) => {
                        // Only close if clicking the overlay background, not the content
                        if (e.target === e.currentTarget) {
                            setShowSearch(false);
                            onSearchActiveChange?.(false);
                        }
                    }}
                >
                    <div className="w-full max-w-md" ref={searchContainerRef}>
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                onClick={() => {
                                    setShowSearch(false);
                                    onSearchActiveChange?.(false);
                                }}
                                className="p-2 text-white"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-white text-lg font-semibold">Search {getPageTitle()}</h2>
                        </div>
                        {renderMobileSearch()}
                    </div>
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full min-h-screen w-full bg-[#06040C] p-6 
        transition-transform duration-500 z-[100]
        ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Close Button */}
                <button
                    className="absolute glass p-1 top-6 right-6 text-white"
                    onClick={() => setOpen(false)}
                >
                    <X size={26} />
                </button>

                {/* Sidebar Navigation */}
                <nav className="mt-16 flex flex-col space-y-5 text-white">
                    <SidebarLink to="/dashboard" label="Dashboard" setOpen={setOpen} />
                    <SidebarLink to="/dashboard/financial-gpt" label="Financial GPT" setOpen={setOpen} />
                    <SidebarLink to="/dashboard/watchlist" label="Watchlist" setOpen={setOpen} />
                    <SidebarLink to="/dashboard/predictions" label="Predictions" setOpen={setOpen} />
                    <SidebarLink to="/dashboard/charts" label="Charts" setOpen={setOpen} />
                    <SidebarLink to="/dashboard/news" label="News" setOpen={setOpen} />
                    <SidebarLink to="/dashboard/journal" label="Journal" setOpen={setOpen} />
                    <SidebarLink to="/dashboard/account-settings" label="Settings" setOpen={setOpen} />
                    <SidebarLink to="/dashboard/account-settings?tab=support" label="Support" setOpen={setOpen} />

                    {/* Logout Button */}
                    <button
                        onClick={handleLogoutClick}
                        disabled={isPending}
                        className="text-lg border-b border-white/10 pb-3 hover:text-gray-300 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Logging out..." : "Logout"}
                    </button>
                </nav>
                <div className="w-full h-full">
                    <img src={noise} alt="shade" className="absolute top-0 left-0 w-full h-full object-cover -z-50" />
                </div>

                <div className="purple-shadow bottom-10 left-20 w-1/2 h-[150px] !-z-20"></div>
                <div className="purple-shadow -top-10 left-20 w-1/2 h-[100px] !-z-10"></div>
            </aside>
        </>
    );
}

/* Simple Sidebar Link Component */
function SidebarLink({
    label,
    to,
    setOpen
}: {
    label: string;
    to: string;
    setOpen: (v: boolean) => void;
}) {
    return (
        <Link
            to={to}
            onClick={() => setOpen(false)}
            className="text-lg border-b border-white/10 pb-3 hover:text-gray-300"
        >
            {label}
        </Link>
    );
}