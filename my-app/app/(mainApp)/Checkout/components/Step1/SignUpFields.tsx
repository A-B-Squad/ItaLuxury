import {
    FaEnvelope,
    FaLock,
    FaPhone,
    FaUser
} from "react-icons/fa";
import FormInput from "./FormInput";



const SignUpFields = ({ register, errors, showPassword, togglePasswordVisibility }: any) => (
    <>
        <FormInput
            name="fullName"
            label="Nom complet"
            icon={FaUser}
            placeholder="Prénom Nom"
            error={errors.fullName}
            register={register("fullName", { required: "Le nom complet est requis" })}
        />
        <FormInput
            name="email"
            label="Adresse email"
            icon={FaEnvelope}
            type="email"
            placeholder="exemple@email.com"
            error={errors.email}
            register={register("email", { required: "L'email est requis" })}
        />
        <FormInput
            name="number"
            label="Numéro de téléphone"
            icon={FaPhone}
            type="tel"
            placeholder="12 345 678"
            error={errors.number}
            register={register("number", { required: "Le numéro de téléphone est requis" })}
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
export default SignUpFields;