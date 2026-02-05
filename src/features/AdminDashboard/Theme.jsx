import React, { useEffect, useRef, useState } from 'react'
import { FiCheck } from 'react-icons/fi'

const Theme = () => {
    const [selectedColor, setSelectedColor] = useState('')
    const hasInitializedRef = useRef(false)

    // Predefined color palette
    const colors = [
        { name: 'Default', hex: '#00A4A6', rgb: '0, 164, 166' },       // ✅ correct
        { name: 'Deep Navy', hex: '#0C2C55' },                     // was "Midnight Navy"
        // Midnight navy is usually almost black-blue
        { name: 'Hot Pink', hex: '#FF4686' },                      // was "Blush Pink"
        // Blush is soft & pale — this is bright/saturated
        { name: 'Dark Teal', hex: '#215E61' },                     // was "Deep Teal"
        // Better fit for this tone
        { name: 'Slate Gray', hex: '#4B5563' },                    // was "Soft Gray"
        // This is the Tailwind slate-600 family, not soft/light
        { name: 'Crimson Red', hex: '#F63049' },                   // was "Crimson"
        // More accurate shade description
    ]

    useEffect(() => {
        const savedColor = localStorage.getItem('themeColor')
        const initialColor = savedColor || selectedColor
        if (initialColor) {
            setSelectedColor(initialColor)
            document.documentElement.style.setProperty('--color-primary', initialColor)
            document.documentElement.style.setProperty('--bg-primary', initialColor)
        }
        hasInitializedRef.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!hasInitializedRef.current) return
        if (selectedColor) {
            localStorage.setItem('themeColor', selectedColor)
            document.documentElement.style.setProperty('--color-primary', selectedColor)
            document.documentElement.style.setProperty('--bg-primary', selectedColor)

        }
    }, [selectedColor])

    const handleColorSelect = (color) => {
        setSelectedColor(color.hex)
        console.log(`🎨 Selected Color: ${color.name} (${color.hex})`)
        window.location.reload();
    }

    return (
        <div className=" ">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Theme Customization</h1>
                <p className="text-gray-600">Select your preferred color theme for the application</p>
            </div>

            {/* Color Selection Card */}
            <div className="bg-white/50 rounded-2xl shadow-lg p-8 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Color Theme</h2>

                {/* Color Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-8">
                    {colors.map((color) => (
                        <button
                            key={color.hex}
                            onClick={() => handleColorSelect(color)}
                            className="relative group transition-transform transform hover:scale-105"
                        >
                            {/* Color Box */}
                            <div
                                className={`w-full h-40 rounded-xl shadow-md transition-all duration-300 border-4 flex items-center justify-center ${selectedColor === color.hex
                                    ? 'border-gray-800 shadow-lg'
                                    : 'border-transparent hover:shadow-lg'
                                    }`}
                                style={{ backgroundColor: color.hex }}
                            >
                                {selectedColor === color.hex && (
                                    <div className="bg-white rounded-full p-2 shadow-lg">
                                        <FiCheck size={24} className="text-gray-800" />
                                    </div>
                                )}
                            </div>

                            {/* Color Info */}
                            <div className="mt-3 text-center">
                                <h3 className="font-semibold text-gray-800">{color.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{color.hex}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Selected Color Preview */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>

                    <div className="flex items-center gap-6">
                        {/* Color Swatch */}
                        <div className="flex-shrink-0">
                            <div
                                className="w-24 h-24 rounded-xl shadow-lg border-4 border-gray-200"
                                style={{ backgroundColor: selectedColor }}
                            ></div>
                        </div>

                        {/* Color Details */}
                        <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-2">Current Color</p>
                            <p className="text-2xl font-bold text-gray-900 mb-3">{selectedColor}</p>

                            {/* RGB Value */}
                            <div className="bg-gray-100 rounded-lg p-4">
                                <p className="text-xs text-gray-600 mb-1">RGB Value</p>
                                <p className="font-mono text-sm text-gray-800">
                                    rgb({colors.find(c => c.hex === selectedColor)?.rgb})
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">💾 Note:</span> Your selected color will be saved to your profile and applied across the application.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Theme