"use client"

import { useState, useEffect } from "react"
import { FiUsers, FiUserCheck, FiHome, FiBell, FiMessageCircle, FiShield } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const DashboardContent = () => {
  // ============ STATE MANAGEMENT ============
  const [dashboardData, setDashboardData] = useState(null)
  const [recentActivity, setRecentActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

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

  // ============ STAT CARD COMPONENT ============
  const StatCard = ({ icon: Icon, label, value, borderColor, bgColor }) => (
    <div className={`bg-white rounded-lg p-6 shadow-sm border-l-4 ${borderColor} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </div>
  )

  // ============ ACTIVITY ITEM COMPONENT ============
  const ActivityItem = ({ activity }) => (
    <div className="flex items-start gap-4 py-4 border-b border-gray-300 last:border-b-0">
      <img
        src={activity.avatar || "/placeholder.svg"}
        alt={activity.name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900">{activity.name}</p>
        <p className="text-sm text-gray-600">{activity.action}</p>
      </div>
      <p className="text-xs text-gray-500 whitespace-nowrap ml-2">{activity.timestamp}</p>
    </div>
  )

  // ============ QUICK ACTION BUTTON COMPONENT ============
  const QuickActionButton = ({ action }) => {
    const Icon = action.icon
    return (
      <button
        onClick={() => handleQuickAction(action.label)}
        className={`w-full ${action.color} ${action.hoverColor} text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
      >
        <Icon className="w-5 h-5" />
        <span>{action.label}</span>
      </button>
    )
  }

  // ============ RENDER ============
  return (
    <div className="  font-sans">
      {/* Header */}
      <div className=" border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your members activities.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className=" ">
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
                  {quickActions.map((action) => (
                    <QuickActionButton key={action.id} action={action} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardContent
