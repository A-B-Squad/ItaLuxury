import { useAuth } from "@/app/hooks/useAuth";
import { useProductsInBasketStore } from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import {
  ADD_MULTIPLE_TO_BASKET_MUTATION,
  SIGNIN_MUTATION,
  SIGNUP_MUTATION,
} from "@/graphql/mutations";
import {
  auth,
  facebookProvider,
  googleProvider,
} from "@/lib/fireBase/firebase";
import { setToken } from "@/utils/tokens/token";
import { useMutation } from "@apollo/client";
import { signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaFacebook,
  FaGoogle,
  FaLock,
  FaPhone,
  FaUser,
} from "react-icons/fa";

interface AuthFormProps {
  setCurrentStep: (step: number) => void;
  setShowLoginForm: (show: boolean) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  onAuthSuccess?: (userData: any) => void;
  setIsGuest: (isGuest: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  setCurrentStep,
  setShowLoginForm,
  setIsLoggedIn,
  onAuthSuccess,
  setIsGuest
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();
  const { toast } = useToast();

  const [signIn, { loading: loadingSignIn }] = useMutation(SIGNIN_MUTATION);
  const [signUp, { loading: loadingSignUp }] = useMutation(SIGNUP_MUTATION);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { products } = useProductsInBasketStore();
  const { updateToken } = useAuth();

  const [addMultiProductToBasket] = useMutation(ADD_MULTIPLE_TO_BASKET_MUTATION);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAuthSuccess = (token: string, userId: string) => {
    setToken(token);
    updateToken(token);

    if (onAuthSuccess) {
      onAuthSuccess(userId);
    }
    setIsGuest(false);
    setIsLoggedIn(true);
    setShowLoginForm(false);
    setCurrentStep(2);
  };

  const handleAuth = async (data: any) => {
    try {
      if (isLoginMode) {
        await signIn({
          variables: { input: { emailOrPhone: data.emailOrPhone, password: data.password } },
          onCompleted: (data) => {
            if (data.signIn?.token) {
              handleAuthSuccess(data.signIn.token, data.signIn.userId);
              toast({
                title: "Connexion réussie",
                description: "Vous êtes maintenant connecté.",
                className: "bg-green-600 text-white",
              });
            }
          },
          onError: () => setErrorMessage("Email/téléphone ou mot de passe invalide"),
        });
      } else {
        await signUp({
          variables: {
            input: {
              fullName: data.fullName,
              email: data.email,
              number: data.number,
              password: data.password,
            },
          },
          onCompleted: (data) => {
            if (data.signUp?.token) {
              const productsFormat = products.map((product) => ({
                productId: product.id,
                quantity: product.actualQuantity,
              }));

              addMultiProductToBasket({
                variables: {
                  input: { userId: data.signUp.user.id, products: productsFormat },
                },
              });

              handleAuthSuccess(data.signUp.token, data.signUp.user);
              toast({
                title: "Inscription réussie",
                description: "Votre compte a été créé avec succès.",
                className: "bg-green-600 text-white",
              });
            }
          },
          onError: (error) => setErrorMessage(`Erreur lors de la création du compte. ${error.message}`),
        });
      }
    } catch (err) {
      toast({
        title: "Erreur d'authentification",
        description: "Une erreur s'est produite lors de l'authentification",
        className: "bg-red-800 text-white",
      });
    }
  };

  const handleSocialAuth = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await signIn({
        variables: { input: { emailOrPhone: user.email, password: user.uid } },
        onCompleted: (data) => {
          if (data.signIn?.token) {
            const productsFormat = products.map((product) => ({
              productId: product.id,
              quantity: product.actualQuantity,
            }));

            addMultiProductToBasket({
              variables: {
                input: { userId: data.signIn.user.id, products: productsFormat },
              },
            });

            handleAuthSuccess(data.signIn.token, data.signIn.user);
            toast({
              title: "Connexion réussie",
              description: `Vous êtes connecté avec ${provider === googleProvider ? "Google" : "Facebook"}.`,
              className: "bg-green-600 text-white",
            });
          }
        },
        onError: () => setErrorMessage(`Erreur lors de la connexion avec ${provider === googleProvider ? "Google" : "Facebook"}`),
      });
    } catch (err) {
      setErrorMessage(`Échec de connexion avec ${provider === googleProvider ? "Google" : "Facebook"}.`);
    }
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMessage("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primaryColor to-primaryColor/90 px-8 py-6">
          <h2 className="text-2xl font-bold text-white text-center">
            {isLoginMode ? "Connexion" : "Créer un compte"}
          </h2>
          <p className="text-white/90 text-center mt-2 text-sm">
            {isLoginMode
              ? "Connectez-vous pour continuer votre commande"
              : "Inscrivez-vous pour profiter de tous nos avantages"}
          </p>
        </div>

        <div className="px-8 py-6">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialAuth(googleProvider)}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-sm"
            >
              <FaGoogle className="text-xl text-red-500" />
              <span>Continuer avec Google</span>
            </button>

