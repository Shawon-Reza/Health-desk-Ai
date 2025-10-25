"use client"

import { useState, useEffect } from "react"
import { FaFax } from "react-icons/fa"
import { FiEdit2, FiFacebook, FiGlobe, FiMapPin, FiPhone, FiPlus, FiTrash2, FiUser } from "react-icons/fi"
import AddClinicModal from "./AddClinicModal"
// import { FiEdit2, FiTrash2, FiMapPin, FiPhone, FiFax, FiGlobe, FiUsers, FiPlus } from "react-icons/fi"

const ClinicManagement = () => {
    // ============ STATE MANAGEMENT ============
    const [clinics, setClinics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAddClinicOpen, setIsAddClinicOpen] = useState(false)
    const [isEditClinicOpen, setIsEditClinicOpen] = useState(false)
    const [selectedClinic, setSelectedClinic] = useState(null)


    // ============ MOCK DATA - Replace with backend API calls ============
    const mockClinicsData = [
        {
            id: 1,
            name: "Downtown Medical Center",
            address: "123 Main St, City, ST 12345",
            phone: "(555) 123-4567",
            fax: "(555) 123-4567",
            website: "www.clinic.com",
            staffMembers: 5,
            type: "Primary Care",
        },
        {
            id: 2,
            name: "Downtown Medical Center",
            address: "123 Main St, City, ST 12345",
            phone: "(555) 123-4567",
            fax: "(555) 123-4567",
            website: "www.clinic.com",
            staffMembers: 5,
            type: "Specialty Care",
        },
        {
            id: 3,
            name: "Medical Center",
            address: "123 Main St, City, ST 12345",
            phone: "(555) 123-4567",
            fax: "(555) 123-4567",
            website: "www.clinic.com",
            staffMembers: 5,
            type: "Urgent Care",
        },
        {
            id: 4,
            name: "Downtown Medical Center",
            address: "123 Main St, City, ST 12345",
            phone: "(555) 123-4567",
            fax: "(555) 123-4567",
            website: "www.clinic.com",
            staffMembers: 5,
            type: "Primary Care",
        },
        {
            id: 5,
            name: "Downtown Medical Center",
            address: "123 Main St, City, ST 12345",
            phone: "(555) 123-4567",
            fax: "(555) 123-4567",
            website: "www.clinic.com",
            staffMembers: 5,
            type: "Specialty Care",
        },
        {
            id: 6,
            name: "Downtown Medical Center",
            address: "123 Main St, City, ST 12345",
            phone: "(555) 123-4567",
            fax: "(555) 123-4567",
            website: "www.clinic.com",
            staffMembers: 5,
            type: "Urgent Care",

        },
    ]

    // ============ LIFECYCLE HOOKS ============
    useEffect(() => {
        console.log("[v0] Initializing Clinic Management Component")
        console.log("[v0] Fetching clinics data from backend...")

        // Simulate API delay - Replace with actual API call
        setTimeout(() => {
            setClinics(mockClinicsData)
            setLoading(false)

            // Console log all data for debugging
            console.log("[v0] Clinics Data Loaded:", mockClinicsData)
            console.log("[v0] Total Clinics:", mockClinicsData.length)
            console.log("[v0] Component Ready for Backend Integration")
        }, 500)
    }, [])

    // ============ EVENT HANDLERS ============
    const handleAddClinic = () => {
        console.log("[v0] Add Clinic button clicked")
        console.log("[v0] Action: Open Add Clinic Modal/Form")
        // Add your modal/form logic here
        setIsAddClinicOpen(true)
    }

    // =========== EDIT & DELETE HANDLERS ============
    const handleEditClinic = ({ id }) => {
        console.log("[v0] Edit Clinic button clicked for Clinic ID:", id)
        // Add your modal/form logic here

        const clinicToEdit = clinics.find((clinic) => clinic.id === id)
        setSelectedClinic(clinicToEdit)
        console.log("[v0] Clinic to Edit:", clinicToEdit)
        // setIsEditClinicOpen(true)
        setIsAddClinicOpen(true)
    }



    const handleDeleteClinic = (clinicId, clinicName) => {
        console.log("[v0] Delete Clinic clicked")
        console.log("[v0] Clinic to Delete:", { id: clinicId, name: clinicName })
        console.log("[v0] Action: Show Delete Confirmation")
        // Add your delete logic here
    }

    // ============ CLINIC CARD COMPONENT ============
    const ClinicCard = ({ clinic }) => (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">

            {/* Add Clinic Modal */}
            <AddClinicModal isOpen={isAddClinicOpen} onClose={() => setIsAddClinicOpen(false)} data={selectedClinic} />



            {/* Card Header with Title and Actions */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "var(--color-primary)" }}
                    >
                        <FiMapPin className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEditClinic({ id: clinic.id })}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit clinic"
                    >
                        <FiEdit2
                            className="w-4 h-4 text-gray-600 cursor-pointer" />
                    </button>
                    <button
                        onClick={() => handleDeleteClinic(clinic.id, clinic.name)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete clinic"
                    >
                        <FiTrash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>

            {/* Card Content */}
            <div className="space-y-3">
                {/* Address */}
                <div className="flex items-start gap-3">
                    <FiMapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Address</p>
                        <p className="text-sm text-gray-700">{clinic.address}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Type</p>
                        <p className="text-sm text-gray-700">{clinic.type}</p>
                    </div>
                </div>

                {/* Phone & Fax Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <FiPhone className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Phone</p>
                            <p className="text-sm text-gray-700">{clinic.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <FaFax className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">FAX Number</p>
                            <p className="text-sm text-gray-700">{clinic.fax}</p>
                        </div>
                    </div>
                </div>

                {/* Website & Staff Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <FiGlobe className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Website</p>
                            {/* open in new tab */}
                            <a href={clinic.website} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{clinic.website}</a>

                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <FiUser className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Staff Members</p>
                            <p className="text-sm text-gray-700">{clinic.staffMembers} members</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )




    // ============ RENDER ============
    return (
        <div className="min-h-screen font-sans">
            {/* Add Clinic Modal */}
            <AddClinicModal isOpen={isAddClinicOpen} onClose={() => setIsAddClinicOpen(false)} />

            {/* Header */}
            <div className="border-b border-gray-200 sticky top-0 z-30">
                <div className=" px-6 py-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Clinic Management</h1>
                        <p className="text-gray-600 mt-1">Manage your clinic and address</p>
                    </div>
                    <button
                        onClick={handleAddClinic}
                        className="flex items-center gap-2 text-white font-semibold py-2 px-4 rounded-lg transition-colors hover:opacity-90"
                        style={{ backgroundColor: "var(--color-primary)" }}
                    >
                        <FiPlus className="w-5 h-5" />
                        Add Clinic
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className=" mx-auto px-6 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Loading clinics data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {clinics?.map((clinic) => (
                            <ClinicCard key={clinic.id} clinic={clinic} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ClinicManagement
