"use client"

import { useState, useEffect } from "react"
import { FiEdit2, FiTrash2, FiPlus, FiFileText } from "react-icons/fi"
import AddMatterModal from "./AddMatterModal"

const SubjectMatters = () => {
    const [subjectMatters, setSubjectMatters] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false);

    //    Open modal to add new matter
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Mock data - Replace with backend API call
    const mockSubjectMatters = [
        {
            id: 1,
            title: "Customer Support",
            description:
                "Our customer support team is dedicated to providing fast, friendly, and reliable assistance. We handle every query with care, ensuring clear communication and quick solutions. Customer satisfaction is our top priority, and we strive to make every interaction smooth and helpful. Always ready to assist, we're here to ensure you have the best possible experience every time you reach out.",
            icon: "FiFileText",
            borderColor: "border-l-4 border-l-[#00A4A6]",
        },
        {
            id: 2,
            title: "Accountant",
            description:
                "Our customer support team is dedicated to providing fast, friendly, and reliable assistance. We handle every query with care, ensuring clear communication and quick solutions. Customer satisfaction is our top priority, and we strive to make every interaction smooth and helpful. Always ready to assist, we're here to ensure you have the best possible experience every time you reach out.",
            icon: "FiFileText",
            borderColor: "border-l-4 border-l-pink-400",
        },
        {
            id: 3,
            title: "Eye Specialist",
            description:
                "Our customer support team is dedicated to providing fast, friendly, and reliable assistance. We handle every query with care, ensuring clear communication and quick solutions. Customer satisfaction is our top priority, and we strive to make every interaction smooth and helpful. Always ready to assist, we're here to ensure you have the best possible experience every time you reach out.",
            icon: "FiFileText",
            borderColor: "border-l-4 border-l-[#00A4A6]",
        },
        {
            id: 4,
            title: "Surgeon",
            description:
                "Our customer support team is dedicated to providing fast, friendly, and reliable assistance. We handle every query with care, ensuring clear communication and quick solutions. Customer satisfaction is our top priority, and we strive to make every interaction smooth and helpful. Always ready to assist, we're here to ensure you have the best possible experience every time you reach out.",
            icon: "FiFileText",
            borderColor: "border-l-4 border-l-red-400",

        },
    ]

    // Fetch subject matters data
    useEffect(() => {
        console.log("[SubjectMatters] Component mounted - Fetching data...")

        // Simulate API call
        setTimeout(() => {
            setSubjectMatters(mockSubjectMatters)
            setLoading(false)
            console.log("[SubjectMatters] Data loaded successfully:", mockSubjectMatters)
        }, 500)

        // Replace with actual API call:
        // fetchSubjectMatters()
        //   .then(data => {
        //     console.log('[SubjectMatters] API Response:', data);
        //     setSubjectMatters(data);
        //     setLoading(false);
        //   })
        //   .catch(error => {
        //     console.error('[SubjectMatters] Error fetching data:', error);
        //     setLoading(false);
        //   });
    }, [])

    // Handle add subject matter
    const handleAddSubjectMatter = () => {
        console.log("[SubjectMatters] Add Subject Matter clicked")
        // Add your logic here
        handleModalOpen();
    }

    // Handle edit subject matter
    const handleEditSubjectMatter = (id, title) => {
        console.log("[SubjectMatters] Edit clicked for ID:", id, "Title:", title)
        // Add your logic here
    }

    // Handle delete subject matter
    const handleDeleteSubjectMatter = (id, title) => {
        console.log("[SubjectMatters] Delete clicked for ID:", id, "Title:", title)
        // Add your logic here
    }

    if (loading) {
        return <div className="p-8">Loading...</div>
    }



    return (
        <div className="p-8">
            {/* Add Matter Modal */}
            <AddMatterModal isOpen={isModalOpen} onClose={handleModalClose} />

            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#2F2F2F] mb-2">Subject Matters</h1>
                    <p className="text-gray-500">Manage your subject matters</p>
                </div>
                <button
                    onClick={handleAddSubjectMatter}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 bg-primary hover:opacity-90"
                    //   style={{ backgroundColor: "#00A4A6" }}
                    onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
                    onMouseLeave={(e) => (e.target.style.opacity = "1")}
                >
                    <FiPlus size={20} />
                    Add Subject Matter
                </button>
            </div>

            {/* Subject Matters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {subjectMatters.map((matter) => (
                    <div
                        key={matter.id}
                        className={`${matter.borderColor} rounded-lg p-6 transition-all duration-200 hover:shadow-lg`}
                    >
                        {/* Card Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg text-white bg-primary" >
                                    <FiFileText size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-[#2F2F2F]">{matter.title}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditSubjectMatter(matter.id, matter.title)}
                                    className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
                                    title="Edit"
                                >
                                    <FiEdit2 size={18} style={{ color: "#00A4A6" }} />
                                </button>
                                <button
                                    onClick={() => handleDeleteSubjectMatter(matter.id, matter.title)}
                                    className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
                                    title="Delete"
                                >
                                    <FiTrash2 size={18} color="#EF4444" />
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex items-start gap-3">
                            <FiFileText size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                            <p className="text-gray-600 text-sm leading-relaxed">{matter.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SubjectMatters
