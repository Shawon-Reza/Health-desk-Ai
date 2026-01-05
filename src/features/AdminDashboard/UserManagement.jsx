
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiChevronDown, FiUserPlus } from "react-icons/fi";
import UserDetailsTable from "./UserDetailsTable";
import AddNewUserModal from "./AddNewUserModal";
import ChangePasswordModal from "./ChangePasswordModal";
import useGetSubjectMattersAndClinicsList from "../../hooks/useGetSubjectMattersAndClinicsList";
import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../service/axiosInstance";

export default function UserManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("All Roles");
    const [selectedClinic, setSelectedClinic] = useState("All Clinics");
    const [selectedClinicId, setSelectedClinicId] = useState(null);
    const [users, setUsers] = useState([]);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [changePasswordUserId, setChangePasswordUserId] = useState(null);
    const [changePasswordUserName, setChangePasswordUserName] = useState('');
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [showClinicDropdown, setShowClinicDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const roleRef = useRef();
    const clinicRef = useRef();

    const roles = [
        "All Roles",
        "President",
        "Manager",
        "Doctor",
        "Staff",
        "jr_staff",
    ];
    const clinics = ["All Clinics"]; // kept for the "All Clinics" label; real data comes from the hook

    // ================ FETCH CLINICS AND SUBJECT MATTERS ================
    const {

        clinicsList,
        subjectMattersList,
        isLoading,
        error,
        refetch
    } = useGetSubjectMattersAndClinicsList()
    // =============================================================================
    //================ FETCH USER LIST DATA INCLUDING FILTERING  ==================\\
    const {
        data: userListResponse = { results: [], pagination: { count: 0, next: null, previous: null, page: 1, pageSize: 0 } },
        isLoading: userListLoading,
        error: userListError,
        refetch: refetchUserList
    } = useQuery({
        queryKey: ['userList', searchQuery, selectedRole, selectedClinicId, currentPage],
        queryFn: async () => {
            // Build query parameters
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedRole && selectedRole !== 'All Roles') params.append('role', selectedRole.toLowerCase());
            if (selectedClinicId) params.append('clinic', selectedClinicId);
            params.append('page', currentPage);

            const queryString = params.toString();
            const url = queryString ? `/api/v1/users/?${queryString}` : '/api/v1/users/';

            const response = await axiosApi.get(url);
            const rawData = response.data;
            const results = Array.isArray(rawData) ? rawData : rawData?.results || rawData?.data || [];
            const count = Number(rawData?.count ?? results.length ?? 0);
            const pageSize = Number(rawData?.page_size ?? results.length ?? 0);
            const next = rawData?.next ?? null;
            const previous = rawData?.previous ?? null;

            return {
                results,
                pagination: {
                    count,
                    next,
                    previous,
                    page: currentPage,
                    pageSize,
                },
            };
        },
    });
    console.log("User list :", userListResponse);


    // map API user shape to table row shape
    const mapUserFromApi = (u, idx) => {
        const roleColorMap = {
            owner: "bg-pink-200 text-pink-700",
            admin: "bg-pink-200 text-pink-700",
            doctor: "bg-blue-200 text-blue-700",
            manager: "bg-purple-200 text-purple-700",
            staff: "bg-amber-200 text-amber-700",
            default: "bg-gray-200 text-gray-700",
        };
        const statusColorMap = {
            Active: "bg-green-500 text-white",
            Inactive: "bg-red-500 text-white",
        };

        const subjectMattersValue = Array.isArray(u.subject_matters) && u.subject_matters.length
            ? (u.subject_matters[0].title || u.subject_matters[0])
            : "N/A";
        const clinicValue = Array.isArray(u.clinics) && u.clinics.length ? u.clinics[0] : "N/A";
        const statusValue = u.is_active ? "Active" : "Inactive";

        return {
            id: String(u.id ?? idx + 1).padStart(2, "0"),
            name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.email,
            email: u.email,
            subjectMatters: subjectMattersValue,
            role: u.role,
            roleColor: roleColorMap[u.role] || roleColorMap.default,
            clinic: clinicValue,
            status: statusValue,
            statusColor: statusColorMap[statusValue] || statusColorMap.Inactive,
        };
    };

    // when API data arrives, populate the table rows
    const usersData = Array.isArray(userListResponse) ? userListResponse : userListResponse?.results || [];
    const pagination = !Array.isArray(userListResponse) && userListResponse?.pagination
        ? userListResponse.pagination
        : {
            count: usersData.length,
            next: null,
            previous: null,
            page: currentPage,
            pageSize: usersData.length,
        };
    const currentPageDisplay = pagination.page || 1;
    const pageSize = pagination.pageSize || usersData.length || 1;
    const totalPages = Math.max(1, Math.ceil((pagination.count || 0) / pageSize));
    const hasPrevious = pagination.previous !== null ? Boolean(pagination.previous) : currentPageDisplay > 1;
    const hasNext = pagination.next !== null ? Boolean(pagination.next) : currentPageDisplay < totalPages;

    useEffect(() => {
        if (Array.isArray(usersData) && usersData.length) {
            setUsers(usersData.map((u, idx) => mapUserFromApi(u, idx)));
        } else {
            setUsers([]);
        }
    }, [usersData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedRole, selectedClinicId]);

    useEffect(() => {
        const filterParams = {
            search: searchQuery,
            role: selectedRole === "All Roles" ? null : selectedRole,
            clinic: selectedClinicId || null,
        };
        console.log("[UserManagement] Filters applied:", filterParams);
    }, [searchQuery, selectedRole, selectedClinicId]);

    const handleAddUser = () => {
        console.log("[UserManagement] Add user clicked");
        setModalMode('create');
        setSelectedUserId(null);
        setIsAddUserOpen(true);
    };

    const handleEditUser = (userId) => {
        console.log("[UserManagement] Edit user clicked for ID:", userId);
        setModalMode('edit');
        setSelectedUserId(userId);
        setIsAddUserOpen(true);
    };

    const handleChangePassword = (userId, userName) => {
        console.log("[UserManagement] Change password clicked for ID:", userId);
        setChangePasswordUserId(userId);
        setChangePasswordUserName(userName);
        setIsChangePasswordOpen(true);
    };

    const handleCloseChangePassword = () => {
        setIsChangePasswordOpen(false);
        setChangePasswordUserId(null);
        setChangePasswordUserName('');
    };

    const handleCloseAddUser = () => {
        setIsAddUserOpen(false);
        setModalMode('create');
        setSelectedUserId(null);
    };

    // Map new user payload to table row shape
    const mapUserToRow = (u) => {
        const roleColorMap = {
            Admin: "bg-pink-200 text-pink-700",
            President: "bg-blue-200 text-blue-700",
            Manager: "bg-purple-200 text-purple-700",
            Doctor: "bg-emerald-200 text-emerald-700",
            Staff: "bg-amber-200 text-amber-700",
            "jr_staff": "bg-amber-100 text-amber-700",
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

    const handleUserCreated = () => {
        console.log("[UserManagement] User created:", created);
        setUsers((prev) => [...prev, mapUserToRow(created)]);
    };

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setShowRoleDropdown(false);
    };

    const handleClinicChange = (clinicOption) => {
        const isAll = clinicOption === "All Clinics";
        setSelectedClinic(isAll ? "All Clinics" : (clinicOption.name || clinicOption.title || clinicOption));
        setSelectedClinicId(isAll ? null : clinicOption.id);
        setShowClinicDropdown(false);
    };

    const handlePageChange = (page) => {
        if (!Number.isFinite(page)) return;
        const nextPage = Math.max(1, page);
        setCurrentPage(nextPage);
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
        <div className=" space-y-6 max-h-[calc(100dvh-148px)] overflow-auto">
            {/* Add New User Modal */}
            <AddNewUserModal
                isOpen={isAddUserOpen}
                onClose={handleCloseAddUser}
                onCreated={handleUserCreated}
                onRefetch={refetch}
                mode={modalMode}
                userId={selectedUserId}
                roles={roles.filter((r) => r !== "All Roles")}
                clinics={clinicsList}
                subjectMatters={subjectMattersList}
                isLoading={isLoading}
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
                                <div className="absolute left-0 md:right-0 md:left-auto mt-2 w-full md:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
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
                                <div className="absolute left-0 md:right-0 md:left-auto mt-2 w-full md:w-48 bg-white border border-gray-300 rounded-lg shadow-lg  max-h-60 overflow-y-auto z-100">
                                    {/* All Clinics option */}
                                    <button
                                        key="all-clinics"
                                        onClick={() => handleClinicChange("All Clinics")}
                                        className={`w-full text-left px-3 md:px-4 py-2 text-sm md:text-base hover:bg-gray-100 transition-colors ${selectedClinicId === null ? "bg-gray-100 font-semibold" : ""}`}
                                    >
                                        All Clinics
                                    </button>
                                    {/* Dynamic clinics from hook */}
                                    {clinicsList?.map((clinic) => (
                                        <button
                                            key={clinic.id}
                                            onClick={() => handleClinicChange(clinic)}
                                            className={`w-full text-left px-3 md:px-4 py-2 text-sm md:text-base hover:bg-gray-100 transition-colors ${clinic.id === selectedClinicId
                                                ? "bg-gray-100 font-semibold"
                                                : ""
                                                }`}
                                        >
                                            {clinic.name || clinic.title || clinic.id}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* UserDetailsTable placeholder */}
            <section className="max-h-[calc(100vh-400px)] overflow-auto bg-white">
                <UserDetailsTable
                    users={usersData}
                    onEditUser={handleEditUser}
                    onChangePassword={handleChangePassword}
                    isLoading={userListLoading}
                    error={userListError}
                />
            </section>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-gray-600">
                    {pagination.count > 0
                        ? `Showing page ${currentPageDisplay} of ${totalPages} (${pagination.count} users)`
                        : "No users to display"}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPageDisplay - 1)}
                        disabled={!hasPrevious}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {currentPageDisplay} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPageDisplay + 1)}
                        disabled={!hasNext}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Change Password Modal */}
            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={handleCloseChangePassword}
                userId={changePasswordUserId}
                userName={changePasswordUserName}
            />
        </div>
    );
}
