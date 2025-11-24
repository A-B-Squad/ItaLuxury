import Link from "next/link";
import { FiHeart, FiUser } from "react-icons/fi";
import { GoPackageDependents } from "react-icons/go";
import { IoGitCompare } from "react-icons/io5";
import handleAuthAlert from "./Helper/handleAuthAlert";

const AccountMenuLinks = ({
    decodedToken,
    comparisonList,
    logout
}: {
    decodedToken: any;
    comparisonList: any[];
    logout: () => void;
}) => (
    <div className="p-4">
        <div className="space-y-2">
            <Link
                href="/Account"
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
            >
                <FiUser className="text-gray-600" />
                <span className="text-sm font-medium">Mon Compte</span>
            </Link>

            <Link
                href={decodedToken?.userId ? `/TrackingPackages` : "/signin"}
                onClick={() => handleAuthAlert(decodedToken, "Veuillez vous connecter pour voir vos commandes.")}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
            >
                <GoPackageDependents className="text-gray-600" />
                <span className="text-sm font-medium">Mes Commandes</span>
            </Link>

            <Link
                href={decodedToken?.userId ? `/FavoriteList` : "/signin"}
                onClick={() => handleAuthAlert(decodedToken, "Veuillez vous connecter pour voir vos favoris.")}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
            >
                <FiHeart className="text-gray-600" />
                <span className="text-sm font-medium">Ma Liste D'envies</span>
            </Link>

            <Link
                href="/productComparison"
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
            >
                <IoGitCompare className="text-gray-600" />
                <span className="text-sm font-medium">Comparer ({comparisonList.length})</span>
            </Link>

            <button
                onClick={() => {
                    logout();
                }}
                className="flex items-center gap-3 p-2 w-full text-left text-red-600 hover:bg-red-50 rounded-md transition-colors mt-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium">Déconnexion</span>
            </button>
        </div>
    </div>
);

export default AccountMenuLinks