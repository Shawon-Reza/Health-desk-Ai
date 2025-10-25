
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiChevronDown, FiUserPlus } from "react-icons/fi";
import UserDetailsTable from "./UserDetailsTable";
import AddNewUserModal from "./AddNewUserModal";

export default function UserManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("All Roles");
    const [selectedClinic, setSelectedClinic] = useState("All Clinics");
    const [users, setUsers] = useState([]);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

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
        console.log("[UserManagement] Add user clicked");
        setIsAddUserOpen(true);
    };

    const handleCloseAddUser = () => setIsAddUserOpen(false);

    // Map new user payload to table row shape
    const mapUserToRow = (u) => {
        const roleColorMap = {
            Admin: "bg-pink-200 text-pink-700",
            President: "bg-blue-200 text-blue-700",
            Manager: "bg-purple-200 text-purple-700",
            Doctor: "bg-emerald-200 text-emerald-700",
            Staff: "bg-amber-200 text-amber-700",
            "Jr. Staff": "bg-amber-100 text-amber-700",
        };
        const statusColorMap = {
            Active: "bg-green-500 text-white",
            Blocked: "bg-red-500 text-white",
            Pending: "bg-yellow-500 text-white",
        };

        return {
            id: String(users.length + 1).padStart(2, "0"),
            name: u.name || `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
            email: u.email,
            subjectMatters: u.subjectMatter || "N/A",
            role: u.role,
            roleColor: roleColorMap[u.role] || "bg-gray-200 text-gray-700",
            clinic: Array.isArray(u.clinics) && u.clinics.length ? u.clinics[0] : "N/A",
            status: u.status || "Active",
            statusColor: statusColorMap[u.status] || statusColorMap.Active,
        };
    };

    const handleUserCreated = (created) => {
        console.log("[UserManagement] User created:", created);
        setUsers((prev) => [...prev, mapUserToRow(created)]);
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
            {/* Add New User Modal */}
            <AddNewUserModal
                isOpen={isAddUserOpen}
                onClose={handleCloseAddUser}
                onCreated={handleUserCreated}
                roles={roles.filter((r) => r !== "All Roles")}
                clinics={clinics.filter((c) => c !== "All Clinics")}
            />
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">
                        Manage staff members and their access
                    </p>
                </div>
                {/* Add User Button */}
                <button
                    onClick={handleAddUser}
                    style={{ backgroundColor: "#00A4A6" }}
                    className="flex items-center gap-2 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:opacity-90 transition-opacity text-sm md:text-base"
                >
                    <FiUserPlus size={18} className="md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Add User</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {/* Search & Filters */}
            <div className="border border-gray-300 rounded-lg p-3 md:p-4 space-y-3 md:space-y-4 bg-white">
                <div className="flex flex-col lg:flex-row  gap-3 md:gap-4">
                    {/* Search Bar */}
                    <div className="w-full relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="flex gap-2 md:gap-4">
                        {/* Role Dropdown */}
                        <div className="relative flex-1" ref={roleRef}>
                            <button
                                onClick={() => setShowRoleDropdown((prev) => !prev)}
                                className="w-full flex items-center justify-between gap-2 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <span className="truncate">{selectedRole}</span>
                                <FiChevronDown size={16} className="flex-shrink-0" />
                            </button>
                            {showRoleDropdown && (
                                <div className="absolute left-0 md:right-0 md:left-auto mt-2 w-full md:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                    {roles.map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => handleRoleChange(role)}
                                            className={`w-full text-left px-3 md:px-4 py-2 text-sm md:text-base hover:bg-gray-100 transition-colors ${role === selectedRole ? "bg-gray-100 font-semibold" : ""
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clinic Dropdown */}
                        <div className="relative flex-1" ref={clinicRef}>
                            <button
                                onClick={() => setShowClinicDropdown((prev) => !prev)}
                                className="w-full flex items-center justify-between gap-2 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <span className="truncate">{selectedClinic}</span>
                                <FiChevronDown size={16} className="flex-shrink-0" />
                            </button>
                            {showClinicDropdown && (
                                <div className="absolute left-0 md:right-0 md:left-auto mt-2 w-full md:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                    {clinics.map((clinic) => (
                                        <button
                                            key={clinic}
                                            onClick={() => handleClinicChange(clinic)}
                                            className={`w-full text-left px-3 md:px-4 py-2 text-sm md:text-base hover:bg-gray-100 transition-colors ${clinic === selectedClinic
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
            </div>

            {/* UserDetailsTable placeholder */}
            <section className="max-h-[calc(100vh-320px)] overflow-auto bg-white">
                <UserDetailsTable users={users} />
            </section>
        </div>
    );
}
