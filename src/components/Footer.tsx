import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import TechTren from '../assets/Home/logo.png';
import AppStore from '../assets/Home/appStore.svg';
import PlayApp from '../assets/Home/playApp.svg';
import { ChevronRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// Types for our link data
interface FooterLink {
    label: string;
    path: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

const Footer = () => {
    const navigate = useNavigate();

    // Footer sections data with consistent routing
    const footerSections: FooterSection[] = [
        {
            title: "Quick links",
            links: [
                { label: "Home", path: "/" },
                { label: "About us", path: "/dashboard" },
                { label: "Sign in", path: "/auth/sign-in" },
                { label: "Blog", path: "/blog" },
                { label: "Pricing", path: "/dashboard" },
                { label: "Get demo", path: "/dashboard" },
                { label: "Contact us", path: "/dashboard" },
            ]
        },
        {
            title: "Products",
            links: [
                { label: "Financial GPT", path: "/dashboard" },
                { label: "Price prediction", path: "/dashboard" },
                { label: "News & AI Insights", path: "/dashboard" },
                { label: "Watchlists", path: "/dashboard" },
                { label: "SwingTrade Signal", path: "/dashboard" },
                { label: "DayTrade Signal", path: "/dashboard" },
                { label: "Congress Monitoring", path: "/dashboard" },
                { label: "AI Stock Picker", path: "/dashboard" },
                { label: "AI Stock Screener", path: "/dashboard" },
                { label: "Crypto Spotlight", path: "/dashboard" },
                { label: "Gainers and Losers", path: "/dashboard" },
            ]
        },
        {
            title: "Resources",
            links: [
                { label: "Journals", path: "/dashboard" },
                { label: "Billing", path: "/dashboard" },
                { label: "Priority support", path: "/dashboard" },
                { label: "Threads", path: "/dashboard" },
                { label: "Communities", path: "/dashboard" },
                { label: "FAQs", path: "/dashboard" },
                { label: "Case studies", path: "/dashboard" },
                { label: "Docs", path: "/dashboard" },
            ]
        }
    ];

    // Legal links
    const legalLinks: FooterLink[] = [
        { label: "Terms of Services", path: "/blog" },
        { label: "Privacy statement", path: "/blog" },
    ];

    const renderDesktopSection = (section: FooterSection) => (
        <div key={section.title}>
            <h4 className="text-white font-semibold mb-4">{section.title}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
                {section.links.map((link) => (
                    <li key={link.path}>
                        <Link
                            to={link.path}
                            className="hover:text-white transition-colors duration-200"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderMobileAccordion = (section: FooterSection) => (
        <AccordionItem key={section.title} value={section.title.toLowerCase()} className="border-b border-gray-700">
            <AccordionTrigger className="text-white font-semibold text-base hover:no-underline py-3">
                {section.title}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-400 pt-2">
                <ul className="space-y-2">
                    {section.links.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className="hover:text-white transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </AccordionContent>
        </AccordionItem>
    );

    return (
        <footer className="Footer w-full max-w-6xl mx-auto pt-16 px-4">
            <div className="border-t pt-12 text-gray-400">
                {/* --- Top Grid (Desktop) --- */}
                <div className="hidden md:grid md:grid-cols-4 gap-10 justify-items-center">
                    {/* --- Left Section --- */}
                    <div className="space-y-5 max-w-xs">
                        <div className="flex items-center gap-2 mb-6">
                            <Link to="/">
                                <img src={TechTren} alt="TechTren" className="w-48" />
                            </Link>
                        </div>
                        <p className="text-sm leading-relaxed pr-10 text-gray-300">
                            AI-powered predictions, real-time data, and investor communities —
                            all in one platform.
                        </p>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-white font-medium mb-2">
                                Sign up Newsletter
                            </h4>
                            <p className="text-sm text-gray-400 mb-3">
                                Learn the numbers that spell success for your business!
                            </p>
                            <button
                                className="special-btn gradient-box-shadow px-12 py-2 !text-white hover:scale-110 transition-all duration-200"
                                onClick={() => navigate('/auth/sign-up')}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

                    {/* --- Footer Sections --- */}
                    {footerSections.map(renderDesktopSection)}
                </div>

                {/* --- Mobile Accordion Sections --- */}
                <div className="md:hidden flex flex-col gap-8">
                    <div className="flex flex-col items-center mt-4 gap-4">
                        <p className="text-base text-center text-gray-300 max-w-xs px-6">
                            AI-powered predictions, real-time data, and investor communities —
                            all in one platform.
                        </p>
                        {/* <div className="flex gap-3 mt-3 flex-col w-full items-center"> */}
                        <div className="hidden w-full items-center">
                            <img src={AppStore} alt="appStore" className="w-[60%] h-auto cursor-pointer" />
                            <img src={PlayApp} alt="playApp" className="w-[60%] h-auto cursor-pointer" />
                        </div>
                        <button className="special-btn px-8 py-2" onClick={() => navigate('/auth/sign-in')}>
                            Sign In
                        </button>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        {footerSections.map(renderMobileAccordion)}

                        <AccordionItem value="newsletter" className="border-b border-gray-700">
                            <AccordionTrigger className="text-white font-semibold text-base hover:no-underline py-3">
                                Sign up Newsletter
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-gray-400 pt-2">
                                <p className="text-sm text-gray-400 mb-3">
                                    Learn the numbers that spell success for your business!
                                </p>
                                <div className="flex items-center border px-2 py-1 rounded-[20px]">
                                    <Input
                                        type="email"
                                        placeholder="Enter email address"
                                        className="!bg-transparent border-none focus-visible:ring-0 focus:outline-none text-gray-200 placeholder-gray-500"
                                    />
                                    <span className="special-btn !py-0 !px-3 flex items-center">
                                        <ChevronRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <hr className="mt-6 bg-gray-800" />

                {/* --- Bottom Section --- */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 py-4 text-center md:text-left">
                    <ul className="flex items-center gap-2 mb-3 md:mt-0">
                        {legalLinks.map((link, index) => (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    {link.label}
                                </Link>
                                {index < legalLinks.length - 1 && <span>|</span>}
                            </li>
                        ))}
                    </ul>
                    <p>© 2025 Tech Tren. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;