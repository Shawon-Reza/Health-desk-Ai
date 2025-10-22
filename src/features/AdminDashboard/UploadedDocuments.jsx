"use client"

import { useState, useEffect } from "react"
import { FiUser, FiMoreVertical, FiChevronDown } from "react-icons/fi"

const UploadedDocuments = () => {
  const [documents, setDocuments] = useState([])
  const [filteredDocuments, setFilteredDocuments] = useState([])
  const [selectedRole, setSelectedRole] = useState("All Roles")
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock data - Replace with API call
  const mockDocuments = [
    {
      id: 1,
      slNo: "02",
      name: "Dr. Zara Khan",
      documentType: "Questions",
      uploadedDate: "16 oct, 2025",
      uploadedBy: "President",
      role: "President",
    },
    {
      id: 2,
      slNo: "03",
      name: "Dr. Aliza",
      documentType: "Answers",
      uploadedDate: "16 oct, 2025",
      uploadedBy: "Manager",
      role: "Manager",
    },
    {
      id: 3,
      slNo: "05",
      name: "Dr. Aliza",
      documentType: "Questions",
      uploadedDate: "16 oct, 2025",
      uploadedBy: "President",
      role: "President",
    },
    {
      id: 4,
      slNo: "07",
      name: "Dr. Aliza",
      documentType: "Answers",
      uploadedDate: "16 oct, 2025",
      uploadedBy: "Manager",
      role: "Manager",
    },
  ]

  const roles = ["All Roles", "President", "Manager"]

  // Fetch documents from backend
  useEffect(() => {
    console.log("[v0] UploadedDocuments component mounted")
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      console.log("[v0] Fetching documents from backend...")

      // Replace with actual API call
      // const response = await fetch('/api/documents');
      // const data = await response.json();

      // Using mock data for now
      setDocuments(mockDocuments)
      setFilteredDocuments(mockDocuments)
      console.log("[v0] Documents fetched successfully:", mockDocuments)
    } catch (error) {
      console.error("[v0] Error fetching documents:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle role filter
  const handleRoleFilter = (role) => {
    console.log("[v0] Filtering by role:", role)
    setSelectedRole(role)
    setShowRoleDropdown(false)

    if (role === "All Roles") {
      setFilteredDocuments(documents)
      console.log("[v0] Showing all documents")
    } else {
      const filtered = documents.filter((doc) => doc.role === role)
      setFilteredDocuments(filtered)
      console.log("[v0] Filtered documents:", filtered)
    }
  }

  // Handle view details
  const handleViewDetails = (document) => {
    console.log("[v0] Viewing document details:", document)
    // Add your logic here - could open a modal or navigate to details page
  }

  // Handle action menu
  const handleAction = (action, document) => {
    console.log("[v0] Action triggered:", action, "for document:", document)
    // Add your logic here - could be edit, delete, download, etc.
  }

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "President":
        return "bg-blue-100 text-blue-700"
      case "Manager":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return <div className="p-6">Loading documents...</div>
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Uploaded Documents</h1>

        {/* Role Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {selectedRole}
            <FiChevronDown size={18} />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleFilter(role)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${selectedRole === role ? "bg-blue-50 text-blue-600" : "text-gray-700"
                    }`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">SL.NO</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Documents Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Document Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Uploaded Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Uploaded By</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">View Details</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((document, index) => (
                <tr key={document.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">{document.slNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <FiUser size={16} className="text-teal-600" />
                      </div>
                      {document.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{document.documentType}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{document.uploadedDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(document.role)}`}
                    >
                      {document.uploadedBy}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleViewDetails(document)}
                      className="px-3 py-1 border  text-primary rounded hover:bg-teal-50 transition-colors text-xs font-medium"
                    >
                      View Doc
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleAction("menu", document)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <FiMoreVertical size={18} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No documents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredDocuments.length} of {documents.length} documents
      </div>
    </div>
  )
}

export default UploadedDocuments
