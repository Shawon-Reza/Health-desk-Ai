"use client"

import { useState, useEffect } from "react"
import { FiBell } from "react-icons/fi"

const Notifications = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    // Mock data - Replace with your backend API call
    const mockNotifications = [
        {
            id: 1,
            name: "Assessments Reminder",
            enabled: true,
            description: "Get reminded about upcoming assessments",
        },
        {
            id: 2,
            name: "Tagged Message Reminder",
            enabled: true,
            description: "Get notified when you are tagged in messages",
        },
    ]

    // Fetch notifications data
    useEffect(() => {
        console.log("[v0] Notifications component mounted")
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            console.log("[v0] Fetching notifications data...")
            setLoading(true)

            // Replace this with your actual API call
            // const response = await fetch('/api/notifications');
            // const data = await response.json();

            // Using mock data for now
            setNotifications(mockNotifications)
            console.log("[v0] Notifications data loaded:", mockNotifications)
            setLoading(false)
        } catch (error) {
            console.error("[v0] Error fetching notifications:", error)
            setLoading(false)
        }
    }

    const handleToggle = (id, currentState) => {
        console.log(`[v0] Toggling notification ID: ${id}, Current state: ${currentState}`)

        const updatedNotifications = notifications.map((notif) =>
            notif.id === id ? { ...notif, enabled: !notif.enabled } : notif,
        )

        setNotifications(updatedNotifications)
        console.log("[v0] Updated notifications:", updatedNotifications)

        // Call your backend API to save the change
        updateNotificationPreference(id, !currentState)
    }

    const updateNotificationPreference = async (id, enabled) => {
        try {
            console.log(`[v0] Updating notification preference - ID: ${id}, Enabled: ${enabled}`)

            // Replace this with your actual API call
            // const response = await fetch(`/api/notifications/${id}`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ enabled })
            // });
            // const data = await response.json();

            console.log(`[v0] Notification preference updated successfully`)
        } catch (error) {
            console.error("[v0] Error updating notification preference:", error)
        }
    }

    if (loading) {
        return <div className="p-6 text-center">Loading notifications...</div>
    }

    return (
        <div className="">
            <div
                className=" border rounded-lg p-6 md:p-8"
                style={{ borderColor: "#00A4A6" }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Notifications</h1>

                <hr className="border border-gray-300" />

                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div key={notification.id}>
                            <div className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-4">
                                    <FiBell size={24} style={{ color: "#00A4A6" }} />
                                    <div>
                                        <p className="text-lg font-medium text-gray-900">{notification.name}</p>
                                        {notification.description && <p className="text-sm text-gray-500">{notification.description}</p>}
                                    </div>
                                </div>

                                {/* Toggle Switch */}
                                <button
                                    onClick={() => handleToggle(notification.id, notification.enabled)}
                                    className={`relative inline-flex h-6 w-14 items-center rounded-full transition-colors ${notification.enabled ? "bg-teal-500" : "bg-gray-300"
                                        }`}
                                    style={{
                                        backgroundColor: notification.enabled ? "#00A4A6" : "#d1d5db",
                                    }}
                                    aria-label={`Toggle ${notification.name}`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notification.enabled ? "translate-x-7" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Divider */}
                            {notification.id !== notifications[notifications.length - 1].id && (
                                <div className="border-b border-gray-200"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Notifications
