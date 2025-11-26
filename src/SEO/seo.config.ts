// SEO Configuration based on keyword mapping sheet
export const seoConfig = {
    home: {
        title: 'AI Financial Assistant & Finance Chatbot for Investments - Tech Tren',
        description: 'Simplify investing with the best AI financial assistant. Track, plan, and grow your wealth smarter—try Tech Tren\'s AI finance chatbot today!',
        keywords: 'AI financial assistant, AI finance chatbot, best ai for investments, financial planning AI, investment tracking',
        canonical: 'https://www.techtren.com/'
    },

    // New landing pages to be created
    stockPredictor: {
        title: 'AI Stock Predictor & Forecast App for Smarter Trading',
        description: 'Use advanced AI stock prediction software to forecast prices and trends. Make confident trades with Tech Tren\'s powerful AI stock predictor today!',
        keywords: 'AI stock predictor, ai stock forecast, AI stock prediction, stock price prediction software, stock forecast app',
        canonical: 'https://www.techtren.com/ai-stock-predictor'
    },

    newsAlerts: {
        title: 'Real-Time Stock News Alerts & AI Financial Updates',
        description: 'Stay ahead with AI-powered financial news and instant stock alerts. Track real-time market trends and make faster, smarter investment moves!',
        keywords: 'stock news alerts, AI financial news, real-time stock news alerts, financial market updates',
        canonical: 'https://www.techtren.com/stock-news-alerts'
    },

    alertsApp: {
        title: 'AI Stock & Crypto Alerts App for Smarter Trading',
        description: 'Get real-time AI stock and crypto alerts with advanced trading software. Stay informed, react fast, and enhance your investment strategy today!',
        keywords: 'AI stock alerts app, crypto alerts in real time, best trading alerts software, stock alert notifications',
        canonical: 'https://www.techtren.com/trading-alerts'
    },

    chartingTool: {
        title: 'Stock Analysis Tool with AI Charting & Technical Indicators',
        description: 'Analyze markets with AI-powered stock charting and technical indicators. Gain deep insights, track trends, and refine your trading strategy today!',
        keywords: 'best stock analysis tool, AI stock charting, best stock charting app, best technical indicators for trading',
        canonical: 'https://www.techtren.com/ai-charting'
    },

    // Existing pages
    blog: {
        title: 'Financial News & Investment Insights Blog - Tech Tren',
        description: 'Stay updated with the latest financial news, stock market analysis, and AI-powered investment insights from Tech Tren\'s expert blog.',
        keywords: 'financial news, investment blog, stock market news, crypto news, AI investment insights',
        canonical: 'https://www.techtren.com/blog'
    },

    termsOfService: {
        title: 'Terms of Service - Tech Tren',
        description: 'Read Tech Tren\'s terms of service to understand our policies, user agreements, and guidelines for using our AI financial platform.',
        keywords: 'terms of service, user agreement, legal terms',
        canonical: 'https://www.techtren.com/terms-services'
    },

    // Dashboard pages (no index for logged-in areas)
    dashboard: {
        title: 'Dashboard - Tech Tren',
        description: 'Access your personalized AI-powered investment dashboard with real-time insights, predictions, and market analysis.',
        robots: 'noindex, nofollow'
    },

    notFound: {
        title: '404 - Page Not Found - Tech Tren',
        description: 'The page you are looking for doesn\'t exist. Return to Tech Tren\'s homepage to explore our AI financial tools.',
        robots: 'noindex, nofollow'
    }
};

export type SEOConfigKey = keyof typeof seoConfig;