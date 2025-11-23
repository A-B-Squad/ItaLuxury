"use client";

import { useMutation } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/app/hooks/useAuth";
import { useProductsInBasketStore } from "@/app/store/zustand";
import { useToast } from "@/components/ui/use-toast";
import {
  ADD_MULTIPLE_TO_BASKET_MUTATION,
  SIGNIN_MUTATION,
} from "@/graphql/mutations";
import {
  auth,
  facebookProvider,
  googleProvider,
} from "@/lib/fireBase/firebase";
import { setToken } from "@/utils/tokens/token";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
  FaUser
} from "react-icons/fa";

// Types 
interface SigninFormData {
  emailOrPhone: string;
  password: string;
}

interface SigninResponse {
  signIn: {
    token: string;
    userId: string
  };
}



interface BasketProduct {
  productId: string;
  quantity: number;
}

interface AddToBasketInput {
  userId: string;
  products: BasketProduct[];
}

// Step 2: Define the Signin component
const Signin: React.FC = () => {
  // Step 3: Set up hooks and state
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { updateToken } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>();
  const { products } = useProductsInBasketStore();

  const [addMultiProductToBasket] = useMutation(
    ADD_MULTIPLE_TO_BASKET_MUTATION
  );

  // Step 4: Set up the signin mutation
  const [SignIn, { loading }] = useMutation<SigninResponse>(SIGNIN_MUTATION, {
    onCompleted: (data: SigninResponse) => {
      setToken(data.signIn.token);
      updateToken(data.signIn.token);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur ita-luxury",
        className: "bg-primaryColor text-white",
      });

      const productsFormat: BasketProduct[] = products.map((product) => {
        return {
          productId: product.id,
          quantity: product.actualQuantity,
        };
      });
      addMultiProductToBasket({
        variables: {
          input: {
            userId: data.signIn.userId,
            products: productsFormat,
          } as AddToBasketInput,
        },
      });

      router.replace("/");
    },
    onError: (error) => {
      // Handle and display error messages
      setErrorMessage(
        error.message === "Invalid email or password"
          ? "Aucun compte n'est associé à cet email"
          : "Une erreur s'est produite. Veuillez réessayer."
      );
    },
  });

  // Step 5: Define form submission handler
  const onSubmit: SubmitHandler<SigninFormData> = (data: SigninFormData): void => {
    SignIn({
      variables: { input: data },

    });
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Proceed with your existing sign-in logic
      SignIn({
        variables: { input: { emailOrPhone: user.email, password: user.uid } },
      });
    } catch (error) {
      console.error("Google login failed:", error);
      setErrorMessage("Échec de la connexion avec Google.");
    }
  };

  const handleFacebookLogin = async (): Promise<void> => {
    try {
      const result: UserCredential = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      SignIn({
        variables: { input: { emailOrPhone: user.email, password: user.uid } },
      });
    } catch (error) {
      console.error("Facebook login failed:", error);
      setErrorMessage("Échec de la connexion avec Facebook.");
    }
  };
  // Step 6: Define password visibility toggle function
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  // Step 7: Render the component
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            className="h-16 w-auto"
            src="/images/logos/LOGO.png"
            alt="ita-luxury"
            width={200}
            height={200}
            priority
          />
        </div>
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connectez-vous à votre compte
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            créez un nouveau compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {errorMessage && (
            <div
              className="mb-4 bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded"
              role="alert"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="emailOrPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse e-mail ou numéro de téléphone
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="emailOrPhone"
                  type="text"
                  autoComplete="email"
                  className={`block w-full pl-10 sm:text-sm py-2 border ${errors.emailOrPhone
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    } rounded-md shadow-sm`}
                  placeholder="vous@exemple.com ou 12345678"
                  {...register("emailOrPhone", {
                    required: "L'email ou le numéro de téléphone est requis",
                    validate: (value: string) => {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      const phoneRegex = /^\d{8}$/;
                      return (
                        emailRegex.test(value) ||
                        phoneRegex.test(value) ||
                        "Format invalide"
                      );
                    },
                  })}
                />
              </div>
              {errors.emailOrPhone && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.emailOrPhone.message as string}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  style={{
                    WebkitAppearance: "none",
                    appearance: "none",
                  }}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  autoComplete="current-password"
                  className={`block w-full pl-10 pr-10 sm:text-sm py-2 border ${errors.password ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    } rounded-md shadow-sm`}
                  {...register("password", {
                    required: "Le mot de passe est requis",
                  })}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <FaEye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link href="/ForgotPassword" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              >
                <FaGoogle className="h-5 w-5 text-red-600" />
                <span className="ml-2">Google</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Vous n'avez pas de compte ?{' '}
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;