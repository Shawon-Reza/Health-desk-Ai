import React, { useState } from 'react'
import { FiChevronDown, FiPaperclip, FiMic, FiSend } from 'react-icons/fi'
import { PiGraduationCapLight } from 'react-icons/pi'
import { useMutation } from '@tanstack/react-query'
import useGetSubjectMattersAndClinicsList from '../../../hooks/useGetSubjectMattersAndClinicsList'
import axiosApi from '../../../service/axiosInstance'
import { queryClient } from '../../../main'
import { toast } from 'react-toastify'

const CreateNewAssesment = () => {
    const [formData, setFormData] = useState({
        title: '',
        role: '',
        clinic: '',
        numberOfQuestions: '5',
        message: '',
    })

    const roles = ['Manager', 'Doctor', 'Staff', 'Jr_staff']
    const {

        clinicsList,
        subjectMattersList,
        isLoading,
        error,
        refetch
    } = useGetSubjectMattersAndClinicsList()

    // .................Create assessment mutation.......................\\
    const createAssessmentMutation = useMutation({
        mutationFn: async (data) => {
            const response = await axiosApi.post('/api/v1/assesments/create/', {
                title: data.title,
                clinic: parseInt(data.clinic),
                role: data.role.toLowerCase(),
                description: data.message,
                count: parseInt(data.numberOfQuestions)
            })
            return response.data
        },
        onSuccess: (data) => {
            toast.success('Assessment created successfully!')
            console.log('[CreateNewAssesment] Assessment created successfully:', data)
            queryClient.invalidateQueries(['assessments'])
            // Reset form
            setFormData({
                title: '',
                role: '',
                clinic: '',
                numberOfQuestions: '5',
                message: '',
            })
            // TODO: Show success toast/notification
            // TODO: Navigate to assessment details or refresh list
        },
        onError: (error) => {
            console.error('[CreateNewAssesment] Error creating assessment:', error)
            // TODO: Show error toast/notification
        }
    })

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    const handleGenerate = (e) => {
        e.preventDefault()
        console.log("Create assesment data:", formData)
        if (!formData.title || !formData.role || !formData.clinic || !formData.message) {
            console.warn('[CreateNewAssesment] Please fill in all required fields')
            // TODO: Show validation error toast
            return
        }
        createAssessmentMutation.mutate(formData)
    }

    return (
        <div className="">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Knowledge Assessments</h1>
                <p className="text-sm text-gray-600">Monthly tests to track your Staff knowledge and progress</p>
            </div>

            {/* Create Assessment Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 md:p-5">
                <div className="flex items-center gap-3 mb-4 border-b-2 border-gray-200 pb-2">
                    <PiGraduationCapLight className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Create New Assessment</h2>
                </div>


                <form onSubmit={handleGenerate} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleChange('title')}
                            placeholder="e.g., Weekly Knowledge Assessment"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700"
                            required
                        />
                    </div>

                    {/* Role and Number of Questions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.role}
                                    onChange={handleChange('role')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white text-gray-700"
                                    required
                                >
                                    <option value="" disabled>Select a role</option>
                                    {roles.map(role => (
                                        <option key={role} value={role.toLowerCase(role)}>{role}</option>
                                    ))}
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Number of Questions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Number Of Questions
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={formData.numberOfQuestions}
                                onChange={handleChange('numberOfQuestions')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-600 font-medium"
                                required
                            />
                        </div>
                    </div>

                    {/* Clinic */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Clinic
                        </label>
                        <div className="relative">
                            <select
                                value={formData.clinic}
                                onChange={handleChange('clinic')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white text-gray-700"
                                required
                            >
                                <option value="" disabled>Select clinic</option>
                                {clinicsList?.map(clinic => (
                                    <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Message Input */}
                    <div>
                        <div className="relative bg-primarytransparent rounded-lg border border-teal-100">
                            <textarea
                                value={formData.message}
                                onChange={handleChange('message')}
                                placeholder="Type a message..."
                                className="w-full px-3 py-2 bg-transparent outline-none resize-none text-gray-700 placeholder:text-teal-400"
                                rows="2"
                            />
                            <div className="flex items-center justify-end gap-2 px-3 pb-2">
                                {/* <button
                                    type="button"
                                    className="p-1.5 text-gray-500 hover:text-teal-600 transition"
                                    aria-label="Attach file"
                                >
                                    <FiPaperclip className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    className="p-1.5 text-gray-500 hover:text-teal-600 transition"
                                    aria-label="Voice input"
                                >
                                    <FiMic className="w-4 h-4" />
                                </button> */}
                                {/* ........................Send icon.................... */}
                                {/* <button
                                    type="button"
                                    className="p-1.5 text-primary hover:text-teal-700 transition"
                                    aria-label="Send message"
                                >
                                    <FiSend className="w-4 h-4" />
                                </button> */}
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        type="submit"
                        disabled={createAssessmentMutation.isPending}
                        className="w-full bg-primary hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
                    >
                        {createAssessmentMutation.isPending ? 'Creating...' : 'Generate'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateNewAssesment