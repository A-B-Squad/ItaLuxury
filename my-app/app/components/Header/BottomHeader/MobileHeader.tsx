import Link from "next/link";
import { motion } from 'framer-motion';
import UserAvatar from "./UserAvatar";
import { FiUser } from "react-icons/fi";
import { IoBagHandleOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";

const MobileHeader = ({
    textColor,
    openDrawerMobileSideBar,
    isTransparent,
    openDrawerMobileSearch,
    openBasketDrawer,
    quantityInBasket,
    isAuthenticated,
    showUserMenu,
    setShowUserMenu,
    userMenuRef,
    userData
}: any) => (
    <div className="mobile-header-wrapper lg:hidden">
        <div className="mobile-header-content flex items-center px-4 py-3 relative">
            {/* Left Section - Menu Button */}
            <div className="mobile-left-section flex items-center">
                <motion.button
                    type="button"
                    className="mobile-menu-button rounded-lg lg:hidden hover:bg-gray-50 transition-colors"
                    onClick={openDrawerMobileSideBar}
                    whileTap={{ scale: 0.95 }}
                >
                    <HiMiniBars3CenterLeft className={`mobile-menu-icon text-2xl ${textColor}`} />
                </motion.button>
            </div>

            <div className="mobile-logo-section lg:hidden absolute left-1/2 transform -translate-x-1/2">
                <Link href="/" className="mobile-logo-link flex-shrink-0">
                    <div className="mobile-logo-container relative w-24 h-10">
                        <Image
                            src={"/images/logos/LOGO.png"}
                            width={70}
                            height={70}
                            style={{ objectFit: "contain" }}
                            quality={100}
                            priority={true}
                            alt="ita-luxury"
                            className={`mobile-logo-image transition-transform duration-300 hover:scale-105 ${isTransparent ? 'brightness-0 invert' : ''}`}
                        />
                    </div>
                </Link>
            </div>

            {/* Right Section - Actions */}
            <div className="mobile-actions-section flex items-center justify-end gap-1 ml-auto">
                {/* Search Button */}
                <motion.button
                    onClick={openDrawerMobileSearch}
                    className="mobile-search-button relative p-2.5 rounded-xl lg:hidden hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 ease-in-out flex items-center justify-center min-w-[44px] min-h-[44px]"
                    whileTap={{ scale: 0.95 }}
                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                >
                    <CiSearch className={`mobile-search-icon text-xl ${textColor}`} />
                </motion.button>

                {/* Basket Button */}
                <motion.button
                    onClick={openBasketDrawer}
                    className="mobile-basket-button relative p-2.5 rounded-xl lg:hidden hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 ease-in-out flex items-center justify-center min-w-[44px] min-h-[44px]"
                    whileTap={{ scale: 0.95 }}
                    style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                >
                    <IoBagHandleOutline className={`mobile-basket-icon text-xl ${textColor}`} />
                    {quantityInBasket > 0 && (
                        <motion.span
                            className="mobile-basket-badge absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-md border-2 border-white"
                            style={{ fontSize: '11px', fontWeight: '600', lineHeight: '1' }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                            {quantityInBasket > 9 ? "9+" : quantityInBasket}
                        </motion.span>
                    )}
                </motion.button>

                {/* User Avatar or Login Button */}
                {!isAuthenticated ? (
                    <Link href="/signin">
                        <motion.button
                            className="mobile-user-login-button p-2.5 rounded-xl lg:hidden hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 ease-in-out flex items-center justify-center min-w-[44px] min-h-[44px]"
                            whileTap={{ scale: 0.95 }}
                            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
                        >
                            <FiUser className={`mobile-user-login-icon text-xl ${textColor}`} />
                        </motion.button>
                    </Link>
                ) : (
                    <div className="flex items-center">
                        <UserAvatar
                            showUserMenu={showUserMenu}
                            setShowUserMenu={setShowUserMenu}
                            userMenuRef={userMenuRef}
                            isMobile={true}
                            userData={userData}
                        />
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default MobileHeader