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
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import axiosApi from '../../service/axiosInstance'
import useGetSubjectMattersAndClinicsList from '../../hooks/useGetSubjectMattersAndClinicsList'
import { queryClient } from '../../main'
import { toast } from 'react-toastify'

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
  onRefetch,
  mode = 'create', // 'create' or 'edit'
  userId = null,
  roles = ['President', 'Manager', 'Doctor', 'Staff', 'jr_staff'],
  clinics = [],
  subjectMatters = [],
  isLoading = false,
}) => {
  if (!isOpen) return null

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    startDate: new Date().toISOString().slice(0, 10),
    employeeId: '',
    knowledgeLevel: '',
    clinics: [],
    clinicIds: [],
    subjectMatter: '',
    subjectMatterId: null,
    status: 'Active',
    subroleId: null,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loadingUserData, setLoadingUserData] = useState(false)
  const [searchSubrole, setSearchSubrole] = useState('')

  // ................................Fetch Sub Roles For doctores/staff/jr_staff..................................\\
  const { data: subRolesData, isLoading: isLoadingSubRoles } = useQuery({
    queryKey: ['subRoles'],
    queryFn: async () => {
      const response = await axiosApi.get('/api/v1/subroles/')
      console.log('SubRoles Response:', response.data)
      return response.data
    },
  })

  console.log("Doctors Subroles:.........................", subRolesData)

  // Ensure subject display title syncs once subject list is loaded
  React.useEffect(() => {
    if (form.subjectMatterId && Array.isArray(subjectMatters) && subjectMatters.length) {
      const matched = subjectMatters.find((s) => s.id === form.subjectMatterId)
      if (matched?.title && matched.title !== form.subjectMatter) {
        setForm((prev) => ({ ...prev, subjectMatter: matched.title }))
      }
    }
  }, [form.subjectMatterId, form.subjectMatter, subjectMatters])

  // Fetch user data when in edit mode
  React.useEffect(() => {
    if (mode === 'edit' && userId && isOpen) {
      setLoadingUserData(true)
      axiosApi.get(`/api/v1/users/${userId}/`)
        .then((response) => {
          const userData = response.data
          console.log(userData)

          // Normalize clinics to parallel name/id arrays for chips + selection
          const normalizedClinics = Array.isArray(userData.clinics)
            ? userData.clinics.map((c) => c?.name || c?.title || c)
            : []
          const normalizedClinicIds = Array.isArray(userData.clinics)
            ? userData.clinics.map((c) => c?.id).filter(Boolean)
            : (userData.clinic_ids || [])

          // Normalize first subject for initial select
          const firstSubject = Array.isArray(userData.subject_matters) ? userData.subject_matters[0] : null
          const subjectMatterId = firstSubject?.id ?? (typeof firstSubject === 'number' ? firstSubject : null)
          const subjectMatterTitle = firstSubject?.title || (typeof firstSubject === 'string' ? firstSubject : '')

          // Map API data to form state
          setForm({
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            password: '', // Don't pre-fill password
            role: userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : '',
            startDate: userData.joining_date || new Date().toISOString().slice(0, 10),
            employeeId: userData.employee_id || '',
            knowledgeLevel: String(userData.knowledge_level || ''),
            clinics: normalizedClinics,
            clinicIds: normalizedClinicIds,
            subjectMatter: subjectMatterTitle,
            subjectMatterId: subjectMatterId,
            status: userData.is_active ? 'Active' : 'Inactive',
            subroleId: userData.subrole?.id || null,
          })
          setLoadingUserData(false)
        })
        .catch((error) => {
          console.error('[AddNewUserModal] Failed to fetch user data:', error)
          alert('Failed to load user data')
          setLoadingUserData(false)
          onClose()
        })
    }
  }, [mode, userId, isOpen])

  // Mutation for creating/updating user
  const createUserMutation = useMutation({
    mutationFn: async (payload) => {
      if (mode === 'edit' && userId) {
        console.log(userId)
        console.log(payload)
        const response = await axiosApi.patch(`/api/v1/users/${userId}/update/`, payload)
        return response.data
      } else {
        const response = await axiosApi.post('/api/v1/users/create/', payload)
        return response.data
      }
    },
    onSuccess: (data) => {
      console.log(mode === 'edit' ? 'User updated successfully:' : 'User created successfully:', data)
      onCreated && onCreated(data)
      // onRefetch && onRefetch()
      onClose && onClose()
      queryClient.invalidateQueries({ queryKey: ['userList'] })
      toast.success(`User ${mode === 'edit' ? 'updated' : 'created'} successfully!`)
    },
    onError: (error) => {
      console.error(`[AddNewUserModal] ${mode === 'edit' ? 'PUT' : 'POST'} failed:`, error)
      alert(error?.response?.data?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} user.`);
    },
  })

  const canSubmit = useMemo(() => {
    const baseValidation =
      form.firstName &&
      form.lastName &&
      /@/.test(form.email) &&
      form.role &&
      form.employeeId &&
      form.status;

    // Password is only required in create mode
    if (mode === 'create') {
      return baseValidation && form.password;
    }

    return baseValidation;
  }, [form, mode])

  const update = (key) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleClinic = (clinic) => {
    setForm((prev) => {
      const clinicName = clinic.name || clinic
      const clinicId = clinic.id
      const hasClinic = prev.clinics.includes(clinicName)
      const newClinics = hasClinic
        ? prev.clinics.filter((c) => c !== clinicName)
        : [...prev.clinics, clinicName]
      const newClinicIds = hasClinic
        ? prev.clinicIds.filter((id) => id !== clinicId)
        : [...prev.clinicIds, clinicId]
      return { ...prev, clinics: newClinics, clinicIds: newClinicIds }
    })
  }

  const handleRemoveClinic = (clinicName) => {
    setForm((prev) => {
      const clinicIndex = prev.clinics.indexOf(clinicName)
      const newClinics = prev.clinics.filter((c) => c !== clinicName)
      const newClinicIds = clinicIndex !== -1 ? prev.clinicIds.filter((_, i) => i !== clinicIndex) : prev.clinicIds
      return { ...prev, clinics: newClinics, clinicIds: newClinicIds }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return

    // Map form data to API payload structure
    const payload = {
      email: form.email,
      first_name: form.firstName,
      last_name: form.lastName,
      role: form.role.toLowerCase(),
      is_active: form.status === 'Active',
      clinic_ids: form.clinicIds,
      picture: null,
      subject_ids: form.subjectMatterId ? [form.subjectMatterId] : [],
      employee_id: form.employeeId,
      knowledge_level: parseInt(form.knowledgeLevel) || 0,
      joining_date: form.startDate,
      phone: form.phone,
      subrole_ids: form.subroleId ? [form.subroleId] : [],
    }

    // Only include password if it's set (required for create, optional for edit)
    if (form.password) {
      payload.password = form.password
    }

    console.log('[AddNewUserModal] Submitting payload:', payload)
    createUserMutation.mutate(payload)
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
          <h2 id="add-user-title" className="text-lg sm:text-xl font-semibold text-gray-800">{mode === 'edit' ? 'Update User' : 'Add New User'}</h2>
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
            <Field label={mode === 'edit' ? 'Change Password (leave empty to keep current)' : 'Set Password'} icon={FiLock}>
              <div className="relative">
                <FiLock className="absolute left-3 top-2.5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  required={mode === 'create'}
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

            {/* Sub Role (Doctor, Staff, Jr Staff) */}
            {['Doctor', 'Staff', 'jr_staff'].includes(form.role) && (
              <Field label="Sub Role (Specialization)" icon={FiBriefcase}>
                <div className="space-y-2">
                  {/* Search Input */}
                  <div className="relative">
                    <FiBriefcase className="absolute left-3 top-2.5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search sub roles..."
                      value={searchSubrole}
                      onChange={(e) => setSearchSubrole(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  
                  {/* Selected Sub Role Display */}
                  {form.subroleId && (
                    <div className="px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-teal-700">
                          {subRolesData?.find((s) => s.id === form.subroleId)?.name || 'Selected'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, subroleId: null }))}
                          className="text-teal-600 hover:text-teal-800"
                          aria-label="Clear sub role"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sub Role Options */}
                  <div className="border border-gray-300 rounded-lg p-2 max-h-48 overflow-y-auto">
                    {isLoadingSubRoles ? (
                      <span className="text-sm text-gray-500">Loading sub roles...</span>
                    ) : subRolesData && subRolesData.length > 0 ? (
                      <div className="space-y-1">
                        {subRolesData
                          .filter(
                            (s) =>
                              s.is_active &&
                              s.name.toLowerCase().includes(searchSubrole.toLowerCase())
                          )
                          .map((subrole) => (
                            <button
                              key={subrole.id}
                              type="button"
                              onClick={() => {
                                setForm((prev) => ({
                                  ...prev,
                                  subroleId: subrole.id,
                                }))
                                setSearchSubrole('')
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition ${
                                form.subroleId === subrole.id
                                  ? 'bg-teal-100 text-teal-700 border-teal-300'
                                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {subrole.name}
                            </button>
                          ))}
                        {subRolesData.filter(
                          (s) =>
                            s.is_active &&
                            s.name.toLowerCase().includes(searchSubrole.toLowerCase())
                        ).length === 0 && (
                          <span className="text-sm text-gray-500 p-2">
                            No sub roles found
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No data available</span>
                    )}
                  </div>
                </div>
              </Field>
            )}

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
                  {isLoading ? (
                    <span className="text-sm text-gray-500">Loading clinics...</span>
                  ) : clinics.length > 0 ? (
                    clinics.map((clinic) => {
                      const clinicName = clinic.name || clinic
                      return (
                        <button
                          type="button"
                          key={clinic.id || clinic}
                          onClick={() => toggleClinic(clinic)}
                          className={`px-3 py-1 rounded-full text-sm border transition ${form.clinics.includes(clinicName)
                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {clinicName}
                        </button>
                      )
                    })
                  ) : (
                    <span className="text-sm text-gray-500">No data available</span>
                  )}
                </div>
              </div>
            </Field>

            {/* Subject Matter Experts */}
            <Field label="Subjects Matter Experts" icon={FiTag}>
              {isLoading ? (
                <div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
                  Loading subjects...
                </div>
              ) : subjectMatters.length > 0 ? (
                <div className="relative">
                  {FiTag && (
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTag className="w-4 h-4 text-gray-500" />
                    </span>
                  )}
                  <select
                    value={form.subjectMatter}
                    onChange={(e) => {
                      const selectedTitle = e.target.value
                      const selectedSubject = subjectMatters.find(s => (s.title || s) === selectedTitle)
                      setForm((prev) => ({
                        ...prev,
                        subjectMatter: selectedTitle,
                        subjectMatterId: selectedSubject?.id || null
                      }))
                    }}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                  >
                    <option value="" disabled>
                      Select subject
                    </option>
                    {subjectMatters.map((s) => {
                      const title = s.title || s
                      return (
                        <option key={s.id || s} value={title}>
                          {title}
                        </option>
                      )
                    })}
                  </select>
                  <FiChevronDown className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                </div>
              ) : (
                <div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
                  No data available
                </div>
              )}
            </Field>

            {/* Status */}
            <Field label="Status" icon={FiUser}>
              <Select
                value={form.status}
                onChange={update('status')}
                options={['Active', 'Inactive']}
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
              disabled={!canSubmit || createUserMutation.isPending || loadingUserData}
              className={`px-5 py-2 rounded-lg text-white font-semibold transition ${!canSubmit || createUserMutation.isPending || loadingUserData ? 'bg-teal-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                }`}
            >
              {loadingUserData ? 'Loading...' : createUserMutation.isPending ? (mode === 'edit' ? 'Updating…' : 'Adding…') : (mode === 'edit' ? 'Update User' : 'Add User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddNewUserModal