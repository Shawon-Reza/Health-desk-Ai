import { useEffect, useRef, useState, useMemo } from "react";
import Markdown from 'https://esm.sh/react-markdown@10'
import remarkGfm from 'remark-gfm';
import { useLocation } from "react-router-dom";

const MessageList = ({
    messages,
    userId,
    onLoadMore,
    hasNextPage,
    isFetchingNextPage,
    roomType,
    isAiTyping
}) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const isLoadingRef = useRef(false);
    const prevScrollHeightRef = useRef(0);
    const [prevMessageCount, setPrevMessageCount] = useState(0);
    const wasAtBottomBeforeFetchRef = useRef(true);


    // .....................**Group messages by date logic start**......................\\
    const groupedMessages = useMemo(() => {
        const groups = [];
        let currentDate = null;

        messages.forEach((msg) => {
            const messageDate = new Date(msg.created_at).toDateString();

            if (messageDate !== currentDate) {
                currentDate = messageDate;
                groups.push({
                    type: 'date',
                    date: messageDate,
                    dateObj: new Date(msg.created_at)
                });
            }

            groups.push({
                type: 'message',
                data: msg
            });
        });

        return groups;
    }, [messages]);

    // Format date label
    const formatDateLabel = (dateObj) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const messageDate = new Date(dateObj);

        if (messageDate.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return messageDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        }
    };
    // .....................**Group messages by date logic End**......................\\


    // Auto-scroll to bottom ONLY if user was already viewing the bottom (new real-time messages)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Never scroll during pagination
        if (isFetchingNextPage) {
            return;
        }

        // Check if new messages arrived
        const messageCountChanged = messages.length !== prevMessageCount;

        if (messageCountChanged && wasAtBottomBeforeFetchRef.current) {
            // Only scroll to bottom if new messages were added AND user was viewing the bottom
            const messageDifference = messages.length - prevMessageCount;

            if (messageDifference > 0) {
                // New messages arrived and user was at bottom - scroll to bottom
                setTimeout(() => {
                    container.scrollTop = container.scrollHeight - container.clientHeight;
                }, 0);
            }

            setPrevMessageCount(messages.length);
        } else if (messageCountChanged) {
            // Message count changed but user wasn't at bottom (pagination) - just update count
            setPrevMessageCount(messages.length);
        }
    }, [messages.length, isFetchingNextPage, prevMessageCount]);

    // Restore scroll position after older messages load
    useEffect(() => {
        const container = containerRef.current;
        if (!container || isFetchingNextPage) return;

        // After fetch completes, restore scroll position
        if (prevScrollHeightRef.current > 0) {
            const newScrollHeight = container.scrollHeight;
            const heightDifference = newScrollHeight - prevScrollHeightRef.current;

            // Scroll down by the height of newly added messages to stay in same visual position
            container.scrollTop = heightDifference;
            console.log("📍 Scroll position restored - added", heightDifference, "px");

            prevScrollHeightRef.current = 0;
            wasAtBottomBeforeFetchRef.current = false; // User scrolled to top for pagination, not at bottom
        }
    }, [isFetchingNextPage]);

    // Infinite scroll - load older messages when scroll to top
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;

        // Track if user is at the bottom (for auto-scroll later)
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        wasAtBottomBeforeFetchRef.current = isAtBottom;

        // When user scrolls to top
        if (scrollTop === 0 && hasNextPage && !isFetchingNextPage && !isLoadingRef.current) {
            isLoadingRef.current = true;
            console.log("📍 Top reached - loading older messages");

            // Store current scroll position before fetch
            prevScrollHeightRef.current = e.target.scrollHeight;

            onLoadMore();

            // Reset flag after a delay
            setTimeout(() => {
                isLoadingRef.current = false;
            }, 500);
        }
    };

    const MessageBubble = ({ msg }) => {
        console.log("message ::::::", msg)
        const isAI = msg?.is_ai === true;
        const isMe = !isAI && Number(msg?.sender?.id) === Number(userId);
        const text = msg?.content || "";

        return (
            <div className={`flex mb-4 ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                    className={`px-4 py-2 rounded-lg max-w-md
          ${isAI && "bg-purple-100 border border-purple-300"}
          ${isMe && "bg-teal-100 text-gray-900"}
          ${!isMe && !isAI && "bg-blue-100 text-gray-900"}
        `}
                >
                    {/* ...............AI label................ */}
                    {isAI && (
                        <div className="text-xs font-semibold text-purple-600 mb-1">
                            🤖 AI Assistant
                        </div>
                    )}

                    {/* ................Convert Markdown to HTML................. */}
                    <div className="text-sm prose prose-sm max-w-none">
                        {isAI ? (
                            <Markdown remarkPlugins={[remarkGfm]}>
                                {text}
                            </Markdown>
                        ) : (
                            <p>{text}</p>
                        )}
                    </div>

                    {/* TIME */}
                    <div className="text-xs text-gray-500 mt-1 text-right">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-2"
        >
            {isFetchingNextPage && (
                <div className="text-center text-sm text-gray-500 py-2">
                    Loading older messages...
                </div>
            )}
            {/* // .....................**Group messages by date logic**......................\\ */}
            {groupedMessages.map((item, index) => {
                if (item.type === 'date') {
                    return (
                        <div key={`date-${index}`} className="flex items-center justify-center my-4">
                            <div className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                                {formatDateLabel(item.dateObj)}
                            </div>
                        </div>
                    );
                } else {
                    return <MessageBubble key={item.data.id} msg={item.data} />;
                }
            })}
            {/* AI Typing Indicator */}
            {isAiTyping && roomType === "ai" && (
                <div className="flex mb-4 justify-start">
                    <div className="px-4 py-2 rounded-lg bg-purple-100 border border-purple-300">
                        <div className="text-xs font-semibold text-purple-600 mb-1">
                            🤖 AI Assistant
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">AI is thinking</span>
                            <div className="flex gap-1 ml-1">
                                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
