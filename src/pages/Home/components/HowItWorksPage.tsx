import { Card, CardContent } from "@/components/ui/card";
import PuzzlePiece from "../../../assets/Home/puzzle-piece.svg";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
// import play from '../../../assets/Home/play.svg';
import TechCardImg1 from '../../../assets/Home/techCardImg1.svg';
import Signals from '../../../assets/Home/signals.gif';
import TechCardImg3 from '../../../assets/Home/techCardImg3.svg';
import VectorInput from '../../../assets/Home/vectorInput.svg';
import singleBox from '../../../assets/Home/singlebox.png';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { VideoButton } from "@/components/VideoButton";
import { VideoModal } from "@/components/VideoModal";

interface Step {
    number: string;
    title: string;
    image: string | null;
    description: string;
    vectorInput: string | null;
    signals: boolean;
}

const steps: Step[] = [
    {
        number: "1",
        title: "Search or Ask",
        image: TechCardImg1,
        description: "Enter your stock, crypto, or question.",
        vectorInput: null,
        signals: false
    },
    {
        number: "2",
        title: "AI Analysis",
        image: null,
        description: "Our AI analyzes market data and trends.",
        vectorInput: VectorInput,
        signals: true
    },
    {
        number: "3",
        title: "Get Insights",
        image: TechCardImg3,
        description: "Receive actionable investment insights.",
        vectorInput: null,
        signals: false
    }
];

