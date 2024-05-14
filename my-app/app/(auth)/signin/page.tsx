"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, gql } from "@apollo/client";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { SIGNIN_MUTATION } from "@/graphql/mutations";

const Signin = () => {
  const { toast } = useToast();

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  

  const [SignIn, { loading }] = useMutation(SIGNIN_MUTATION, {
    variables: {
      input: {
        email: formData.email,
        password: formData.password,
      },
    },
    onCompleted: () => {
      toast({
        title: "Connexion",
        description: "Bienvenue",
        className: "bg-white",
      });
      router.replace("/Home");
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
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="E-mail"
            onChange={(e) => {
              setFormData({
                ...formData,
                email: e.target.value,
              });
            }}
          />
          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Mot de passe"
            onChange={(e) => {
              setFormData({
                ...formData,
                password: e.target.value,
              });
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full text-center py-3 rounded bg-mediumBeige text-white hover:bg-strongBeige focus:outline-none my-1 transition-all"
            onClick={(e) => {
              e.preventDefault();
              SignIn();
            }}
          >
            {loading ? "Chargement..." : "Se Connecter"}
          </button>
        </div>

        <div className="text-grey-dark mt-6">
          Vous n'avez pas un compte?
          <Link
            className="no-underline border-b border-blue text-blue-700"
            href="/signup"
          >
            S'inscrire
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Signin;
