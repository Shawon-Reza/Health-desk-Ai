import React, { useEffect, useMemo, useState } from 'react'
import { FiArrowLeft, FiFileText, FiHash, FiMessageCircle, FiUserX } from 'react-icons/fi'
import { RiContactsBook3Line } from 'react-icons/ri';

import UserManageMentSetAction from './UserManageMentSetAction';
import Communication from './Communication/Communication';


// Small, reusable stat card component
const StatCard = ({ icon: Icon, label, value, children, tone = 'default' }) => {
    const toneClasses = useMemo(() => {
        switch (tone) {
            case 'danger':
                return 'text-red-500';
            case 'muted':
                return 'text-gray-500';
            default:
                return 'text-[#2F2F2F]';
        }
    }, [tone])

    return (
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-3">
                <Icon size={25} />
                <span className='font-medium'>{label}</span>
            </div>
            <div className={`text-xl font-bold ${children ? 'mb-3' : ''} ${toneClasses}`}>
                {value}
            </div>
            {children}
        </div>
    )
}

const StatusPill = ({ status }) => {
    const map = {
        Active: 'bg-green-50 text-green-700 border-green-200',
        Blocked: 'bg-red-50 text-red-600 border-red-200',
        Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    }
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${map[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            {status}
        </span>
    )
}

const UserProfileFromAdmin = () => {
    // Mocked state; swap fetchUser with real API later
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [showActionsMenu, setShowActionsMenu] = useState(false)
    const [userPermissions, setUserPermissions] = useState({
        trainAI: false,
        blockUser: false,
        accessUserProfile: false,
        accessChatHistory: false,
        createAssessment: false
    })

    // Simulate backend fetch
    useEffect(() => {
        const fetchUser = async () => {
            // Replace with real API call
            // const res = await fetch(`/api/users/:id`)
            // const data = await res.json()
            const mock = {
                id: 'u_001',
                name: 'Dr. Jhoson',
                employeeId: '0125',
                subjectMatter: 'Customer Support',
                chatOpen: false, // false => Close as in screenshot
                status: 'Blocked',
            }
            console.log('[UserProfileFromAdmin] fetched user:', mock)
            setTimeout(() => {
                setUser(mock)
                setLoading(false)
            }, 300)
        }
        fetchUser()
    }, [])

    const handleBack = () => {
        console.log('[UserProfileFromAdmin] Back clicked')
        // e.g., navigate(-1) if using react-router
    }

    const handleToggleChat = () => {
        setUser((prev) => {
            const next = { ...prev, chatOpen: !prev.chatOpen }
            console.log('[UserProfileFromAdmin] Chat toggled:', { from: prev.chatOpen, to: next.chatOpen })
            return next
        })
    }

    const handleToggleBlock = () => {
        setUser((prev) => {
            const nextStatus = prev.status === 'Blocked' ? 'Active' : 'Blocked'
            const next = { ...prev, status: nextStatus }
            console.log('[UserProfileFromAdmin] Account status changed:', { from: prev.status, to: nextStatus })
            return next
        })
    }

    const handleToggleActionsMenu = () => {
        setShowActionsMenu(prev => !prev)
    }

    const handleSavePermissions = (userId, permissions) => {
        setUserPermissions(permissions)
        console.log('[UserProfileFromAdmin] Permissions saved for user:', userId, permissions)
        // TODO: Call API to save permissions
        // Example: PUT /api/users/${userId}/permissions with body: permissions
    }

    const handleCloseActionsMenu = () => {
        setShowActionsMenu(false)
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="h-6 w-28 rounded bg-gray-200 animate-pulse mb-6" />
                <div className="h-10 w-64 rounded bg-gray-200 animate-pulse mb-3" />
                <div className="h-6 w-80 rounded bg-gray-200 animate-pulse mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-white rounded-xl shadow-md border border-gray-100 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-8">
            {/* Top actions */}
            <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[#00A4A6] hover:bg-teal-50 border border-teal-100"
                aria-label="Go back"
            >
                <FiArrowLeft className="w-4 h-4" />
                <span>Back</span>
            </button>

            {/* Header  */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#2F2F2F]">
                        {user?.name} <span className="font-semibold">Profile</span>
                    </h1>
                    <p className="text-gray-500 mt-2">See the profile overview and chat history</p>
                </div>

                <div className="relative">
                    <button 
                        onClick={handleToggleActionsMenu}
                        className='text-lg font-medium px-4 xl:px-12 py-2 bg-primary text-white rounded-md w-max hover:opacity-90 transition'
                    >
                        Actions
                    </button>

                    {/* Actions Dropdown */}
                    <UserManageMentSetAction
                        isOpen={showActionsMenu}
                        onClose={handleCloseActionsMenu}
                        userId={user?.id}
                        initialPermissions={userPermissions}
                        onSave={handleSavePermissions}
                    />
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-center itc">
                <StatCard icon={RiContactsBook3Line} label="Employee ID" value={user?.employeeId || '--'} />

                <StatCard icon={FiFileText} label="Subject Matter" value={user?.subjectMatter || '--'} />

                <StatCard icon={FiMessageCircle} label="Chat History" value={user?.chatOpen ? 'Open' : 'Close'} tone={user?.chatOpen ? 'default' : 'danger'}>
                    <button
                        onClick={handleToggleChat}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${user?.chatOpen
                            ? 'bg-primary text-white hover:opacity-90 border-primary'
                            : 'text-red-500 border-red-300 hover:bg-red-50'
                            }`}
                    >
                        {user?.chatOpen ? 'Close' : 'Open'}
                    </button>
                </StatCard>

                <StatCard icon={FiUserX} label="Account Status" value={<span className={user?.status === 'Blocked' ? 'text-red-500' : ''}>{user?.status}</span>}>
                    <div className="mt-2">
                        <StatusPill status={user?.status} />
                        <button
                            onClick={handleToggleBlock}
                            className="ml-3 px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                            {user?.status === 'Blocked' ? 'Unblock' : 'Block'}
                        </button>
                    </div>
                </StatCard>
            </div>

            {/* Chat History Section */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-[#2F2F2F] mb-3">Viewing Chat History</h2>

                <Communication />



                {/* Placeholder for future chat list */}
                {/* <div className="rounded-xl border border-dashed border-gray-300 p-6 text-gray-500">
                    Chat history will appear here. Integrate your messages API and render the conversation list.

                    
                </div> */}
            </div>
        </div>
    )
}

export default UserProfileFromAdmin