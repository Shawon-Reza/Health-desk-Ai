import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import ChatPanel from "./ChatPanel";
import CreateNewGroupModal from "../Communication/CreateNewGroupModal";
import CreateNewMessageModal from "../Communication/CreateNewMessageModal";
import { connectWebSocketForChatList } from "./ChatService";
import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../../service/axiosInstance";
import { queryClient } from "../../../main";
import { useDebouncedCallback } from "use-debounce";
import { base_URL } from "../../../config/Config";

const Communication = () => {
    const [activeTab, setActiveTab] = useState("allChat");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [showCreateMessageModal, setShowCreateMessageModal] = useState(false);
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);

    const roles = ["All", "private", "group"];
    const socketRef = useRef(null);

    // Debounced search handler - prevents input from losing focus
    const handleSearchInput = useDebouncedCallback((value) => {
        setSearchQuery(value);
    }, 900);

    // Fetch user's chat rooms with filters
    const { data: rooms = [], isLoading } = useQuery({
        queryKey: ["myRooms", searchQuery, selectedRole],
        queryFn: async () => {
            const response = await axiosApi.get(
                `/api/v1/rooms/?q=${searchQuery}&type=${selectedRole === "All" ? "" : selectedRole}`
            );
            return Array.isArray(response.data) ? response.data : response.data.results || [];
        },
        keepPreviousData: true, // Smooth UX while loading new results
        staleTime: 1000 * 30, // Optional: reduce refetch frequency
    });

    // WebSocket for real-time room updates
    useEffect(() => {
        socketRef.current = connectWebSocketForChatList({
            onMessage: (message) => {
                if (message.type !== "room_update") return;

                console.log("Room update received:", message);

                // Invalidate all myRooms queries (including filtered ones)
                // This triggers a refetch with current searchQuery & selectedRole
                queryClient.invalidateQueries({
                    queryKey: ["myRooms"],
                    refetchType: "active", // Only refetch if query is active
                });
            },
        });

        return () => socketRef.current?.close();
    }, [queryClient]);

    const handleChatSelect = (chat) => {
        setSelectedChatRoom(chat.room_id);
    };

    const handleRoleFilterChange = (role) => {
        setSelectedRole(role);
    };

    // Format last message time
    const formatChatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const time = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        const day = date.toLocaleDateString("en-GB");
        return `${time} · ${day}`;
    };

    if (isLoading && rooms.length === 0) {
        return (
            <div className="container mx-auto">
                <section className="text-secondary mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold">Communication Hub</h2>
                    <p className="text-lg opacity-80">Chat with your team and AI assistant</p>
                </section>
                <div className="flex justify-center items-center h-[calc(100vh-280px)]">
                    <p className="text-gray-500">Loading chat rooms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className=" mx-auto">
            {/* Header */}
            <section className="text-secondary mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold">Communication Hub</h2>
                <p className="text-lg opacity-80">Chat with your team and AI assistant</p>
            </section>

            {/* Main Layout */}
            <section className="flex gap-6 h-[calc(100vh-250px)]">
                {/* Sidebar */}
                <section className="w-[40%] xl:w-[25%] h-full bg-white rounded-xl shadow-md p-4 space-y-4 border border-gray-300">
                    {/* Tabs */}
                    <div className="flex justify-between gap-3 pb-2">
                        <button
                            onClick={() => setActiveTab("allChat")}
                            className={`pb-1 font-medium ${activeTab === "allChat"
                                ? "text-primary border-b-2 border-primary"
                                : "text-gray-600 hover:text-primary"
                                }`}
                        >
                            All Chat
                        </button>
                        <button
                            onClick={() => setActiveTab("aiAssistant")}
                            className={`pb-1 font-medium ${activeTab === "aiAssistant"
                                ? "text-primary border-b-2 border-primary"
                                : "text-gray-600 hover:text-primary"
                                }`}
                        >
                            AI Assistant
                        </button>
                    </div>

                    {/* New Group / New Message Buttons */}
                    <div className={`${activeTab === "allChat" ? "" : "hidden"} flex justify-between gap-3 pb-2`}>
                        <button
                            onClick={() => setShowCreateGroupModal(true)}
                            className="pb-1 font-medium text-primary border-2 rounded-lg px-2 border-primary"
                        >
                            New Group
                        </button>
                        <button
                            onClick={() => setShowCreateMessageModal(true)}
                            className="pb-1 font-medium text-primary border-2 rounded-lg px-2 border-primary"
                        >
                            New Message
                        </button>
                    </div>

                    {/* Search + Filter */}
                    <div className={`flex items-center gap-2 ${activeTab === "allChat" ? "" : "hidden"}`}>
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search chat..."
                                defaultValue={searchQuery}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 rounded-lg text-sm focus:outline-none bg-gray-200"
                            />
                        </div>
                        <select
                            value={selectedRole}
                            onChange={(e) => handleRoleFilterChange(e.target.value)}
                            className="border rounded-lg px-2 py-2 text-sm"
                        >
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Chat List */}
                    <div className={`space-y-2 overflow-auto h-[calc(100vh-450px)] ${activeTab === "allChat" ? "" : "hidden"}`}>
                        <p className={`text-center text-gray-500 ${activeTab === "aiAssistant" ? "" : "hidden"}`}>
                            All chats are shown here
                        </p>

                        <div className={`${activeTab === "allChat" ? "" : "hidden"}`}>
                            {rooms.length === 0 ? (
                                <p className="text-center text-gray-500 py-10">No chats found</p>
                            ) : (
                                rooms.map((chat) => (
                                    <button
                                        key={chat.room_id}
                                        onClick={() => handleChatSelect(chat)}
                                        className={`flex items-center gap-3 w-full p-2 rounded-lg text-left hover:bg-gray-100 transition ${selectedChatRoom === chat.room_id ? "bg-gray-200" : ""
                                            }`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={`${base_URL}${chat.image }`}
                                                alt={chat.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            {chat?.is_online && (
                                                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-medium text-sm truncate">{chat.name}</h4>
                                                <span className="text-xs text-gray-400">
                                                    {formatChatTime(chat?.last_message?.created_at)}
                                                </span>
                                            </div>
                                            <p className={`text-xs text-gray-600 truncate ${chat?.unseen_count > 0 ? "font-bold" : ""}`}>
                                                {chat?.last_message?.text || "No messages yet"}
                                            </p>
                                        </div>
                                        {chat?.unseen_count > 0 && (
                                            <span className="relative w-6 h-6 flex items-center justify-center text-xs rounded-full bg-primary text-white font-semibold">
                                                {chat.unseen_count > 99 ? "99+" : chat.unseen_count}
                                            </span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* Chat Panel */}
                <section className="w-[60%] xl:w-[75%] h-full bg-white rounded-lg shadow-md p-4">
                    <ChatPanel chatRoom={selectedChatRoom} />
                </section>

                {/* Modals */}
                {showCreateGroupModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
                            <CreateNewGroupModal onClose={() => setShowCreateGroupModal(false)} />
                        </div>
                    </div>
                )}

                {showCreateMessageModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl lg:max-w-3xl xl:max-w-5xl relative mx-5 sm:mx-10">
                            <CreateNewMessageModal onClose={() => setShowCreateMessageModal(false)} />
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Communication;