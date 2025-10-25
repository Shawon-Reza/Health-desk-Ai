"use client"

import { useState, useEffect, useRef } from "react"
import { FiPaperclip, FiMic, FiSend, FiInfo } from "react-icons/fi"

const ChatPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Dr. Michael Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      message:
        "Good morning ! We have a busy schedule today with 15 patients. Let's make sure we're prepared for the new insurance verification Process",
      timestamp: "9:00 AM",
      type: "received",
      date: "Today",
    },
    {
      id: 2,
      sender: "Dr. Sarah Jhonson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      message: "Ok, I'll keep that in Mind!",
      timestamp: "9:08 AM",
      type: "sent",
      date: "Today",
    },
  ])

  const [inputMessage, setInputMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [actionPopup, setActionPopup] = useState(false)

  const currentUser = {
    name: "Dr. Michael Chen",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Log component initialization
  useEffect(() => {
    console.log("[ChatDetail] Component initialized")
    console.log("[ChatDetail] Current user:", currentUser)
    console.log("[ChatDetail] Initial messages:", messages)
  }, [])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) {
      console.log("[ChatDetail] Empty message, not sending")
      return
    }

    console.log("[ChatDetail] Sending message:", inputMessage)

    // Create new message object
    const newMessage = {
      id: messages.length + 1,
      sender: currentUser.name,
      avatar: currentUser.avatar,
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      type: "sent",
      date: "Today",
    }

    console.log("[ChatDetail] New message object:", newMessage)

    // Add message to state
    setMessages([...messages, newMessage])
    setInputMessage("")

    // TODO: Replace with actual backend API call
    // Example:
    // const sendMessageToBackend = async () => {
    //   try {
    //     const response = await fetch('YOUR_BACKEND_API_URL/messages', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({
    //         message: inputMessage,
    //         sender: currentUser.name,
    //         timestamp: new Date().toISOString()
    //       })
    //     });
    //     const data = await response.json();
    //     console.log('[ChatDetail] Backend response:', data);
    //   } catch (error) {
    //     console.error('[ChatDetail] Error sending message:', error);
    //   }
    // };
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

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = msg.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(msg)
    return acc
  }, {})

  return (
    <div className="flex flex-col  bg-white border border-teal-500 rounded-lg overflow-hidden h-full">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <span className="text-sm text-gray-500">{date}</span>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 mb-4 ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
                {msg.type === "received" && (
                  <img
                    src={msg.avatar || "/placeholder.svg"}
                    alt={msg.sender}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                )}

                <div className={`flex flex-col ${msg.type === "sent" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.type === "sent" ? "bg-teal-100 text-gray-900" : "bg-blue-100 text-gray-900"
                      }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{msg.timestamp}</span>
                </div>

                {msg.type === "sent" && (
                  <img
                    src={msg.avatar || "/placeholder.svg"}
                    alt={msg.sender}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
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
  )
}

export default ChatPanel
