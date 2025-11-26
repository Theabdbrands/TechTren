export interface RelatedItem {
  tag: string;
  title: string;
  date: string;
  image: string;
}

export interface NewsContent {
  title: string;
  author: string;
  authorRole: string;
  carouselImages: string[];
  intro: string[];
  sections: {
    heading: string;
    content: string;
    image?: string;
  }[];
  related: RelatedItem[];
}

export const newsData: NewsContent = {
  title: "Trump tariffs to wreak Havoc for 'Inflation-fearing consumers,' shows Fed's beige book, but analyst notes recession risks appear 'well contained'.",
  author: "Namrata Sen",
  authorRole: "Benzinga Staff Writer",
  carouselImages: [
    "/src/assets/articles/trumpjani.png",
    "/src/assets/articles/trumpjani.png",
    "/src/assets/articles/trumpjani.png",
    "/src/assets/articles/trumpjani.png",
    "/src/assets/articles/trumpjani.png",
    "/src/assets/articles/trumpjani.png",
  ],
  intro: [
    "The Federal Reserve's latest Beige Book report reveals that tariffs implemented by the Donald Trump administration are translating into higher costs for businesses, with the financial burden increasingly being passed on to consumers.",
    "However, the report details an economy that “changed little on balance,” with one analyst highlighting that the broader risks of a recession remain low."
  ],
  sections: [
    {
      heading: "Trump’s tariffs are causing price hikes",
      content: `The October 2025 summary indicates that tariff-induced price hikes were reported across many of the Fed's districts. While some businesses absorbed the initial shock to protect market share, others in manufacturing and retail have begun “fully passing higher import costs along to their customers”.\n\nThis has led to price-sensitive behavior, with the report noting that “lower- and middle-income households continued to seek discounts and promotions in the face of rising prices and elevated economic uncertainty”.\n\nThe economic landscape remains varied, with three districts reporting slight growth, five seeing no change, and four noting a slight softening of activity.`
    },
    {
      heading: "Price action",
      content: `The S&P 500 index ended 0.40% higher at 6,671.06 on Wednesday, whereas the Nasdaq 100 index advanced 0.68% to 24,745.36. On the other hand, Dow Jones fell 0.037% to 46,253.31.\n\nThe SPDR S&P 500 ETF Trust (NYSE:SPY) and Invesco QQQ Trust ETF (NASDAQ:QQQ), which track the S&P 500 index and Nasdaq 100 index, respectively, rose on Wednesday. The SPY was up 0.44% at $665.17, while the QQQ advanced 0.71% to $602.22, according to Benzinga Pro data.\n\nOn Thursday, the futures of the S&P 500, Dow Jones, and Nasdaq 100 indices were trading in a mixed manner.`
    },
    {
      heading: "Rising costs will be a ‘Greater Burden’ for consumers",
      image: "/src/assets/articles/mask.png",
      content: `Eric Teal, Chief Investment Officer for Comerica Wealth Management, observed that companies are running out of ways to mitigate the duties.\n\n“Ultimately, it is likely the inflation-fearing consumer will bear an even greater burden of the tariff costs,” Teal stated in his commentary.`
    },
    {
      heading: "Government shutdown to amplify weakness?",
      content: `The report’s findings cover a period before the recent government shutdown, a factor that could worsen the slowdown. According to Jeffrey Roach, Chief Economist for LPL Financial, the “slowdown started before the government shutdown, which will only exacerbate the weakness.”\n\nHe noted that waning demand has pushed down prices for some materials like steel and lumber.`
    },
    {
      heading: "Matt Maley’s strategy for the CPI countdown",
      content: `As the CPI release approaches and earnings season accelerates, volatility is ramping up across equities, metals, and tech. On Wednesday, October 22 at 6 PM ET, Benzinga’s Chief Market Strategist Matt Maley will break down how he is positioning for the week ahead, including the sectors he believes could rotate and the tactical trades designed to capture both sides of the move.`
    }
  ],
  related: [
    {
      tag: "AMZN",
      title: "Why D-Local stock is soaring this week",
      date: "Oct 17, 2025",
      image: "/src/assets/articles/1.png",
    },
    {
      tag: "GOOGLE",
      title: "2 Growth stocks to invest $1,000 in right now",
      date: "Oct 17, 2025",
      image: "/src/assets/articles/2.png",
    },
    {
      tag: "MSFT",
      title: "Gold and tech rising together, but history says one will soon...",
      date: "Oct 17, 2025",
      image: "/src/assets/articles/3.jpg",
    },
  ]
};