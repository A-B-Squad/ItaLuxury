import Link from "next/link";
import { motion } from 'framer-motion';

const NavLink = ({ href, onClick, linkId, children, activeLink, isTransparent, textColor, hoverTextColor }: any) => (
    <Link
        href={href}
        onClick={onClick}
        className={`relative py-2 px-1 font-semibold text-base transition-colors ${activeLink === linkId
            ? isTransparent ? "text-white" : "text-primaryColor"
            : `${textColor} ${hoverTextColor}`
            }`}
    >
        {children}
        {activeLink === linkId && (
            <motion.div
                className={`absolute bottom-0 left-0 w-full h-0.5 ${isTransparent ? 'bg-white' : 'bg-primaryColor'}`}
                layoutId="underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
        )}
    </Link>
);
export default NavLink

