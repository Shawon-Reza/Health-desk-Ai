import React, { useState, useEffect } from 'react'
import { FiEye, FiPause, FiPlay, FiClock, FiCheckCircle } from 'react-icons/fi'
import { PiGraduationCapLight } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

const GeneratedAssesmentsAndHistories = () => {
    const [loading, setLoading] = useState(true)
    const [currentAssessment, setCurrentAssessment] = useState(null)
    const [assessmentHistory, setAssessmentHistory] = useState([])
    const navigate = useNavigate();


    // Mock data - replace with API call
    const mockCurrentAssessment = {
        id: '11',
        title: 'December 2025 Knowledge Assessment',
        totalQuestions: 20,
        dueDate: 'Dec 31',
        progress: {
            completed: 12,
            total: 15,
            percentage: 80
        }
    }

    const mockHistory = [
        {
            id: '1',
            title: 'January 2024 Knowledge Assessment',
            role: 'Manager',
            status: 'Completed',
            dueDate: '2024-01-31',
            completed: 15,
            total: 15,
            averageScore: 92
        },
        {
            id: '2',
            title: 'December 2023 Knowledge Assessment',
            role: 'Staff',
            status: 'Completed',
            dueDate: '2023-12-31',
            completed: 14,
            total: 15,
            averageScore: 88
        }
    ]

    useEffect(() => {
        // Simulate API fetch
        console.log('[GeneratedAssesmentsAndHistories] Fetching data...')
        setTimeout(() => {
            setCurrentAssessment(mockCurrentAssessment)
            setAssessmentHistory(mockHistory)
            setLoading(false)
        }, 500)
    }, [])

    const handleViewDetails = (assessmentId) => {
        console.log('[GeneratedAssesmentsAndHistories] View Details:', assessmentId)
        // TODO: Navigate to details page or open modal
        navigate(`created/${assessmentId}`)

    }

    const handlePauseAssessment = (assessmentId) => {
        console.log('[GeneratedAssesmentsAndHistories] Pause Assessment:', assessmentId)
        // TODO: Call API to pause assessment
    }

    const handleStartAssessment = (assessmentId) => {
        console.log('[GeneratedAssesmentsAndHistories] Start Assessment:', assessmentId)
        // TODO: Navigate to assessment taking page
    }

    const handleAssesmentClick = (assessmentId) => {
        console.log('[GeneratedAssesmentsAndHistories] Assessment clicked:', assessmentId)
        navigate(`/admin/assessments/history/${assessmentId}`);
    }

    if (loading) {
        return (
            <div className="">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
        )
    }

    return (
        <div className=" space-y-8 mt-5">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Generated Assessments</h1>
            </div>

            {/* Current Assessment Card */}
            {currentAssessment && (
                <div className="bg-primarytransparent rounded-2xl shadow-md border border-teal-100 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                        <div className="flex items-start gap-3">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                <PiGraduationCapLight className="w-6 h-6 text-teal-600" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                    {currentAssessment.title}
                                </h2>
                                <p className="text-teal-600 font-medium">
                                    {currentAssessment.totalQuestions} questions
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-300 rounded-full">
                            <FiClock className="w-4 h-4 text-amber-700" />
                            <span className="text-sm font-medium text-amber-700">
                                Due {currentAssessment.dueDate}
                            </span>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-medium text-gray-600">
                                {currentAssessment.progress.completed} of {currentAssessment.progress.total} staff completed
                            </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-teal-500 to-teal-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${currentAssessment.progress.percentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleViewDetails(currentAssessment.id)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-teal-200 text-teal-600 rounded-lg hover:bg-teal-50 transition font-medium"
                        >
                            <FiEye className="w-4 h-4" />
                            View Details
                        </button>
                        <button
                            onClick={() => handlePauseAssessment(currentAssessment.id)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                        >
                            <FiPause className="w-4 h-4" />
                            Pause Assessment
                        </button>
                        <button
                            onClick={() => handleStartAssessment(currentAssessment.id)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
                        >
                            <FiPlay className="w-4 h-4" />
                            Start Assessment
                        </button>
                    </div>
                </div>
            )}

            {/* Assessment History */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
                <div className="flex items-start gap-3 mb-6">
                    <div className="p-3 bg-teal-50 rounded-lg">
                        <PiGraduationCapLight className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">Assessment History</h2>
                        <p className="text-gray-500">Your past assessment results</p>
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-4">
                    {assessmentHistory.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No assessment history available</p>
                    ) : (
                        assessmentHistory.map((assessment) => (
                            <div
                                key={assessment.id}
                                onClick={() => {
                                    handleAssesmentClick(assessment?.id)
                                }}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border border-gray-200 rounded-xl hover:shadow-md transition cursor-pointer"
                            >
                                {/* Left section */}
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-gray-900">
                                            {assessment.title}
                                        </h3>
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                            {assessment.role}
                                        </span>
                                        <span className="flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-200">
                                            <FiCheckCircle className="w-3 h-3" />
                                            {assessment.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-amber-600 font-medium">
                                            Due: {assessment.dueDate}
                                        </span>
                                        <span className="text-teal-600 font-medium">
                                            {assessment.completed}/{assessment.total} member completed
                                        </span>
                                    </div>
                                </div>

                                {/* Right section - Score */}
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-3xl md:text-4xl font-bold text-emerald-500">
                                            {assessment.averageScore}%
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">
                                            Average Score
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div >
    )
}

export default GeneratedAssesmentsAndHistories