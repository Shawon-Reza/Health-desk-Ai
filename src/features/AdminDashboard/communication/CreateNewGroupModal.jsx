import React, { useState, useMemo } from 'react';

const fakeClinics = [
    { id: 1, name: 'Clinic One' },
    { id: 2, name: 'Clinic Two' },
    { id: 3, name: 'Clinic Three' },
    { id: 3, name: 'or Three' },
    { id: 3, name: 'a Three' },
];
const fakeRoles = ['Admin', 'Doctor', 'Staff', 'Manager'];
const fakeMembers = [
    { id: 1, name: 'Dr. Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', role: 'Admin', clinics: ['Clinic One', 'Clinic Two'] },
    { id: 2, name: 'Dr. Sarah Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', role: 'Doctor', clinics: ['Clinic One'] },
    { id: 3, name: 'John Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', role: 'Staff', clinics: ['Clinic Two', 'Clinic Three'] },
    { id: 4, name: 'Jane Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', role: 'Manager', clinics: ['Clinic Three'] },
    { id: 5, name: 'Dr. Michael Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', role: 'Admin', clinics: ['Clinic One', 'Clinic Three'] },
];

const CreateNewGroupModal = ({ onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedClinics, setSelectedClinics] = useState([]);
    const [clinicSearch, setClinicSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [memberSearch, setMemberSearch] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [membersList, setMembersList] = useState([]);

    // Fetch members when clinics or role changes
    React.useEffect(() => {
        // Simulate backend fetch: filter by selected clinics and role
        let members = fakeMembers;
        if (selectedClinics.length > 0) {
            members = members.filter(m => m.clinics.some(c => selectedClinics.includes(c)));
        }
        if (selectedRole) {
            members = members.filter(m => m.role === selectedRole);
        }
        setMembersList(members);
    }, [selectedClinics, selectedRole]);

    // Filter clinics by search and remove already selected
    const filteredClinics = useMemo(() => {
        let clinics = fakeClinics;
        if (clinicSearch) {
            clinics = clinics.filter(c => c.name.toLowerCase().includes(clinicSearch.toLowerCase()));
        }
        return clinics.filter(c => !selectedClinics.includes(c.name));
    }, [clinicSearch, selectedClinics]);

    // Filter members by search and remove already selected
    const filteredMembers = useMemo(() => {
        let members = membersList;
        if (memberSearch) {
            members = members.filter(m => m.name.toLowerCase().startsWith(memberSearch.toLowerCase()));
        }
        return members.filter(m => !selectedMembers.some(sm => sm.id === m.id));
    }, [memberSearch, selectedMembers, membersList]);

    const handleAddClinic = (clinicName) => {
        setSelectedClinics([...selectedClinics, clinicName]);
        setClinicSearch('');
    };

    const handleRemoveClinic = (clinicName) => {
        setSelectedClinics(selectedClinics.filter(c => c !== clinicName));
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleAddMember = (member) => {
        setSelectedMembers([...selectedMembers, member]);
        setMemberSearch('');
    };

    const handleRemoveMember = (id) => {
        setSelectedMembers(selectedMembers.filter(m => m.id !== id));
    };

    const handleCreateGroup = () => {
        // For now, just log the data
        console.log('Create Group:', {
            groupName,
            selectedClinics,
            selectedRole,
            selectedMembers,
        });
        onClose();
    };

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-300 pb-2">Create New Group</h2>
            <form className="space-y-4">
                {/* Group Name */}
                <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                        Group Name
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] border-gray-300 shadow-sm"
                        placeholder="Enter Group Name"
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                </div>
                {/* Clinic (searchable multi-select) */}
                <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                        Clinic
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]  border-gray-300 shadow-sm"
                            placeholder="Choose Clinic"
                            value={clinicSearch}
                            onChange={e => setClinicSearch(e.target.value)}
                        />
                        {clinicSearch && (
                            <div className="absolute bg-white border rounded-lg shadow-lg mt-1 w-full z-10">
                                {filteredClinics.length === 0 ? (
                                    <div className="p-2 text-sm text-gray-500">No clinics found</div>
                                ) : (
                                    filteredClinics.map(clinic => (
                                        <button
                                            key={clinic.id}
                                            type="button"
                                            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left"
                                            onClick={() => handleAddClinic(clinic.name)}
                                        >
                                            <span className="text-sm">{clinic.name}</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                        {/* Show selected clinics as chips */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedClinics.map(clinicName => (
                                <span key={clinicName} className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1">
                                    {clinicName}
                                    <button type="button" className="ml-1 text-blue-500 hover:text-blue-700 text-xs" onClick={() => handleRemoveClinic(clinicName)}>
                                        &#10005;
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Role & Add Members */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-sm font-medium mb-1 flex items-center gap-2">
                            Role
                        </label>
                        <select
                            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]  border-gray-300 shadow-sm"
                            value={selectedRole}
                            onChange={handleRoleChange}
                        >
                            <option value="">Select a role</option>
                            {fakeRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-medium mb-1 flex items-center gap-2">
                            Add Members
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]  border-gray-300 shadow-sm"
                            placeholder="Choose Members"
                            value={memberSearch}
                            onChange={e => setMemberSearch(e.target.value)}
                        />
                        {memberSearch && (
                            <div className="absolute bg-white border rounded-lg shadow-lg mt-1 w-full z-10">
                                {filteredMembers.length === 0 ? (
                                    <div className="p-2 text-sm text-gray-500">No members found</div>
                                ) : (
                                    filteredMembers.map(member => (
                                        <button
                                            key={member.id}
                                            type="button"
                                            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left"
                                            onClick={() => handleAddMember(member)}
                                        >
                                            <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-full object-cover" />
                                            <span className="text-sm">{member.name}</span>
                                            <span className="ml-auto text-xs bg-pink-100 text-pink-600 rounded-full px-2 py-0.5">{member.role}</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Members List */}
                <div className="mt-6">
                    <label className="text-sm font-medium mb-2 flex items-center gap-2">
                        Selected Members List
                    </label>
                    <div className=" border-t pt-2 border-gray-400">
                        {selectedMembers.length === 0 ? (
                            <div className="text-gray-500 text-sm py-4">No members added yet.</div>
                        ) : (
                            selectedMembers.map(member => (
                                <div key={member.id} className="flex items-center justify-between gap-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                                        <span className="font-medium text-sm">{member.name}</span>
                                    </div>

                                    <span className="bg-pink-100 text-pink-600 rounded-full px-3 py-1 text-xs font-semibold">{member.role}</span>

                                    <button type="button" className="ml-auto text-red-500 hover:text-red-700 text-xl" onClick={() => handleRemoveMember(member.id)}>
                                        &#10005;
                                    </button>
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
                    <button type="button" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700" onClick={handleCreateGroup}>
                        Create Group
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateNewGroupModal;