"use client";
import { useAuth } from "@/app/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { AnimatePresence, motion } from "framer-motion";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { MdPointOfSale } from "react-icons/md";


const UserAvatar = ({ showUserMenu, setShowUserMenu, userMenuRef, isMobile = false, userData }: { showUserMenu: boolean, setShowUserMenu: any, userMenuRef: any, isMobile?: boolean, userData: any }) => {
    const { toast } = useToast();
    const router = useRouter();
    const { logout } = useAuth();

    const userPoints = userData?.points || 0;
    const userName = userData?.name || userData?.email;

    const handleLogout = async () => {
        try {
            logout()
            await router.push("/");

            toast({
                title: "Déconnexion réussie",
                description: "À bientôt sur ita-luxury",
                className: "bg-primaryColor text-white",
            });

            setTimeout(() => {
                globalThis.location.reload();
            }, 100);
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            toast({
                title: "Erreur de déconnexion",
                description: "Veuillez réessayer plus tard",
                variant: "destructive",
            });
        }
    };
    return (
        <div className="relative md:hidden" ref={userMenuRef}>
            <motion.div
                className="relative cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileTap={{ scale: 0.95 }}
            >
                {/* Points Badge */}
                <div
                    className="absolute -top-5 -right-2 bg-primaryColor text-white text-xs font-bold rounded-full px-2 py-1 min-w-[24px] text-center shadow-lg z-10"
                >
                    {userPoints > 999 ? "999+" : userPoints}
                </div>

                {/* User Avatar */}
                <div className={`relative ${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full overflow-hidden border-2 border-gray-200 hover:border-primaryColor transition-colors bg-gray-100`}>

                    <div className="w-full h-full bg-primaryColor/10 flex items-center justify-center">
                        <FiUser className={`${isMobile ? 'text-lg' : 'text-xl'} text-primaryColor`} />
                    </div>
                </div>
            </motion.div>

            {/* User Menu Dropdown */}
            <AnimatePresence>
                {showUserMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute ${isMobile ? 'right-0 top-12' : 'right-0 top-14'} bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] z-50 overflow-hidden`}
                    >
                        {/* User Info Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-primaryColor/5 to-primaryColor/10 border-b">
                            <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">

                                    <div className="w-full h-full bg-primaryColor/10 flex items-center justify-center">
                                        <FiUser className="text-sm text-primaryColor" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {userName || "Utilisateur"}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <MdPointOfSale className="text-xs text-primaryColor" />
                                        <span className="text-xs font-semibold text-primaryColor">
                                            {userPoints} points
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Menu Items */}
                        <div className="py-2">
                            <Link
                                href="/Account"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <FiUser className="text-base text-gray-500" />
                                Mon Compte
                            </Link>
                            <Link
                                href="/Account"
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <MdPointOfSale className="text-base text-primaryColor" />
                                Mes Points ({userPoints})
                            </Link>

                            <div className="border-t border-gray-100 mt-2 pt-2">
                                <button
                                    onClick={() => {
                                        setShowUserMenu(false);
                                        handleLogout();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <IoIosLogOut className="text-base" />
                                    Se déconnecter
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    );
};
export default UserAvatar