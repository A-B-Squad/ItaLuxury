"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, gql } from "@apollo/client";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    number: "",
    password: "",
  });
  const SIGNUP_MUTATION = gql`
    mutation SignUp($input: SignUpInput!) {
      signUp(input: $input) {
        user {
          fullName
          email
        }
        token
      }
    }
  `;

  const [SignUp, { loading }] = useMutation(SIGNUP_MUTATION, {
    variables: {
      input: {
        fullName: formData.fullName,
        email: formData.email,
        number: formData.number,
        password: formData.number,
      },
    },
    onCompleted: (data) => {
      // router.push("/");
    },
    onError: (error) => {
      setIsError(true);
      if (error.message === "Email address is already in use") {
        setErrorMessage("L'adresse e-mail est déjà utilisée");
      } else {
        console.log("====================================");
        console.log(error);
        console.log("====================================");
      }
    },
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setErrorMessage("Le mot de passe doit comporter au moins 8 caractères");
      setIsError(true);
    } else if (
      !formData.fullName ||
      !formData.number ||
      !formData.password ||
      !formData.email
    ) {
      setErrorMessage("Veuillez remplir tous les champs");
      setIsError(true);
    } else if (formData.password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      setIsError(true);
    } else {
      SignUp();
    }
  };

  return (
    <div className="bg-lightBeige min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">S'inscrire</h1>
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
            name="fullname"
            placeholder="Nom et prénom"
            onChange={(e) => {
              setFormData({
                ...formData,
                fullName: e.target.value,
              });
            }}
          />

          <input
            type="email"
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
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="number"
            placeholder="Téléphone"
            onChange={(e) => {
              setFormData({
                ...formData,
                number: e.target.value,
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
          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="confirm"
            placeholder="Confirmer votre mot de passe"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />

          <button
            type="submit"
            className="w-full text-center py-3 rounded bg-mediumBeige text-white hover:bg-strongBeige focus:outline-none my-1 transition-all"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Chargement..." : "Créer un compte"}
          </button>

          <div className="text-center text-sm text-grey-dark mt-4">
            En vous inscrivant, vous acceptez les
            <a
              className="no-underline border-b border-grey-dark text-grey-dark"
              href="#"
            >
              {" "}
              Conditions d'utilisation
            </a>{" "}
            et
            <a
              className="no-underline border-b border-grey-dark text-grey-dark"
              href="#"
            >
              {" "}
              politique de confidentialité
            </a>
          </div>
        </div>

        <div className="text-grey-dark mt-4 mb-4">
          Vous avez déjà un compte?
          <Link
            className="no-underline border-b border-blue text-blue-700"
            href="/signin"
          >
            Se connecter
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Signup;
