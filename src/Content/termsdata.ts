export interface TermsSection {
  id: string;
  number: string;
  title: string;
  heading: string;
  content: string;
}

export const termsSections: TermsSection[] = [
  {
    id: 'overview',
    number: '1',
    title: 'Overview, Educational Use, No Investment Advice',
    heading: 'Overview, Educational use, No investment advice',
    content: `Tech Tren provides data analytics, educational content, and market tools. We are not a broker, dealer, investment adviser, fiduciary, or commodity trading advisor. All information, including outputs from Financial GPT, Price Prediction, alerts, news, charts, and analytics, is for educational and informational purposes only and does not constitute personalized advice, a recommendation, or a solicitation to buy or sell any security or digital asset. Always consult a licensed financial adviser, tax professional, or attorney. Your decisions are your own and at your sole risk.`
  },
  {
    id: 'eligibility',
    number: '2',
    title: 'Eligibility and Accounts',
    heading: 'Eligibility and accounts',
    content: `You must be at least 18 and able to form a binding contract. You are responsible for the accuracy of registration data, safeguarding your credentials, enabling multi-factor authentication where available, and all activity under your account. We may refuse, suspend, or terminate accounts for any violation of these Terms or applicable law.`
  },
  {
    id: 'subscriptions',
    number: '3',
    title: 'Subscriptions, Billing, Trials, and Refunds',
    heading: 'Subscriptions, Billing, Trials, and Refunds',
    content: `Certain features require a paid subscription. Fees, taxes, and charges are billed in advance on a recurring basis until canceled. You authorize us and our payment processors to charge your payment method. Plans auto-renew unless you cancel before the renewal date. Unless required by law, fees are non-refundable. We may change prices or features with notice as required by law.`
  },
  {
    id: 'platform',
    number: '4',
    title: 'Platform Features',
    heading: 'Platform features',
    content: `The platform includes, without limitation: (a) real-time alerts and news delivered to devices; (b) social features enabling posts, comments, and sharing; (c) charting and analytics; (d) Financial GPT, which answers market questions using real-time data; and (e) Price Prediction, which provides non-personalized price ranges based on models and data. Outputs are probabilistic, may be wrong, delayed, incomplete, or inconsistent, and must not be relied upon as advice.`
  },
  {
    id: 'market-data',
    number: '5',
    title: 'Market Data and Third-Party Content',
    heading: 'Market data and third-party content',
    content: `Market data and news may be provided by third parties and are subject to delays, interruptions, or errors. We do not guarantee accuracy, completeness, timeliness, or availability. Third-party links or integrations are provided for convenience and are governed by their own terms and privacy practices. We are not responsible for third-party content or services.`
  },
  {
    id: 'acceptable-use',
    number: '6',
    title: 'Acceptable Use',
    heading: 'Acceptable use',
    content: `You agree not to: (i) violate laws; (ii) harvest, scrape, or reproduce data except through documented APIs and permitted downloads; (iii) reverse engineer, decompile, or circumvent security; (iv) use bots or automation to overload the service; (v) upload malware, defamatory, or unlawful content; (vi) infringe intellectual property or privacy rights; (vii) impersonate others; or (viii) share, resell, or transfer your account without consent. We may remove content or suspend accounts that violate these rules.`
  },
  {
    id: 'intellectual-property',
    number: '7',
    title: 'Intellectual Property; User Content; DMCA',
    heading: 'Intellectual property; User content; DMCA',
    content: `All platform software, models, content, and trademarks are owned by Tech Tren or licensors and protected by law. Subject to these Terms, we grant you a limited, revocable, non-exclusive, non-transferable license to use the service. By posting content, you grant Tech Tren a worldwide, royalty-free license to host, store, reproduce, and display that content to operate and improve the service. For copyright claims, email DMCA notices to dmca@techtren.com with required details.`
  },
  {
    id: 'privacy',
    number: '8',
    title: 'Privacy',
    heading: 'Privacy',
    content: `Our Privacy Policy explains how we collect, use, and protect data. By using the service, you consent to our data practices described there, including use of cookies and service providers.`
  },
  {
    id: 'risk',
    number: '9',
    title: 'Risk Disclosures',
    heading: 'Risk disclosures',
    content: `Trading and investing involve substantial risk, including the possible loss of principal. Model outputs, backtests, scenarios, and forecasts are inherently uncertain and may differ from real results. Past performance does not guarantee future results. Digital assets may be volatile, unregulated, or subject to rapid changes. You assume all risks associated with your decisions.`
  },
  {
    id: 'no-advice',
    number: '10',
    title: 'No Advice, No Fiduciary Duty',
    heading: 'No advice; No fiduciary duty',
    content: `We do not provide personalized advice and have no fiduciary duty to you. You alone decide whether and how to use any information on the platform.`
  },
  {
    id: 'warranties',
    number: '11',
    title: 'No Warranties; Disclaimers',
    heading: 'No warranties; Disclaimers',
    content: `THE SERVICE, DATA, AND CONTENT ARE PROVIDED AS IS AND AS AVAILABLE WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING ACCURACY, COMPLETENESS, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND NON-INTERRUPTION. WE DO NOT WARRANT THAT OUTPUTS OR PREDICTIONS WILL BE CORRECT OR THAT THE SERVICE WILL BE ERROR-FREE OR AVAILABLE AT ALL TIMES.`
  },
  {
    id: 'liability',
    number: '12',
    title: 'Limitation of Liability',
    heading: 'Limitation of liability',
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, TECH TREN, ITS AFFILIATES, AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, TRADING LOSSES, DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR ANY CLAIM WILL NOT EXCEED THE AMOUNT YOU PAID TO TECH TREN FOR THE SERVICE IN THE TWELVE MONTHS BEFORE THE EVENT. SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; YOUR RIGHTS MAY VARY.`
  },
  {
    id: 'indemnification',
    number: '13',
    title: 'Indemnification',
    heading: 'Indemnification',
    content: `You agree to defend, indemnify, and hold harmless Tech Tren and its affiliates from any claims, liabilities, damages, losses, and expenses, including reasonable attorneys’ fees, arising from your content, your use of the service, or your violation of these Terms or applicable law.`
  },
  {
    id: 'service-changes',
    number: '14',
    title: 'Service Changes; Beta; Termination',
    heading: 'Service changes; Beta; Termination',
    content: `We may modify, suspend, or discontinue any part of the service at any time. Beta or experimental features may be offered with reduced reliability and may be withdrawn. You may cancel at any time through your account settings. We may terminate or suspend access for violations, risk, or legal reasons. Upon termination, your license ends and certain provisions survive.`
  },
  {
    id: 'governing-law',
    number: '15',
    title: 'Governing Law and Arbitration',
    heading: 'Governing law and arbitration',
    content: `These Terms are governed by the laws of the State of Louisiana, without regard to conflicts of law. Any dispute will be resolved by binding arbitration administered by the American Arbitration Association under its Commercial Rules, on an individual basis. CLASS ACTIONS AND JURY TRIALS ARE WAIVED. You may opt out within 30 days of first acceptance by emailing arbitration-optout@techtren.com with your account details.`
  },
  {
    id: 'international-use',
    number: '16',
    title: 'International Use and Export',
    heading: 'International use and export',
    content: `You are responsible for compliance with local laws. You agree to comply with export control and sanctions laws and not to use the service in prohibited jurisdictions.`
  },
  {
    id: 'force-majeure',
    number: '17',
    title: 'Force Majeure',
    heading: 'Force majeure',
    content: `We are not liable for delays or failures due to events beyond our reasonable control, including outages, cyberattacks, natural disasters, labor disputes, or acts of government.`
  },
  {
    id: 'app-stores',
    number: '18',
    title: 'App Stores and Third-Party Platforms',
    heading: 'App stores and third-party platforms',
    content: `If you access the service via Apple App Store or Google Play, you acknowledge their terms apply, they are third-party beneficiaries, and they have no obligation to support the service.`
  },
  {
    id: 'changes-terms',
    number: '19',
    title: 'Changes to These Terms',
    heading: 'Changes to these terms',
    content: `We may update these Terms. Material changes will be posted with notice as required. Continued use after changes becomes effective constitutes acceptance.`
  },
  {
    id: 'miscellaneous',
    number: '20',
    title: 'Miscellaneous',
    heading: 'Miscellaneous',
    content: `These Terms, together with our Privacy Policy, form the entire agreement and supersede prior understandings. You may not assign without our consent; we may assign. If any provision is found unenforceable, the remainder remains in effect. No waiver is effective unless in writing.`
  },
  {
    id: 'contact',
    number: '21',
    title: 'Contact',
    heading: 'Contact',
    content: `Questions about these Terms may be sent to legal@techtren.com.`
  },
];