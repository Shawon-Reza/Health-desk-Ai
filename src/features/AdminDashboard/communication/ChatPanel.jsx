"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useRef } from "react";
import { FiSend, FiInfo } from "react-icons/fi";
import axiosApi from "../../../service/axiosInstance";
import { connectWebSocketForChat } from "./ChatService";
import { getAuthData } from "../../../config/Config";
import MessageList from "./MessageList";
import { useLocation } from "react-router-dom";
import ActionsDropdown from "./ActionsDropdown";

const ChatPanel = ({ chatRoom, roomType, activeTab }) => {

  console.log("======================================================", chatRoom)
  console.log("====================================================== Room Type:", roomType)
  console.log("======================================================", activeTab)
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const textareaRef = useRef(null);

  // Auth
  const { userInfo } = getAuthData();
  const userId = userInfo?.user_id;
  const location = useLocation();
  const path = location.pathname.split('/')[2];
  console.log("Path Name: ----------------------------------------------------------------------:", path)

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
        console.log("@@@@@@@@@@@@@@@@@@@@New messages@@@@@@@@@@@@@@@@@@:", newMessage)

        // Turn off AI typing indicator when AI responds
        if (newMessage?.is_ai && roomType === "ai") {
          setIsAiTyping(false);
        }

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

    // Show AI typing indicator if this is an AI chat
    if (roomType === "ai") {
      setIsAiTyping(true);
    }

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
      // Turn off typing indicator on error
      if (roomType === "ai") {
        setIsAiTyping(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const el = e.target;
    setInputMessage(el.value);
    // Auto-resize up to 150px height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const nextHeight = Math.min(textareaRef.current.scrollHeight, 150);
      textareaRef.current.style.height = `${nextHeight}px`;
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
          <div className="p-4 border-b border-gray-300 flex justify-between items-center relative">
            <div className="flex gap-3 items-start">
              <img
                src={safeUser.avatar}
                className="w-10 h-10 rounded-full"
                alt=""
              />
              <div>
                <div className="font-semibold">{safeUser.name}</div>
                <div className="text-xs text-pink-600">{safeUser.role}</div>
              </div>
              {
                data?.pages[0]?.chatInfo?.chat_blocked && (
                  <div>
                    <p className="text-red-500 font-semibold">Blocked</p>
                  </div>
                )
              }


            </div>

            <div className={`relative ${data?.pages[0].chatInfo?.type === "ai" ? "hidden" : ""} `}>
              <FiInfo
                size={20}
                className={`cursor-pointer ${path === "user-management" || path === "clinicwise-chat-history" ? "hidden" : ""}`}
                onClick={() => setShowActions(!showActions)}
              />

              <ActionsDropdown
                showActions={showActions}
                onEditDetails={() => console.log("Edit Details")}
                onAddMember={() => console.log("Add Member")}
                onBlockMember={() => console.log("Block Member")}
                onDeleteChat={() => console.log("Delete Chat")}
                chatInfo={data?.pages[0].chatInfo}
              />
            </div>
          </div>
          {/* Message List */}
          <MessageList
            messages={messages}
            userId={userId}
            onLoadMore={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            roomType={roomType}
            isAiTyping={isAiTyping}
          />

          {/* ........................................................Input Area For send text................................................ */}
          <div className="p-4 border-t border-gray-300">
            <div className="flex gap-3">
              <textarea
                ref={textareaRef}
                rows={1}
                disabled={data?.pages[0].chatInfo?.chat_blocked || path === "user-management" || data?.pages[0].chatInfo?.can_send === false}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder={`${
                  data?.pages[0].chatInfo?.chat_blocked 
                    ? 'Chat is blocked. You are not allowed to send messages until unblocked.' 
                    : data?.pages[0].chatInfo?.can_send === false
                    ? 'User is currently inactive. Cannot send messages.'
                    : 'Type your message...'
                }`}
                className={`flex-1 outline-none resize-none overflow-y-auto ${data?.pages[0].chatInfo?.chat_blocked || data?.pages[0].chatInfo?.can_send === false ? 'placeholder:text-red-500' : ''}`}
                style={{ maxHeight: "150px" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                <FiSend size={24} />
              </button>
            </div>
            {path === "user-management" && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                You are not allowed to send messages.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPanel;
