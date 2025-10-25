import React, { useMemo, useState } from 'react'
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiBriefcase,
  FiCalendar,
  FiHash,
  FiActivity,
  FiMapPin,
  FiTag,
  FiChevronDown,
} from 'react-icons/fi'

// Simple API helper that can be swapped with a real client
async function createUser(payload) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Failed to create user: ${res.status}`)
    return res.json()
  }
  console.warn('[AddNewUserModal] VITE_API_BASE_URL not set. Simulating POST...')
  await new Promise((r) => setTimeout(r, 500))
  return { id: String(Date.now()), ...payload }
}

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex text-sm font-medium text-gray-700 mb-1 items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />} {label}
    </label>
    {children}
  </div>
)

const Select = ({ value, onChange, options, placeholder = 'Select', leftIcon: Icon }) => (
  <div className="relative">
    {Icon && (
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-4 h-4 text-gray-500" />
      </span>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <FiChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
  </div>
)

const AddNewUserModal = ({
  isOpen,
  onClose,
  onCreated,
  roles = ['Admin', 'President', 'Manager', 'Doctor', 'Staff', 'Jr. Staff'],
  clinics = ['Clinic 1', 'Clinic 2', 'Clinic 3'],
  subjectMatters = ['Customer Support', 'Accountant', 'Eye Specialist', 'Surgeon'],
}) => {
  if (!isOpen) return null

  const [form, setForm] = useState({
    firstName: 'Sahil',
    lastName: 'Khan',
    email: 'usermail@gmail.com',
    phone: '+999999999',
    password: '1234569',
    role: 'Manager',
    startDate: new Date().toISOString().slice(0, 10),
    employeeId: '00125',
    knowledgeLevel: '8',
    clinics: ['Clinic 1', 'Clinic 2'],
    subjectMatter: 'Customer Support',
    status: 'Active',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = useMemo(() => {
    return (
      form.firstName &&
      form.lastName &&
      /@/.test(form.email) &&
      form.password &&
      form.role &&
      form.employeeId &&
      form.status
    )
  }, [form])

  const update = (key) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleClinic = (name) => {
    setForm((prev) => {
      const has = prev.clinics.includes(name)
      const next = has
        ? prev.clinics.filter((c) => c !== name)
        : [...prev.clinics, name]
      return { ...prev, clinics: next }
    })
  }

  const handleRemoveClinic = (name) => toggleClinic(name)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    const payload = {
      ...form,
      name: `${form.firstName} ${form.lastName}`.trim(),
    }
    console.log('[AddNewUserModal] Submitting payload:', payload)
    try {
      const created = await createUser(payload)
      console.log('[AddNewUserModal] POST success:', created)
      onCreated && onCreated(created)
      onClose && onClose()
    } catch (err) {
      console.error('[AddNewUserModal] POST failed:', err)
      alert('Failed to create user. See console for details.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-title"
    >
      <div className="bg-white w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 id="add-user-title" className="text-lg sm:text-xl font-semibold text-gray-800">Add New User</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Close">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-6 max-h-[calc(100dvh-160px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <Field label="First Name" icon={FiUser}>
              <div className="relative">
                <FiUser className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  value={form.firstName}
                  onChange={update('firstName')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="First name"
                  required
                />
              </div>
            </Field>

            {/* Last Name */}
            <Field label="Last Name" icon={FiUser}>
              <div className="relative">
                <FiUser className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  value={form.lastName}
                  onChange={update('lastName')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Last name"
                  required
                />
              </div>
            </Field>

            {/* Email */}
            <Field label="Email Address" icon={FiMail}>
              <div className="relative">
                <FiMail className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </Field>

            {/* Phone */}
            <Field label="Phone Number" icon={FiPhone}>
              <div className="relative">
                <FiPhone className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="+1234567890"
                />
              </div>
            </Field>

            {/* Password */}
            <Field label="Set Password" icon={FiLock}>
              <div className="relative">
                <FiLock className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-2.5 text-gray-500"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </Field>

            {/* Role */}
            <Field label="Role" icon={FiBriefcase}>
              <Select
                value={form.role}
                onChange={update('role')}
                options={roles}
                leftIcon={FiBriefcase}
                placeholder="Select role"
              />
            </Field>

            {/* Start Date */}
            <Field label="Start Date" icon={FiCalendar}>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="date"
                  value={form.startDate}
                  onChange={update('startDate')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </Field>

            {/* Employee ID */}
            <Field label="Employee ID" icon={FiHash}>
              <div className="relative">
                <FiHash className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  value={form.employeeId}
                  onChange={update('employeeId')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., 00125"
                  required
                />
              </div>
            </Field>

            {/* Knowledge Level */}
            <Field label="Knowledge Level" icon={FiActivity}>
              <div className="relative">
                <FiActivity className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={form.knowledgeLevel}
                  onChange={update('knowledgeLevel')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </Field>

            {/* Clinics (multi select chips) */}
            <Field label="Clinic" icon={FiMapPin}>
              <div className="border border-gray-300 rounded-lg p-2">
                {/* Selected chips */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.clinics.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-teal-50 text-teal-700 border border-teal-200">
                      {c}
                      <button type="button" className="ml-1" onClick={() => handleRemoveClinic(c)} aria-label={`Remove ${c}`}>
                        <FiX className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                  {!form.clinics.length && (
                    <span className="text-sm text-gray-500">No clinic selected</span>
                  )}
                </div>
                {/* Options */}
                <div className="flex flex-wrap gap-2">
                  {clinics.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => toggleClinic(c)}
                      className={`px-3 py-1 rounded-full text-sm border transition ${
                        form.clinics.includes(c)
                          ? 'bg-gray-100 text-gray-700 border-gray-300'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </Field>

            {/* Subject Matter Experts */}
            <Field label="Subjects Matter Experts" icon={FiTag}>
              <Select
                value={form.subjectMatter}
                onChange={update('subjectMatter')}
                options={subjectMatters}
                leftIcon={FiTag}
                placeholder="Select subject"
              />
            </Field>

            {/* Status */}
            <Field label="Status" icon={FiUser}>
              <Select
                value={form.status}
                onChange={update('status')}
                options={[ 'Active', 'Blocked', 'Pending' ]}
                leftIcon={FiUser}
                placeholder="Select status"
              />
            </Field>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
                !canSubmit || submitting ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {submitting ? 'Adding…' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddNewUserModal