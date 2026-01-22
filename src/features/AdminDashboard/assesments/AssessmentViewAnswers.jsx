import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosApi from "../../../service/axiosInstance";
import { FiArrowLeft, FiCheckCircle, FiUser, FiBookOpen } from "react-icons/fi";

export const AssessmentViewAnswers = () => {
    const { participantId, assessmentId } = useParams();
    const navigate = useNavigate();

    console.log('AssessmentViewAnswers Params:', { participantId, assessmentId });

    // .........................................Fetch user answers........................................\\
    const { data: answersData, isLoading, error } = useQuery({
        queryKey: ['assessmentAnswers', assessmentId, participantId],
        queryFn: async () => {
            const res = await axiosApi.get(`/api/v1/assessments/${assessmentId}/users/${participantId}/`);
            console.log("res", res);
            return res.data;
        },
        onSuccess: (data) => {
            console.log('[AssessmentViewAnswers] API data:', data);
        },
        onError: (err) => {
            console.error('[AssessmentViewAnswers] Error fetching answers:', err);
        },
    });
    console.log("answersData", answersData);

    const responseData = answersData?.data;
    const user = responseData?.user;
    const assessment = responseData?.assessment;
    const answers = responseData?.answers || [];

    const handleBack = () => {
        navigate(-1);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-96 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !responseData) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 text-lg font-medium">Error loading answers</p>
                <button
                    onClick={handleBack}
                    className="mt-4 px-4 py-2 text-teal-600 border-2 border-teal-200 rounded-lg hover:bg-teal-50"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const totalAnswered = answers.filter(a => a.answered).length;
    const answeredPercentage = answers.length > 0 ? Math.round((totalAnswered / answers.length) * 100) : 0;

    return (
        <div className="space-y-6 pb-8">
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Answers Review</h1>
                <p className="text-gray-600">View participant responses and scoring details</p>
            </div>

            {/* User & Assessment Info Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Card */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-teal-50 rounded-lg">
                            <FiUser className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Participant</h3>
                            <p className="text-xl font-bold text-gray-900">{user?.name}</p>
                            <p className="text-sm text-gray-600 mt-1">ID: {user?.id}</p>
                        </div>
                    </div>
                </div>

                {/* Assessment Card */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <FiBookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Assessment</h3>
                            <p className="text-xl font-bold text-gray-900">{assessment?.title}</p>
                            <p className="text-sm text-gray-600 mt-1">Score: {assessment?.total_score}/{assessment?.max_score}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Completion Status</h3>
                    <span className="text-2xl font-bold text-emerald-600">{answeredPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${answeredPercentage}%` }}
                    />
                </div>
                <p className="text-sm text-gray-600 mt-3">
                    {totalAnswered} out of {answers.length} questions answered
                </p>
            </div>

            {/* Answers List */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">Question Answers</h3>
                </div>

                <div className="divide-y divide-gray-200">
                    {answers.map((answer, index) => (
                        <div key={index} className="p-6 hover:bg-gray-50 transition">
                            {/* Question Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 flex-shrink-0">
                                    <span className="text-sm font-bold text-teal-700">{answer.question_number}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-base font-semibold text-gray-900">{answer.question_text}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        {answer.answered ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                                <FiCheckCircle className="w-3 h-3" />
                                                Answered
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                Not Answered
                                            </span>
                                        )}
                                        {answer.score > 0 && (
                                            <span className="ml-auto text-sm font-bold text-emerald-600">
                                                Score: {answer.score}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Answer Content */}
                            <div className="ml-11">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    {answer.answer_text ? (
                                        <p className="text-gray-700 text-sm leading-relaxed">{answer.answer_text}</p>
                                    ) : (
                                        <p className="text-gray-400 text-sm italic">No answer provided</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Footer */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl border border-teal-200 p-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                        <p className="text-2xl font-bold text-teal-700">{totalAnswered}</p>
                        <p className="text-xs text-gray-600 uppercase tracking-wider mt-1">Questions Answered</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-700">{answers.length}</p>
                        <p className="text-xs text-gray-600 uppercase tracking-wider mt-1">Total Questions</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-emerald-700">{assessment?.total_score}</p>
                        <p className="text-xs text-gray-600 uppercase tracking-wider mt-1">Total Score</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
