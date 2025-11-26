import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { X, ChevronRight, BadgeCheck, ArrowLeft } from 'lucide-react';
import { pricingData, type PricingTier } from '@/Content/pricingData';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import singleBox from '../../../assets/Home/singlebox.png';

// Stripe payment links
const STRIPE_LINKS = {
    expert: 'https://buy.stripe.com/aFa3cv9rK9qgcyVcv128802',
    unlimited: 'https://buy.stripe.com/dRm00j47q9qggPbbqX28801',
};

// Gradient configuration function
const getCardGradient = (tierId: string) => {
    const gradients = {
        basic: 'bg-gradient-to-b from-[rgba(20,232,147,0.1)] to-[rgba(6,4,12,0.1)]',
        expert: 'bg-gradient-to-b from-[rgba(79,57,172,0.25)] to-[rgba(6,4,12,0.25)]',
        unlimited: 'bg-gradient-to-b from-[rgba(20,232,147,0.5)] to-[rgba(6,4,12,0.5)]',
    };
    return gradients[tierId as keyof typeof gradients] || gradients.basic;
};

// Gradient overlay component
const GradientOverlay = ({ tierId }: { tierId: string }) => (
    <div
        className={`
      absolute top-0 left-0 right-0 h-1/3 pointer-events-none
      bg-gradient-to-b ${getCardGradient(tierId)} opacity-60
      blur-[1px] transition-all duration-300
    `}
    />
);

const FeatureIcon = ({ included }: { included: boolean }) =>
    included ? <BadgeCheck className="w-5 h-5 text-[#14E893]" /> : <X className="w-[17px] h-[17px] text-[#E81418] border border-red-600 rounded-full p-[1px] mr-1" />;

