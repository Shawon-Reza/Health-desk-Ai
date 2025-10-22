"use client";

import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

/** Password Field Component */
const PasswordField = ({ label, name, value, showPassword, onChange, onToggle, error }) => (
  <div className="mb-6">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
      <FiLock size={16} />
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default function Security() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /** Handle Input Change */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Toggle Password Visibility */
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /** Validate Form */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword)
      newErrors.currentPassword = "Current password is required";

    if (!formData.newPassword)
      newErrors.newPassword = "New password is required";
    else if (formData.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle Save Changes */
  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate backend API request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Password changed successfully!");

      // Reset form after success
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch {
      setErrors({ submit: "Failed to change password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  /** Handle Cancel */
  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return (
    <div
      className="p-6 md:p-8 rounded-2xl border"
      style={{ borderColor: "var(--color-primary)" }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Security</h1>
      <hr className="border border-gray-300 mt-2 mb-5" />

      <div>
        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={formData.currentPassword}
          showPassword={showPasswords.current}
          onChange={handleInputChange}
          onToggle={() => togglePasswordVisibility("current")}
          error={errors.currentPassword}
        />

        <PasswordField
          label="New Password"
          name="newPassword"
          value={formData.newPassword}
          showPassword={showPasswords.new}
          onChange={handleInputChange}
          onToggle={() => togglePasswordVisibility("new")}
          error={errors.newPassword}
        />

        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          showPassword={showPasswords.confirm}
          onChange={handleInputChange}
          onToggle={() => togglePasswordVisibility("confirm")}
          error={errors.confirmPassword}
        />

        {errors.submit && (
          <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
        )}

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={loading}
            className="px-6 py-2 rounded-lg font-medium text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
