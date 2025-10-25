import { FiGrid, FiMessageSquare, FiLock, FiUsers, FiSettings, FiPlus } from "react-icons/fi"
import { NavLink, useNavigate } from "react-router-dom"
import logo from "../../assets/python2.png"

const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiGrid },
    { id: "communication", label: "Communication", icon: FiMessageSquare },
    { id: "manage-clinic", label: "Manage Clinic", icon: FiLock },
    { id: "subject-matters", label: "Subject Matters", icon: FiLock },
    { id: "user-management", label: "User Management", icon: FiUsers },
    { id: "ai-training", label: "AI Training", icon: FiLock },
    { id: "assessments", label: "Assessments", icon: FiLock },

    { id: "settings", label: "Settings", icon: FiSettings },
]

export default function AdminDashboardSidebar({ onClick }) {
    const navigate = useNavigate()

    return (
        <aside className="w-full  bg-primary text-white flex flex-col h-screen">
            {/* Logo */}
            <div
                onClick={() => {
                    navigate('/admin')
                }}
                className="p-6 border-b border-primary-600 cursor-pointer">
                <div className="flex items-center gap-3">
                    <div className=" p-2 rounded-lg">
                        <figure>
                            <img src={logo} alt="AI.Desk Logo  "
                                className=""
                            />
                        </figure>
                    </div>
                    <h1
                        className="text-2xl font-bold">AI.Desk</h1>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2.5 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const to = `/admin/${item.id}`

                    return (
                        <NavLink
                            key={item.id}
                            to={to}
                            onClick={onClick}
                            className={({ isActive }) =>
                                `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-2xl text-gray-600 text-default opacity-90 transform transition-all duration-200 ease-in-out ${isActive ? " bg-white/35" : "hover:border hover:border-[#E2E2E2] "
                                }`
                            }
                        >
                            <Icon size={21} />
                            <span className="font-semibold text-sm sm:text-xl xl:text-2xl">{item.label}</span>
                        </NavLink>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-teal-600"></div>
        </aside>
    )
}
