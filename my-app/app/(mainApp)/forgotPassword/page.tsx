"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD_MUTATION } from "@/graphql/mutations";
import { useToast } from "@/components/ui/use-toast";

const ForgotPassword = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [ForgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    ForgotPassword({
      variables: {
        email,
      },
      onCompleted: (data) => {

        toast({
          title: "E-mail envoyé",
          description: "E-mail envoyé avec succeés",
          className: "bg-primaryColor text-white",
        });
      },
      onError: (error) => {
        setIsError(true);
        setErrorMessage("E-mail n'existe pas !");
        console.log(error);
      },
    });
  };

  return (
    <div className="bg-lightBeige min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">Mot de passe oublié</h1>
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
            type="email"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Tapez votre e-mail"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-center py-3 rounded bg-secondaryColor text-white hover:bg-primaryColor focus:outline-none my-1 transition-all"
          >
            {loading ? "Chargement..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
