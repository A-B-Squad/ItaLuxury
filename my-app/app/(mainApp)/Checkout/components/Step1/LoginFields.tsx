import {
    FaLock,
    FaUser
} from "react-icons/fa";
import FormInput from "./FormInput";
const LoginFields = ({ register, errors, showPassword, togglePasswordVisibility }: any) => (
    <>
        <FormInput
            name="emailOrPhone"
            label="Email ou Téléphone"
            icon={FaUser}
            placeholder="exemple@email.com ou 12345678"
            error={errors.emailOrPhone}
            register={register("emailOrPhone", {
                required: "Ce champ est requis",
                validate: (value: string) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const phoneRegex = /^\d{8}$/;
                    return emailRegex.test(value) || phoneRegex.test(value) || "Format invalide";
                },
            })}
        />
        <FormInput
            name="password"
            label="Mot de passe"
            icon={FaLock}
            placeholder="••••••••"
            error={errors.password}
            register={register("password", { required: "Le mot de passe est requis" })}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={togglePasswordVisibility}
        />
    </>
);
export default LoginFields;