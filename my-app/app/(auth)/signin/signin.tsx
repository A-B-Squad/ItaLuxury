"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { SIGNIN_MUTATION } from "@/graphql/mutations";
import { useForm } from "react-hook-form";

const Signin = () => {
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [SignIn, { loading }] = useMutation(SIGNIN_MUTATION, {
    onCompleted: () => {
      toast({
        title: "Connexion",
        description: "Bienvenue",
        className: "bg-strongBeige text-white",
      });
      router.replace("/");
    },
    onError: (error) => {
      if (error) {
        setIsError(true);
        if (error.message === "Invalid email or password") {
          setErrorMessage("Email ou mot de passe invalide");
        } else if (error.message === "Invalid password") {
          setErrorMessage("Mot de passe invalide");
        }
      }
    },
  });

  const onSubmit = (data: any) => {
    SignIn({ variables: { input: data } });
  };

  return (
    <div className="bg-lightBeige min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Se Connecter</h1>
          {isError && (
            <div
              id="alert-border-2"
              className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-800 dark:bg-red-200 dark:border-red-800"
              role="alert"
            >
              <svg
                className="flex-shrink-0 w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <div className="ms-3 text-sm font-medium">{errorMessage}</div>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              className="block border  border-grey-light w-full p-3 rounded mb-4"
              placeholder="E-mail"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message as string}
              </p>
            )}
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              placeholder="Mot de passe"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message as string}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-center py-3 rounded bg-mediumBeige text-white hover:bg-strongBeige focus:outline-none my-1 transition-all"
            >
              {loading ? "Chargement..." : "Se Connecter"}
            </button>
          </form>
        </div>

        <div className="text-grey-dark mt-6">
          Vous n'avez pas un compte ?{" "}
          <Link
            className="no-underline border-b text-sm border-blue text-blue-700"
            href="/signup"
          >
            S'inscrire
          </Link>
          .
          <br />
          Mot de passe oublié ?{" "}
          <Link
            className="no-underline text-sm border-b border-blue text-blue-700"
            href="/forgotPassword"
          >
            Changer mot de passe
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Signin;
