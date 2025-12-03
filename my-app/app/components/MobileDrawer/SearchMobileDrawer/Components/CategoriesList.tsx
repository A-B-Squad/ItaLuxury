import Link from "next/link";
import { CiSearch } from "react-icons/ci";

const CategoriesList = ({
    categories,
    closeDrawer
}: {
    categories: any[];
    closeDrawer: () => void;
}) => (
    <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Catégories ({categories.length})
        </h3>
        <ul className="space-y-1">
            {categories.map((category: any) => (
                <Link
                    key={category.id}
                    href={`/Collections?${new URLSearchParams({ category: category.name })}`}
                    onClick={closeDrawer}
                    
                >
                    <li className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors duration-150 text-base font-medium">
                        <CiSearch className="text-gray-400 w-5 h-5 flex-shrink-0" />
                        <span className="flex-1 text-base">{category.name}</span>
                    </li>
                </Link>
            ))}
        </ul>
    </div>
);

export default CategoriesList