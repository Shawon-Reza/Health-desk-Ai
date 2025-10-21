import React, { useState } from "react";
import {
    FiX,
    FiMapPin,
    FiPhone,
    FiGlobe,
    FiFileText,
    FiType,
} from "react-icons/fi";

const AddClinicModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Don't render when closed

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        fax: "",
        website: "",
        type: "",
    });

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("[Form Submitted]");
        console.table(formData);
        onClose(); // close popup after logging
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center border-b-3 border-gray-300 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Add New Clinic
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <FiX className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                    {/* Clinic Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Clinic Name
                        </label>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                            <FiFileText className="text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter clinic name"
                                className="w-full outline-none text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Address & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                                <FiMapPin className="text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter clinic address"
                                    className="w-full outline-none text-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                                <FiPhone className="text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className="w-full outline-none text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fax & Website */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                FAX Number
                            </label>
                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                                <FiPhone className="text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    name="fax"
                                    value={formData.fax}
                                    onChange={handleChange}
                                    placeholder="Enter fax number"
                                    className="w-full outline-none text-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website
                            </label>
                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                                <FiGlobe className="text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="Enter website link"
                                    className="w-full outline-none text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
                            <FiType className="text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                placeholder="Enter clinic type (e.g., dental, general)"
                                className="w-full outline-none text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition"
                        >
                            Add Clinic
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClinicModal;
