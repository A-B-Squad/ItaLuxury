import Link from "next/link";

const RegularLinkButton = ({ item, isActive }: any) => (
    <Link
        key={item.path}
        href={item.path}
        className="flex flex-col items-center justify-center flex-1"
    >
        <div className="flex flex-col items-center py-1 active:scale-95 transition-transform">
            <div
                className={`transition-colors duration-200 ${isActive(item.path) ? "text-primaryColor" : "text-gray-400"
                    }`}
            >
                {item.icon}
            </div>
            <span
                className={`text-[11px] mt-1 font-normal transition-colors duration-200 ${isActive(item.path) ? "text-primaryColor" : "text-gray-600"
                    }`}
            >
                {item.name}
            </span>
        </div>
    </Link>
);


export default RegularLinkButton