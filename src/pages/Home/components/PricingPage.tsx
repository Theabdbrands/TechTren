import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { X, Zap, ChevronRight, BadgeCheck, Loader2, AlertCircle } from 'lucide-react';
import { pricingData, type PricingTier } from '@/Content/pricingData';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/api/stores/auth-store';
import { useCancelSubscription } from '../../../api/hooks/subscription/useSubscription';
import { VideoButton } from '@/components/VideoButton';
import { VideoModal } from '@/components/VideoModal';

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

// Stripe payment links
const STRIPE_LINKS = {
    // expert: 'https://buy.stripe.com/aFa3cv9rK9qgcyVcv128802',
    expert: 'https://buy.stripe.com/aFaeVddI07i8eH30Mj28800',
    unlimited: 'https://buy.stripe.com/dRm00j47q9qggPbbqX28801',
};

// Cancel Subscription Confirmation Dialog Component
const CancelConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    planName
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading: boolean;
    planName: string;
}) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0A0814] border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-white text-xl font-semibold mb-2">
                            Cancel {planName}?
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Your subscription will be downgraded to the Basic plan immediately.
                            You'll lose access to premium features.
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-gray-300 text-sm mb-2 block">
                        Help us improve (optional)
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Why are you cancelling?"
                        className="w-full bg-white/5 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#14E893] transition-colors resize-none"
                        rows={3}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        Keep Subscription
                    </button>

                    <button
                        onClick={() => onConfirm(reason)}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            'Cancel Subscription'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const PricingCard = ({ tier }: { tier: PricingTier }) => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const cancelSubscription = useCancelSubscription();
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const displayPrice = tier.monthlyPrice;

    const handleSubscribe = () => {
        if (!isAuthenticated) {
            sessionStorage.setItem('subscriptionPlan', tier.id);
            navigate('/auth/sign-up');
        } else {
            if (tier.id === 'basic') {
                navigate('/dashboard');
            } else if (tier.id === 'expert' || tier.id === 'unlimited') {
                // For paid plans, redirect to Stripe
                const stripeLink = STRIPE_LINKS[tier.id as keyof typeof STRIPE_LINKS];
                if (stripeLink) {
                    sessionStorage.setItem('checkoutInProgress', tier.id);
                    window.location.href = stripeLink;
                }
            }
        }
    };

    const handleCancelClick = () => {
        setShowCancelDialog(true);
    };

    const handleCancelConfirm = async (reason: string) => {
        try {
            await cancelSubscription.mutateAsync({ reason: reason || undefined });
            setShowCancelDialog(false);
        } catch (error) {
            // Error is handled in the mutation's onError
            console.error('Cancel subscription error:', error);
        }
    };

    // Determine button label and action
    const isCurrentPlan = user?.subscription === tier.id;
    let buttonLabel = "Subscribe now";
    let buttonAction = handleSubscribe;
    let buttonDisabled = false;
    let buttonClass = "special-btn";

    if (isCurrentPlan) {
        if (tier.id === 'basic') {
            buttonLabel = "Current plan";
            buttonDisabled = true;
            buttonClass = "special-btn opacity-60 cursor-not-allowed";
        } else {
            buttonLabel = "Cancel Subscription";
            buttonAction = handleCancelClick;
            {/* let colorGreen = '#14E893' */ }
            buttonClass = "hover:bg-[#14E893] bg-green-400/40 cursor-pointer hover:text-gray-900 text-white rounded-full transition-all duration-300";
        }
    } else {
        const plansOrder = ["basic", "expert", "unlimited"];
        const currentIndex = plansOrder.indexOf(user?.subscription || "basic");
        const tierIndex = plansOrder.indexOf(tier.id);

        if (tierIndex > currentIndex) {
            // buttonLabel = "Upgrade now";
            buttonLabel = "Subscribe now";
        } else if (tierIndex < currentIndex) {
            // buttonLabel = "Downgrade now";
            buttonLabel = "Subscribe now";
        }
    }

    return (
        <>
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
                            onClick={buttonAction}
                            disabled={buttonDisabled}
                            className={`${buttonClass} !py-2 !px-4 flex items-center justify-center gap-2 text-md w-full relative z-1 hover:opacity-90 transition-all`}
                        >
                            {buttonLabel}
                            {!buttonDisabled && buttonLabel !== "Cancel Subscription" && (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>

                        {/* {isCurrentPlan && tier.id !== 'basic' && (
                            <p className="text-gray-500 text-xs text-center mt-2">
                                Remember to cancel on Stripe to stop future charges
                            </p>
                        )} */}
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

            {/* Cancel Confirmation Dialog */}
            <CancelConfirmDialog
                isOpen={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                onConfirm={handleCancelConfirm}
                isLoading={cancelSubscription.isPending}
                planName={tier.name}
            />
        </>
    );
};

const FreeTrialCard = () => {
    const [isVideoOpen, setIsVideoOpen] = React.useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    const handleStartFreeTrial = () => {
        if (!isAuthenticated) {
            sessionStorage.setItem('subscriptionPlan', 'basic');
            navigate('/auth/sign-up');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <Card className="bg-transparent py-0 rounded-4xl mb-8">
            <CardContent className="p-6 md:p-12">
                <div className="flex flex-col lg:flex-row justify-between sm:items-center items-start">
                    <div className="text-left">
                        <h4 className="text-white text-3xl md:text-4xl font-medium mb-2">Free</h4>
                        <p className="text-gray-400 text-base">Limited time - free trial</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 max-w-md sm:ml-auto sm:my-0 my-8">
                        {['Should I Buy Analysis', 'Price Prediction', 'Technical Analysis', 'Option Strategy'].map((feature) => (
                            <div key={feature} className="flex items-center gap-2.5 w-fit">
                                <BadgeCheck className="w-5 h-5 text-white" />
                                <span className="text-gray-400 text-base">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* <button className="w-full sm:w-auto text-gray-400 px-4 rounded-4xl cursor-pointer hover:text-gray-300 transition-colors">
                            See demo
                        </button> */}
                        <VideoButton onClick={() => setIsVideoOpen(true)} />
                        <button
                            onClick={handleStartFreeTrial}
                            className="bg-white rounded-4xl text-gray-900 text-base py-2 px-6 font-bold flex items-center gap-2 justify-center cursor-pointer hover:bg-gray-100 hover:scale-110 transition-all duration-200"
                        >
                            Start free trial
                            <ChevronRight className="w-4 h-4 text-gray-900" />
                        </button>
                    </div>
                </div>
            </CardContent>
            {/* Video Modal using reusable component */}
            <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
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
            <Tabs value={selectedTier.id} className="w-full">
                <TabsList className="grid grid-cols-3 w-full bg-transparent border border-gray-700 rounded-2xl px-1 h-full">
                    {pricingData.map((tier) => (
                        <TabsTrigger
                            key={tier.id}
                            value={tier.id}
                            onClick={() => onTierChange(tier)}
                            className="text-xs font-medium py-2 
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

const PricingPage: React.FC = () => {
    const [selectedMobileTier, setSelectedMobileTier] = React.useState<PricingTier>(pricingData[0]);

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-transparent">
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-2 text-gray-300 mb-2">
                    <Zap className="sm:w-5 sm:h-5 h-4 w-4" />
                    <span className="sm:text-lg font-medium text-base">Membership and pricing plans</span>
                </div>
                <h2 className="text-4xl md:text-[52px] font-medium text-white px-4">
                    Explore the best plan for you
                </h2>
            </div>

            <FreeTrialCard />

            {/* Mobile Tabs */}
            <MobilePlanTabs
                selectedTier={selectedMobileTier}
                onTierChange={setSelectedMobileTier}
            />

            {/* Desktop Grid - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 relative max-w-5xl mx-auto">
                {pricingData.map((tier) => (
                    <PricingCard
                        key={tier.id}
                        tier={tier}
                    />
                ))}
            </div>
        </section>
    );
};

export default PricingPage;