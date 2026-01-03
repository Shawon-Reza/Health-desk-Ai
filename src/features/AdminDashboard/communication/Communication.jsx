import React, { useEffect, useRef, useState } from "react"
import { FiSearch } from "react-icons/fi"
import ChatPanel from "./ChatPanel"
import CreateNewGroupModal from "../Communication/CreateNewGroupModal"
import CreateNewMessageModal from "../Communication/CreateNewMessageModal"
import { connectWebSocketForChatList } from "./ChatService"
import { useQuery } from "@tanstack/react-query"
import axiosApi from "../../../service/axiosInstance"
import { queryClient } from "../../../main"


const Communication = () => {
    const [activeTab, setActiveTab] = useState("allChat")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRole, setSelectedRole] = useState("All")
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
    const [showCreateMessageModal, setShowCreateMessageModal] = useState(false)
    const [selectedChatRoom, setSelectedChatRoom] = useState(null)


    const roles = ["All", "Manager", "Staff", "Doctor"]
    const socketRef = useRef(null)

    // ................**Fetch user's chat rooms**.................\\
    const { data: rooms = [], isLoading, isError, error } = useQuery({
        queryKey: ['myRooms'],
        queryFn: async () => {
            const response = await axiosApi.get('/api/v1/rooms/');
            // Return array - handle both { results: [...] } and direct array response
            return Array.isArray(response.data) ? response.data : response.data.results || [];
        },
        onSuccess: (data) => {
            console.log("Fetched chat rooms:", data);
        },
        onError: (err) => {
            console.error("Error fetching chat rooms:", err);
        }
    });
    console.log(rooms)

    // ................**WebSocket for real-time chat list updates/query Cached**.................\\
    useEffect(() => {
        socketRef.current = connectWebSocketForChatList({
            onMessage: (message) => {
                if (message.type !== 'room_update') return;
                console.log("New message :", message)
                const updated = message.data;

                queryClient.setQueryData(['myRooms'], (oldRooms) => {
                    // Ensure oldRooms is an array
                    if (!Array.isArray(oldRooms)) return oldRooms;

                    const existingRoom = oldRooms.find(
                        room => room.room_id === updated.room_id
                    );

                    if (!existingRoom) return oldRooms;

                    const mergedRoom = {
                        ...existingRoom,
                        ...updated,
                        last_message: updated.last_message,
                    };

                    return [
                        mergedRoom,
                        ...oldRooms.filter(
                            room => room.room_id !== updated.room_id
                        ),
                    ];
                });
            },
        });

        return () => socketRef.current?.close();
    }, [queryClient]);


    useEffect(() => {
        console.log("[Search + Filter]", { searchQuery, selectedRole })
    }, [searchQuery, selectedRole])

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleChatSelect = (chat) => {
        console.log(chat)
        //    Select chat room to pass to ChatPanel
        setSelectedChatRoom(chat.room_id)
        console.log(selectedChatRoom)
    }

    const handleRoleFilterChange = (role) => {
        setSelectedRole(role)
    }

    // ......................** Formatting chat time **......................  //
    const formatChatTime = (isoString) => {
        const date = new Date(isoString);

        const time = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        const day = date.toLocaleDateString("en-GB");

        return `${time} · ${day}`;
    };


    // Filtered chats based on search and role
    // const filteredChats = mockChats.filter((chat) => {
    //     const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    //     const matchesRole = selectedRole === "All" || chat.role === selectedRole
    //     return matchesSearch && matchesRole
    // })

    if (isLoading) {
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
        )
    }

    return (
        <div className="container mx-auto ">
            {/* Communication header */}
            <section className="text-secondary mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold">Communication Hub</h2>
                <p className="text-lg opacity-80">Chat with your team and AI assistant</p>
            </section>

            {/* Communication main part */}
            <section className="flex gap-6 h-[calc(100vh-250px)]">
                {/* Sidebar.......................................................... */}
                <section className="w-[40%] xl:w-[25%] h-full bg-white rounded-xl shadow-md p-4 space-y-4 border border-gray-300 ">
                    {/* Tabs */}
                    <div className="flex justify-between gap-3  pb-2">
                        <button
                            onClick={() => setActiveTab('allChat')}
                            className={`pb-1 font-medium ${activeTab === 'allChat'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 hover:text-primary'
                                }`}
                        >
                            All Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('aiAssistant')}
                            className={`pb-1 font-medium ${activeTab === 'aiAssistant'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-600 hover:text-primary'
                                }`}
                        >
                            AI Assistant
                        </button>
                    </div>


                    <div className={`${activeTab === 'allChat' ? '' : 'hidden'} flex justify-between gap-3  pb-2`}>
                        <button
                            className={`pb-1 font-medium ${activeTab === 'allChat'
                                ? 'text-primary border-2 rounded-lg px-2 border-primary'
                                : 'text-gray-600 hover:text-primary'
                                }`}
                            onClick={() => setShowCreateGroupModal(true)}
                        >
                            New Group
                        </button>
                        <button
                            className={`pb-1 font-medium ${activeTab === 'allChat'
                                ? 'text-primary border-2 rounded-lg px-2 border-primary'
                                : 'text-gray-600 hover:text-primary'
                                }`}
                            onClick={() => setShowCreateMessageModal(true)}
                        >
                            New Message
                        </button>
                    </div>

                    {/* Search + Role Filter */}
                    <div className={`flex items-center gap-2 ${activeTab === 'allChat' ? '' : 'hidden'} `}>
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search chat..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-3 py-2  rounded-lg text-sm focus:outline-none bg-gray-200"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={selectedRole}
                                onChange={(e) => handleRoleFilterChange(e.target.value)}
                                className="border rounded-lg px-2 py-2 text-sm"
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Chat List */}
                    {/* h-[calc(100vh-250px)] */}
                    <div className={`space-y-2 overflow-auto h-[calc(100vh-450px)] ${activeTab === 'allChat' ? '' : 'hidden'}`}>
                        {/* AI Assistant Default text */}
                        <p className={`text-center text-gray-500 ${activeTab === 'aiAssistant' ? '' : 'hidden'}`}>
                            All chats are shown here
                        </p>

                        <div className={`${activeTab === 'allChat' ? '' : 'hidden'}`}>
                            {rooms.length === 0 ? (
                                <p className="text-center text-gray-500 py-10">No chats found</p>
                            ) : (
                                rooms.map((chat) => (
                                    <button
                                        key={chat.room_id}
                                        onClick={() => handleChatSelect(chat)}
                                        className={`flex items-center gap-3 w-full p-2 rounded-lg text-left hover:bg-gray-100 transition ${selectedChatRoom === chat.room_id ? 'bg-gray-200' : ''}`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={chat.image}
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
                                                <span className="text-xs text-gray-400">{formatChatTime(chat?.last_message?.created_at)}</span>
                                            </div>
                                            <p className={`text-xs text-gray-600 truncate ${chat?.unseen_count > 0 ? 'font-bold' : ''}`}>{chat?.last_message?.text}</p>
                                        </div>
                                        {chat?.unseen_count > 0 && (
                                            <span className="relative w-2 h-2 p-2 text-xs rounded-full bg-primary">
                                                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-semibold">
                                                    {
                                                        chat.unseen_count
                                                    }
                                                </p>
                                            </span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </section>






                {/* Communication chat panel */}
                <section className="w-[60%] xl:w-[75%] h-full bg-white rounded-lg shadow-md p-4">
                    <ChatPanel chatRoom={selectedChatRoom} />
                </section>

                {/* Create New Group Modal */}
                {showCreateGroupModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-30">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
                            <CreateNewGroupModal
                                onClose={() => setShowCreateGroupModal(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Create New Message Modal */}
                {showCreateMessageModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-30">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
                            <CreateNewMessageModal
                                onClose={() => setShowCreateMessageModal(false)}
                            />
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}

export default Communication
