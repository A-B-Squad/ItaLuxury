"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import "../../globals.css";

import { useToast } from "@/components/ui/use-toast";
import {
  ADD_MULTIPLE_TO_BASKET_MUTATION,
  SIGNIN_MUTATION,
} from "@/graphql/mutations";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
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

// Step 2: Define the Signin component
const Signin = () => {
  // Step 3: Set up hooks and state
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { products } = useProductsInBasketStore();

  const [addMultiProductToBasket] = useMutation(
    ADD_MULTIPLE_TO_BASKET_MUTATION
  );

  // Step 4: Set up the signin mutation
  const [SignIn, { loading }] = useMutation(SIGNIN_MUTATION);

  // Step 5: Define form submission handler
  const onSubmit = (data: any) => {
    SignIn({
      variables: { input: data },

      onCompleted: (data) => {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur ita-luxury",
          className: "bg-primaryColor text-white",
        });

        const productsFormat = products.map((product) => {
          return {
            productId: product.id,
            quantity: product.actualQuantity,
          };
        });

        addMultiProductToBasket({
          variables: {
            input: {
              userId: data.signIn.user.id,
              products: productsFormat,
            },
          },
        });

        router.replace("/");
      },
      onError: (error) => {
        // Handle and display error messages
        setErrorMessage(
          error.message === "Invalid email or password"
            ? "Email ou mot de passe invalide"
            : "Une erreur s'est produite. Veuillez réessayer."
        );
      },
    });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Proceed with your existing sign-in logic
      SignIn({
        variables: { input: { emailOrPhone: user.email, password: user.uid } },
        onCompleted: (data) => {
          // Show success toast and redirect to home page
          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur ita-luxury",
            className: "bg-primaryColor text-white",
          });

          const productsFormat = products.map((product) => {
            return {
              productId: product.id,
              quantity: product.actualQuantity,
            };
          });

          addMultiProductToBasket({
            variables: {
              input: {
                userId: data.signIn.user.id,
                products: productsFormat,
              },
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
    } catch (error) {
      console.log(error);

      setErrorMessage("Échec de la connexion avec Google.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      // Proceed with your existing sign-in logic
      SignIn({
        variables: { input: { emailOrPhone: user.email, password: user.uid } },
        onCompleted: (data) => {
          // Show success toast and redirect to home page
          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur ita-luxury",
            className: "bg-primaryColor text-white",
          });

          const productsFormat = products.map((product) => {
            return {
              productId: product.id,
              quantity: product.actualQuantity,
            };
          });

          addMultiProductToBasket({
            variables: {
              input: {
                userId: data.signIn.user.id,
                products: productsFormat,
              },
            },
          });

          router.replace("/");
        },
        onError: (error) => {
          // Handle and display error messages
          console.log(error);

          setErrorMessage(
            error.message === "Invalid email or password"
              ? "Aucun compte n'est associé à cet email"
              : "Une erreur s'est produite. Veuillez réessayer."
          );
        },
      });
    } catch (error) {
      setErrorMessage("Échec de la connexion avec Facebook.");
    }
  };

  // Step 6: Define password visibility toggle function
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Step 7: Render the component
  return (
    <div className="bg-gray-100 pb-24 min-h-screen flex flex-col justify-center pt-12 sm:px-6 lg:px-8">
      {/* Step 7.1: Render logo and title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto"
          src="/LOGO.png"
          alt="ita-luxury"
          width={200}
          height={200}
        />
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connectez-vous à votre compte
        </h1>
      </div>

      {/* Step 7.2: Render form container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Step 7.3: Display error message if present */}
          {errorMessage && (
            <div
              className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          {/* Step 7.4: Render form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Step 7.4.1: Email input field */}
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
                  className={`block w-full pl-10 sm:text-sm outline-none py-2 border-gray-300 rounded-md ${errors.emailOrPhone ? "border-red-300" : ""
                    }`}
                  placeholder="vous@exemple.com ou 12345678"
                  {...register("emailOrPhone", {
                    required: "L'email ou le numéro de téléphone est requis",
                    validate: (value) => {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      const phoneRegex = /^[0-9]{8}$/;
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
            {/* Step 7.4.2: Password input field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm 	 font-medium text-gray-700"
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
                  className={`block w-full pl-10 pr-10 sm:text-sm  outline-none py-2 border-gray-300 rounded-md ${errors.password ? "border-red-300" : ""
                    }`}
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

            {/* Step 7.4.3: Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? "Chargement..." : "Se connecter"}
              </button>
            </div>
          </form>
          {/* Google and Facebook Login Buttons */}

          <div className="mt-6 grid grid-cols-1 gap-3">
            {/* <button
              onClick={handleFacebookLogin}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaFacebook className="h-5 w-5 text-blue-600" />
              <span className="ml-2">Facebook</span>
            </button> */}
            <button
              onClick={handleGoogleLogin}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <FaGoogle className="h-5 w-5 text-red-600" />
              <span className="ml-2">Google</span>
            </button>
          </div>

          {/* Step 7.5: Render additional links */}
          <div className="mt-6 flex flex-col space-y-2 text-center text-sm">
            <p className="text-gray-600">
              Vous n'avez pas de compte ?{" "}
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                S'inscrire
              </Link>
            </p>
            <p className="text-gray-600">
              <Link
                href="/ForgotPassword"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Mot de passe oublié ?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
