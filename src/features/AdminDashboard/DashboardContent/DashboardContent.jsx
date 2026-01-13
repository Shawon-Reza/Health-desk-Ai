"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import axiosApi from "../../../service/axiosInstance"
import { FiUsers, FiUserCheck, FiHome, FiBell, FiMessageCircle, FiShield } from "react-icons/fi"
import { Outlet, useNavigate } from "react-router-dom"

const DashboardContent = () => {
  // ============ STATE MANAGEMENT ============
  const [dashboardData, setDashboardData] = useState(null)
  const [recentActivity, setRecentActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  // ...................Fetch my assessments (logs only, UI unchanged)....................\\
  const { data: myAssessments, isLoading: myAssessmentsLoading, error: myAssessmentsError } = useQuery({
    queryKey: ['my-assessments'],
    queryFn: async () => {
      const res = await axiosApi.get('/api/v1/my-assessments/')
      return res.data
    },
    onSuccess: (data) => {
      console.log('[DashboardContent] /api/v1/my-assessments response:', data)
    },
    onError: (err) => {
      console.error('[DashboardContent] Error fetching my assessments:', err)
    },
    staleTime: 5 * 60 * 1000,
  })
  console.log("Consol*********************:", myAssessments?.data)

  // ============ MOCK DATA - Replace with backend API calls ============
  const mockDashboardStats = {
    totalUsers: 1458,
    activeUsers: 999,
    totalClinics: 5,
    taggedMessages: 5,
  }


  const mockRecentActivity = [
    {
      id: 1,
      name: "Dr. Michael Chen",
      action: "Mentioned you on message",
      timestamp: "10 minutes ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      id: 2,
      name: "Dr. Ron Vhen",
      action: "Joined as a staff",
      timestamp: "15 minutes ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ron",
    },
    {
      id: 3,
      name: "Dr. Pappu Roy",
      action: "Mentioned you on message",
      timestamp: "20 minutes ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pappu",
    },
  ]

  const quickActions = [
    {
      id: 1,
      label: "Start New Conversation",
      icon: FiMessageCircle,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      id: 2,
      label: "Train AI Assistant",
      icon: FiShield,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
    },
    {
      id: 3,
      label: "Manage Users",
      icon: FiUsers,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    {
      id: 4,
      label: "Manage Clinics",
      icon: FiHome,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
    },
  ]

  // ============ LIFECYCLE HOOKS ============
  useEffect(() => {
    console.log("[v0] Initializing Dashboard Component")
    console.log("[v0] Fetching dashboard data from backend...")

    // Simulate API delay - Replace with actual API call
    setTimeout(() => {
      setDashboardData(mockDashboardStats)
      setRecentActivity(mockRecentActivity)
      setLoading(false)

      // Console log all data for debugging
      console.log("[v0] Dashboard Data Loaded:", mockDashboardStats)
      console.log("[v0] Recent Activity Loaded:", mockRecentActivity)
      console.log("[v0] Quick Actions Available:", quickActions)
    }, 500)
  }, [])

  // ============ EVENT HANDLERS ============
  const handleQuickAction = (actionLabel) => {
    console.log("[v0] Quick Action Triggered:", actionLabel)
    console.log("[v0] Action Details:", { action: actionLabel, timestamp: new Date().toISOString() })
    // Add your action logic here
    // navigate('/admin/users-management');
  }

  const handleScrollMore = () => {
    console.log("[v0] Scroll More clicked - Loading more activities...")
    console.log("[v0] Current activities count:", recentActivity?.length)
    // Add pagination logic here
  }

  // ============ HELPER COMPONENTS ============
  const StatCard = ({ icon: Icon, label, value, borderColor, bgColor }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className={`w-12 h-12 ${bgColor} text-gray-700 p-2 rounded-lg`} />
      </div>
    </div>
  )

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <img
        src={activity.avatar}
        alt={activity.name}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{activity.name}</p>
        <p className="text-xs text-gray-600">{activity.action}</p>
      </div>
      <span className="text-xs text-gray-500">{activity.timestamp}</span>
    </div>
  )

  const QuickActionButton = ({ action }) => {
    const Icon = action.icon
    return (
      <button
        onClick={() => handleQuickAction(action.label)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white font-semibold transition-colors ${action.color} ${action.hoverColor}`}
      >
        <Icon className="w-5 h-5" />
        {action.label}
      </button>
    )
  }

  // ============ ASSESSMENT CARD COMPONENT ============
  const AssessmentCard = ({ assessment }) => {
    const daysLeft = assessment.end_date
      ? Math.max(0, Math.ceil((new Date(assessment.end_date) - new Date()) / (1000 * 60 * 60 * 24)))
      : 0

    const isOverdue = daysLeft === 0 && new Date(assessment.end_date) < new Date()
    const progressPercentage = assessment.participant_count > 0
      ? Math.round(((assessment.completed_count + assessment.in_progress_count) / assessment.participant_count) * 100)
      : 0

    return (
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-100 rounded-lg">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{assessment.title}</h3>
              <p className="text-sm text-gray-600">{assessment.participant_count} participants</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isOverdue
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
            }`}>
            {isOverdue ? "Overdue" : `Due in ${daysLeft}d`}
          </span>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-teal-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {assessment.completed_count} completed • {assessment.in_progress_count} in progress • {assessment.not_started_count} not started
          </p>
        </div>

        {/* Status & Dates */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-white rounded-lg p-2">
            <p className="text-xs text-gray-600">Status</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">{assessment.status}</p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-xs text-gray-600">Start</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(assessment.start_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="bg-white rounded-lg p-2">
            <p className="text-xs text-gray-600">End</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(assessment.end_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {/* assessments/give-answers/:assessmentId */}
        <button
          onClick={() => {
            navigate(`/admin/assessments/give-answers/${assessment.id}`);
          }}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <span>▶</span> Start Assessment
        </button>
      </div>
    )
  }

  return (
    <div className="font-sans">
      {/* Header */}
      <div className="border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your members activities.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FiUsers}
                label="Total Users"
                value={dashboardData?.totalUsers}
                borderColor="border-l-4 border-blue-500"
                bgColor="bg-blue-100"
              />
              <StatCard
                icon={FiUserCheck}
                label="Active User"
                value={dashboardData?.activeUsers}
                borderColor="border-l-4 border-green-500"
                bgColor="bg-green-100"
              />
              <StatCard
                icon={FiHome}
                label="Total Clinic"
                value={dashboardData?.totalClinics}
                borderColor="border-l-4 border-teal-500"
                bgColor="bg-teal-100"
              />
              <StatCard
                icon={FiBell}
                label="Tagged Message"
                value={dashboardData?.taggedMessages}
                borderColor="border-l-4 border-yellow-500"
                bgColor="bg-yellow-100"
              />
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-2 ">
                  {recentActivity?.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
                <button
                  onClick={handleScrollMore}
                  className="w-full mt-4 py-2 font-semibold border-2 rounded-lg transition-colors"
                  style={{
                    color: "var(--color-primary)",
                    borderColor: "var(--color-primary)",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(0, 164, 166, 0.05)")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  Scroll More
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {quickActions?.map((action) => (
                    <QuickActionButton key={action.id} action={action} />
                  ))}
                </div>
              </div>
            </div>

            {/* Assessments Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessments</h2>
              <p className="text-gray-600 mb-6">Give proper answers and improve your knowledge</p>

              {myAssessmentsLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading assessments...</p>
                </div>
              ) : myAssessmentsError ? (
                <div className="text-center py-12">
                  <p className="text-red-600">Failed to load assessments</p>
                </div>
              ) : myAssessments?.data && myAssessments.data.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {myAssessments?.data?.map((assessment) => (
                    <AssessmentCard key={assessment.id} assessment={assessment} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg">No assessments found</p>
                  <p className="text-gray-400 text-sm">Check back later for new assessments</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default DashboardContent