const StepCard = ({ step, className = "" }: { step: Step; className?: string }) => (
    <div className={cn("group", className)}>
        <Card className="relative flex flex-col items-center text-center p-6 bg-transparent hover:shadow-lg transition-all duration-300 border border-border group-hover:!border-[#28AD9B] glass h-full" style={{
            background: 'rgba(20, 20, 20, 0.30)',
        }}>
            <div className="absolute -top-5 bg-[#06040C] border border-slate-600 rounded-full w-10 h-10 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-[#28AD9B] group-hover:to-[#4E3AAC] transition-all duration-300">
                <span className="text-lg font-medium group-hover:text-white">{step.number}</span>
            </div>

            <CardContent className="sm:pt-6 space-y-6 flex flex-col flex-grow pt-3">
                <h3 className="text-xl font-medium">{step.title}</h3>
                <div className="w-full space-y-2 flex-grow">
                    {step.image && (
                        <span className="block">
                            <img src={step.image} alt={step.title} className="border rounded-2xl h-64 w-full object-cover transition-all duration-300" />
                        </span>
                    )}
                    {step.vectorInput && (
                        <div className="relative border rounded-2xl flex items-end justify-end h-64 px-6 transition-all duration-300">
                            <img src={step.vectorInput} alt="VectorInput" className="self-end" />
                            {step.signals && (
                                <div className="absolute w-36 h-auto left-1/2 -translate-x-1/2 top-2">
                                    <img
                                        src={Signals}
                                        alt="Signals"
                                        className="w-full h-full object-contain"
                                    />
                                    {/* Gradient overlay with mix blend mode */}
                                    <div
                                        className="absolute inset-0 mix-blend-color"
                                        style={{
                                            background: 'linear-gradient(275.19deg, #14E893 -15.5%, #5131AD 98.25%)',
                                        }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <p className="text-sm text-muted-foreground px-4 sm:mb-10 sm:mt-8 text-gray-400 flex-shrink-0 mb-4">
                    {step.description}
                </p>
            </CardContent>
        </Card>
    </div>
);

const StepsCarousel = ({ steps }: { steps: Step[] }) => {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (!api) return;

        const update = () => {
            setCurrent(api.selectedScrollSnap());
        };

        update();
        api.on("select", update);

        const autoplay = setInterval(() => {
            api.scrollNext();
        }, 30000);

        return () => clearInterval(autoplay);
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
        if (distanceFromActive === 1 || distanceFromActive === (steps.length - 1)) {
            return {
                width: "0.6rem",
                height: "0.6rem",
                opacity: 0.8
            };
        }
        // Next neighbors (2 away): small size, medium opacity
        if (distanceFromActive === 2 || distanceFromActive === (steps.length - 2)) {
            return {
                width: "0.4rem",
                height: "0.4rem",
                opacity: 0.5
            };
        }
        // Farthest dots: smallest size, low opacity
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
                    loop: true,
                }}
            >
                <CarouselContent>
                    {steps.map((step, index) => (
                        <CarouselItem
                            key={index}
                            className="basis-full bg-transparent"
                        >
                            <StepCard step={step} className="pt-5 h-full" />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-3 px-6 py-3 bg-black/80 border border-gray-700/40 rounded-full">
                    {steps.map((_, i) => {
                        const dotStyle = getDotStyle(i);
                        const isActive = current === i;

                        return (
                            <button
                                key={i}
                                onClick={() => api?.scrollTo(i)}
                                className={cn(
                                    "transition-all duration-300 rounded-full",
                                    isActive
                                        ? "bg-gradient-to-r from-[#28AD9B] to-[#4E3AAC] border-transparent"
                                        : "bg-gray-600 hover:bg-gray-400"
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
            <div className="">
                <div className="purple-shadow sm:w-1/2 sm:h-96 -bottom-16 sm:-right-[400px] right-0 w-full h-1/4 sm:hidden block" style={{ filter: 'blur(100px) saturate(65%)' }}></div>
            </div>
        </div>
    );
};

export default function HowItWorksSection() {
    const [isVideoOpen, setIsVideoOpen] = React.useState(false);
    const navigate = useNavigate();
    return (
        <section className="relative w-full flex flex-col items-center justify-center sm:pb-20 sm:pt-8 sm:px-4 text-center max-w-6xl mx-auto pt-0 px-2 pb-10">
            <div className="text-sm mb-5 flex items-center justify-center gap-2">
                <img src={PuzzlePiece} alt="PuzzlePiece" className="w-4 h-4" />
                <p className="text-gray-400">
                    How it works
                </p>
            </div>

            <h1 className="sm:text-[54px] leading-16 font-medium mb-2 text-4xl max-w-3xl">
                Tech Tren – your personal
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E3AAC] to-[#28AD9B]">
                    {' '}AI consultant for Investment
                </p>
            </h1>


            <p className="text-sm sm:text-base text-muted-foreground sm:mb-6 text-gray-400 mb-10">
                Find out if you're the investor – in 3 minutes
            </p>

            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl sm:mt-8 mt-0 sm:px-0 px-6">
                {steps.map((step, index) => (
                    <StepCard key={index} step={step} className="group-hover:bg-gradient-to-r group-hover:from-[#28AD9B] group-hover:to-[#4E3AAC] transition-all duration-300 cursor-default" />
                ))}
            </div>

            {/* Mobile: Carousel Layout - Single slide only */}
            <div className="block md:hidden w-full max-w-6xl sm:mt-8 mt-0 sm:px-0 px-6">
                <StepsCarousel steps={steps} />
            </div>

            <div className="mt-8 flex items-center justify-center sm:flex-row flex-col gap-5 sm:gap-3 w-full">
                <Button className="special-btn hover:scale-110 gradient-box-shadow w-2/3 sm:w-fit sm:py-5 sm:px-5 py-6 text-base" onClick={() => navigate('/auth/sign-up')}>
                    Start free trial
                    <span className="ml-1">
                        <ChevronRight size={14} />
                    </span>
                </Button>

                {/* <div className="flex items-center justify-center px-3 rounded-4xl ml-4 hover:scale-110 transition-all">
                    <img src={play} alt="play" className="size-7 mr-2" />
                    <Button variant="outline" className="rounded-full px-0 py-5 !bg-transparent border-none">
                        See demo
                    </Button>
                </div> */}
                <VideoButton onClick={() => setIsVideoOpen(true)} />
            </div>

            <div className="">
                <img src={singleBox} alt="box" className="absolute -right-[500px] -bottom-36 object-contain w-1/2" />
                <div className="purple-shadow -right-[500px] -bottom-36"></div>
            </div>

            {/* Video Modal using reusable component */}
            <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
        </section>
    );
}