import { useSetTopbar } from "@/api/hooks/TopbarContext";
import bellIconActive from "../../../assets/watchlist/bell-ringing-04.svg"
import bellIconNonActive from "../../../assets/watchlist/bell-ringing-03.svg"
import Cut from "../../../assets/watchlist/x-close.png"
import {
  useWatchlist,
  useRemoveFromWatchlist,
  useCreatePriceAlert,
  useDeletePriceAlert
} from "@/api/hooks/watchlist/useWatchlist";
import { useWatchlistAlerts } from "@/api/hooks/watchlist/useWatchlist";
import { useTickerDetailsMultiple } from "@/api/hooks/watchlist/useTickerDetails";
import type { WatchlistItem, PriceAlert } from "@/types/watchlist";
import { toast } from "sonner";
import { useMemo, useState } from "react";

const ShareIcon = ({ isActive }: { isActive?: boolean }) => (
  <img
    src={isActive ? bellIconActive : bellIconNonActive}
    alt="Share"
    width={20}
    height={20}
    className="h-5 w-5 object-contain transition-all duration-300"
  />
);

const CloseIcon = () => (
  <img
    src={Cut}
    alt="Remove"
    width={20}
    height={20}
    className="h-5 w-5 object-contain"
  />
);

let colorRed = '#FF0044'
let colorGreen = '#14E893'

interface StockCardProps {
  item: WatchlistItem;
  alert?: PriceAlert;
  tickerData?: {
    details: any;
    price: any;
    icon: any;
    logo: any;
  };
}

