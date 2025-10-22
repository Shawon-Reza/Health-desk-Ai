"use client"

import { useState, useEffect } from "react"
import { FiUser, FiMail, FiPhone } from "react-icons/fi"

const ProfilePersonalInformationForm = () => {
  // State management for form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  })

  // State for user profile
  const [userProfile, setUserProfile] = useState({
    name: "Dr. Sarah Jhonson",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  })

  // State for form submission
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Mock data - Replace with actual API call
  const mockUserData = {
    firstName: "Sarah",
    lastName: "Jhonson",
    email: "sarah.jhonson@example.com",
    phoneNumber: "+1 (555) 123-4567",
  }

  // Fetch user data on component mount
  useEffect(() => {
    console.log("[PersonalInformation] Component mounted")
    fetchUserData()
  }, [])

  // Function to fetch user data from backend
  const fetchUserData = async () => {
    try {
      console.log("[PersonalInformation] Fetching user data...")
      setIsLoading(true)

      // Replace this with your actual API endpoint
      // const response = await fetch('/api/user/profile');
      // const data = await response.json();
      // setFormData(data);

      // Using mock data for demonstration
      setFormData(mockUserData)
      console.log("[PersonalInformation] User data loaded:", mockUserData)
    } catch (error) {
      console.error("[PersonalInformation] Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log(`[PersonalInformation] Input changed - ${name}: ${value}`)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSaveChanges = async (e) => {
    e.preventDefault()
    console.log("[PersonalInformation] Save changes clicked")
    console.log("[PersonalInformation] Form data to submit:", formData)

    try {
      setIsLoading(true)

      // Replace this with your actual API endpoint
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // const result = await response.json();

      console.log("[PersonalInformation] Changes saved successfully")
      setSuccessMessage("Changes saved successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("[PersonalInformation] Error saving changes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    console.log("[PersonalInformation] Cancel clicked")
    console.log("[PersonalInformation] Resetting form to original data")
    setFormData(mockUserData)
    setSuccessMessage("")
  }

  return (
    <div className=" ">
      <div className=" mx-auto border-2 rounded-xl" style={{ borderColor: "var(--color-primary)" }}>
        {/* Header */}
        <div className="px-6 md:px-8 py-6 border-b-2 border-gray-300" >
          <h1 className="text-xl md:text-2xl font-bold text-secondary">Personal Information</h1>
        </div>

        {/* Profile Section */}
        <div className="px-6 md:px-8 py-8 flex flex-col items-center">
          {/* Avatar */}
          <div
            className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-4 border-4"
            style={{ borderColor: "var(--color-primary)" }}
          >
            <img
              src={userProfile.avatar || "/placeholder.svg"}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <h2 className="text-xl md:text-2xl font-bold text-primary mt-4">{userProfile.name}</h2>

          {/* Role Badge */}
          <div className="mt-3 px-6 py-2 rounded-lg" style={{ backgroundColor: "#FFB6D9" }}>
            <span className="text-sm font-semibold text-secondary">{userProfile.role}</span>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSaveChanges} className="px-6 md:px-8 py-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#D4EDDA", color: "#155724" }}>
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* First Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-secondary mb-2">
                <FiUser className="mr-2" size={16} />
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                style={{ focusRingColor: "var(--color-primary)" }}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-secondary mb-2">
                <FiUser className="mr-2" size={16} />
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                style={{ focusRingColor: "var(--color-primary)" }}
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="flex items-center text-sm font-medium text-secondary mb-2">
                <FiMail className="mr-2" size={16} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                style={{ focusRingColor: "var(--color-primary)" }}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="flex items-center text-sm font-medium text-secondary mb-2">
                <FiPhone className="mr-2" size={16} />
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
                style={{ focusRingColor: "var(--color-primary)" }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-medium text-white transition disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfilePersonalInformationForm
