import React, { useState, useMemo } from 'react';

const fakeRoles = ['Admin', 'Doctor', 'Staff', 'Manager'];
const fakeUsers = [
    { id: 1, name: 'Dr. Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', role: 'Admin' },
    { id: 2, name: 'Dr. Sarah Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', role: 'Doctor' },
    { id: 3, name: 'John Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', role: 'Staff' },
    { id: 4, name: 'Jane Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', role: 'Manager' },
    { id: 5, name: 'Dr. Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', role: 'Admin' },
    { id: 6, name: 'Alice Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6', role: 'Staff' },
];

const CreateNewMessageModal = ({ onClose }) => {
    const [userSearch, setUserSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [usersList, setUsersList] = useState(fakeUsers);

    // Fetch users when role changes
    React.useEffect(() => {
        // Simulate backend fetch: filter by selected role
        let users = fakeUsers;
        if (selectedRole) {
            users = users.filter(u => u.role === selectedRole);
        }
        setUsersList(users);
    }, [selectedRole]);

    // Filter users by search
    const filteredUsers = useMemo(() => {
        let users = usersList;
        if (userSearch) {
            users = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()));
        }
        return users;
    }, [userSearch, usersList]);

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleUserToggle = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleSendMessage = () => {
        // For now, just log the data
        console.log('Send Message:', {
            selectedUsers,
            selectedRole,
            message,
        });
        onClose();
    };

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-300 pb-2">New Direct Message</h2>
            <form className="space-y-4">
                {/* Search User & Role */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-sm font-medium mb-1 flex items-center gap-2">
                            Search User
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-gray-300 shadow-sm"
                            placeholder="Search here"
                            value={userSearch}
                            onChange={e => setUserSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-medium mb-1 flex items-center gap-2">
                            Role
                        </label>
                        <select
                            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-gray-300 shadow-sm"
                            value={selectedRole}
                            onChange={handleRoleChange}
                        >
                            <option value="">Select a role</option>
                            {fakeRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Send Message */}
                <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                        Send Message
                    </label>
                    <textarea
                        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-gray-300 shadow-sm resize-none"
                        placeholder="Type message here"
                        rows="5"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                </div>

                {/* User List */}
                <div className="mt-6">
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                        User List
                    </label>
                    <div className="border-t pt-2 border-gray-400 max-h-64 overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                            <div className="text-gray-500 text-sm py-4">No users found</div>
                        ) : (
                            filteredUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between gap-3 py-2 hover:bg-gray-50 rounded-lg px-2">
                                    <div className="flex items-center gap-2">
                                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="font-medium text-sm">{user.name}</span>
                                    </div>

                                    <span className="bg-pink-100 text-pink-600 rounded-full px-3 py-1 text-xs font-semibold text-center">{user.role}</span>

                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-2 border-teal-500 text-teal-600 focus:ring-2 focus:ring-teal-500 cursor-pointer"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleUserToggle(user.id)}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" className="border border-red-400 text-red-500 px-6 py-2 rounded-lg font-semibold bg-white hover:bg-red-50" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700" onClick={handleSendMessage}>
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateNewMessageModal;