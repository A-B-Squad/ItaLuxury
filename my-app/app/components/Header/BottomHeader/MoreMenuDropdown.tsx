import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

const MoreMenuDropdown = ({ showMoreMenu, activeLink, handleNavigation }: any) => (
    <AnimatePresence>
        {showMoreMenu && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
                <Link
                    href="/Collections?choice=new-product&page=1"
                    onClick={() => handleNavigation("nouveaute")}
                    className={`block px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeLink === "nouveaute" ? "text-primaryColor bg-gray-50" : "text-gray-700"}`}
                >
                    <span className="font-semibold">Nouveauté</span>
                </Link>

                <div className="lg:hidden">
                    <Link
                        href="/Collections?category=Electroménager&page=1"
                        onClick={() => handleNavigation("electromenager")}
                        className={`block px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeLink === "electromenager" ? "text-primaryColor bg-gray-50" : "text-gray-700"}`}
                    >
                        <span className="font-semibold">Électroménager</span>
                    </Link>
                </div>

                <div className="xl:hidden">
                    <Link
                        href="/Collections?category=Cuisine&page=1"
                        onClick={() => handleNavigation("cuisine")}
                        className={`block px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeLink === "cuisine" ? "text-primaryColor bg-gray-50" : "text-gray-700"}`}
                    >
                        <span className="font-semibold">Cuisine</span>
                    </Link>
                    <Link
                        href="/Collections?category=Maison+et+Décoration&page=1"
                        onClick={() => handleNavigation("deco")}
                        className={`block px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeLink === "deco" ? "text-primaryColor bg-gray-50" : "text-gray-700"}`}
                    >
                        <span className="font-semibold">Déco Maison</span>
                    </Link>
                </div>

                <Link
                    href="/Collections?category=Appareil+de+coiffure&page=1"
                    onClick={() => handleNavigation("coiffure")}
                    className={`block px-4 py-2.5 hover:bg-gray-50 transition-colors ${activeLink === "coiffure" ? "text-primaryColor bg-gray-50" : "text-gray-700"}`}
                >
                    <span className="font-semibold">Appareil de coiffure</span>
                </Link>
            </motion.div>
        )}
    </AnimatePresence>
);
export default MoreMenuDropdown

