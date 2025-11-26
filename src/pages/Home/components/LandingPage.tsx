import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import dashboardImg2 from "../../../assets/Home/dashboard-i2.png";
// import dashboardImg3 from "../../../assets/Home/dashboard-i3.png";
import DashboardMobile from "../../../assets/Home/Dashboard-Mobile.webp";
import financialGpt from "../../../assets/Home/financialGpt.webp";
import MobileFinancialGraph from "../../../assets/Home/MobileFinancialGraph.webp";
import EllipseMobile from "../../../assets/Home/EllipseMobile.svg";
import SingleBox from "../../../assets/Home/singlebox.png";
import DashboardImage from "../../../assets/Home/dashboardImg.webp";
import HomePredictionGraph from "../../../assets/Home/homPredictionGraph.png";
import { VideoModal } from "@/components/VideoModal";
import { VideoButton } from "@/components/VideoButton";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";

// ---------- Animated Gradient ----------
function AnimatedGradient() {
    return (
        <motion.img
            src={EllipseMobile}
            alt="Animated gradient background"
            className="absolute -z-10 w-full h-full scale-150 sm:scale-[120%] translate-y-32 sm:translate-y-0"
            animate={{
                x: ["-25%", "25%", "-25%"],
            }}
            transition={{
                duration: 30,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}

// ---------- App Mock Desktop ----------
function AppMock() {
    return (
        <div className="relative hidden sm:block">
            <OptimizedImage
                src={DashboardImage}
                alt="dashboard"
                className="w-4/5 mx-auto"
                aspectRatio="16/9"
                priority={true}
            />
            <div className="hidden md:block absolute left-0 top-14 backdrop-blur-lg">
                {/* <img src={dashboardImg3} alt="dashboard" className="w-76 h-58" /> */}
                <OptimizedImage
                    src={HomePredictionGraph}
                    alt="dashboard"
                    className="w-76 h-58"
                    aspectRatio="4/3"
                    priority={true}
                />
            </div>
            <div className="hidden md:block absolute -right-10 bottom-6 w-72 glass rounded-2xl p-4">
                <OptimizedImage
                    src={dashboardImg2}
                    alt="dashboard"
                    aspectRatio="16/9"
                    priority={true}
                />
            </div>
        </div>
    );
}

// ---------- App Mock Mobile ----------
function MobileMock() {
    return (
        <div className="relative block sm:hidden">
            <OptimizedImage
                src={DashboardMobile}
                alt="dashboard"
                className="w-[95%] mx-auto"
                aspectRatio="9/16"
                priority={true}
            />
            <img
                src={financialGpt}
                alt="dashboard"
                className="absolute mx-auto top-92 w-[80%] left-10"
            />
            <img
                src={MobileFinancialGraph}
                alt="dashboard"
                className="mx-auto absolute -top-3 w-48"
            />
        </div>
    );
}

// ---------- Main Landing Component ----------
export function Landing() {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="landing-main relative radial-glow">
            <AnimatedGradient />
            <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 sm:pt-24 md:pt-36">
                <div
                    className="mb-6 glass mx-auto flex justify-center w-fit rounded-4xl px-4 py-2 items-center gap-1 cursor-pointer text-sm group"
                    style={{
                        background: "rgba(20, 20, 20, 0.30)",
                    }}
                    onClick={() => navigate('/#pricing')}
                >
                    🌟 What makes you unique
                    <span className="ml-3 group-hover:translate-x-1 duration-300 transition-all">
                        <ArrowRight size={16} />
                    </span>
                </div>

                <h1 className="mx-auto max-w-5xl text-center text-balance text-4xl md:text-6xl font-light">
                    Smarter Tech. Smarter Investing.
                </h1>

                <p className="mx-auto mt-3 px-12 sm:px-auto sm:mt-5 max-w-lg text-center text-gray-300 text-lg font-extralight">
                    AI-powered predictions, real-time data, and investor communities —
                    all in one platform.
                </p>

                <div className="mt-6 flex items-center justify-center sm:flex-row flex-col gap-5 sm:gap-3">
                    <Button className="special-btn hover:scale-110 gradient-box-shadow w-2/3 sm:w-fit sm:py-5 sm:px-5 py-6 text-base" onClick={() => navigate('/auth/sign-up')}>
                        Start free trial
                        <span className="ml-1">
                            <ChevronRight size={14} />
                        </span>
                    </Button>

                    {/* See Demo Button using reusable component */}
                    <VideoButton onClick={() => setIsVideoOpen(true)} />
                </div>

                <div className="mt-4 md:mt-12">
                    <AppMock />
                    <MobileMock />
                </div>

                <img
                    src={SingleBox}
                    alt="box"
                    className="sm:hidden block absolute top-88 z-[-2]"
                />
            </div>

            {/* Video Modal using reusable component */}
            <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
        </div>
    );
}