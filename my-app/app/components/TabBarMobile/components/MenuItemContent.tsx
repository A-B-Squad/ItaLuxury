const MenuItemContent = ({ item, index, isExpanded }: any) => (
    <div
        className={`flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-50 transition-all active:scale-95 ${isExpanded ? 'animate-fadeInUp' : ''
            }`}
        style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'both'
        }}
    >
        <div className={`${item.color} rounded-full p-3 mb-2 transition-transform hover:scale-110 relative`}>
            <div className="text-white">
                {item.icon}
            </div>
            {item.badge && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                </span>
            )}
        </div>
        <span className="text-xs font-medium text-gray-700">
            {item.name}
        </span>
    </div>
);

export default MenuItemContent