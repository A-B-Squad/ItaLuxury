"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useToast } from "@/components/ui/use-toast";
import { RESET_PASSWORD_MUTATION } from "@/graphql/mutations";

const ResetPassword = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setIsError(true);
      setErrorMessage(
        "Le mot de passe et la confirmation du mot de passe doivent être identiques !",
      );
    } else {
      resetPassword({
        variables: {
          password,
          resetPasswordId: params?.id,
        },
        onCompleted: () => {
          router.replace("/signin");
        },
        onError: (error) => {
          console.error(error);
        },
      });
    }
  };

  return (
    <div className="bg-lightBeige min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">
            Réinitialiser mot de passe
          </h1>
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
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Tapez votre mot de passe"
          />
          <input
            type="password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="confirm-password"
            placeholder="Confirmer votre mot de passe"
          />

          <button
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

export default ResetPassword;
