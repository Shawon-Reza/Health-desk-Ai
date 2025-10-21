import React, { useState } from "react";
import { FaRegFileLines } from "react-icons/fa6";
import { FiX, FiMapPin, FiFileText } from "react-icons/fi";
import { PiSubtitlesThin } from "react-icons/pi";

const AddMatterModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        subjectTitle: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("[Form Submitted]");
        console.table(formData);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl animate-fadeIn">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Add New Subject Matter
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <FiX className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                    {/* Subject Title */}
                    <div>
                        <label
                            htmlFor="subjectTitle"
                            className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                        >
                            <PiSubtitlesThin size={18} />
                            <span>Subject Title</span>
                        </label>
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/40">
                            <FiFileText className="text-gray-400 w-4 h-4" />
                            <input
                                id="subjectTitle"
                                type="text"
                                name="subjectTitle"
                                value={formData.subjectTitle}
                                onChange={handleChange}
                                placeholder="Enter subject title"
                                className="w-full outline-none text-gray-700"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"
                        >
                            <FaRegFileLines />
                            <span>Description</span>
                        </label>
                        <div className="flex items-start gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/40">
                            <FiMapPin className="text-gray-400 w-4 h-4 mt-1" />
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter subject description"
                                className="w-full outline-none text-gray-700 resize-none"
                                rows="4"
                                required
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
                            Add Subject
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMatterModal;
