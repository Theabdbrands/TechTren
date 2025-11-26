import { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import logo from '../../../assets/Home/logosm.svg';
import AiStrategiesGIF from '../../../assets/Home/aiBlendedGif.gif';
import MessageFinancial from '../../../assets/Dashboard/message.svg';
import { useChatWithAutoSave } from '@/api/hooks/dbProxy/useChat';
import { useChatStore } from '@/api/stores/chat-store';
import type { ChatMessage } from '@/types/chat.types';
import { useAuthStore } from '@/api/stores/auth-store';
import { useLocation } from 'react-router-dom';

const THINKING_MESSAGES = [
    "Consulting Tech Tren financial agent...",
    "Consulting Tech Tren tax agent...",
    "Scanning realtime technicals data across stock and crypto markets...",
    "Digesting news from various news sources...",
    "Retrieving relevant financials data...",
];

function GetFinancialMessageIcon(icon: any) {
    return <img src={icon} alt="icon" className='w-5 h-5 filter-green opacity-60' />
}

const SUGGESTED_QUESTIONS = [
    { text: "What stocks should I buy?", icon: GetFinancialMessageIcon(MessageFinancial) },
    { text: "Do I have to pay tax for my crypto investment", icon: GetFinancialMessageIcon(MessageFinancial) },
    { text: "How's the stock & crypto market going?", icon: GetFinancialMessageIcon(MessageFinancial) },
    { text: "Analyza AAPL", icon: GetFinancialMessageIcon(MessageFinancial) },
    { text: "Explain the wheel options stratedy", icon: GetFinancialMessageIcon(MessageFinancial) },
];

interface FinancialGPTProps {
    conversationId?: string;
}

const FinancialGPT = ({ conversationId }: FinancialGPTProps) => {
    const [input, setInput] = useState('');
    const [thinkingMessage, setThinkingMessage] = useState(THINKING_MESSAGES[0]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const thinkingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { user } = useAuthStore();
    const location = useLocation();
    const [hasAutoSent, setHasAutoSent] = useState(false);

    // Hooks
    const { sendMessage, isLoading, error, reset } = useChatWithAutoSave();
    const { getConversation } = useChatStore();

    useEffect(() => {
        // Check if we have an initial message from navigation state
        if (location.state?.initialMessage && !hasAutoSent) {
            const message = location.state.initialMessage;
            handleSendMessage(message);
            setHasAutoSent(true);
            window.history.replaceState({}, document.title);
        }
    }, [location.state, hasAutoSent, conversationId]);

    // Get messages from store
    const conversation = conversationId ? getConversation(conversationId) : undefined;
    const messages = conversation?.messages || [];
    const isWelcomeScreen = messages.length === 0;

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle thinking message rotation during loading
    useEffect(() => {
        if (isLoading) {
            let index = 0;
            thinkingIntervalRef.current = setInterval(() => {
                index = (index + 1) % THINKING_MESSAGES.length;
                setThinkingMessage(THINKING_MESSAGES[index]);
            }, 2000);
        } else {
            if (thinkingIntervalRef.current) {
                clearInterval(thinkingIntervalRef.current);
                thinkingIntervalRef.current = null;
            }
        }

        return () => {
            if (thinkingIntervalRef.current) {
                clearInterval(thinkingIntervalRef.current);
            }
        };
    }, [isLoading]);

    const handleSendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        setInput('');

        try {
            await sendMessage(messageText, conversationId);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex justify-between pt-16 sm:pt-0 items-center flex-col h-full w-full relative bg-transparent min-h-screen">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-8 w-full">
                {isWelcomeScreen && (
                    <div className="text-center mt-12 mb-0 sm:mt-4">
                        <img src={logo} alt="logo" className="mx-auto w-24 sm:w-auto" />
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-2 mt-3 sm:mt-5">Ask Financial GPT</h1>
                        <p className="text-sm sm:text-base text-gray-400 mb-4 w-full sm:w-80 mx-auto px-4 sm:px-0">
                            Your AI-powered investor and communicator all in one platform.
                        </p>
                    </div>
                )}

                {isWelcomeScreen && (
                    <div className='w-full h-full relative flex justify-center mb-4 sm:mb-8'>
                        <div className='w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] h-24 sm:h-32 md:h-36'
                            style={{
                                mixBlendMode: "plus-lighter"
                            }}
                        >
                            <img
                                src={AiStrategiesGIF}
                                alt="gif"
                                className='w-full h-full object-cover'
                            />
                        </div>
                    </div>
                )}

                {isWelcomeScreen && !isLoading && (
                    <div className="flex items-center justify-around flex-col mx-auto text-center mb-4 sm:mb-6 mt-6 sm:mt-10 px-4 sm:px-0">
                        <p className="text-lg sm:text-xl md:text-[26px] font-semibold mb-1">
                            Welcome again, {user?.user_name}
                        </p>
                        <p className="text-sm sm:text-base text-gray-400 max-w-full sm:max-w-[530px]">
                            Ask me anything about financial markets, trading strategies, stock analysis, economic trends, or
                            investment insights. I'm here to help you make informed financial decisions.
                        </p>
                    </div>
                )}

                {/* Display all messages */}
                {messages.map((message: ChatMessage, index: number) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[85%] sm:max-w-xs md:max-w-2xl px-3 sm:px-4 py-2 sm:py-3 my-4 sm:my-6 ${message.role === 'user'
                                ? 'bg-emerald-600/30 !py-2 rounded-lg text-white'
                                : 'glass text-gray-200 border !rounded-lg'
                                }`}
                            style={message.role === 'assistant' ? {
                                background: 'rgba(20, 20, 20, 0.30)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            } : undefined}>
                            {message.role === 'assistant' ? (
                                <div className='flex items-start h-fit gap-2'>
                                    <div className="flex-1 min-w-0">
                                        <div className="markdown-content text-xs sm:text-sm leading-relaxed">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}
                                                components={{
                                                    // Customize heading styles
                                                    h1: ({ node, ...props }) => (
                                                        <h1 className="text-xl sm:text-2xl font-bold mb-3 mt-4 text-emerald-400" {...props} />
                                                    ),
                                                    h2: ({ node, ...props }) => (
                                                        <h2 className="text-lg sm:text-xl font-bold mb-2 mt-3 text-emerald-400" {...props} />
                                                    ),
                                                    h3: ({ node, ...props }) => (
                                                        <h3 className="text-base sm:text-lg font-semibold mb-2 mt-2 text-emerald-300" {...props} />
                                                    ),
                                                    // Customize paragraph spacing
                                                    p: ({ node, ...props }) => (
                                                        <p className="mb-3 last:mb-0" {...props} />
                                                    ),
                                                    // Customize lists
                                                    ul: ({ node, ...props }) => (
                                                        <ul className="list-disc list-inside mb-3 space-y-1 ml-2" {...props} />
                                                    ),
                                                    ol: ({ node, ...props }) => (
                                                        <ol className="list-decimal list-inside mb-3 space-y-1 ml-2" {...props} />
                                                    ),
                                                    li: ({ node, ...props }) => (
                                                        <li className="ml-2" {...props} />
                                                    ),
                                                    // Customize links
                                                    a: ({ node, ...props }) => (
                                                        <a
                                                            className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            {...props}
                                                        />
                                                    ),
                                                    // Customize code blocks
                                                    code: ({ node, inline, ...props }: any) =>
                                                        inline ? (
                                                            <code
                                                                className="bg-slate-800/60 text-emerald-300 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono"
                                                                {...props}
                                                            />
                                                        ) : (
                                                            <code
                                                                className="block bg-slate-900/60 text-emerald-300 p-3 rounded-lg overflow-x-auto text-xs sm:text-sm font-mono my-2"
                                                                {...props}
                                                            />
                                                        ),
                                                    // Customize blockquotes
                                                    blockquote: ({ node, ...props }) => (
                                                        <blockquote
                                                            className="border-l-4 border-emerald-500/50 pl-4 py-2 my-3 bg-slate-800/30 rounded-r italic"
                                                            {...props}
                                                        />
                                                    ),
                                                    // Customize tables
                                                    table: ({ node, ...props }) => (
                                                        <div className="overflow-x-auto my-3">
                                                            <table className="min-w-full border-collapse border border-slate-700" {...props} />
                                                        </div>
                                                    ),
                                                    th: ({ node, ...props }) => (
                                                        <th className="border border-slate-700 bg-slate-800/60 px-3 py-2 text-left font-semibold" {...props} />
                                                    ),
                                                    td: ({ node, ...props }) => (
                                                        <td className="border border-slate-700 px-3 py-2" {...props} />
                                                    ),
                                                    // Customize horizontal rules
                                                    hr: ({ node, ...props }) => (
                                                        <hr className="my-4 border-slate-700" {...props} />
                                                    ),
                                                    // Strong/Bold text
                                                    strong: ({ node, ...props }) => (
                                                        <strong className="font-bold text-emerald-300" {...props} />
                                                    ),
                                                    // Emphasis/Italic text
                                                    em: ({ node, ...props }) => (
                                                        <em className="italic text-gray-300" {...props} />
                                                    ),
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {message.content}
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {/* Error Message */}
                {error && (
                    <div className="flex justify-center px-4">
                        <div className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 sm:px-4 py-2 rounded-lg max-w-full sm:max-w-2xl">
                            <p className="text-xs sm:text-sm">Error: {(error as any).message || "Something went wrong. Please try again."}</p>
                            <button
                                onClick={reset}
                                className="text-xs underline mt-1 hover:text-red-300"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {/* Suggested Questions - Only show on welcome screen */}
                {isWelcomeScreen && !isLoading && messages.length === 0 && (
                    <div className="px-2 sm:px-4 md:px-8 pb-4 sm:pb-6">
                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-4xl mx-auto items-center">
                            {SUGGESTED_QUESTIONS.map((question, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(question.text)}
                                    className="flex items-center cursor-pointer gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-400/20 hover:border-emerald-500/60 transition-all duration-200 text-xs sm:text-sm font-medium
                                        justify-center md:justify-start"
                                    disabled={isLoading}
                                >
                                    {question.icon}
                                    <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-none">{question.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-start px-2 sm:px-0">
                        <div className="bg-slate-800/40 text-gray-200 border border-slate-700/40 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl flex items-center gap-2 sm:gap-3 max-w-[90%] sm:max-w-none">
                            <Loader size={18} className="sm:w-5 sm:h-5 animate-spin text-emerald-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">{thinkingMessage}</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="px-3 sm:px-4 md:px-8 pb-2 sm:pb-4 w-full mt-4 sm:mt-10">
                <div
                    className="flex items-center gap-2 sm:gap-3 border rounded-full px-3 sm:px-4 sm:pl-6 w-full sm:w-[90%] md:w-[70%] mx-auto"
                    style={{
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '1px 0px 4px 0px rgba(40, 173, 155, 0.5), -2px 0px 14px 0px rgba(78, 58, 172, 0.5)',
                    }}
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your question about markets, stocks, or crypto..."
                        className="bg-transparent flex-1 text-xs sm:text-sm text-gray-300 outline-none py-3 sm:py-4 placeholder-gray-500"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={() => handleSendMessage()}
                        disabled={isLoading || !input.trim()}
                        className="special-btn hover:scale-110 py-1.5 sm:py-2 px-3 sm:px-4 flex-shrink-0"
                    >
                        <Send size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FinancialGPT;