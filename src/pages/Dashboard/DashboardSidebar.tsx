import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useLogout } from "@/api/hooks/Auth/useAuth";
import { toast } from "sonner";
import Logo from "../../assets/Home/logo.png";
import dashboard from "../../assets/Dashboard/dashboardIcon/dashboard.svg"
import bookmark from "../../assets/Dashboard/dashboardIcon/bookmark.svg"
import financialGpt from "../../assets/Dashboard/dashboardIcon/financialGpt.svg"
import predictions from "../../assets/Dashboard/dashboardIcon/predictions.svg"
import charts from "../../assets/Dashboard/dashboardIcon/charts.svg"
import news from "../../assets/Dashboard/dashboardIcon/news.svg"
import journal from "../../assets/Dashboard/dashboardIcon/journal.svg"
import support from "../../assets/Dashboard/dashboardIcon/support.svg"

interface DashboardSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
    sidebarOpen,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { mutate: logout, isPending } = useLogout();

    // Top 7 items
    const mainMenu = [
        { path: "/dashboard", icon: dashboard, label: "Dashboard" },
        { path: "/dashboard/financial-gpt", icon: financialGpt, label: "Financial GPT" },
        { path: "/dashboard/watchlist", icon: bookmark, label: "Watchlist" },
        { path: "/dashboard/predictions", icon: predictions, label: "Predictions" },
        { path: "/dashboard/charts", icon: charts, label: "Charts" },
        { path: "/dashboard/news", icon: news, label: "News" },
        { path: "/dashboard/journal", icon: journal, label: "Journal" },
    ];

    // Bottom 3 items
    const bottomMenu = [
        { path: "/dashboard/account-settings", icon: dashboard, label: "Settings" },
        { path: "/dashboard/account-settings?tab=support", icon: support, label: "Support" },
    ];

    const isActive = (path: string) => {
        const [pathname, search] = path.split('?');

        if (location.pathname !== pathname) return false;

        if (search) {
            return location.search.includes('tab=support');
        }

        return !location.search.includes('tab=support');
    };

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                toast.success("Logged out successfully!");
            },
            onError: (error: any) => {
                toast.error(error?.message || "Logout failed. Please try again.");
            }
        });
    };

    const renderMenu = (items: any[]) =>
        items.map((item) => {
            const active = isActive(item.path);
            return (
                <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`relative cursor-pointer w-full flex items-center gap-3 pl-6 px-4 py-2 
                            transition-colors duration-500 
                            hover:bg-white/5 
                            ${active
                            ? "text-[#14E893] font-semibold"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    <img
                        src={item.icon}
                        alt={item.label}
                        className={`w-5 h-5 transition-all duration-300 ${active ? "filter-green" : "filter-gray-400"
                            }`}
                    />

                    {sidebarOpen && <span>{item.label}</span>}
                    {active && (
                        <span className="absolute right-0 top-1/4 bottom-1/4 w-[3px] rounded-tl-full rounded-bl-full bg-[#14E893]"></span>
                    )}
                </button>
            );
        });

    return (
        <div
            className={`${sidebarOpen ? "w-64" : "w-20"
                } glass transition-all duration-300 flex flex-col justify-between border !border-l-transparent  rounded-tr-3xl rounded-br-3xl !rounded-tl-none !rounded-bl-none h-full pt-3`}
            style={{
                background: 'rgba(20, 20, 20, 0.30)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
            {/* Top Section */}
            <div>
                <div className="flex items-center gap-2 p-4">
                    <img src={Logo} alt="TechTren" className="w-36" />
                </div>

                {/* Main Navigation - 7 items */}
                <div className="mt-6 space-y-2">{renderMenu(mainMenu)}</div>
            </div>

            {/* Bottom Section - 3 items (Settings, Support, Logout) */}
            <div className="mb-4">
                <div className="space-y-2">{renderMenu(bottomMenu)}</div>

                <div className="pl-2 mt-2 group">
                    <button
                        onClick={handleLogout}
                        disabled={isPending}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-white group-hover:text-[#14E893] group-hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed opacity-40 group-hover:opacity-100 transition-all duration-300"
                    >
                        <LogOut size={18} className="text-[#14E893]" />
                        {sidebarOpen && <span>{isPending ? "Logging out..." : "Logout"}</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardSidebar;