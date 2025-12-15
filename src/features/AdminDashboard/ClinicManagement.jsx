"use client"

import { useState } from "react"
import { FaFax } from "react-icons/fa"
import { FiEdit2, FiFacebook, FiGlobe, FiMapPin, FiPhone, FiPlus, FiTrash2, FiUser } from "react-icons/fi"
import AddClinicModal from "./AddClinicModal"
import { BiClinic } from "react-icons/bi"
import { useQuery, useMutation } from "@tanstack/react-query"
import axiosApi from "../../service/axiosInstance"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

const ClinicManagement = () => {
    // ============ STATE MANAGEMENT ============
    const [isAddClinicOpen, setIsAddClinicOpen] = useState(false)
    const [isEditClinicOpen, setIsEditClinicOpen] = useState(false)
    const [selectedClinic, setSelectedClinic] = useState(null)

    // ============ FETCH CLINICS DATA ============
    const { data: clinics, isLoading: loading, error, refetch } = useQuery({
        queryKey: ['clinics'],
        queryFn: async () => {
            const response = await axiosApi.get('/api/v1/clinics/')
            console.log('[Clinics API Response]:', response.data)
            return response.data
        },
    })

    console.log(clinics)

    // ============ DELETE CLINIC MUTATION ============
    const deleteClinicMutation = useMutation({
        mutationFn: async (clinicId) => {
            const response = await axiosApi.delete(`/api/v1/clinics/${clinicId}/delete/`)
            console.log('[Delete Clinic Response]:', response.data)
            return response.data
        },
        onSuccess: () => {
            refetch()
        },
        onError: (error) => {
            const message = error?.response?.data?.detail || error.message || "Failed to delete clinic"
            toast.error(message)
            console.log(error)
        },
    })

    // ============ EVENT HANDLERS ============
    const handleAddClinic = () => {
        setSelectedClinic(null)
        setIsAddClinicOpen(true)
    }

    // =========== EDIT & DELETE HANDLERS ============
    const handleEditClinic = ({ id }) => {
        const clinicToEdit = clinics?.find((clinic) => clinic.id === id)
        setSelectedClinic(clinicToEdit)
        setIsAddClinicOpen(true)
    }

    const handleDeleteClinic = (clinicId, clinicName) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteClinicMutation.mutate(clinicId)
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    }

    // ============ CLINIC CARD COMPONENT ============
    const ClinicCard = ({ clinic }) => (
        <div className=" bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
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


                {/* Phone & Fax Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <FiMapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Address</p>
                            <p className="text-sm text-gray-700">{clinic.address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <BiClinic className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Type</p>
                            <p className="text-sm text-gray-700">{clinic.type}</p>
                        </div>
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
                        <div className="overflow-hidden flex-1">
                            <p className="text-xs text-gray-500 font-medium">Website</p>
                            {/* open in new tab */}
                            <a href={clinic.website}
                                className="text-sm text-blue-600 hover:underline block truncate"
                                target="_blank"
                                rel="noopener noreferrer"
                            >{clinic.website}
                            </a>

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
        <div className="min-h-screen  font-sans">
            {/* Add Clinic Modal */}
            <AddClinicModal
                isOpen={isAddClinicOpen}
                onClose={() => {
                    setIsAddClinicOpen(false);
                    setSelectedClinic(null);
                    refetch();
                }}
                data={selectedClinic}
            />

            {/* Header */}
            <div className="border-b border-gray-200 sticky top-0 z-30">
                <div className=" px-6 py-8 flex items-center justify-between bg-[#F0FDF4]">
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
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600">Error loading clinics: {error.message}</p>
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
