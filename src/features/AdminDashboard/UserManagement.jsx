
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiChevronDown, FiUserPlus } from "react-icons/fi";
import UserDetailsTable from "./UserDetailsTable";

export default function UserManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("All Roles");
    const [selectedClinic, setSelectedClinic] = useState("All Clinics");
    const [users, setUsers] = useState([]);

    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [showClinicDropdown, setShowClinicDropdown] = useState(false);

    const roleRef = useRef();
    const clinicRef = useRef();

    const roles = [
        "All Roles",
        "Admin",
        "President",
        "Manager",
        "Doctor",
        "Staff",
        "Jr. Staff",
    ];
    const clinics = [
        "All Clinics",
        "Downtown Medical Center",
        "Uptown Clinic",
        "Central Hospital",
    ];

    const mockUsers = [
        {
            id: "01",
            name: "Dr. Sarah Jhonson",
            email: "admin@example.com",
            subjectMatters: "N/A",
            role: "Admin",
            roleColor: "bg-pink-200 text-pink-700",
            clinic: "Downtown Medical Center",
            status: "Active",
            statusColor: "bg-green-500 text-white",
        },
        {
            id: "02",
            name: "Dr. Zara Khan",
            email: "zarakhah@example.com",
            subjectMatters: "Eye Specialist",
            role: "President",
            roleColor: "bg-blue-200 text-blue-700",
            clinic: "Downtown Medical Center",
            status: "Active",
            statusColor: "bg-green-500 text-white",
        },
        {
            id: "03",
            name: "Dr. Zara Khan",
            email: "zarakhah@example.com",
            subjectMatters: "Eye Specialist",
            role: "President",
            roleColor: "bg-blue-200 text-blue-700",
            clinic: "Downtown Medical Center",
            status: "Active",
            statusColor: "bg-green-500 text-white",
        },
        {
            id: "04",
            name: "Dr. Zara Khan",
            email: "zarakhah@example.com",
            subjectMatters: "Eye Specialist",
            role: "President",
            roleColor: "bg-blue-200 text-blue-700",
            clinic: "Downtown Medical Center",
            status: "Active",
            statusColor: "bg-green-500 text-white",
        },
        {
            id: "01",
            name: "Dr. Sarah Jhonson",
            email: "admin@example.com",
            subjectMatters: "N/A",
            role: "Admin",
            roleColor: "bg-pink-200 text-pink-700",
            clinic: "Downtown Medical Center",
            status: "Active",
            statusColor: "bg-green-500 text-white",
        },
        {
            id: "02",
            name: "Dr. Zara Khan",
            email: "zarakhah@example.com",
            subjectMatters: "Eye Specialist",
            role: "President",
            roleColor: "bg-blue-200 text-blue-700",
            clinic: "Downtown Medical Center",
            status: "Active",
            statusColor: "bg-green-500 text-white",
        },
        {
            id: "03",
            name: "Dr. Zara Khan",
            email: "zarakhah@example.com",
            subjectMatters: "Eye Specialist",
            role: "President",
            roleColor: "bg-blue-200 text-blue-700",
            clinic: "Downtown Medical Center",
            status: "Active",
            statusColor: "bg-green-500 text-white",
        },
        {
            id: "04",
            name: "Dr. Zara Khan",
            email: "zarakhah@example.com",
            subjectMatters: "Eye Specialist",
            role: "President",
            roleColor: "bg-blue-200 text-blue-700",
            clinic: "Downtown Medical Center",
            status: "Active",
            statusColor: "bg-green-500 text-white",
        },
        // Add others...
    ];

    useEffect(() => {
        setUsers(mockUsers);
    }, []);

    useEffect(() => {
        const filterParams = {
            search: searchQuery,
            role: selectedRole === "All Roles" ? null : selectedRole,
            clinic: selectedClinic === "All Clinics" ? null : selectedClinic,
        };
        console.log("[UserManagement] Filters applied:", filterParams);
    }, [searchQuery, selectedRole, selectedClinic]);

    const handleAddUser = () => {
        console.log("Add user clicked");
    };

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setShowRoleDropdown(false);
    };

    const handleClinicChange = (clinic) => {
        setSelectedClinic(clinic);
        setShowClinicDropdown(false);
    };

    const handleClickOutside = (e) => {
        if (
            roleRef.current &&
            !roleRef.current.contains(e.target) &&
            showRoleDropdown
        ) {
            setShowRoleDropdown(false);
        }
        if (
            clinicRef.current &&
            !clinicRef.current.contains(e.target) &&
            showClinicDropdown
        ) {
            setShowClinicDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showRoleDropdown, showClinicDropdown]);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">
                        Manage staff members and their access
                    </p>
                </div>
                <button
                    onClick={handleAddUser}
                    style={{ backgroundColor: "#00A4A6" }}
                    className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    <FiUserPlus size={20} />
                    Add User
                </button>
            </div>

            {/* Search & Filters */}
            <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Role Dropdown */}
                    <div className="relative" ref={roleRef}>
                        <button
                            onClick={() => setShowRoleDropdown((prev) => !prev)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            {selectedRole}
                            <FiChevronDown size={18} />
                        </button>
                        {showRoleDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                {roles.map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => handleRoleChange(role)}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${role === selectedRole ? "bg-gray-100 font-semibold" : ""
                                            }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clinic Dropdown */}
                    <div className="relative" ref={clinicRef}>
                        <button
                            onClick={() => setShowClinicDropdown((prev) => !prev)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            {selectedClinic}
                            <FiChevronDown size={18} />
                        </button>
                        {showClinicDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                {clinics.map((clinic) => (
                                    <button
                                        key={clinic}
                                        onClick={() => handleClinicChange(clinic)}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${clinic === selectedClinic
                                                ? "bg-gray-100 font-semibold"
                                                : ""
                                            }`}
                                    >
                                        {clinic}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* UserDetailsTable placeholder */}
            <section className="max-h-[calc(100vh-320px)] overflow-auto">
                <UserDetailsTable users={users} />
            </section>
        </div>
    );
}
