import { ArrowRight } from "lucide-react";
import idea from '../../../assets/Home/bulb.svg';
import star0 from '../../../assets/Home/star0.svg';
import upGraph from '../../../assets/Home/Solid (1).svg';
import singleBox from '../../../assets/Home/singlebox.png';
import downGraph from '../../../assets/Home/Solid (2).svg';
import greenBull from '../../../assets/Home/greenbull.png';
import purpleBull from '../../../assets/Home/purplebull.png';
import bullBg from '../../../assets/Home/bullBg.png'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Marquee,
    MarqueeContent,
    MarqueeFade,
    MarqueeItem,
} from '@/components/ui/shadcn-io/marquee';
import { useNavigate } from "react-router-dom";


interface StockData {
    name: string;
    amount: string;
    bonus: string;
    icon: string
}

const data: StockData[] = [
    { name: 'NVDA', amount: '$187.62', bonus: '-0.32%', icon: upGraph },
    { name: 'AAPL', amount: '$175.43', bonus: '-0.45%', icon: upGraph },
    { name: 'MSFT', amount: '$415.86', bonus: '+0.28%', icon: downGraph },
    { name: 'GOOGL', amount: '$158.22', bonus: '+0.51%', icon: downGraph },
];


// StockCard Component Marquee 
const StockCard = ({ item }: { item: StockData }) => (
    <div className="glass text-white p-4 flex flex-col justify-between rounded-3xl sm:h-28 sm:w-40 w-32 h-24 sm:pt-4 pt-3 !shadow-none">
        <div className="sm:space-y-2 space-y-0 sm:mb-0 mb-1">
            <h5 className="font-medium sm:text-lg text-base">{item.name}</h5>
            <p className="sm:text-lg font-medium text-gray-400 text-sm">{item.amount}</p>
        </div>
        <p
            className={`flex items-center font-medium ${item.bonus.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}
        >
            {item.bonus}
            <span>
                <img src={item.icon} alt="" className="size-5" />
            </span>
        </p>
    </div>
);

// MarqueeCards Component shadcn
interface MarqueeCardsProps {
    items: StockData[];
    direction?: "left" | "right";
    speed?: "slow" | "normal" | "fast";
    pauseOnHover?: boolean;
    className?: string;
}

const MarqueeCards = ({
    items,
    direction = "left",
    pauseOnHover = true,
    className,
}: MarqueeCardsProps) => {
    const marqueeProps = {
        reverse: direction === "right",
        pauseOnHover,
    };

    return (
        <div className={`relative w-full ${className}`}>
            <Marquee {...marqueeProps}>
                <MarqueeFade side="left" />
                <MarqueeFade side="right" />
                <MarqueeContent>
                    {items.map((item, index) => (
                        <MarqueeItem key={index} className="flex-shrink-0">
                            <StockCard item={item} />
                        </MarqueeItem>
                    ))}
                </MarqueeContent>
            </Marquee>
        </div>
    );
};

export default function RevolutionBullCard() {
    const navigate = useNavigate();
    return (
        <div className="relative flex items-stretch justify-between gap-4 mx-auto pb-20 max-w-6xl sm:flex-row flex-col sm:pr-0 px-6">
            <div className="relative sm:pl-4 pl-0">
                {/* First Card */}
                <Card className="relative overflow-hidden glass" style={{
                    background: 'rgba(20, 20, 20, 0.80)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'backdrop-filter: blur(10px) saturate(160%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <CardHeader className="pb-4">
                        <div className="relative h-28 mb-4">
                            <img
                                src={greenBull}
                                alt="bull"
                                className="sm:w-[400px] sm:h-[230px] object-contain absolute sm:top-3 right-6 sm:-mr-40 -z-3 opacity-50 w-64 h-44 -mr-16 top-0"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 z-10 sm:text-left text-center cursor-default">
                        <p className="flex items-center text-gray-400 mb-2 text-base sm:justify-start justify-center sm:mt-0 mt-6">
                            <span>
                                <img src={idea} alt="idea" className="size-5 mr-2 mb-1" />
                            </span>
                            AI based prediction
                        </p>
                        <h3 className="sm:text-2xl font-semibold flex items-center gap-2 mb-3 sm:justify-start justify-center text-[26px] sm:mt-0 mt-6 group cursor-pointer" onClick={() => navigate('/auth/sign-in')}>
                            Price Prediction
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-2 transition-all duration-300" />
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed sm:px-0 px-8">
                            An innovative method allows you to predict the price of assets and earn on your investments.
                        </p>
                    </CardContent>
                    <div className="green-circled sm:w-[600px] sm:h-[400px] absolute sm:blur-[80px] sm:-top-40 sm:-right-60 w-60 h-40 -top-16 -right-10 blur-[30px]"></div>
                    <span>
                        <img src={bullBg} alt="" className="absolute top-0 left-0 w-full h-full object-cover" />
                    </span>
                </Card>

                <div className="absolute sm:top-5 left-0 w-full h-fit top-20">
                    <MarqueeCards
                        items={data}
                        direction="left"
                        speed="normal"
                        pauseOnHover={true}
                    />
                </div>
            </div>

            {/* Second Card */}
            <Card className="relative overflow-hidden bg-transparent glass" style={{
                background: 'rgba(20, 20, 20, 0.80)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
                backdropFilter: 'backdrop-filter: blur(10px) saturate(160%)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <CardHeader className="pb-4">
                    <div className="relative h-28 mb-4">
                        <img
                            src={purpleBull}
                            alt="bull"
                            className="w-[400px] h-[230px] object-contain absolute top-3 -left-84 -mr-40 -z-3 opacity-50 sm:block hidden"
                        />
                        <div className="glass absolute sm:-top-12 sm:left-5 sm:py-4 sm:pt-6 sm:px-6 w-66 z-[3] top-6 -left-28 py-3 px-4">
                            <span>🔥</span>
                            <h5 className="text-gray-200 mt-1 sm:text-sm text-xs">Thousands Gather for Election Day Protest in Georgia</h5>
                            <p className="sm:text-xs text-[10px] text-gray-400 sm:mt-2 mt-1">1d - Yahoo Finance</p>
                        </div>
                        <div className="glass absolute sm:-top-10 sm:-right-36 sm:py-4 sm:pt-6 sm:px-6 w-72 z-[8] top-16 -right-44 py-3 px-4">
                            <span>🔥</span>
                            <h5 className="text-gray-200 mt-1 sm:text-sm text-xs">The Fed Lowers Interest Rates: Implications for Tesla Stock</h5>
                            <p className="sm:text-xs text-[10px] text-gray-400 sm:mt-2 mt-1">1d ago - NASDAQ.com</p>
                        </div>
                        <div className="glass absolute sm:top-6 sm:-right-16 sm:py-4 sm:pt-6 sm:px-6 w-72 z-[3] py-3 px-4 -top-6 -right-10">
                            <span>🔥</span>
                            <h5 className="text-gray-200 mt-1 sm:text-sm text-xs">Rachel Cruze: 8 Strategies to Reduce Your Essential Expenses</h5>
                            <p className="sm:text-xs text-[10px] text-gray-400 sm:mt-2 mt-1">1d ago - AMAZON</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 z-10 sm:text-left text-center cursor-default">
                    <p className="flex items-center text-gray-400 mb-2 text-base sm:justify-start justify-center sm:mt-0 mt-6">
                        <span>
                            <img src={star0} alt="idea" className="size-5 mr-2 mb-1" />
                        </span>
                        Updates & blogs
                    </p>
                    <h3 className="text-2xl font-semibold flex items-center gap-2 mb-3 sm:justify-start justify-center sm:mt-0 mt-6 cursor-pointer group" onClick={() => navigate('/auth/sign-in')}>
                        News and AI Insights
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-2 transition-all duration-300" />
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed sm:px-0 px-8">
                        A comprehensive, hassle-free solution to launch your own trading brand without the complexities
                    </p>
                </CardContent>
                <div className="purple-circled absolute -top-36 -left-88"></div>

                <img src={bullBg} alt="" className="absolute top-0 left-0 w-full h-full object-cover z-[1]" />

            </Card>


            {/* Side Filters Code */}
            <div className="!overflow-hidden myBullBg">
                <img src={singleBox} alt="box" className="absolute -left-[450px] -top-10 object-contain w-1/2 sm:block hidden" />
                <div className="green-shadow -top-10 -left-[450px] sm:block hidden"></div>
            </div>

            <div className="">
                <img src={singleBox} alt="box" className="absolute -right-[380px] top-44 object-contain w-1/2 -z-90 sm:block hidden" />
                <div className="purple-shadow sm:w-[600px] sm:-right-96 sm:h-[450px] sm:top-20 -z-5 w-1/2 h-1/4 bottom-24 right-20"></div>
            </div>
        </div>
    );
}