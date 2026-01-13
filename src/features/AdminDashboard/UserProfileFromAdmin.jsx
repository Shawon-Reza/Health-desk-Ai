import React, { useEffect, useMemo, useState } from 'react'
import { FiArrowLeft, FiFileText, FiHash, FiMessageCircle, FiUserX } from 'react-icons/fi'
import { RiContactsBook3Line } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axiosApi from '../../service/axiosInstance';

import UserManageMentSetAction from './UserManageMentSetAction';
import Communication from './Communication/Communication';
import useGetUserProfile from '../../hooks/useGetUserProfile';


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
    const [showActionsMenu, setShowActionsMenu] = useState(false)
    const [userPermissions, setUserPermissions] = useState({
        trainAI: false,
        blockUser: false,
        accessUserProfile: false,
        accessChatHistory: false,
        createAssessment: false
    })
  
    const { userId } = useParams();
    const queryClient = useQueryClient();

    // Fetch user data from API
    const { data: user, isLoading: loading, error } = useQuery({
        queryKey: ['user-profile-admin', userId],
        queryFn: async () => {
            const res = await axiosApi.get(`/api/v1/users/${userId}/`);
            console.log('[UserProfileFromAdmin] Fetched user data:', res.data);
            return res.data;
        },
        enabled: !!userId,
    });

    console.log(user)

    // Status mutation for toggling active/inactive
    const statusMutation = useMutation({
        mutationFn: async ({ userId, nextStatus }) => {
            const payload = { is_active: !!nextStatus };
            console.log('[UserProfileFromAdmin] Toggle status payload:', payload);
            const response = await axiosApi.patch(`/api/v1/users/status/${userId}/`, payload);
            return response.data;
        },
        onSuccess: (_, variables) => {
            toast.success(`User ${variables.nextStatus ? "activated" : "deactivated"} successfully`);
            queryClient.invalidateQueries({ queryKey: ['user-profile-admin', userId] });
        },
        onError: (error) => {
            const message = error?.response?.data?.message || "Failed to update status";
            toast.error(message);
        }
    });

    const handleBack = () => {
        console.log('[UserProfileFromAdmin] Back clicked')
        // e.g., navigate(-1) if using react-router
    }

    const handleToggleChat = () => {
        console.log('[UserProfileFromAdmin] Chat toggle clicked - implement API call');
        // TODO: Implement API call to toggle chat status
    }

    const handleToggleStatus = () => {
        if (!user?.id) return;
        statusMutation.mutate({ 
            userId: user.id, 
            nextStatus: !user.is_active 
        });
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
                        {user?.full_name} <span className="font-semibold">Profile</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 text-center itc">
                <StatCard icon={RiContactsBook3Line} label="Employee ID" value={user?.employee_id || '--'} />

                <StatCard icon={FiFileText} label="Subject Matter" value={user?.subject_matters?.join(', ') || '--'} />

                <StatCard icon={FiUserX} label="Account Status" value={<span className={!user?.is_active ? 'text-red-500' : ''}>{user?.is_active ? 'Active' : 'Inactive'}</span>}>
                    <div className="mt-2">
                        <StatusPill status={user?.is_active ? 'Active' : 'Blocked'} />
                        <button
                            onClick={handleToggleStatus}
                            disabled={statusMutation.isPending}
                            className={`ml-3 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                                statusMutation.isPending 
                                    ? 'opacity-60 cursor-not-allowed border-gray-200 text-gray-500' 
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {statusMutation.isPending 
                                ? 'Updating...' 
                                : user?.is_active ? 'Set Inactive' : 'Set Active'}
                        </button>
                    </div>
                </StatCard>
            </div>

            {/* User Details Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FiFileText className="text-primary" />
                        Personal Information
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            {user?.picture && (
                                <img 
                                    src={`http://10.10.13.2:8000${user.picture}`} 
                                    alt={user?.full_name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                                />
                            )}
                            <div>
                                <p className="text-sm text-gray-600">Name</p>
                                <p className="font-semibold text-gray-900">{user?.full_name}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">{user?.phone || '--'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Role</p>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700 capitalize">
                                {user?.role}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Joining Date</p>
                            <p className="font-medium text-gray-900">
                                {user?.joining_date ? new Date(user.joining_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : '--'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Clinic & Knowledge */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FiFileText className="text-primary" />
                        Professional Details
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Clinics</p>
                            {user?.clinics && user.clinics.length > 0 ? (
                                <div className="space-y-1">
                                    {user.clinics.map((clinic, index) => (
                                        <span key={index} className="inline-block px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 mr-2 mb-2">
                                            {clinic}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No clinics assigned</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Knowledge Level</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full transition-all"
                                        style={{ width: `${(user?.knowledge_level || 0) * 10}%` }}
                                    />
                                </div>
                                <span className="text-sm font-bold text-teal-600">{user?.knowledge_level || 0}/10</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Subject Matters</p>
                            {user?.subject_matters && user.subject_matters.length > 0 ? (
                                <div className="space-y-1">
                                    {user.subject_matters.map((matter, index) => (
                                        <span key={index} className="inline-block px-3 py-1 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 mr-2 mb-2">
                                            {matter}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No subject matters</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FiMessageCircle className="text-primary" />
                        Preferences
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FiMessageCircle className="text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Tagged Messages</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user?.notify_tagged_messages 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                                {user?.notify_tagged_messages ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FiFileText className="text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Assessments</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user?.notify_assessments 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                                {user?.notify_assessments ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <FiUserX className="text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Account Status</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user?.is_active 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-600'
                            }`}>
                                {user?.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat History Section */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-[#2F2F2F] mb-3">Viewing Chat History</h2>
                {/* ............................User Chat History ........................ */}
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