export const PricingCard = ({ tier }: { tier: PricingTier }) => {
    const navigate = useNavigate();
    const displayPrice = tier.monthlyPrice;

    const handleSubscribe = () => {
        if (tier.id === 'basic') {
            // For basic plan, redirect directly to login
            navigate('/auth/sign-in');
        } else if (tier.id === 'expert' || tier.id === 'unlimited') {
            // For paid plans, redirect to Stripe
            const stripeLink = STRIPE_LINKS[tier.id as keyof typeof STRIPE_LINKS];
            if (stripeLink) {
                sessionStorage.setItem('checkoutInProgress', tier.id);
                window.location.href = stripeLink;
            }
        }
    };

    const buttonLabel = tier.id === 'basic' ? "Subscribe now" : "Subscribe now";

    return (
        <Card className={`sticky overflow-hidden rounded-3xl border-0
                bg-gradient-to-b from-white/5 to-transparent
                shadow-[inset_0px_0px_0px_1px_#FFFFFF1A] pb-0
                transition-all duration-200 h-fit`}>
            <GradientOverlay tierId={tier.id} />

            {tier.id === 'expert' && (
                <div className="absolute top-8 -right-14 bg-[#14E893] text-black text-xs font-semibold px-16 py-1 transform rotate-45 z-10">
                    Most popular
                </div>
            )}

            <CardContent className="p-0 relative z-1">
                <div className="relative">
                    <div className="pt-2 pb-6 px-8 relative z-1">
                        <h4 className="text-gray-400 text-md font-medium mb-2">{tier.name}</h4>
                        <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-white text-3xl font-medium">{displayPrice}</h3>
                            {tier.savings && tier.savings !== 'Save $0.00' && (
                                <span className={`!py-2 !text-xs flex items-center !px-4 ${tier.id === 'unlimited' ? '!bg-black !text-white rounded-full cursor-pointer' : 'special-btn'}`}>
                                    {tier.savings}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-400 text-sm">{tier.month}</p>
                    </div>
                </div>

                <div className="border-t border-gray-700 w-full hidden" />

                <div className="px-8 py-6 relative">
                    <button
                        onClick={handleSubscribe}
                        className={`special-btn !py-2 !px-4 flex items-center justify-center gap-2 text-md w-full relative z-1 hover:opacity-90 transition-all`}
                    >
                        {buttonLabel}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="border-t border-gray-700 w-full" />

                {/* Features section */}
                <div className="px-7 py-4">
                    <Accordion type="multiple" className="space-y-6" defaultValue={Object.keys(tier.features)}>
                        {Object.entries(tier.features).map(([key, feature]) => (
                            <AccordionItem key={key} value={key} className="border-0 my-4">
                                <AccordionTrigger className="hover:no-underline [&[data-state=open]>svg]:rotate-180 cursor-pointer">
                                    <span className="text-base font-medium text-white text-left">{feature.title}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 space-y-3">
                                    {feature.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2.5">
                                            <FeatureIcon included={item.included} />
                                            <span className="text-gray-400 text-base">{item.name}</span>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </CardContent>
        </Card>
    );
};

// Mobile Tabs Component
const MobilePlanTabs = ({
    selectedTier,
    onTierChange,
}: {
    selectedTier: PricingTier;
    onTierChange: (tier: PricingTier) => void;
}) => {
    return (
        <div className="md:hidden mb-6">
            <Tabs value={selectedTier.id} className="w-full glass"
                style={{
                    background: 'rgba(20, 20, 20, 0.50)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                <TabsList className="grid grid-cols-3 w-full rounded-2xl px-1 h-full">
                    {pricingData.map((tier) => (
                        <TabsTrigger
                            key={tier.id}
                            value={tier.id}
                            onClick={() => onTierChange(tier)}
                            className="text-xs font-medium py-3 
        text-gray-400 rounded-lg transition-all duration-200 cursor-pointer
        data-[state=active]:text-white
        data-[state=active]:[background:linear-gradient(275.19deg,#14E893_-15.5%,#5131AD_98.25%)]"
                        >
                            {tier.name.replace(' plan', '')}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Selected Plan Card for Mobile */}
            <div className="mt-6">
                <PricingCard tier={selectedTier} />
            </div>
        </div>
    );
};

const PostSignupPricing: React.FC = () => {
    const [selectedMobileTier, setSelectedMobileTier] = React.useState<PricingTier>(pricingData[0]);
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate('/auth/sign-in');
    };

    return (
        <div className="relative overflow-hidden min-h-screen flex items-center justify-center py-12 pt-36">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Back Button */}
                <div className="text-center mb-10 relative">
                    <button
                        onClick={handleBackToLogin}
                        className="absolute left-0 cursor-pointer top-1/2 transform -translate-y-[110px] sm:-translate-y-[300%] flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Login
                    </button>

                    <div className="flex flex-col items-center pt-14">
                        <h2 className="text-4xl md:text-[52px] font-medium text-white px-4 mb-4">
                            Choose Your Plan
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Welcome! Please select a plan to continue. You can start with our free Basic plan or upgrade for premium features.
                        </p>
                    </div>
                </div>

                {/* Mobile Tabs */}
                <div className='!z-80'>
                    <MobilePlanTabs
                        selectedTier={selectedMobileTier}
                        onTierChange={setSelectedMobileTier}
                    />
                </div>

                {/* Desktop Grid - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 relative max-w-5xl mx-auto">
                    {pricingData.map((tier) => (
                        <PricingCard
                            key={tier.id}
                            tier={tier}
                        />
                    ))}
                </div>
            </div>

            <div className="">
                <img src={singleBox} alt="box" className="absolute sm:-right-[500px] bottom-60 object-contain sm:w-1/2  right-0 w-full -z-10 opacity-100" />
                <div className="purple-shadow blur-[150px] !saturate-[1] sm:w-1/2 sm:h-96 bottom-80 sm:-right-[500px] right-0 w-full h-1/4 -z-10 !opacity-30 sm:!opacity-100"></div>
            </div>

            <div className="">
                <img src={singleBox} alt="box" className="absolute sm:-left-[500px] top-10 object-contain sm:w-1/2  left-0 w-full -z-10" />
                <div className="purple-shadow blur-[150px] !saturate-[1] sm:w-1/2 sm:h-96 top-10 sm:-left-[500px] left-0 w-full h-1/4 -z-10 !opacity-30 sm:!opacity-100"></div>
            </div>
        </div>
    );
};

export default PostSignupPricing;