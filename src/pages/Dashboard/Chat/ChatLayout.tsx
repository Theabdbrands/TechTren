// ChatLayout.tsx
import React, { useEffect, useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import MobileChatSidebar from "./components/MobileChatSidebar"; // Add this import
import { useIsMobile } from "@/hooks/use-mobile";
import ChatHeader from "./ChatHeader";
import FinancialChatHeader from "./components/FinancialChatHeader";
import { useChatStore } from "@/api/stores/chat-store";

interface ChatLayoutProps {
    children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
    const isMobile = useIsMobile();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {
        activeConversationId,
        setActiveConversation,
        createNewConversation,
        getConversation
    } = useChatStore();

    // Get current conversation to check if it has messages
    const currentConversation = activeConversationId ? getConversation(activeConversationId) : undefined;
    const hasMessages = currentConversation && currentConversation.messages.length > 0;

    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(true);
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [location.pathname, isMobile]);

    // Create initial conversation if none exists
    useEffect(() => {
        if (!activeConversationId) {
            const newId = createNewConversation();
            setActiveConversation(newId);
        }
    }, []);

    const handleConversationSelect = (conversationId: string) => {
        setActiveConversation(conversationId);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const handleNewConversation = () => {
        const newId = createNewConversation();
        setActiveConversation(newId);
        if (isMobile) {
            setSidebarOpen(false);
        }
        return newId;
    };

    return (
        <>
            {/* Mobile Chat Sidebar with Navbar */}
            {isMobile && (
                <MobileChatSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    currentConversationId={activeConversationId}
                    onConversationSelect={handleConversationSelect}
                    onNewConversation={handleNewConversation}
                />
            )}

            {/* Overlay for mobile when sidebar is open */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex py-4 gap-2">
                {/* Desktop Sidebar */}
                {!isMobile && (
                    <div className="sticky top-4 w-80 h-screen z-50">
                        <ChatSidebar
                            sidebarOpen={sidebarOpen}
                            currentConversationId={activeConversationId}
                            onConversationSelect={handleConversationSelect}
                            onNewConversation={handleNewConversation}
                        />
                    </div>
                )}

                <main className="w-full mr-4">
                    {/* Chat Header for desktop sidebar toggle */}
                    {!isMobile && (
                        <ChatHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    )}

                    {/* Only show FinancialChatHeader when there are messages in the conversation */}
                    {hasMessages && !isMobile && (
                        <div className="sticky top-4 py-3 backdrop-blur-lg rounded-xl z-10 animate-fadeIn">
                            <FinancialChatHeader />
                        </div>
                    )}

                    <div>
                        {React.cloneElement(children as React.ReactElement<{ conversationId?: string | null }>, {
                            conversationId: activeConversationId
                        })}
                    </div>
                </main>
            </div>

            {/* Gradient Background Elements */}
            <div className="relative overflow-hidden">
                <div
                    className="fixed -top-10 -left-[250px] hidden sm:block w-[600px] h-[450px] rounded-full opacity-60 z-[-90]"
                    style={{
                        background: "linear-gradient(275.19deg, #14E893 -15.5%, #5131AD 98.25%)",
                        filter: "blur(100px) saturate(50%)",
                    }}
                ></div>
            </div>

            <div className="relative overflow-hidden">
                <div
                    className="fixed -top-40 -right-[350px] hidden sm:block w-[600px] h-[450px] rounded-full opacity-70 z-[-90]"
                    style={{
                        background: "linear-gradient(275.19deg, #14E893 -15.5%, #5131AD 98.25%)",
                        filter: "blur(100px) saturate(50%)",
                    }}
                ></div>
            </div>
        </>
    );
};

export default ChatLayout;