const StockCard = ({ item, alert, tickerData }: StockCardProps) => {
  const [isAlertActive, setIsAlertActive] = useState(!!alert);
  const [imageError, setImageError] = useState(false);

  const { mutate: removeFromWatchlist, isPending: isRemoving } = useRemoveFromWatchlist();
  const { mutate: createAlert } = useCreatePriceAlert();
  const { mutate: deleteAlert } = useDeletePriceAlert();

  // Extract data from Polygon API
  const details = tickerData?.details?.data;
  const priceData = tickerData?.price?.data;
  const iconBase64 = tickerData?.icon?.data;
  const logoBase64 = tickerData?.logo?.data;

  const isLoadingData = tickerData?.details?.isLoading || tickerData?.price?.isLoading;
  const hasError = tickerData?.details?.isError || tickerData?.price?.isError;

  // Calculate price and change
  const currentPrice = priceData?.c || 0;
  const openPrice = priceData?.o || 0;
  const priceChange = currentPrice - openPrice;
  const priceChangePercent = openPrice ? ((priceChange / openPrice) * 100) : 0;
  const isPositive = priceChangePercent >= 0;

  const formattedPrice = currentPrice ? `$${currentPrice.toFixed(2)}` : '$0.00';
  const formattedChange = `${isPositive ? '+' : ''}${priceChangePercent.toFixed(2)}%`;

  const companyName = details?.name || `${item.ticker} Company`;
  const description = details?.description;

  // Get the first letter of ticker for fallback
  const firstLetter = item.ticker.charAt(0).toUpperCase();

  // Determine what to show: icon, logo, or letter fallback
  const hasIcon = iconBase64 && !imageError;
  const hasLogo = logoBase64 && !imageError && !hasIcon;
  const showFallback = !hasIcon && !hasLogo && !tickerData?.icon?.isLoading && !tickerData?.logo?.isLoading && !isLoadingData;

  const toggleAlert = () => {
    if (isAlertActive && alert) {
      deleteAlert(alert.id, {
        onSuccess: () => {
          setIsAlertActive(false);
          toast.success("Alert removed successfully");
        },
        onError: (error) => {
          toast.error((error as any)?.message || "Failed to remove alert");
        }
      });
    } else {
      if (!currentPrice) {
        toast.error("Unable to create alert: Price data not available");
        return;
      }

      const alertData = {
        currentPrice: currentPrice,
        threshold: currentPrice * 0.95, // 5% below current
        direction: "BELOW" as const,
        delivery: ["email"],
        is_recurring: false,
        asset_class: "stocks"
      };

      createAlert({ ticker: item.ticker, alertData }, {
        onSuccess: () => {
          setIsAlertActive(true);
          toast.success("Alert created successfully");
        },
        onError: (error) => {
          toast.error((error as any)?.message || "Failed to create alert");
        }
      });
    }
  };

  const handleRemoveFromWatchlist = () => {
    removeFromWatchlist(item.ticker, {
      onSuccess: () => {
        toast.success(`${item.ticker} removed from watchlist`);
      },
      onError: (error) => {
        toast.error((error as any)?.message || `Failed to remove ${item.ticker}`);
      }
    });
  };

  // Truncate description for display
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "No recent updates available";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const displayDescription = truncateText(description || "", 80);
  const lastUpdated = item.updatedAt
    ? new Date(item.updatedAt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
    : new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="group glass h-full w-full rounded-2xl p-5 flex flex-col justify-between"
        style={{
          background: 'rgba(20, 20, 20, 0.30)',
        }}>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[32px] font-bold">{item.ticker}</p>

            {/* Display icon using base64 data URL */}
            {hasIcon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white/10">
                <img
                  src={iconBase64}
                  alt={`${item.ticker} Logo`}
                  className="h-full w-full object-cover rounded-full"
                  onError={() => setImageError(true)}
                />
              </div>
            )}

            {/* Display logo as fallback if icon not available */}
            {hasLogo && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white/10">
                <img
                  src={logoBase64}
                  alt={`${item.ticker} Logo`}
                  className="h-full w-full object-cover rounded-full"
                  onError={() => setImageError(true)}
                />
              </div>
            )}

            {/* Show loading spinner */}
            {(isLoadingData || tickerData?.icon?.isLoading || tickerData?.logo?.isLoading) && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-gray-700/50 animate-pulse"></div>
            )}

            {/* Show first letter as fallback */}
            {showFallback && (
              <div
                className="glass flex h-10 w-10 items-center justify-center rounded-full border font-bold text-lg">
                {firstLetter}
              </div>
            )}
          </div>

          {isLoadingData ? (
            <div className="mb-7 h-5 w-40 bg-gray-700/50 animate-pulse rounded"></div>
          ) : (
            <p className="mb-7 text-sm text-gray-400">{companyName}</p>
          )}

          {isLoadingData ? (
            <div className="mb-3 h-8 w-32 bg-gray-700/50 animate-pulse rounded"></div>
          ) : hasError ? (
            <div className="mb-3 text-sm text-red-400">Failed to load price</div>
          ) : (
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{formattedPrice}</span>
              <span
                className="text-sm font-medium"
                style={{
                  color: isPositive ? colorGreen : colorRed
                }}
              >
                {formattedChange}
              </span>
            </div>
          )}

          {/* DESCRIPTION + DATE */}
          <div className="mb-6 flex items-start gap-2">
            <div
              className="mt-1 p-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: isPositive ? colorGreen : colorRed }}
            />
            <div className="flex flex-col">
              {isLoadingData ? (
                <>
                  <div className="h-4 w-full bg-gray-700/50 animate-pulse rounded mb-2"></div>
                  <div className="h-3 w-32 bg-gray-700/50 animate-pulse rounded"></div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-300">{displayDescription}</p>
                  <p className="text-xs text-gray-400 mt-2">Updated on {lastUpdated}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Icons */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={toggleAlert}
          >
            <button
              aria-label="Alert"
              className={`rounded-full border p-2 transition-all duration-300 ${isAlertActive
                ? 'bg-[rgba(20,232,147,1)] border-[rgba(20,232,147,1)]'
                : 'text-gray-400 hover:border-white/30 hover:bg-white/5 hover:text-[#14E893]'
                }`}
              disabled={isRemoving || isLoadingData}
            >
              <ShareIcon isActive={isAlertActive} />
            </button>
            <p className="text-sm font-normal text-white leading-[18px]">
              {isAlertActive ? (
                <>Alert set on price<br /> variation</>
              ) : (
                <>Set alerts on<br />price variation</>
              )}
            </p>
          </div>

          <button
            aria-label="Remove"
            className="rounded-full cursor-pointer border p-2 text-gray-400 transition-all hover:border-white/30 hover:bg-white/5 duration-300 hover:text-red-500"
            onClick={handleRemoveFromWatchlist}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <CloseIcon />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Watchlist() {
  useSetTopbar('watchlist');

  const { data: watchlistData, isLoading, error } = useWatchlist();
  const { data: alertsData } = useWatchlistAlerts();

  // Get all tickers from watchlist
  const tickers = useMemo(() => {
    return watchlistData?.data.items.map(item => item.ticker) || [];
  }, [watchlistData]);

  // Fetch details for all tickers (now includes icon and logo)
  const tickerDataList = useTickerDetailsMultiple(tickers);

  // Create a map of alerts by ticker for easy lookup
  const alertsByTicker = useMemo(() => {
    const map: { [ticker: string]: PriceAlert } = {};
    alertsData?.data.items.forEach(alert => {
      map[alert.ticker] = alert;
    });
    return map;
  }, [alertsData]);

  // Create a map of ticker data by ticker
  const tickerDataByTicker = useMemo(() => {
    const map: { [ticker: string]: any } = {};
    tickerDataList.forEach(data => {
      map[data.ticker] = data;
    });
    return map;
  }, [tickerDataList]);

  if (isLoading) {
    return (
      <section className="flex justify-center items-center min-h-64">
        <div className="text-white">Loading watchlist...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex justify-center items-center min-h-64">
        <div className="text-red-500">Error loading watchlist</div>
      </section>
    );
  }

  const watchlistItems = watchlistData?.data.items || [];


  return (
    <section>
      {watchlistItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">Your watchlist is empty</p>
          <p className="text-gray-500">Use the search bar above to add stocks and cryptocurrencies to your watchlist</p>
        </div>
      ) : (
        <>
          <div className="mb-12 grid mt-16 sm:mt-0 gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] xl:grid-cols-4">
            <h1 className="text center text-lg mx-auto block sm:hidden">Watchlists</h1>
            {watchlistItems.map((item) => (
              <StockCard
                key={item.id}
                item={item}
                alert={alertsByTicker[item.ticker]}
                tickerData={tickerDataByTicker[item.ticker]}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}