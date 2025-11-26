import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import singleBox from "../assets/Home/singlebox.png";
import { useAuthStore } from "@/api/stores/auth-store";

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [isProductsOpen]);

    const handleMobilePricingClick = () => {
        onClose();
        if (location.pathname === "/") {
            setTimeout(() => {
                const section = document.querySelector("#pricing");
                if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                }
            }, 300);
        } else {
            navigate("/#pricing");
            setTimeout(() => {
                const section = document.querySelector("#pricing");
                if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                }
            }, 800);
        }
    };

    const handleMobileProductLinkClick = (to: string) => {
        if (!isAuthenticated) {
            onClose();
            handleMobilePricingClick();
            return;
        }
        navigate(to);
        onClose();
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[90] ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <aside
                className={`fixed top-0 left-0 h-full w-full bg-black transition-transform duration-500 ease-in-out z-[95] flex flex-col pt-28 px-4 overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex-1">
                    <div className="border-b border-white/10">
                        <button
                            onClick={() => setIsProductsOpen(!isProductsOpen)}
                            className="flex w-full items-center justify-between py-4 text-white text-lg hover:text-gray-300 transition-all duration-200"
                        >
                            <span>Products</span>
                            <ChevronDown
                                className={`w-5 h-5 transition-all duration-500 ease-out ${isProductsOpen ? "rotate-180" : "rotate-0"
                                    }`}
                            />
                        </button>

                        <div
                            className="overflow-hidden transition-all duration-500 ease-out"
                            style={{
                                maxHeight: isProductsOpen ? `${contentHeight}px` : "0px",
                                opacity: isProductsOpen ? 1 : 0,
                            }}
                        >
                            <div ref={contentRef} className="pb-4">
                                <div className="flex flex-col gap-2 ml-4">
                                    {/* Features Section */}
                                    <div className="mb-3">
                                        <div className="flex items-center gap-2 mb-2 text-gray-400">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                                <rect x="14" y="14" width="7" height="7" rx="1" />
                                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                            </svg>
                                            <span className="text-xs font-semibold uppercase tracking-wider">
                                                Features
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 ml-2">
                                            {[
                                                "Financial GPT",
                                                "Price Prediction",
                                                "Tax GPT",
                                                "Threads",
                                                "Watchlist",
                                                "Real-time news",
                                            ].map((label, index) => (
                                                <SidebarSubLink
                                                    key={label}
                                                    to="/dashboard"
                                                    onClose={() => handleMobileProductLinkClick("/dashboard")}
                                                    label={label}
                                                    index={index}
                                                    isOpen={isProductsOpen}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Trading & AI Tools */}
                                    <div className="flex flex-col gap-1 ml-2">
                                        {[
                                            "Trading Strategies",
                                            "AI Stock Picker",
                                            "SwingTrading signal",
                                            "Trading Signal",
                                            "Crypto Radar",
                                            "AI Alert",
                                            "AI Screener",
                                            "Congress Trade Monitoring",
                                            "Crypto Spotlight",
                                            "Real-time Quotes & Charts",
                                            "Gainers and Losers",
                                        ].map((label, index) => (
                                            <SidebarSubLink
                                                key={label}
                                                to="/dashboard"
                                                onClose={() => handleMobileProductLinkClick("/dashboard")}
                                                label={label}
                                                index={index + 6}
                                                isOpen={isProductsOpen}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Links */}
                    <div className="border-b border-white/10">
                        <button
                            onClick={handleMobilePricingClick}
                            className="flex w-full py-4 text-white text-lg hover:text-gray-300 transition-colors text-left"
                        >
                            Pricing
                        </button>
                    </div>

                    <div className="border-b border-white/10">
                        <Link
                            to="/"
                            onClick={onClose}
                            className="flex py-4 text-white text-lg hover:text-gray-300 transition-colors"
                        >
                            Resources
                        </Link>
                    </div>

                    <div className="border-b border-white/10">
                        <Link
                            to="/"
                            onClick={onClose}
                            className="flex py-4 text-white text-lg hover:text-gray-300 transition-colors"
                        >
                            About
                        </Link>
                    </div>

                    <div className="border-b border-white/10">
                        <Link
                            to="/blog"
                            onClick={onClose}
                            className="flex py-4 text-white text-lg hover:text-gray-300 transition-colors"
                        >
                            Blog
                        </Link>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="mt-6 flex flex-col items-center gap-4 px-4 pb-8">
                    <Button className="special-btn gradient-box-shadow w-full py-6 text-base font-bold">
                        <Link
                            to="/auth/sign-up"
                            onClick={onClose}
                            className="flex items-center justify-center w-full"
                        >
                            Get free demo
                            <ChevronRight size={16} className="ml-2" />
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full rounded-full py-6 text-base font-bold bg-transparent border-white/20 text-white hover:bg-white/10"
                    >
                        <Link
                            to="/auth/sign-in"
                            onClick={onClose}
                            className="flex items-center justify-center w-full"
                        >
                            Sign in
                        </Link>
                    </Button>
                </div>

                {/* Background Graphics */}
                <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
                    <img
                        src={singleBox}
                        alt="box"
                        className="absolute bottom-24 object-contain right-0 w-full opacity-60"
                    />
                    <div className="purple-shadow bottom-20 left-20 w-1/2 h-[150px] z-90"></div>
                    <div className="purple-shadow -top-10 left-20 w-1/2 h-[100px]"></div>
                </div>
            </aside>
        </>
    );
}

function SidebarSubLink({
    to,
    onClose,
    label,
    index,
    isOpen,
}: {
    to: string;
    onClose: () => void;
    label: string;
    index: number;
    isOpen: boolean;
}) {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            onClose();

            if (location.pathname === "/") {
                setTimeout(() => {
                    const section = document.querySelector("#pricing");
                    if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                    }
                }, 300);
            } else {
                navigate("/#pricing");
                setTimeout(() => {
                    const section = document.querySelector("#pricing");
                    if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                    }
                }, 800);
            }
        }
    };

    return (
        <Link
            to={isAuthenticated ? to : "#"}
            onClick={handleClick}
            className="text-white/80 hover:text-gray-300 text-sm font-medium transition-all duration-300 ease-out pl-4 border-l-2 border-gray-600 hover:border-gray-500 py-2 hover:bg-white/5 rounded-r-lg"
            style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateX(0)" : "translateX(-10px)",
                transition: `all 0.3s ease-out ${index * 0.03}s`,
            }}
        >
            {label}
        </Link>
    );
}