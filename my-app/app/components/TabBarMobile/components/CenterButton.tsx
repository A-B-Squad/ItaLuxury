import { X } from "lucide-react";

const CenterButton = ({ isExpanded, toggleExpanded, item }: any) => (
    <button
        key="center-button"
        onClick={toggleExpanded}
        className="flex flex-col items-center justify-center flex-1"
    >
        <div className="flex flex-col items-center -mt-6 active:scale-95 transition-transform">
            <div
                className={`rounded-full p-3.5 shadow-lg mb-1 transition-all duration-300 ${isExpanded ? 'bg-primaryColor rotate-45' : 'bg-logoColor rotate-0'
                    }`}
            >
                <div className="text-white">
                    {isExpanded ? <X size={24} /> : item.icon}
                </div>
            </div>
            <span className="text-[11px] text-gray-600 font-normal mt-1">
                {isExpanded ? 'Fermer' : item.name}
            </span>
        </div>
    </button>
);
export default CenterButton