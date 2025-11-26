export interface PricingFeature {
    name: string;
    included: boolean;
}

export interface PricingTier {
    id: string;
    name: string;
    description: string;
    monthlyPrice: string;
    yearlyPrice: string;
    month: string;
    savings?: string;
    popular?: boolean;
    // gradient: string;
    // buttonVariant: 'default' | 'gradient' | 'primary';
    features: {
        aiPrompts: {
            title: string;
            items: PricingFeature[];
        };
        tradingStrategies: {
            title: string;
            items: PricingFeature[];
        };
        premiumFeatures: {
            title: string;
            items: PricingFeature[];
        };
    };
}

export const pricingData: PricingTier[] = [
    {
        id: 'basic',
        name: 'Basic plan',
        description: 'Limited time - free trial',
        monthlyPrice: '$0.00',
        yearlyPrice: '$0.00',
        month: '100 AI Prompts per Month',
        features: {
            aiPrompts: {
                title: 'Including',
                items: [
                    { name: 'Should I Buy Analysis', included: true },
                    { name: 'Price Prediction', included: false },
                    { name: 'Technical Analysis', included: true },
                    { name: 'Option Strategy', included: true },
                    { name: 'Tax GPT', included: false },
                ]
            },
            tradingStrategies: {
                title: 'Dashboard Access',
                items: [
                    { name: 'Threads', included: true },
                    { name: 'Watchlist', included: true },
                    { name: 'Real-time news', included: true },
                    { name: 'Trading Strategies', included: true },
                    { name: 'AI Stock Picker', included: false },
                    { name: 'SwingMax Signal', included: false },
                    { name: 'DayTrading Signal', included: false },
                    { name: 'Crypto Radar', included: false },
                    { name: 'AI Alert', included: false },
                ]
            },
            premiumFeatures: {
                title: 'Premium Features',
                items: [
                    { name: 'AI Screener', included: false },
                    { name: 'Congress Trade Monitor', included: false },
                    { name: 'Crypto Spotlight', included: false },
                    { name: 'Real-time Quotes & Charts', included: true },
                    { name: 'Gainers and Losers', included: true },
                    { name: 'Alerts for Signals & Movers', included: false },
                    { name: 'First Priority Support', included: false },
                ]
            }
        }
    },
    {
        id: 'expert',
        name: 'Expert plan',
        description: 'For professional traders',
        monthlyPrice: '$24.99',
        yearlyPrice: '$299.88',
        month: '800 AI Prompts per Month',
        savings: 'Save $0.00',
        features: {
            aiPrompts: {
                title: 'Including',
                items: [
                    { name: 'Should I Buy Analysis', included: true },
                    { name: 'Price Prediction', included: true },
                    { name: 'Technical Analysis', included: true },
                    { name: 'Option Strategy', included: true },
                    { name: 'Tax GPT', included: true },
                ]
            },
            tradingStrategies: {
                title: 'Dashboard Access',
                items: [
                    { name: 'Threads', included: true },
                    { name: 'Watchlist', included: true },
                    { name: 'Real-time news', included: true },
                    { name: 'Trading Strategies', included: true },
                    { name: 'AI Stock Picker', included: true },
                    { name: 'SwingTrading signal', included: true },
                    { name: 'Day Trading Signal', included: true },
                    { name: 'Crypto Radar', included: false },
                    { name: 'AI Alert', included: false },
                ]
            },
            premiumFeatures: {
                title: 'Premium features',
                items: [
                    { name: 'AI Screener', included: false },
                    { name: 'Congress Trade Monitor', included: true },
                    { name: 'Crypto Spotlight', included: false },
                    { name: 'Real-time Quotes & Charts', included: true },
                    { name: 'Gainers and Losers', included: true },
                    { name: 'Alerts for Signals & Movers', included: false },
                    { name: 'First Priority Support', included: false },
                ]
            }
        }
    },
    {
        id: 'unlimited',
        name: 'Unlimited plan',
        description: 'Most popular choice',
        monthlyPrice: '$54.99',
        yearlyPrice: '$659.88',
        month: '1600 AI Prompts Per Month',
        savings: 'Save $0.00',
        popular: true,
        features: {
            aiPrompts: {
                title: 'Including',
                items: [
                    { name: 'Should I Buy Analysis', included: true },
                    { name: 'Price Prediction', included: true },
                    { name: 'Technical Analysis', included: true },
                    { name: 'Option Strategy', included: true },
                    { name: 'Tax GPT', included: true },
                ]
            },
            tradingStrategies: {
                title: 'Dashboard Access:',
                items: [
                    { name: 'Threads', included: true },
                    { name: 'Watchlist', included: true },
                    { name: 'Real-time news', included: true },
                    { name: 'Trading Strategies', included: true },
                    { name: 'AI Stock Picker', included: true },
                    { name: 'SwingTrading signal', included: true },
                    { name: 'Day Trading Signal', included: true },
                    { name: 'Crypto Radar', included: true },
                    { name: 'AI Alert', included: true },
                ]
            },
            premiumFeatures: {
                title: 'Premium features',
                items: [
                    { name: 'AI Screener', included: true },
                    { name: 'Congress Trade Monitor', included: true },
                    { name: 'Crypto Spotlight', included: true },
                    { name: 'Real-time Quotes & Charts', included: true },
                    { name: 'Gainers and Losers', included: true },
                    { name: 'Alerts for Signals & Movers', included: true },
                    { name: 'First Priority Support', included: true },
                ]
            }
        }
    }
];