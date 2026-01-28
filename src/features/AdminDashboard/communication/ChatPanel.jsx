"use client";

import { useInfiniteQuery, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useRef } from "react";
import { FiSend, FiInfo, FiPaperclip, FiX } from "react-icons/fi";
import { MentionsInput, Mention } from "react-mentions";
import "./mentions.css";
import axiosApi from "../../../service/axiosInstance";
import { connectWebSocketForChat } from "./ChatService";
import { getAuthData } from "../../../config/Config";
import MessageList from "./MessageList";
import { useLocation } from "react-router-dom";
import ActionsDropdown from "./ActionsDropdown";

const ChatPanel = ({ chatRoom, roomType, activeTab }) => {

  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auth
  const { userInfo } = getAuthData();
  const userId = userInfo?.user_id;
  const location = useLocation();
  const path = location.pathname.split('/')[2];
  const isAiRoom = roomType === "ai";

  // =============================Fetch room members for mentions (group rooms only)=================================\\
  const { data: roomMembersData } = useQuery({
    queryKey: ["roomMembersForMentions", chatRoom],
    queryFn: async () => {
      const res = await axiosApi.get(`/api/v1/rooms/${chatRoom}/members/`);
      return res.data;
    },
    enabled: !!chatRoom && roomType === "group",
    staleTime: 5 * 60 * 1000,
  });

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

  // Flatten and reverse to show oldest -> newest
  const messages = useMemo(() => {
    const list = data?.pages.flatMap((p) => p.results) ?? [];
    return [...list].reverse();
  }, [data]);

  // WebSocket for real-time messages
  useEffect(() => {
    if (!chatRoom) return;

    const socket = connectWebSocketForChat({
      roomId: chatRoom,

      onMessage: (payload) => {
        if (payload.type !== "message") return;
        const newMessage = payload.data;

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

  // ============================================Send message with optimistic update=====================================\\
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && attachments.length === 0) return;

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

    // Helper: extract mention ids from react-mentions markup @[__display__](__id__)
    const extractMentionIdsFromMarkup = (text) => {
      const ids = [];
      if (!text) return ids;
      const regex = /@\[(.+?)\]\((.+?)\)/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        // match[2] is the id per our markup
        ids.push(match[2]);
      }
      // ensure uniqueness
      return Array.from(new Set(ids));
    };

    // Helper: convert markup to plain text, e.g. @[John Doe](2) => @John Doe
    const toPlainText = (text) =>
      (text || "").replace(/@\[(.+?)\]\(.+?\)/g, "@$1");

    // Prepare payload
    const mentionIds = extractMentionIdsFromMarkup(inputMessage);
    const contentPlain = toPlainText(inputMessage).trim();

    // Debug: Log what we're about to send
    try {
      console.groupCollapsed("📨 Sending chat message payload");
      console.log("room:", chatRoom);
      console.log("content:", contentPlain);
      console.log("mention_user_ids:==============================================================================", mentionIds);
      console.groupEnd();
    } catch { }

    // .................................................** Send Messages **.............................................. //
    try {
      const formData = new FormData();
      // Just appent paylod fields to formData
      formData.append("content", contentPlain);
      if (mentionIds.length > 0) {
        // Backend expects comma-separated IDs (e.g., "2,5"); single value is fine too
        formData.append("mention_user_ids", mentionIds.join(","));
      }
      
      // Append attachments
      if (attachments.length > 0) {
        attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      // Debug: log formData entries
      try {
        for (const [k, v] of formData.entries()) {
          if (v instanceof File) {
            console.log("formData", k, { name: v.name, type: v.type, size: v.size });
          } else {
            console.log("formData", k, v);
          }
        }
      } catch { }

      const resp = await axiosApi.post(`/api/v1/rooms/${chatRoom}/send/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("✅ Message sent:", resp?.status, resp?.data);
      setAttachments([]);
    } catch (err) {
      // Turn off typing indicator on error
      if (roomType === "ai") {
        setIsAiTyping(false);
      }
      console.error("❌ Send message failed:", err?.response?.status, err?.response?.data || err?.message);
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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'xls', 'xlsx', 'csv', 'doc', 'docx'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter(file => {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const isValidExtension = allowedExtensions.includes(fileExtension);
      const isValidSize = file.size <= maxSize;
      
      if (!isValidExtension || !isValidSize) {
        console.warn(`❌ File rejected: ${file.name} - Extension: ${isValidExtension ? 'valid' : 'invalid'}, Size: ${isValidSize ? 'valid' : 'too large'}`);
      }
      
      return isValidExtension && isValidSize;
    });

    setAttachments(prev => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Members filtered for mention suggestions
  const members = roomMembersData?.results ?? [];
  const mentionData = useMemo(() => {
    const data = members.map((m) => ({
      id: String(m.id),
      display: m.name || m.username || "Unknown User",
    }));

    // Add test data if no members loaded
    if (data.length === 0) {
      console.warn("⚠️ No members data, using test data");
      return [
        { id: '1', display: 'Rafit jr_staff' },
        { id: '2', display: 'Fugit magna' },
        { id: '3', display: 'Dolor Test' },
      ];
    }

    console.log("📋 Mention Data Generated:", data);
    console.log("📋 Total members:", members.length);
    return data;
  }, [members]);

  useEffect(() => {
    console.log("🔍 Room Type:", roomType);
    console.log("🔍 Chat Room:", chatRoom);
    console.log("🔍 Room Members Data:", roomMembersData);
  }, [roomType, chatRoom, roomMembersData]);

  const isInputDisabled =
    data?.pages[0].chatInfo?.chat_blocked ||
    path === "user-management" ||
    data?.pages[0].chatInfo?.can_send === false ||
    (isAiRoom && isAiTyping);

  const inputPlaceholder =
    data?.pages[0].chatInfo?.chat_blocked
      ? 'Chat is blocked. You are not allowed to send messages until unblocked.'
      : data?.pages[0].chatInfo?.can_send === false
        ? 'User is currently inactive. Cannot send messages.'
        : isAiRoom && isAiTyping
          ? 'Please wait, AI is responding...'
          : 'Type your message...';
  // ...........................**Chat info**........................... //
  // data?.pages[0].chatInfo)
  const safeUser = {
    name: data?.pages[0]?.chatInfo?.name || "Unknown User",
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
            {/* File attachments preview */}
            {attachments.length > 0 && (roomType === "group" || roomType === "private") && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <FiPaperclip size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700 max-w-[200px] truncate">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3 w-full min-w-0">
              {/* File upload button for group and private */}
              {(roomType === "group" || roomType === "private") && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.xls,.xlsx,.csv,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={handleFileInputClick}
                    disabled={isInputDisabled}
                    className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    title="Attach files"
                  >
                    <FiPaperclip size={24} />
                  </button>
                </>
              )}
              {roomType === "group" ? (
                <div className="flex-1 relative min-w-0 ">
                  <MentionsInput
                    className="mentions mentions--multiLine"
                    inputClassName="mentions__input"
                    highlighterClassName="mentions__highlighter"
                    controlClassName="mentions__control"
                    suggestionsClassName="mentions__suggestions__list"
                    suggestionClassName="mentions__suggestions__item"
                    value={inputMessage}
                    onChange={(e) => handleInputChange(e)}
                    onKeyDown={handleInputKeyDown}
                    placeholder={inputPlaceholder}
                    disabled={isInputDisabled}
                    singleLine={false}
                    allowSuggestionsAboveCursor={true}
                    forceSuggestionsAboveCursor={true}
                    a11ySuggestionsListLabel="Suggested mentions"
                  >
                    <Mention
                      trigger="@"
                      data={mentionData}
                      displayTransform={(id, display) => `@${display}`}
                      markup="@[__display__](__id__)"
                      mentionClassName="mentions__mention"
                      renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => {
                        return (
                          <div
                            style={{
                              padding: "8px 12px",
                              maxHeight: "50vh",
                              overflowY: "auto"
                            }}
                          >
                            {suggestion.display}
                          </div>
                        );
                      }}
                    />
                  </MentionsInput>
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  rows={2}
                  disabled={isInputDisabled}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  placeholder={inputPlaceholder}
                  className={`flex-1 outline-none resize-none overflow-y-auto border border-gray-300 rounded-lg p-2 min-w-0 text-base min-h-[100px] ${data?.pages[0].chatInfo?.chat_blocked || data?.pages[0].chatInfo?.can_send === false ? 'placeholder:text-red-500' : ''}`}
                  style={{ minHeight: "100px", maxHeight: "250px" }}
                />
              )}
              <button
                onClick={handleSendMessage}
                disabled={(!inputMessage.trim() && attachments.length === 0) || isInputDisabled}
                className="disabled:opacity-50"
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
