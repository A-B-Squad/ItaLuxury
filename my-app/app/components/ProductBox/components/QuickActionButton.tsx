interface QuickActionButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    title: string;
    disabled?: boolean;
    isAddToCart?: boolean;

}
const QuickActionButton: React.FC<QuickActionButtonProps> = ({
    icon,
    onClick,
    title,
    disabled = false,
    isAddToCart = false,
}) => (
    <div
        className={`relative w-fit cursor-crosshair ${disabled ? "cursor-not-allowed" : "cursor-pointer"
            } ${isAddToCart ? "hidden md:block" : ""}`}
        title={title}
        onClick={!disabled ? onClick : undefined}
    >
        <li
            className={`bg-primaryColor rounded-full delay-100 lg:translate-x-20 group-hover:translate-x-0 transition-all p-2 shadow-md hover:bg-secondaryColor ${disabled ? "opacity-50" : ""
                }`}
        >
            {icon}
        </li>
    </div>
);

export default QuickActionButton