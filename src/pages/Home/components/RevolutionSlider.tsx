import { Card, CardContent } from "@/components/ui/card";
import {
    Marquee,
    MarqueeContent,
    MarqueeItem,
} from '@/components/ui/shadcn-io/marquee';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import * as React from "react";
import Icon1 from '../../../assets/Home/revolution-carousel-icon1.svg';
import Icon2 from '../../../assets/Home/revolution-carousel-icon2.svg';
import Icon3 from '../../../assets/Home/revolution-carousel-icon3.svg';
import Icon4 from '../../../assets/Home/revolution-carousel-icon4.svg';

const cards = [
    {
        icon: Icon1,
        title: "AI Stock Picks",
        desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    },
    {
        icon: Icon2,
        title: "Screener",
        desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu pariatur.",
    },
    {
        icon: Icon3,
        title: "Live alerts",
        desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    },
    {
        icon: Icon4,
        title: "Trading Signals",
        desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
    },
];

// Card Component Marquee 
const FeatureCard = ({ card, className = "" }: { card: typeof cards[0]; className?: string }) => (
    <Card className={cn("!w-80 bg-gradient-to-b rounded-2xl text-center text-white flex-shrink-0 mx-3", className)}>
        <CardContent className="p-6 flex flex-col items-center justify-center space-y-4 pt-1 gap-4">
            <div className="p-3"> <img src={card.icon} alt="icon" /> </div>
            <div>
                <h3 className="text-xl font-medium mb-4">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.desc}</p>
            </div>
        </CardContent>
    </Card>
);

// Custom subtle fade
const SmokeFade = ({ side }: { side: 'left' | 'right' }) => (
    <div
        className={`
            absolute top-0 bottom-0 w-32 z-10 pointer-events-none
            ${side === 'left' ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'}
            from-background via-background/70 to-transparent
        `}
        style={{
            maskImage: side === 'left'
                ? 'linear-gradient(to right, black, transparent)'
                : 'linear-gradient(to left, black, transparent)',
            WebkitMaskImage: side === 'left'
                ? 'linear-gradient(to right, black, transparent)'
                : 'linear-gradient(to left, black, transparent)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
        }}
    />
);

// MarqueeCards Component shadcn
interface FeatureMarqueeProps {
    items: typeof cards;
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    className?: string;
}

const FeatureMarquee = ({
    items,
    direction = "left",
    pauseOnHover = true,
    className,
}: FeatureMarqueeProps) => {
    const marqueeProps = {
        reverse: direction === "right",
        pauseOnHover,
    };

    return (
        <div className={`relative w-full ${className}`}>
            <Marquee {...marqueeProps}>
                <SmokeFade side="left" />
                <SmokeFade side="right" />
                <MarqueeContent>
                    {items.map((card, index) => (
                        <MarqueeItem key={index} className="flex-shrink-0">
                            <FeatureCard card={card} />
                        </MarqueeItem>
                    ))}
                </MarqueeContent>
            </Marquee>
        </div>
    );
};

interface FeatureCarouselProps {
    items: typeof cards;
    className?: string;
}

interface FeatureCarouselProps {
    items: typeof cards;
    className?: string;
}

const FeatureCarousel = ({
    items,
    className,
}: FeatureCarouselProps) => {
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
        }, 4000);

        return () => clearInterval(autoplay);
    }, [api]);

    const getDotStyle = (index: number) => {
        const distanceFromActive = Math.abs(index - current);

        // Active dot
        if (distanceFromActive === 0) {
            return {
                width: "1rem",
                height: "0.5rem",
                opacity: 1
            };
        }
        // Immediate neighbors (1 away)
        if (distanceFromActive === 1 || distanceFromActive === (items.length - 1)) {
            return {
                width: "0.6rem",
                height: "0.6rem",
                opacity: 0.8
            };
        }
        // Next neighbors (2 away)
        if (distanceFromActive === 2 || distanceFromActive === (items.length - 2)) {
            return {
                width: "0.4rem",
                height: "0.4rem",
                opacity: 0.5
            };
        }
        // Farthest dots
        return {
            width: "0.4rem",
            height: "0.4rem",
            opacity: 0.3
        };
    };

    return (
        <div className={`relative w-full ${className}`}>
            <Carousel
                setApi={setApi}
                className="w-full"
                opts={{
                    align: "center",
                    loop: true,
                }}
            >
                <CarouselContent className="-ml-10 mr-0 ">
                    {items.map((card, index) => (
                        <CarouselItem
                            key={index}
                            className="pl-2 pr-2 basis-3/4 sm:basis-2/5"
                        >
                            <div className={cn(
                                "transition-all duration-300 transform",
                                current === index
                                    ? "scale-100 opacity-100"
                                    : "scale-90 opacity-70"
                            )}>
                                <FeatureCard card={card} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            {/* Pagination Dots */}
            <div className="mt-8 flex justify-center">
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
        </div>
    );
};

export default function RevolutionSlider() {
    return (
        <div className="relative overflow-visible w-full bg-transparent pb-10 px-4 sm:px-8 lg:px-16 max-w-6xl mx-auto">
            <div className="hidden lg:block">
                <FeatureMarquee
                    items={cards}
                    direction="left"
                    pauseOnHover={true}
                />
            </div>

            <div className="block lg:hidden overflow-visible">
                <FeatureCarousel items={cards} />
            </div>
        </div>
    );
}