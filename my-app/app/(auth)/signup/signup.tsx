"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ADD_MULTIPLE_TO_BASKET_MUTATION,
  SIGNUP_MUTATION,
} from "@/graphql/mutations";
import "../../globals.css";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaFacebook,
  FaGoogle,
} from "react-icons/fa";
import { useProductsInBasketStore } from "@/app/store/zustand";
import { signInWithPopup } from "firebase/auth";
import {
  googleProvider,
  facebookProvider,
  auth,
} from "@/lib/fireBase/firebase";

interface SignupFormData {
  fullName: string;
  email: string;
  number: string;
  password: string;
}

const Signup: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [socialSignupData, setSocialSignupData] = useState<any>(null);
  const [showPhoneInput, setShowPhoneInput] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SignupFormData>();
  const { products } = useProductsInBasketStore();
  const [addMultiProductToBasket] = useMutation(
    ADD_MULTIPLE_TO_BASKET_MUTATION
  );

  const [signUp, { loading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      const productsFormat = products.map((product) => ({
        productId: product.id,
        quantity: product.actualQuantity,
      }));

      addMultiProductToBasket({
        variables: {
          input: {
            userId: data.signUp.user.id,
            products: productsFormat,
          },
        },
      });
      router.replace("/");
    },
    onError: (error) => {
      if (error.message === "Email address is already in use") {
        setErrorMessage("L'adresse e-mail est déjà utilisée");
        setEmailExists(true);
      } else {
        console.log(error);
        setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
      }
    },
  });

  const onSubmit = (data: SignupFormData) => {
    const signupData = socialSignupData
      ? { ...socialSignupData, number: data.number }
      : data;

    signUp({
      variables: {
        input: signupData,
      },
      onError: (err) => {
        setErrorMessage(`Échec de la connexion ${err.message}.`);
      },
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSocialLogin = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setSocialSignupData({
        fullName: user.displayName,
        email: user.email,
        password: user.uid,
      });

      setValue("fullName", user.displayName || "");
      setValue("email", user.email || "");
      setShowPhoneInput(true);
    } catch (error) {
      setErrorMessage(
        `Échec de la connexion avec ${provider === googleProvider ? "Google" : "Facebook"}.`
      );
    }
  };

  const handleReturnToLogin = () => {
    setShowPhoneInput(false);
    setEmailExists(false);
    setSocialSignupData(null);
    reset();
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex pb-24 flex-col justify-center pt-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto h-16 w-auto"
          src="/LOGO.png"
          alt="ita-luxury"
          width={200}
          height={200}
          priority
        />
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un compte
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Rejoignez-nous pour découvrir nos produits exclusifs
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

          {emailExists ? (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <svg className="h-12 w-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <p className="text-center mb-4 text-gray-700">
                Cette adresse e-mail est déjà utilisée.
              </p>
              <button
                onClick={handleReturnToLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Retour pour se connecter avec une autre adresse e-mail
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {!showPhoneInput && (
                <>
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nom complet
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="fullName"
                        type="text"
                        className={`block w-full pl-10 sm:text-sm py-2 border ${
                          errors.fullName ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        } rounded-md shadow-sm`}
                        placeholder="Nom complet"
                        {...register("fullName", {
                          required: "Le nom complet est requis",
                        })}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Adresse e-mail
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className={`block w-full pl-10 sm:text-sm py-2 border ${
                          errors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        } rounded-md shadow-sm`}
                        placeholder="vous@exemple.com"
                        {...register("email", {
                          required: "L'email est requis",
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email.message}
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
                        className={`block w-full pl-10 pr-10 sm:text-sm py-2 border ${
                          errors.password ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        } rounded-md shadow-sm`}
                        {...register("password", {
                          required: "Le mot de passe est requis",
                          minLength: {
                            value: 8,
                            message:
                              "Le mot de passe doit comporter au moins 8 caractères",
                          },
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                        >
                          {showPassword ? (
                            <FaEyeSlash
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <FaEye className="h-5 w-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Numéro de téléphone
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="flex items-center">
                    <span className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-600 font-medium">
                      +216
                    </span>
                    <input
                      id="number"
                      type="tel"
                      className={`block w-full pl-3 sm:text-sm py-2 border ${
                        errors.number ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      } rounded-r-md shadow-sm`}
                      placeholder="Numéro de téléphone"
                      {...register("number", {
                        required: "Le numéro de téléphone est requis",
                        pattern: {
                          value: /^[0-9]{8}$/,
                          message:
                            "Le numéro de téléphone doit comporter 8 chiffres",
                        },
                      })}
                    />
                  </div>
                </div>
                {errors.number && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.number.message}
                  </p>
                )}
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
                      Création en cours...
                    </div>
                  ) : (
                    "Créer un compte"
                  )}
                </button>
              </div>
            </form>
          )}
          {!showPhoneInput && !emailExists && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Ou continuer avec
                  </span>
                </div>
              </div>
              {/* Sign up Google & Facebook */}
              <div className="mt-6 grid grid-cols-1 gap-3">
                {/* <button
                  onClick={() => handleSocialLogin(facebookProvider)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <FaFacebook className="h-5 w-5 text-blue-600" />
                  <span className="ml-2">Facebook</span>
                </button> */}
                <button
                  onClick={() => handleSocialLogin(googleProvider)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                >
                  <FaGoogle className="h-5 w-5 text-red-600" />
                  <span className="ml-2">Google</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              En vous inscrivant, vous acceptez nos{" "}
              <Link
                href="/Terms-of-use"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Conditions d'Utilisation
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
