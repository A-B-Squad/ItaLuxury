import React, { useState } from "react";

interface QuickActionButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    title: string;
    disabled?: boolean;
    isAddToCart?: boolean;
    className?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
    icon,
    onClick,
    title,
    disabled = false,
    isAddToCart = false,
    className = "",
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
        >
            <div
                className={`relative ${disabled ? "cursor-not-allowed" : "cursor-pointer"} 
                ${isAddToCart ? "hidden md:block" : ""}`}
                onClick={!disabled ? onClick : undefined}
            >
                <button
                    type="button"
                    disabled={disabled}
                    aria-label={title}
                    className={`flex items-center border justify-center h-8 w-8 rounded-full transition-all duration-300 
                    shadow-sm hover:shadow-md ${disabled ? "opacity-50" : ""} 
                    ${className || "bg-white hover:bg-secondaryColor text-black"}`}
                >
                    {icon}
                </button>
            </div>
            
            {/* Custom tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 z-50 whitespace-nowrap">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md">
                        {title}
                    </div>
                    <div className="w-2 h-2 bg-gray-800 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>
            )}
        </div>
    );
};

export default React.memo(QuickActionButton);