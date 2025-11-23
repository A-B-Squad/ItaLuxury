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
  FaFacebook,
  FaGoogle
} from "react-icons/fa";
import LoginFields from "./LoginFields";
import SignUpFields from "./SignUpFields";

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
  const [addMultiProductToBasket] = useMutation(ADD_MULTIPLE_TO_BASKET_MUTATION);

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { products } = useProductsInBasketStore();
  const { updateToken } = useAuth();

  // Extracted helper functions
  const handleAuthSuccess = (token: string, userId: string) => {
    setToken(token);
    updateToken(token);
    onAuthSuccess?.(userId);
    setIsGuest(false);
    setIsLoggedIn(true);
    setShowLoginForm(false);
    setCurrentStep(2);
  };

  const addProductsToBasket = (userId: string) => {
    const productsFormat = products.map((product) => ({
      productId: product.id,
      quantity: product.actualQuantity,
    }));

    addMultiProductToBasket({
      variables: {
        input: { userId, products: productsFormat },
      },
    });
  };

  const handleSignInSuccess = (data: any) => {
    if (!data.signIn?.token) return;

    handleAuthSuccess(data.signIn.token, data.signIn.userId);
    toast({
      title: "Connexion réussie",
      description: "Vous êtes maintenant connecté.",
      className: "bg-green-600 text-white",
    });
  };

  const handleSignUpSuccess = (data: any) => {
    if (!data.signUp?.token) return;

    addProductsToBasket(data.signUp.user.id);
    handleAuthSuccess(data.signUp.token, data.signUp.user);
    toast({
      title: "Inscription réussie",
      description: "Votre compte a été créé avec succès.",
      className: "bg-green-600 text-white",
    });
  };

  const performSignIn = async (data: any) => {
    await signIn({
      variables: { input: { emailOrPhone: data.emailOrPhone, password: data.password } },
      onCompleted: handleSignInSuccess,
      onError: () => setErrorMessage("Email/téléphone ou mot de passe invalide"),
    });
  };

  const performSignUp = async (data: any) => {
    await signUp({
      variables: {
        input: {
          fullName: data.fullName,
          email: data.email,
          number: data.number,
          password: data.password,
        },
      },
      onCompleted: handleSignUpSuccess,
      onError: (error) => setErrorMessage(`Erreur lors de la création du compte. ${error.message}`),
    });
  };

  const handleAuth = async (data: any) => {
    try {
      if (isLoginMode) {
        await performSignIn(data);
      } else {
        await performSignUp(data);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur d'authentification",
        description: "Une erreur s'est produite lors de l'authentification",
        className: "bg-red-800 text-white",
      });
    }
  };

  const handleSocialSignInSuccess = (data: any, providerName: string) => {
    if (!data.signIn?.token) return;

    addProductsToBasket(data.signIn.user.id);
    handleAuthSuccess(data.signIn.token, data.signIn.user);
    toast({
      title: "Connexion réussie",
      description: `Vous êtes connecté avec ${providerName}.`,
      className: "bg-green-600 text-white",
    });
  };

  const handleSocialAuth = async (provider: any) => {
    const providerName = provider === googleProvider ? "Google" : "Facebook";

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await signIn({
        variables: { input: { emailOrPhone: user.email, password: user.uid } },
        onCompleted: (data) => handleSocialSignInSuccess(data, providerName),
        onError: () => setErrorMessage(`Erreur lors de la connexion avec ${providerName}`),
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(`Échec de connexion avec ${providerName}.`);
    }
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMessage("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getHeaderText = () => ({
    title: isLoginMode ? "Connexion" : "Créer un compte",
    subtitle: isLoginMode
      ? "Connectez-vous pour continuer votre commande"
      : "Inscrivez-vous pour profiter de tous nos avantages"
  });

  const getSubmitButtonText = () => {
    if (isLoginMode) {
      return loadingSignIn ? "Connexion en cours..." : "Se connecter";
    }
    return loadingSignUp ? "Inscription en cours..." : "Créer mon compte";
  };

  const getToggleText = () => {
    if (isLoginMode) {
      return (
        <>
          Pas encore de compte ?{" "}
          <span className="font-semibold text-primaryColor">S'inscrire</span>
        </>
      );
    }
    return (
      <>
        Vous avez déjà un compte ?{" "}
        <span className="font-semibold text-primaryColor">Se connecter</span>
      </>
    );
  };

  const headerText = getHeaderText();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primaryColor to-primaryColor/90 px-8 py-6">
          <h2 className="text-2xl font-bold text-white text-center">
            {headerText.title}
          </h2>
          <p className="text-white/90 text-center mt-2 text-sm">
            {headerText.subtitle}
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
              <LoginFields
                register={register}
                errors={errors}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            ) : (
              <SignUpFields
                register={register}
                errors={errors}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loadingSignUp || loadingSignIn || !isValid}
              className="w-full bg-primaryColor hover:bg-primaryColor/90 text-white py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {getSubmitButtonText()}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-sm text-gray-600 hover:text-primaryColor transition-colors"
            >
              {getToggleText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;