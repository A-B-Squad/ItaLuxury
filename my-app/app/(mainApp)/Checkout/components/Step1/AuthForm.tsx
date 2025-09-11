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
}

const AuthForm: React.FC<AuthFormProps> = ({
  setCurrentStep,
  setShowLoginForm,
  setIsLoggedIn,
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

  const [addMultiProductToBasket] = useMutation(
    ADD_MULTIPLE_TO_BASKET_MUTATION,
  );
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAuth = async (data: any) => {
    try {
      if (isLoginMode) {
        const loginData = {
          emailOrPhone: data.emailOrPhone,
          password: data.password,
        };

        await signIn({
          variables: { input: loginData },
          onCompleted: (data) => {
            if (data.signIn?.token) {
              setIsLoggedIn(true);
              setShowLoginForm(false);
              setCurrentStep(2);
              toast({
                title: "Login Successful",
                description: "You have been logged in successfully.",
                className: "bg-green-600 text-white",
              });
            }
          },
          onError: (error) => {
            console.log(error);
            setErrorMessage("Invalid email/phone or password");
          },
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
              setIsLoggedIn(true);
              setShowLoginForm(false);
              setCurrentStep(2);
              toast({
                title: "Sign Up Successful",
                description: "Your account has been created successfully.",
                className: "bg-green-600 text-white",
              });
            }
          },
          onError: (error) => {
            console.log(error.message);
            setErrorMessage(`Error creating account. ${error.message}`);
          },
        });
      }
    } catch (err) {
      toast({
        title: "Authentication Error",
        description: "An error occurred during authentication",
        className: "bg-red-800 text-white",
      });
    }
  };

  const handleSocialAuth = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Use the same signIn mutation for both Google and Facebook
      await signIn({
        variables: { input: { emailOrPhone: user.email, password: user.uid } },
        onCompleted: (data) => {
          if (data.signIn?.token) {
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
            setIsLoggedIn(true);
            setShowLoginForm(false);
            toast({
              title: "Login Successful",
              description: `You have been logged in successfully with ${provider === googleProvider ? "Google" : "Facebook"}.`,
              className: "bg-green-600 text-white",
            });
            setCurrentStep(2);
          }
          window.location.reload();
        },
        onError: (error) => {
          setErrorMessage(
            `Error logging in with ${provider === googleProvider ? "Google" : "Facebook"}`,
          );
        },
      });
    } catch (err) {
      setErrorMessage(
        `Failed to login with ${provider === googleProvider ? "Google" : "Facebook"}.`,
      );
    }
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMessage("");
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {errorMessage && (
          <div
            className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(handleAuth)} className="mb-4">
          {" "}
          {isLoginMode ? (
            <div className="space-y-7">
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
                    className={`block w-full pl-10 	 pr-10 sm:text-sm outline-none py-2 border-gray-300 rounded-md ${errors.password ? "border-red-300" : ""
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
            </div>
          ) : (
            <>
              {/* Full Name field */}
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
                    className={`block w-full pl-10 sm:text-sm py-2 border-gray-300 outline-none rounded-md ${errors.fullName ? "border-red-300" : ""}`}
                    placeholder="nom"
                    {...register("fullName", {
                      required: "Le nom complet est requis",
                    })}
                  />
                </div>
                {errors.fullname && (
                  <p className="text-red-500">
                    {errors.fullname.message as string}
                  </p>
                )}
              </div>

              {/* Email field */}
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
                    className={`block w-full pl-10 sm:text-sm border-gray-300 py-2 outline-none rounded-md ${errors.email ? "border-red-300" : ""}`}
                    placeholder="vous@exemple.com"
                    {...register("email", { required: "L'email est requis" })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
              {/* Phone number field */}

              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Numéro de téléphone
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="number"
                    type="tel"
                    className={`block w-full pl-10 sm:text-sm border-gray-300 outline-none py-2 rounded-md ${errors.number ? "border-red-300" : ""}`}
                    placeholder="+216 12 345 678"
                    {...register("number", {
                      required: "Le numéro de téléphone est requis",
                    })}
                  />
                </div>
                {errors.number && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.number.message as string}
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
                    className={`block w-full pl-10 	 pr-10 sm:text-sm outline-none py-2 border-gray-300 rounded-md ${errors.password ? "border-red-300" : ""
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
            </>
          )}
          <button
            type="submit"
            disabled={loadingSignUp || loadingSignIn || !isValid}
            className="w-full bg-primaryColor text-white p-2 rounded mb-2"
          >
            {isLoginMode
              ? loadingSignIn
                ? "Chargement..."
                : "Log In"
              : loadingSignUp
                ? "Chargement..."
                : "Sign Up"}
          </button>
        </form>
        {/* Social Login Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialAuth(facebookProvider)}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaFacebook className="h-5 w-5 text-blue-600" />
            <span className="ml-2">Facebook</span>
          </button>
          <button
            onClick={() => handleSocialAuth(googleProvider)}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaGoogle className="h-5 w-5 text-red-600" />
            <span className="ml-2">Google</span>
          </button>
        </div>

        <button
          type="button"
          onClick={toggleAuthMode}
          className="w-full bg-secondaryColor text-white p-2 rounded mt-4"
        >
          {isLoginMode ? "Switch to Sign Up" : "Switch to Log In"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
