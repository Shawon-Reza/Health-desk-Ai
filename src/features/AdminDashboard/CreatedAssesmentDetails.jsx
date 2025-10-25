import React, { useState, useEffect } from 'react'
import { FiArrowLeft, FiThumbsUp, FiThumbsDown, FiPlus, FiCalendar, FiSave } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const CreatedAssesmentDetails = () => {
    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState([])
    const navigate = useNavigate();

    // Mock data - replace with API call
    const mockQuestions = [
        {
            id: 1,
            text: 'How effectively do you manage your time and meet deadlines?',
            liked: false,
            disliked: false
        },
        {
            id: 2,
            text: 'How do you handle challenges or difficult situations at work?',
            liked: false,
            disliked: false
        },
        {
            id: 3,
            text: 'In what ways have you contributed to improving team performance?',
            liked: false,
            disliked: false
        },
        {
            id: 4,
            text: 'How well do you communicate and collaborate with colleagues?',
            liked: false,
            disliked: false
        },
        {
            id: 5,
            text: 'What skills or areas would you like to develop further?',
            liked: false,
            disliked: false
        }
    ]

    useEffect(() => {
        console.log('[CreatedAssesmentDetails] Fetching questions...')
        // Simulate API fetch
        setTimeout(() => {
            setQuestions(mockQuestions)
            setLoading(false)
        }, 500)
    }, [])

    const handleBack = () => {
        console.log('[CreatedAssesmentDetails] Back clicked')
        // TODO: Navigate back using router
        navigate(-1);
    }

    const handleLike = (questionId) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === questionId) {
                return { ...q, liked: !q.liked, disliked: false }
            }
            return q
        }))
        console.log('[CreatedAssesmentDetails] Question liked:', questionId)
    }

    const handleDislike = (questionId) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === questionId) {
                return { ...q, disliked: !q.disliked, liked: false }
            }
            return q
        }))
        console.log('[CreatedAssesmentDetails] Question disliked:', questionId)
    }

    const handleQuestionChange = (questionId, newText) => {
        setQuestions(prev => prev.map(q =>
            q.id === questionId ? { ...q, text: newText } : q
        ))
    }

    const handleAddQuestion = () => {
        const newQuestion = {
            id: questions.length + 1,
            text: '',
            liked: false,
            disliked: false
        }
        setQuestions(prev => [...prev, newQuestion])
        console.log('[CreatedAssesmentDetails] Add Question clicked')
    }

    const handleSetDeadline = () => {
        console.log('[CreatedAssesmentDetails] Set Deadline clicked')
        // TODO: Open date picker modal or navigate to deadline setting
    }

    const handleSaveAssessment = () => {
        const payload = {
            questions: questions.map(q => ({
                id: q.id,
                text: q.text,
                liked: q.liked,
                disliked: q.disliked
            }))
        }
        console.log('[CreatedAssesmentDetails] Save Assessment:', payload)
        // TODO: POST to API endpoint
        // Example: POST /api/assessments/{id}/questions
    }

    if (loading) {
        return (
            <div className="p-6 max-w-5xl">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="h-12 w-96 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Assessment Questions</h1>
                <p className="text-gray-600">Monthly tests to track your staff knowledge and progress</p>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {questions.map((question) => (
                    <div
                        key={question.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 hover:shadow-md transition"
                    >
                        <div className="flex items-start  gap-3">
                            {/* Question Number Badge */}
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                                {question.id}
                            </div>

                            {/* Question Text (Editable) */}
                            <div className="flex-1 ">
                                <textarea
                                    value={question.text}
                                    onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                                    className="w-full text-gray-800 text-base resize-none outline-none border-none focus:ring-0 p-0"
                                    rows="2"
                                    placeholder="Enter your question here..."
                                />
                            </div>

                            {/* Like/Dislike Actions */}
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <button
                                    onClick={() => handleLike(question.id)}
                                    className={`p-2 rounded-lg transition ${question.liked
                                        ? 'bg-teal-100 text-teal-600'
                                        : 'text-gray-400 hover:bg-gray-100 hover:text-teal-600'
                                        }`}
                                    aria-label="Like question"
                                >
                                    <FiThumbsUp className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDislike(question.id)}
                                    className={`p-2 rounded-lg transition ${question.disliked
                                        ? 'bg-red-100 text-red-600'
                                        : 'text-gray-400 hover:bg-gray-100 hover:text-red-600'
                                        }`}
                                    aria-label="Dislike question"
                                >
                                    <FiThumbsDown className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                    onClick={handleAddQuestion}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-50 text-teal-600 border-2 border-teal-200 rounded-lg hover:bg-teal-100 transition font-semibold"
                >
                    <FiPlus className="w-5 h-5" />
                    Add Question
                </button>
                <button
                    onClick={handleSetDeadline}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition font-semibold"
                >
                    <FiCalendar className="w-5 h-5" />
                    Set Deadline
                </button>
                <button
                    onClick={handleSaveAssessment}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
                >
                    <FiSave className="w-5 h-5" />
                    Save Assessment
                </button>
            </div>
        </div>
    )
}

export default CreatedAssesmentDetails