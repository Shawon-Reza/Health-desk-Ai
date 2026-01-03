"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useState, useEffect, useRef, useMemo } from "react"
import { FiPaperclip, FiMic, FiSend, FiInfo } from "react-icons/fi"
import { Virtuoso } from "react-virtuoso"
import axiosApi from "../../../service/axiosInstance"
import { connectWebSocketForChat } from "./ChatService"
import { queryClient } from "../../../main"
import { getAuthData } from "../../../config/Config"



const MessageBubble = ({ msg, myUserId }) => {
  const senderId = msg?.sender_id ?? msg?.senderId ?? msg?.sender?.id
  const isMe = myUserId != null && senderId === myUserId
  const text = msg?.text ?? msg?.message ?? msg?.content ?? ""
  const timestamp = msg?.created_at ?? msg?.timestamp

  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"} my-1`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-[70%] text-sm leading-relaxed ${isMe ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
      >
        <p>{text}</p>
        {timestamp ? (
          <span className={`block mt-1 text-[11px] ${isMe ? "text-blue-100" : "text-gray-500"}`}>
            {new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
        ) : null}
      </div>
    </div>
  )
}

const ChatPanel = ({ chatRoom }) => {

  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [actionPopup, setActionPopup] = useState(false)
  const socketRef = useRef(null)

  const { userId: myUserId, userInfo, role: userRole } = getAuthData() ?? {}

  const currentUser = {
    id: myUserId,
    name: userInfo?.full_name || userInfo?.username || "You",
    role: userRole || "Member",
    avatar: userInfo?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=ChatUser",
  }

  const {
    data,
    isLoading: messagesLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["messages", chatRoom],
    queryFn: async ({ pageParam = null }) => {
      if (!chatRoom) return { results: [], nextCursor: null }

      const params = { limit: 20 }
      if (pageParam) params.cursor = pageParam

      const response = await axiosApi.get(`/api/v1/rooms/${chatRoom}/messages/`, { params })
      const payload = response?.data ?? {}
      const results = Array.isArray(payload) ? payload : payload.results ?? []

      return {
        results,
        nextCursor: payload.next_cursor ?? payload.next ?? null,
      }
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    enabled: Boolean(chatRoom),
    initialPageParam: null,
  })

  const messages = useMemo(() => {
    const flat = data?.pages?.flatMap((page) => page?.results ?? []) ?? []

    return [...flat].sort((a, b) => {
      const aTime = new Date(a?.created_at ?? a?.timestamp ?? 0).getTime()
      const bTime = new Date(b?.created_at ?? b?.timestamp ?? 0).getTime()
      if (Number.isFinite(aTime) && Number.isFinite(bTime)) return aTime - bTime
      return (a?.id ?? 0) - (b?.id ?? 0)
    })
  }, [data])

  // ..............**Connecting to WebSocket**..................\\
  useEffect(() => {
    if (!chatRoom) return undefined

    socketRef.current = connectWebSocketForChat({
      roomId: chatRoom,
      onMessage: (message) => {
        if (message?.type !== "message") return

        const newMessage = message?.data ?? message?.message ?? message

        queryClient.setQueryData(["messages", chatRoom], (oldData) => {
          if (!oldData) return oldData

          const exists = oldData.pages?.some((page) =>
            (page?.results ?? []).some((msg) => msg?.id === newMessage?.id)
          )
          if (exists) return oldData

          const lastIndex = (oldData.pages?.length ?? 0) - 1

          if (lastIndex < 0) {
            return {
              pages: [{ results: [newMessage], nextCursor: null }],
              pageParams: [null],
            }
          }

          const updatedPages = oldData.pages.map((page, idx) => {
            if (idx !== lastIndex) return page
            return {
              ...page,
              results: [...(page?.results ?? []), newMessage],
            }
          })

          return { ...oldData, pages: updatedPages }
        })
      },
    })

    return () => {
      socketRef.current?.close()
    }
  }, [chatRoom])






  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !chatRoom) return

    try {
      setLoading(true)
      await axiosApi.post(`/api/v1/rooms/${chatRoom}/messages/`, { text: inputMessage.trim() })
      setInputMessage("")
      // The WebSocket will append the new message to the list
    } catch (err) {
      console.error("Failed to send message", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAttachment = () => {
    console.log("[ChatDetail] Attachment button clicked")
    // TODO: Implement file upload functionality
  }

  const handleMicrophone = () => {
    console.log("[ChatDetail] Microphone button clicked")
    // TODO: Implement voice message functionality
  }

  const handleInfoClick = () => {
    console.log("[ChatDetail] Info button clicked")
    console.log("[ChatDetail] User details:", currentUser)
    // TODO: Show user details modal or panel
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (


    <div className="flex flex-col  bg-white border border-teal-500 rounded-lg overflow-hidden h-full">


      {/* .............** Initial Display Text **........... */}
      {
        !chatRoom ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        ) : null

      }




      {/* ...............**Messaging part **...............*/}
      <div className={`${!chatRoom ? 'hidden' : 'flex flex-col flex-1 h-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar || "/placeholder.svg"}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-gray-900">{currentUser.name}</h2>
              <span className="inline-block px-3 py-1 text-xs font-medium text-pink-600 bg-pink-100 rounded-full">
                {currentUser.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleInfoClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="User info"
          >
            <FiInfo size={20} className="text-gray-600 cursor-pointer"
              onClick={() => {
                setActionPopup((prev) => !prev);
              }}

            />

            <div className={`absolute right-6 z-10 mt-2 w-48 rounded-md shadow-lg ${actionPopup ? "block" : "hidden"}`}>
              <div className="bg-white rounded-md shadow-lg">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">Action</h3>
                  <div className="mt-2 flex flex-col gap-2">
                    <button className="bg-[#FFB20F] rounded-lg cursor-pointer py-2 text-white font-semibold">Block User</button>
                    <button className="bg-[#FF4B3E] rounded-lg cursor-pointer py-2 text-white font-semibold">Delete Chat</button>
                  </div>
                </div>
              </div>
            </div>

          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 min-h-0">
          {messagesLoading ? (
            <div className="h-full flex items-center justify-center text-gray-500">Loading messages...</div>
          ) : isError ? (
            <div className="h-full flex items-center justify-center text-red-500">
              Failed to load messages{error ? `: ${error.message}` : ""}
            </div>
          ) : (
            <Virtuoso
              style={{ height: "100%" }}
              data={messages}
              itemContent={(index, msg) => <MessageBubble msg={msg} myUserId={myUserId} />}
              startReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage()
                }
              }}
              followOutput="auto"
              components={{
                Header: () => (
                  hasNextPage ? (
                    <div className="py-2 text-center text-sm text-gray-500">
                      {isFetchingNextPage ? "Loading older messages..." : "Scroll up for older messages"}
                    </div>
                  ) : null
                ),
              }}
            />
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 bg-teal-50 rounded-lg px-4 py-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-teal-400"
            />
            <button
              onClick={handleAttachment}
              className="p-2 hover:bg-teal-100 rounded-lg transition-colors"
              aria-label="Attach file"
            >
              <FiPaperclip size={18} className="text-teal-600" />
            </button>
            <button
              onClick={handleMicrophone}
              className="p-2 hover:bg-teal-100 rounded-lg transition-colors"
              aria-label="Voice message"
            >
              <FiMic size={18} className="text-teal-600" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={loading || !inputMessage.trim()}
              className="p-2 hover:bg-teal-100 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Send message"
            >
              <FiSend size={18} className="text-teal-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
