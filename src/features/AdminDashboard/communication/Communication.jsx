import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import ChatPanel from './ChatPanel';
import CreateNewGroupModal from '../Communication/CreateNewGroupModal';
import CreateNewMessageModal from '../Communication/CreateNewMessageModal';




const Communication = () => {
    const [activeTab, setActiveTab] = useState('allChat');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [loading, setLoading] = useState(true);

    const roles = ['All', 'Manager', 'Staff', 'Doctor'];

    // Mock chat data with roles
    const mockChats = [
        {
            id: 1,
            name: 'Clinic 1 - All Staff Group',
            lastMessage: 'Hi, how are you doing today?',
            timestamp: '10 min ago',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
            unread: true,
            role: 'Staff',
        },
        {
            id: 2,
            name: 'Dr. Zara Khan',
            lastMessage: 'Sure, I will send the report.',
            timestamp: '5 min ago',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
            unread: false,
            role: 'Doctor',
        },
        {
            id: 3,
            name: 'AI Assistant',
            lastMessage: 'How can I assist you today?',
            timestamp: 'Just now',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
            unread: true,
            role: 'Manager',
        },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setChats(mockChats);
            setLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        console.log('[Search + Filter]', {
            searchQuery,
            selectedRole,
        });
    }, [searchQuery, selectedRole]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleChatSelect = (chat) => {
        setSelectedChat(chat.id);
    };

    const handleRoleFilterChange = (role) => {
        setSelectedRole(role);
    };

    // Filtered chats based on search and role
    const filteredChats = chats.filter((chat) => {
        const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === 'All' || chat.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    // Modal state
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [showCreateMessageModal, setShowCreateMessageModal] = useState(false);

    return (
        <div className="container mx-auto ">
            {/* Communication header */}
            <section className="text-secondary mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold">Communication Hub</h2>
                <p className="text-lg opacity-80">Chat with your team and AI assistant</p>
            </section>

            {/* Communication main part */}
            <section className="flex gap-6 h-[calc(100vh-280px)]">
                {/* Sidebar.......................................................... */}
                <section className="w-[40%] xl:w-[25%] h-full bg-white rounded-xl shadow-md p-4 space-y-4 border border-gray-300">
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


                    <div className="flex justify-between gap-3  pb-2">
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
                    <div className="flex items-center gap-2">
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
                    <div className="space-y-2 overflow-y-auto max-h-[400px]">
                        {loading ? (
                            <p className="text-center text-gray-500 py-10">Loading chats...</p>
                        ) : filteredChats.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">No chats found</p>
                        ) : (
                            filteredChats.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => handleChatSelect(chat)}
                                    className={`flex items-center gap-3 w-full p-2 rounded-lg text-left hover:bg-gray-100 transition ${selectedChat === chat.id ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <img
                                        src={chat.avatar}
                                        alt={chat.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-medium text-sm truncate">{chat.name}</h4>
                                            <span className="text-xs text-gray-400">{chat.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                                    </div>
                                    {chat.unread && (
                                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </section>

                {/* Communication chat panel */}
                <section className="w-[60%] xl:w-[75%] h-full bg-white rounded-lg shadow-md p-4">
                    <ChatPanel />
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
    );
};

export default Communication;
