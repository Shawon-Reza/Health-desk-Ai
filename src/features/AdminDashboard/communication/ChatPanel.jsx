"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { FiSend, FiInfo } from "react-icons/fi";
import axiosApi from "../../../service/axiosInstance";
import { connectWebSocketForChat } from "./ChatService";
import { getAuthData } from "../../../config/Config";
import MessageList from "./MessageList";

const ChatPanel = ({ chatRoom, currentUser }) => {
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const [showActions, setShowActions] = useState(false);

  // Auth
  const { userInfo } = getAuthData();
  const userId = userInfo?.user_id;



  // Messages (HTTP with infinite scroll)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["messages", chatRoom],
    enabled: !!chatRoom,
    queryFn: async ({ pageParam = null }) => {
      const res = await axiosApi.get(
        `/api/v1/rooms/${chatRoom}/messages/`,
        { params: { cursor: pageParam } }
      );

      return {
        results: res.data.results ?? [],
        nextCursor: res.data.next_cursor ?? null,
        chatInfo: res.data.room ?? null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  console.log("Result--------------:", data)
  console.log("Result*************:", data?.pages[0].chatInfo)


  // Flatten and reverse to show oldest -> newest
  const messages = useMemo(() => {
    const list = data?.pages.flatMap((p) => p.results) ?? [];
    return [...list].reverse();
  }, [data]);

  console.log("Total Messages :", messages)

  // WebSocket for real-time messages
  useEffect(() => {
    if (!chatRoom) return;

    const socket = connectWebSocketForChat({
      roomId: chatRoom,

      onMessage: (payload) => {
        if (payload.type !== "message") return;
        const newMessage = payload.data;
        console.log("New messages:", newMessage)

        queryClient.setQueryData(["messages", chatRoom], (old) => {
          if (!old) return old;

          const exists = old.pages.some((p) =>
            p.results.some((m) => m.id === newMessage.id)
          );

          if (exists) return old;

          console.log("Adding new message to FIRST page (newest messages)")

          // Always add new messages to the FIRST page (page 0), not last page
          // First page = newest messages, last page = oldest messages
          return {
            ...old,
            pages: old.pages.map((p, i) =>
              i === 0
                ? { ...p, results: [newMessage, ...p.results] }
                : p
            ),
          };
        });
      },
    });

    return () => socket.close();
  }, [chatRoom, queryClient]);

  // Send message with optimistic update
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      text: inputMessage,
      created_at: new Date().toISOString(),
      sender: { id: userId },
      avatar: safeUser.avatar,
    };

    setInputMessage("");
    // .....................** Send Messages **..................... //
    try {
      const formData = new FormData();
      // Just appent paylod fields to formData
      formData.append("content", inputMessage);

      await axiosApi.post(`/api/v1/rooms/${chatRoom}/send/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Message send")
    } catch (err) {
      console.error("Send failed", err);
    }
  };
  // ...........................**Chat info**........................... //
  // data?.pages[0].chatInfo)
  const safeUser = {
    name: data?.pages[0]?.chatInfo?.name || "Unknocwn User",
    role: data?.pages[0]?.chatInfo?.display_role || "unknown",
    avatar: `http://10.10.13.2:8000${data?.pages[0]?.chatInfo?.image}` ||
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Chat",
  };

  return (
    <div className="flex flex-col h-full border border-gray-300 rounded-lg bg-white">
      {!chatRoom ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a chat
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="p-4 border-b border-gray-300 flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <img
                src={safeUser.avatar}
                className="w-10 h-10 rounded-full"
                alt=""
              />
              <div>
                <div className="font-semibold">{safeUser.name}</div>
                <div className="text-xs text-pink-600">{safeUser.role}</div>
              </div>
            </div>

            <FiInfo
              className="cursor-pointer"
              onClick={() => setShowActions(!showActions)}
            />
          </div>

          {/* Message List */}
          <MessageList
            messages={messages}
            userId={userId}
            onLoadMore={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />

          {/* Input Area */}
          <div className="p-4 border-t border-gray-300">
            <div className="flex gap-3">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                <FiSend size={24} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPanel;
