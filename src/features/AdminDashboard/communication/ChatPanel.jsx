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

  const safeUser = {
    name: currentUser?.name || "User",
    role: currentUser?.role || "Member",
    avatar:
      currentUser?.avatar ||
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Chat",
  };

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
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  console.log("Result:", data)

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
console.log("exist:",exists)
          if (exists) return old;

          const lastIndex = old.pages.length - 1;
          console.log("Adding new message to cache, lastIndex:", lastIndex)

          return {
            ...old,
            pages: old.pages.map((p, i) =>
              i === lastIndex
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

    queryClient.setQueryData(["messages", chatRoom], (old) => {
      if (!old) return old;

      const lastIndex = old.pages.length - 1;

      return {
        ...old,
        pages: old.pages.map((p, i) =>
          i === lastIndex
            ? { ...p, results: [optimisticMsg, ...p.results] }
            : p
        ),
      };
    });

    setInputMessage("");

    try {
      const formData = new FormData();
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

  return (
    <div className="flex flex-col h-full border rounded-lg bg-white">
      {!chatRoom ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a chat
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
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
          <div className="p-4 border-t">
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
                <FiSend />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPanel;
