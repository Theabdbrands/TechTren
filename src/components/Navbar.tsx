import { useState, type ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "../assets/Home/logo.png";
import flag from "../assets/Home/Flags.svg";
import MenuIcon from "../assets/Home/menu-02.svg";
import { useAuthStore } from "@/api/stores/auth-store";
import MobileSidebar from "./MobileSidebar";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handlePricingClick = () => {
    if (location.pathname === "/") {
      setTimeout(() => {
        const section = document.querySelector("#pricing");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      navigate("/#pricing");
      setTimeout(() => {
        const section = document.querySelector("#pricing");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  };

  const handleProductLinkClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      handlePricingClick();
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[90%] sm:w-3/4 max-w-6xl min-h-14 sm:min-h-16 px-4 sm:px-6 flex items-center justify-between !rounded-full z-[100] mt-6 isolate glass"
        style={{
          background: "rgba(20, 20, 20, 0.30)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="flex items-center gap-12">
          <Link to="/">
            <img src={Logo} alt="Tech Tren Logo" className="w-32" />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <MegaMenu
              title="Products"
              isActive={activeMegaMenu === "products"}
              onOpen={() => setActiveMegaMenu("products")}
              onClose={() => setActiveMegaMenu(null)}
            >
              <div className="w-full px-20 py-10">
                <div className="grid grid-cols-3 gap-12 max-w-[1400px] mx-auto">
                  {/* Left Column - Features */}
                  <div>
                    <div className="flex items-center gap-2 mb-5 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                      </svg>
                      <span className="text-sm font-semibold uppercase tracking-wider">
                        Features
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Financial GPT
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Price Prediction
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Tax GPT
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Threads
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Watchlist
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Real-time news
                      </MegaMenuLink>
                    </div>
                  </div>

                  {/* Middle Column - Trading Strategies (First 4) */}
                  <div>
                    <div className="flex items-center gap-2 mb-5 text-gray-400">
                      <span className="text-sm font-semibold h-5 w-5 uppercase tracking-wider">
                        {" "}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Trading Strategies
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        AI Stock Picker
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        SwingTrading signal
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Trading Signal
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Crypto Radar
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        AI Alert
                      </MegaMenuLink>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-5 text-gray-400">
                      <span className="text-sm font-semibold h-5 w-5 uppercase tracking-wider">
                        {" "}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        AI Screener
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Congress Trade Monitoring
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Crypto Spotlight
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Real-time Quotes & Charts
                      </MegaMenuLink>
                      <MegaMenuLink
                        to="/dashboard"
                        onClick={handleProductLinkClick}
                        onCloseMegaMenu={() => setActiveMegaMenu(null)}
                      >
                        Gainers and Losers
                      </MegaMenuLink>
                    </div>
                  </div>
                </div>
              </div>
            </MegaMenu>

            <button
              onClick={handlePricingClick}
              className="hover:text-gray-300 transition-colors cursor-pointer"
            >
              Pricing
            </button>

            <Link to="/" className="hover:text-gray-300 transition-colors">
              Resources
            </Link>

            <Link to="/" className="hover:text-gray-300 transition-colors">
              About
            </Link>

            <Link to="/blog" className="hover:text-gray-300 transition-colors">
              Blog
            </Link>
          </nav>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 border-l border-gray-700 pl-10 pr-4">
            <img src={flag} alt="Language flag" />
            <span>EN</span>
          </div>

          <Button
            variant="ghost"
            className="text-white hover:text-gray-300 rounded-full"
            style={{ backgroundColor: "rgba(55, 65, 81, 0.25)" }}
            asChild
          >
            <Link to="/auth/sign-in">Sign in</Link>
          </Button>

          <Button
            className="bg-white text-black rounded-full px-4 hover:bg-gray-200 font-semibold"
            asChild
          >
            <Link to="/auth/sign-up">Get free demo</Link>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white focus:outline-none z-[150] relative"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={26} /> : <img src={MenuIcon} alt="Menu" />}
        </button>
      </header>

      {/* Mega Menu Overlay - Full Screen */}
      {activeMegaMenu && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
          onClick={() => setActiveMegaMenu(null)}
        />
      )}

      {/* Mobile Sidebar Component */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}

function MegaMenu({
  title,
  children,
  isActive,
  onOpen,
  onClose,
}: {
  title: string;
  children: ReactNode;
  isActive: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  let timeoutId: number;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    onOpen();
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      onClose();
    }, 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-2 hover:text-gray-300 cursor-pointer transition-colors">
        {title}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isActive ? "rotate-180" : ""
            }`}
        />
      </div>

      {/* Full Width Mega Menu */}
      <div
        className={`fixed glass left-0 right-0 top-[68px] transition-all duration-300 ease-in-out rounded-xl overflow-hidden ${isActive
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-4 pointer-events-none"
          }`}
        style={{
          background: "rgba(20, 20, 20, 0.50)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="w-full border-t border-b border-white/10 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

function MegaMenuLink({
  to,
  children,
  onClick,
  onCloseMegaMenu,
}: {
  to: string;
  children: ReactNode;
  onClick: (e: React.MouseEvent, to: string) => void;
  onCloseMegaMenu: () => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    onCloseMegaMenu();
    onClick(e, to);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="text-white/90 hover:text-white transition-colors py-2 px-3 block text-[15px] rounded-lg hover:bg-white/5"
    >
      {children}
    </Link>
  );
}