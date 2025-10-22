"use client"

import { useState, useRef, useEffect } from "react"
import { FiUploadCloud, FiX, FiPaperclip, FiMic, FiSend, FiThumbsUp, FiThumbsDown } from "react-icons/fi"

export default function AITrainingCenter() {
    const [uploadQueue, setUploadQueue] = useState([
        { id: 1, name: "Learning.pdf", status: "processing", progress: 65 },
        { id: 2, name: "Response answers.pdf", status: "processing", progress: 45 },
    ])

    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            sender: "ai",
            message: "Got these set files",
            timestamp: "9:50 AM",
            avatar: "🤖",
        },
        {
            id: 2,
            sender: "user",
            message: "Got",
            timestamp: "9:48 AM",
            userName: "Dr. Sarah Jhonson",
            avatar: "👩‍⚕️",
        },
    ])

    const [messageInput, setMessageInput] = useState("")
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef(null)
    const chatEndRef = useRef(null)

    // Console logging for component initialization
    useEffect(() => {
        console.log("[v0] AITrainingCenter Component Initialized")
        console.log("[v0] Initial Upload Queue:", uploadQueue)
        console.log("[v0] Initial Chat Messages:", chatMessages)
    }, [])

    // Auto-scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatMessages])

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    // Handle file drop
    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const files = e.dataTransfer.files
        console.log("[v0] Files dropped:", files)
        handleFiles(files)
    }

    // Handle file selection
    const handleFileChange = (e) => {
        const files = e.target.files
        console.log("[v0] Files selected:", files)
        handleFiles(files)
    }

    // Process files
    const handleFiles = (files) => {
        const newFiles = Array.from(files).map((file, index) => {
            const fileObj = {
                id: Date.now() + index,
                name: file.name,
                status: "processing",
                progress: Math.floor(Math.random() * 100),
            }
            console.log("[v0] File added to queue:", fileObj)
            return fileObj
        })

        setUploadQueue([...uploadQueue, ...newFiles])
        console.log("[v0] Updated upload queue:", [...uploadQueue, ...newFiles])
    }

    // Remove file from queue
    const removeFile = (id) => {
        console.log("[v0] Removing file with id:", id)
        const updatedQueue = uploadQueue.filter((file) => file.id !== id)
        setUploadQueue(updatedQueue)
        console.log("[v0] Updated upload queue after removal:", updatedQueue)
    }

    // Handle update AI model
    const handleUpdateAIModel = () => {
        console.log("[v0] Update AI Model clicked")
        console.log("[v0] Current upload queue:", uploadQueue)

        // Simulate API call
        console.log("[v0] Sending request to backend: POST /api/ai/update-model")
        console.log("[v0] Payload:", { files: uploadQueue })

        // Mock API response
        setTimeout(() => {
            console.log("[v0] AI Model updated successfully")
            setUploadQueue([])
        }, 2000)
    }

    // Handle send message
    const handleSendMessage = () => {
        if (messageInput.trim() === "") {
            console.log("[v0] Empty message, not sending")
            return
        }

        const newMessage = {
            id: chatMessages.length + 1,
            sender: "user",
            message: messageInput,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            userName: "Dr. Sarah Jhonson",
            avatar: "👩‍⚕️",
        }

        console.log("[v0] Sending message:", newMessage)
        setChatMessages([...chatMessages, newMessage])
        setMessageInput("")

        // Simulate API call
        console.log("[v0] Sending request to backend: POST /api/chat/send-message")
        console.log("[v0] Payload:", newMessage)

        // Mock AI response
        setTimeout(() => {
            const aiResponse = {
                id: chatMessages.length + 2,
                sender: "ai",
                message: "I received your message and will process it.",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                avatar: "🤖",
            }
            console.log("[v0] AI Response received:", aiResponse)
            setChatMessages((prev) => [...prev, aiResponse])
        }, 1000)
    }

    // Handle message reactions
    const handleReaction = (messageId, reaction) => {
        console.log("[v0] Reaction added to message:", messageId, "Reaction:", reaction)
        console.log("[v0] Sending request to backend: POST /api/chat/reaction")
        console.log("[v0] Payload:", { messageId, reaction })
    }

    // Handle attachment click
    const handleAttachment = () => {
        console.log("[v0] Attachment button clicked")
        fileInputRef.current?.click()
    }

    // Handle microphone click
    const handleMicrophone = () => {
        console.log("[v0] Microphone button clicked")
        console.log("[v0] Starting voice recording...")
    }

    return (
        <div className=" p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Training Center</h1>
                <p className="text-gray-600">Upload and manage training materials for the chatbot</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Section - Upload Documents */}
                <div className="border border-teal-500 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
                    <p className="text-gray-600 text-sm mb-6">
                        Upload PDFs, Word documents, or Excel files to train the AI on clinic procedures, insurance policy medical
                        reference materials, clinical guidelines, and treatment protocols.
                    </p>

                    {/* Drag and Drop Area */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300"
                            }`}
                    >
                        <FiUploadCloud className="mx-auto text-teal-500 mb-3" size={32} />
                        <p className="text-gray-700 font-medium mb-1">Drag and drop files here, or</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-teal-500 hover:text-teal-600 font-medium"
                        >
                            Browse files
                        </button>
                        <p className="text-gray-500 text-xs mt-2">Accepted file types: pdf, doc</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* Upload Queue */}
                    {uploadQueue.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Upload Queue</h3>
                            <div className="space-y-3 max-h-[150px] overflow-auto ">
                                {uploadQueue.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                            <span className="text-gray-700 text-sm">{file.name}</span>
                                            <span className="text-teal-500 text-xs font-medium">{file.status}</span>
                                        </div>
                                        <button onClick={() => removeFile(file.id)} className="text-gray-400 hover:text-gray-600">
                                            <FiX size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Update AI Model Button */}
                    <button
                        onClick={handleUpdateAIModel}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Update AI Model
                    </button>
                </div>

                {/* ...................................................................*/}

                {/* Right Section - AI Assistant Chat */}
                <div className="border border-teal-500 rounded-lg p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                            🤖
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                        {chatMessages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>No messages yet. Start a conversation!</p>
                            </div>
                        ) : (
                            <>
                                {chatMessages.map((msg, index) => (
                                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`flex gap-3 max-w-xs ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                                {msg.avatar}
                                            </div>
                                            <div className={`${msg.sender === "user" ? "text-right" : ""}`}>
                                                {msg.sender === "user" && <p className="text-xs text-gray-600 mb-1">{msg.userName}</p>}
                                                <div
                                                    className={`rounded-lg px-4 py-2 ${msg.sender === "user" ? "bg-teal-100 text-gray-900" : "bg-gray-100 text-gray-900"
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.message}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                                                {msg.sender === "ai" && (
                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            onClick={() => handleReaction(msg.id, "like")}
                                                            className="text-gray-400 hover:text-teal-500"
                                                        >
                                                            <FiThumbsUp size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReaction(msg.id, "dislike")}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <FiThumbsDown size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </>
                        )}
                    </div>

                    {/* Message Input */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                        />
                        <button onClick={handleAttachment} className="text-gray-400 hover:text-teal-500 transition-colors">
                            <FiPaperclip size={20} />
                        </button>
                        <button onClick={handleMicrophone} className="text-gray-400 hover:text-teal-500 transition-colors">
                            <FiMic size={20} />
                        </button>
                        <button onClick={handleSendMessage} className="text-teal-500 hover:text-teal-600 transition-colors">
                            <FiSend size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
