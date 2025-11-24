const CategoryButton = ({ item, openCategoryDrawer }: any) => (
    <button
        key={item.path}
        onClick={openCategoryDrawer}
        className="flex flex-col items-center justify-center flex-1"
    >
        <div className="flex flex-col items-center py-1 active:scale-95 transition-transform">
            <div className="text-gray-400 transition-colors duration-200">
                {item.icon}
            </div>
            <span className="text-[11px] mt-1 font-normal text-gray-600 transition-colors duration-200">
                {item.name}
            </span>
        </div>
    </button>
);
export default CategoryButton