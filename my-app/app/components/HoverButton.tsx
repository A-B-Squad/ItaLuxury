import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HoverButtonProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const HoverButton = memo(({ title, icon, onClick, disabled = false, className}: HoverButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => !disabled && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => !disabled && setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <button
        type="button"
        className={`transition-all bg-transparent text-primaryColor text-xl hover:text-black font-bold rounded p-2 hover:bg-gray-100 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${className}`}
        onClick={!disabled ? onClick : undefined}
        disabled={disabled}
        aria-label={title}
      >
        {icon}
      </button>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2"
          >
            <div className="bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap">
              {title}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-solid border-t-gray-800 border-t-4 border-x-transparent border-x-4 border-b-0 h-0 w-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default HoverButton;