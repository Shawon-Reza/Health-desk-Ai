"use client"
import { use, useState, useRef, useEffect } from "react"
import { FiUser, FiMoreVertical } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

export default function UserDetailsTable({ users = [], onEditUser }) {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  console.log("User:", users)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewDetails = (userId) => {
    console.log("[v0] View details clicked for user ID:", userId)
    navigate(`/admin/user-management/user/${userId}`);
  }

  const handleAction = (userId, action, e) => {
    e.stopPropagation();
    console.log("[v0] Action menu clicked for user ID:", userId, "Action:", action)
    setOpenMenuId(openMenuId === userId ? null : userId);
  }
  //...............Handle Change Password..............\\
  const handleChangePassword = (userId, e) => {
    e.stopPropagation();
    console.log("[v0] Change password for user ID:", userId);
    setOpenMenuId(null);
    // Add your change password logic here
  }
  //..............Handle Delete/Archive User..............\\
  const handleDeleteArchive = (userId, e) => {
    e.stopPropagation();
    console.log("[v0] Delete/Archive user ID:", userId);
    setOpenMenuId(null);
    // Add your delete/archive logic here
  }
  //..............Handle Update User..............\\
  const handleUpdateUser = (userId, e) => {
    e.stopPropagation();
    console.log("[v0] Update user ID:", userId);
    setOpenMenuId(null);
    onEditUser && onEditUser(userId);
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 ">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Users Details</h2>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-[calc(100vh-450px)] ">
        <table className="w-full">
          <thead className="sticky top-0 ">
            <tr className="border-b border-gray-300 bg-gray-100">
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">ID NO</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">User Name</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">User email</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Subject Matters</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Role</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Clinic</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Account Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"

                >
                  <td className="px-4 py-3 text-sm text-gray-900">{user.employee_id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-2"
                      onClick={() => handleViewDetails(user.id)}
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <FiUser size={16} className="text-primary" />
                      </div>
                      {user.full_name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.subject_matters}</td>
                  <td className="px-4 py-3 text-sm flex items-center justify-center">
                    <span className={`px-4 py-2  rounded-full text-xs font-semibold ${user.roleColor}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {
                      user.clinics.join(", ")
                    }
                  </td>
                  <td className=" text-sm">
                    <span className={`px-3 py-3 h-full flex items-center text-xs font-semibold justify-center ${user.is_active ? 'bg-green-100 text-green-800 rounded-md' : 'bg-red-100 text-red-800 rounded-md'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm relative">
                    <button
                      onClick={(e) => handleAction(user.id, "menu", e)}
                      className="p-2 h-full w-full hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <FiMoreVertical size={18} className="text-gray-600 z-0" />
                    </button>

                    {/* Action Menu Popup */}
                    {openMenuId === user.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-12 z-20 bg-white border border-gray-300 rounded-lg shadow-lg w-48 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-700">Actions</h3>
                        </div>
                        <div className="p-2 space-y-2">
                          <button
                            onClick={(e) => handleUpdateUser(user.id, e)}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                          >
                            Update User
                          </button>

                          <button onClick={(e) => handleChangePassword(user.id, e)}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors"
                          >
                            Change Password
                          </button>
                          <button
                            onClick={(e) => handleDeleteArchive(user.id, e)}
                            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Delete / Archived
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
