"use client"
import { use } from "react"
import { FiUser, FiMoreVertical } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

export default function UserDetailsTable({ users = [] }) {
  const navigate = useNavigate();




  const handleViewDetails = (userId) => {
    console.log("[v0] View details clicked for user ID:", userId)
    navigate(`/admin/user-management/user/${userId}`);

  }

  const handleAction = (userId, action) => {
    console.log("[v0] Action menu clicked for user ID:", userId, "Action:", action)
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Users Details</h2>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
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
                  onClick={() => handleViewDetails(user.id)}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{user.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <FiUser size={16} className="text-primary" />
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.subjectMatters}</td>
                  <td className="px-4 py-3 text-sm flex items-center justify-center">
                    <span className={`px-4 py-2  rounded-full text-xs font-semibold ${user.roleColor}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.clinic}</td>
                  <td className=" text-sm">
                    <span className={`px-3 py-3 h-full flex items-center text-xs font-semibold justify-center ${user.statusColor}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleAction(user.id, "menu")}
                      className="p-2 h-full w-full hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <FiMoreVertical size={18} className="text-gray-600" />
                    </button>
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
