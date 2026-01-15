import { useState, useEffect } from "react"
import { FiUsers, FiUserCheck, FiHome, FiBell } from "react-icons/fi"

const AdminAndPresedentDashboardDetails = ({ cardData }) => {

    // ============ STATE MANAGEMENT ============
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)

    // ============ MOCK DATA - Replace with backend API calls ============
    const mockDashboardStats = {
        totalUsers: cardData?.total_user || 0,
        activeUsers: cardData?.active_user || 0,
        totalClinics: cardData?.assigned_clinic || 0,
        taggedMessages: cardData?.mentioned_message || 0,
    }

    // ============ LIFECYCLE HOOKS ============
    useEffect(() => {
        console.log("[AdminDashboard] Fetching dashboard stats from backend...")

        // Simulate API delay - Replace with actual API call
        setTimeout(() => {
            setDashboardData(mockDashboardStats)
            setLoading(false)
            console.log("[AdminDashboard] Dashboard Stats Loaded:", mockDashboardStats)
        }, 500)
    }, [])

    // ============ STAT CARD COMPONENT ============
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

    return (
        <div>
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">Loading dashboard stats...</p>
                </div>
            ) : (
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
            )}
        </div>
    )
}

export default AdminAndPresedentDashboardDetails