            <button
              onClick={() => handleSocialAuth(facebookProvider)}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-sm"
            >
              <FaFacebook className="text-xl text-blue-600" />
              <span>Continuer avec Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou par email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleAuth)} className="space-y-4">
            {isLoginMode ? (
              <>
                {/* Login Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ou Téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-12 pr-4 py-3 border ${errors.emailOrPhone ? "border-red-300" : "border-gray-300"
                        } rounded-xl outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all`}
                      placeholder="exemple@email.com ou 12345678"
                      {...register("emailOrPhone", {
                        required: "Ce champ est requis",
                        validate: (value) => {
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          const phoneRegex = /^[0-9]{8}$/;
                          return emailRegex.test(value) || phoneRegex.test(value) || "Format invalide";
                        },
                      })}
                    />
                  </div>
                  {errors.emailOrPhone && (
                    <p className="mt-2 text-sm text-red-600">{errors.emailOrPhone.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`block w-full pl-12 pr-12 py-3 border ${errors.password ? "border-red-300" : "border-gray-300"
                        } rounded-xl outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all`}
                      placeholder="••••••••"
                      {...register("password", { required: "Le mot de passe est requis" })}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message as string}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Sign Up Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-12 pr-4 py-3 border ${errors.fullName ? "border-red-300" : "border-gray-300"
                        } rounded-xl outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all`}
                      placeholder="Prénom Nom"
                      {...register("fullName", { required: "Le nom complet est requis" })}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">{errors.fullName.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className={`block w-full pl-12 pr-4 py-3 border ${errors.email ? "border-red-300" : "border-gray-300"
                        } rounded-xl outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all`}
                      placeholder="exemple@email.com"
                      {...register("email", { required: "L'email est requis" })}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      className={`block w-full pl-12 pr-4 py-3 border ${errors.number ? "border-red-300" : "border-gray-300"
                        } rounded-xl outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all`}
                      placeholder="12 345 678"
                      {...register("number", { required: "Le numéro de téléphone est requis" })}
                    />
                  </div>
                  {errors.number && (
                    <p className="mt-2 text-sm text-red-600">{errors.number.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`block w-full pl-12 pr-12 py-3 border ${errors.password ? "border-red-300" : "border-gray-300"
                        } rounded-xl outline-none focus:ring-2 focus:ring-primaryColor/20 focus:border-primaryColor transition-all`}
                      placeholder="••••••••"
                      {...register("password", { required: "Le mot de passe est requis" })}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password.message as string}</p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loadingSignUp || loadingSignIn || !isValid}
              className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoginMode
                ? loadingSignIn
                  ? "Connexion en cours..."
                  : "Se connecter"
                : loadingSignUp
                  ? "Inscription en cours..."
                  : "Créer mon compte"}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-sm text-gray-600 hover:text-primaryColor transition-colors"
            >
              {isLoginMode ? (
                <>
                  Pas encore de compte ?{" "}
                  <span className="font-semibold text-primaryColor">S'inscrire</span>
                </>
              ) : (
                <>
                  Vous avez déjà un compte ?{" "}
                  <span className="font-semibold text-primaryColor">Se connecter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;