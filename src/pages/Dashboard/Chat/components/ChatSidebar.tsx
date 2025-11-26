import { ArrowLeft, Trash2, Loader, Pencil, Check, X, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    useConversationsList,
    useDeleteConversation,
    useUpdateConversation,
    usePrefetchConversations
} from "@/api/hooks/dbProxy/useChat";
import { useChatStore } from "@/api/stores/chat-store";
import type { Conversation, ChatMessage } from "@/types/chat.types";

import MessageSvg from '../../../../assets/Dashboard/message.svg';
import logo from "../../../../assets/Home/logosm.svg";

const models = [
    "Auto",
    "Tax Agent",
    "Financial Expert",
    "Custom AI screener",
    "Single ticker price prediction",
];

interface ChatSidebarProps {
    sidebarOpen: boolean;
    currentConversationId: string | null;
    onConversationSelect: (conversationId: string) => void;
    onNewConversation: () => string;
}

const ChatSidebar = ({
    sidebarOpen,
    currentConversationId,
    onConversationSelect,
    onNewConversation
}: ChatSidebarProps) => {
    const navigate = useNavigate();
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [selectedModel, setSelectedModel] = useState("Financial Expert");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [page] = useState(1);

    // Hooks
    const { data: conversationsData, isLoading: isLoadingConversations } = useConversationsList(page, 20);
    const deleteConversation = useDeleteConversation();
    const updateConversation = useUpdateConversation();
    const prefetchConversations = usePrefetchConversations();
    const { setMessages } = useChatStore();
    // console.log("This is the conversationsData", conversationsData)
    // console.log("And this is prefetchConversations", prefetchConversations)
    // Prefetch conversations on mount
    useEffect(() => {
        prefetchConversations();
    }, [prefetchConversations]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Filter conversations to only show those with conversationId starting with "chat_"
    const filteredConversations = conversationsData?.data?.filter(
        (conversation: Conversation) => conversation.conversationId.startsWith("chat_")
    ) || [];

    const handleSelect = (model: string) => {
        setSelectedModel(model);
        setIsOpen(false);
    };

    const handleNewChat = () => {
        onNewConversation();
        // const newId = onNewConversation();
        // setEditingChatId(newId);
        // setEditTitle("New Conversation");
    };

    const handleSelectChat = (conversation: Conversation) => {
        if (editingChatId) return;

        // Parse and set messages from the selected conversation
        if (conversation.contentJson) {
            try {
                const parsed = JSON.parse(conversation.contentJson);
                if (parsed.messages) {
                    setMessages(conversation.conversationId, parsed.messages);
                }
            } catch (error) {
                console.error("Error parsing conversation:", error);
            }
        }

        onConversationSelect(conversation.conversationId);
    };

    const handleDeleteChat = async (e: React.MouseEvent, conversationId: string) => {
        e.stopPropagation();

        // if (confirm("Are you sure you want to delete this conversation?")) {
        await deleteConversation.mutateAsync(conversationId);
        // }
    };

    const handleStartEdit = (e: React.MouseEvent, conversation: Conversation) => {
        e.stopPropagation();
        setEditingChatId(conversation.conversationId);

        // Try to extract title from the first user message
        try {
            const parsed = JSON.parse(conversation.contentJson);
            if (parsed.messages && parsed.messages.length > 0) {
                const firstUserMessage = parsed.messages.find((m: ChatMessage) => m.role === 'user');
                setEditTitle(firstUserMessage?.content.slice(0, 50) || "Untitled Chat");
            }
        } catch {
            setEditTitle("Untitled Chat");
        }
    };

    const handleSaveEdit = async (e: React.MouseEvent, conversation: Conversation) => {
        e.stopPropagation();

        if (!editTitle.trim()) {
            alert('Chat title cannot be empty');
            return;
        }

        // Update the title in the contentJson
        try {
            const parsed = JSON.parse(conversation.contentJson);
            // Store title as metadata
            parsed.title = editTitle.trim();

            await updateConversation.mutateAsync({
                conversationId: conversation.conversationId,
                payload: { contentJson: JSON.stringify(parsed) }
            });
        } catch (error) {
            console.error("Error updating conversation:", error);
        }

        setEditingChatId(null);
    };

    const handleCancelEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingChatId(null);
        setEditTitle("");
    };

    // Helper to extract title from conversation
    const getConversationTitle = (conversation: Conversation): string => {
        try {
            const parsed = JSON.parse(conversation.contentJson);
            if (parsed.title) return parsed.title;
            if (parsed.messages && parsed.messages.length > 0) {
                const firstUserMessage = parsed.messages.find((m: ChatMessage) => m.role === 'user');
                return firstUserMessage?.content.slice(0, 50) || "Untitled Chat";
            }
        } catch {
            // Fallback
        }
        return "Untitled Chat";
    };

    // Helper to get message count
    const getMessageCount = (conversation: Conversation): number => {
        try {
            const parsed = JSON.parse(conversation.contentJson);
            return parsed.messages?.length || 0;
        } catch {
            return 0;
        }
    };

    // Group chats by date
    const groupChatsByDate = (conversations: Conversation[]) => {
        const today: Conversation[] = [];
        const yesterday: Conversation[] = [];
        const previous7Days: Conversation[] = [];
        const previous30Days: Conversation[] = [];
        const older: Conversation[] = [];

        const now = new Date();

        conversations.forEach(chat => {
            const chatDate = new Date(chat.updatedAt);
            const diffTime = now.getTime() - chatDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) today.push(chat);
            else if (diffDays === 1) yesterday.push(chat);
            else if (diffDays <= 7) previous7Days.push(chat);
            else if (diffDays <= 30) previous30Days.push(chat);
            else older.push(chat);
        });

        return { today, yesterday, previous7Days, previous30Days, older };
    };

    const renderChatGroup = (title: string, chats: Conversation[]) => {
        if (chats.length === 0) return null;

        return (
            <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    {title}
                </h3>
                <div className="space-y-1">
                    {chats.map((chat) => (
                        <div
                            key={chat.conversationId}
                            onClick={() => handleSelectChat(chat)}
                            className={`group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${currentConversationId === chat.conversationId
                                ? 'bg-emerald-500/20 border border-emerald-500/40'
                                : 'hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            {/* Chat Icon */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <img src={MessageSvg} alt="Chat" className="w-4 h-4" />
                            </div>

                            {/* Chat Content */}
                            <div className="flex-1 min-w-0">
                                {editingChatId === chat.conversationId ? (
                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="flex-1 bg-white/10 text-sm text-gray-200 px-2 py-1 rounded border border-emerald-500/40 focus:outline-none focus:border-emerald-500"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveEdit(e as any, chat);
                                                if (e.key === 'Escape') handleCancelEdit(e as any);
                                            }}
                                        />
                                        <button
                                            onClick={(e) => handleSaveEdit(e, chat)}
                                            className="p-1 hover:bg-emerald-500/20 rounded"
                                        >
                                            <Check size={14} className="text-emerald-400" />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="p-1 hover:bg-red-500/20 rounded"
                                        >
                                            <X size={14} className="text-red-400" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-200 truncate font-medium flex-1">
                                            {getConversationTitle(chat)}
                                        </p>
                                        {/* <Cloud size={12} className="text-emerald-400 flex-shrink-0" /> */}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {getMessageCount(chat)} message{getMessageCount(chat) !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            {editingChatId !== chat.conversationId && (
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 flex-col">
                                    <button
                                        onClick={(e) => handleStartEdit(e, chat)}
                                        className="p-1.5 hover:bg-gray-200/20 rounded-md group cursor-pointer"
                                        title="Edit title"
                                    >
                                        <Pencil size={14} className="text-gray-400 group-hover:text-gray-200" />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteChat(e, chat.conversationId)}
                                        className="p-1.5 hover:bg-gray-200/20 rounded-md disabled:opacity-50 group cursor-pointer"
                                        title="Delete chat"
                                        disabled={deleteConversation.isPending}
                                    >
                                        <Trash2 size={14} className="text-gray-400 group-hover:text-gray-200" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Use filtered conversations instead of all conversations
    const { today, yesterday, previous7Days, previous30Days, older } = groupChatsByDate(filteredConversations);

    return (
        <AnimatePresence>
            {sidebarOpen && (
                <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="z-[50] glass w-full md:w-70 flex flex-col border !border-l-transparent rounded-tr-3xl rounded-br-3xl !rounded-tl-none !rounded-bl-none h-full pt-3 pb-4"
                    style={{
                        background: 'rgba(20, 20, 20, 0.30)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    {/* Header */}
                    <div className="border-b border-white/10 pb-4 px-4 flex items-center flex-col gap-5">
                        <div
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center self-start gap-2 pt-4 cursor-pointer text-gray-300 hover:text-white transition-all"
                        >
                            <ArrowLeft size={18} />
                            <span className="text-sm font-medium">Back</span>
                        </div>

                        <button
                            onClick={handleNewChat}
                            className="w-full py-2.5 px-4 special-btn transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span className="text-lg">+</span>
                            New Chat
                        </button>
                    </div>

                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
                        {isLoadingConversations ? (
                            <div className="flex items-center justify-center mt-10">
                                <Loader className="animate-spin text-emerald-400" size={24} />
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="flex flex-col items-center text-center text-gray-400 mt-20">
                                <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center mx-auto mb-4">
                                    <img src={MessageSvg} alt="Messages" className="w-8 h-8" />
                                </div>
                                <p className="text-white font-semibold text-lg">No conversations yet</p>
                                <p className="text-sm text-gray-400 mt-2 px-6 leading-relaxed">
                                    Start a new chat to begin your financial analysis journey
                                </p>
                            </div>
                        ) : (
                            <>
                                {renderChatGroup('Today', today)}
                                {renderChatGroup('Yesterday', yesterday)}
                                {renderChatGroup('Previous 7 Days', previous7Days)}
                                {renderChatGroup('Previous 30 Days', previous30Days)}
                                {renderChatGroup('Older', older)}
                            </>
                        )}
                    </div>

                    {/* Model Selector */}
                    <div ref={dropdownRef} className="relative flex flex-col items-center mt-8">
                        <div className="text-white text-sm mb-2 font-semibold">Selected Model</div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center justify-between w-56 px-4 py-2 text-white rounded-lg shadow-md transition-all duration-300 cursor-pointer"
                            style={{
                                background: "linear-gradient(275.19deg, #14E893 -15.5%, #5131AD 98.25%)",
                            }}
                        >
                            <div className="bg-emerald-500/40 p-1 rounded-full">
                                <img src={logo} alt="logo" className="w-6 h-6" />
                            </div>
                            <span className="text-base">{selectedModel}</span>
                            {/* <ArrowRight /> */}
                            <ChevronRight />
                        </button>

                        {isOpen && (
                            <div
                                className="absolute -top-28 -right-[196px] mt-2 w-56 glass"
                                style={{
                                    background: "rgba(20, 20, 20, 0.80)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                }}
                            >
                                {models.map((model) => (
                                    <div
                                        key={model}
                                        onClick={() => handleSelect(model)}
                                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-white/5 transition-all duration-300 ${selectedModel === model ? "text-[#14E893]" : ""
                                            }`}
                                    >
                                        {model}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatSidebar;