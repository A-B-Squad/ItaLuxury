import {
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

interface FormInputProps {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    type?: string;
    placeholder: string;
    error?: { message?: string };
    register: any;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
    name: string; // Add this prop
}

const FormInput = ({
    label,
    icon: Icon,
    type = "text",
    placeholder,
    error,
    register,
    showPasswordToggle,
    showPassword,
    onTogglePassword,
    name
}: FormInputProps) => {
    const inputId = `input-${name}`;
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={inputId}>
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
                    className={`block w-full pl-12 ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-3 border ${error ? "border-red-300" : "border-gray-300"
                        } rounded-xl outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all`}
                    placeholder={placeholder}
                    {...register}
                />
                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600">{error.message as string}</p>
            )}
        </div>
    );
};

    export default FormInput;