
import React, { useState, useEffect } from 'react'
import { FiArrowLeft, FiUser, FiCheckCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const ReviewAssesmentResult = () => {
    const [loading, setLoading] = useState(true)
    const [assessment, setAssessment] = useState(null)
    const [participants, setParticipants] = useState([])
    const navigate = useNavigate();

    // Mock data - replace with API call
    const mockAssessment = {
        id: 'assess-2024-01',
        title: 'January 2024 Knowledge Assessment',
        role: 'Manager',
        status: 'Completed',
        dueDate: '2024-01-31',
        completed: 15,
        total: 15,
        averageScore: 92
    }

    const mockParticipants = [
        {
            id: '03',
            name: 'Dr. Aliza',
            clinic: 'Downtown Medical Center',
            questionsAnswered: 15,
            totalQuestions: 15,
            score: 100
        },
        {
            id: '04',
            name: 'Dr. Zara Khan',
            clinic: 'Downtown Medical Center',
            questionsAnswered: 12,
            totalQuestions: 15,
            score: 96
        },
        {
            id: '05',
            name: 'Dr. Aliza',
            clinic: 'Downtown Medical Center',
            questionsAnswered: 10,
            totalQuestions: 15,
            score: 90
        },
        {
            id: '06',
            name: 'Dr. Aliza',
            clinic: 'Downtown Medical Center',
            questionsAnswered: 15,
            totalQuestions: 15,
            score: 88
        },
        {
            id: '07',
            name: 'Dr. Aliza',
            clinic: 'Downtown Medical Center',
            questionsAnswered: 11,
            totalQuestions: 15,
            score: 80
        }
    ]

    useEffect(() => {
        console.log('[ReviewAssesmentResult] Fetching assessment data...')
        // Simulate API fetch
        setTimeout(() => {
            setAssessment(mockAssessment)
            setParticipants(mockParticipants)
            setLoading(false)
        }, 500)
    }, [])

    const handleBack = () => {
        console.log('[ReviewAssesmentResult] Back clicked')
        // TODO: Navigate back using router
        // e.g., navigate(-1) or navigate('/assessments')
        navigate(-1)
    }

    const handleViewAnswers = (participantId) => {
        console.log('[ReviewAssesmentResult] View Answers for:', participantId)
        // TODO: Navigate to detailed answers page
        // e.g., navigate(`/assessments/${assessment.id}/participant/${participantId}`)
    }

    if (loading) {
        return (
            <div className="">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="h-12 w-96 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
        )
    }

    return (
        <div className=" space-y-6">
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-4 py-2 text-teal-600 border-2 border-teal-200 rounded-lg hover:bg-teal-50 transition font-medium cursor-pointer"
            >
                <FiArrowLeft className="w-4 h-4" />
                Back
            </button>

            {/* Header */}
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Assessment Result</h1>
                <p className="text-gray-600">Monthly tests to track your staff knowledge and progress</p>
            </div>

            {/* Assessment Summary Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                {assessment.title}
                            </h2>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                                {assessment.role}
                            </span>
                            <span className="flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-sm font-medium rounded-full border border-teal-200">
                                <FiCheckCircle className="w-4 h-4" />
                                {assessment.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="text-amber-600 font-medium">
                                Due: {assessment.dueDate}
                            </span>
                            <span className="text-teal-600 font-medium">
                                {assessment.completed}/{assessment.total} member completed
                            </span>
                        </div>
                    </div>

                    {/* Right Section - Average Score */}
                    <div className="text-left lg:text-right">
                        <div className="text-5xl font-bold text-emerald-500">
                            {assessment.averageScore}%
                        </div>
                        <div className="text-sm text-gray-500 font-medium mt-1">
                            Average Score
                        </div>
                    </div>
                </div>
            </div>

            {/* Participants Table */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Participants</h3>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    ID NO
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    User Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Clinic
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Question Answered
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Score
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {participants.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No participants found
                                    </td>
                                </tr>
                            ) : (
                                participants.map((participant) => (
                                    <tr key={participant.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {participant.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-teal-50 rounded-lg">
                                                    <FiUser className="w-4 h-4 text-teal-600" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {participant.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {participant.clinic}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {participant.questionsAnswered}/{participant.totalQuestions}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-lg font-bold text-emerald-500">
                                                {participant.score}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewAnswers(participant.id)}
                                                className="px-4 py-2 text-sm font-medium text-teal-600 border-2 border-teal-200 rounded-lg hover:bg-teal-50 transition"
                                            >
                                                View Answers
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ReviewAssesmentResult