"use client";
import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useProductsInBasketStore } from "../../store/zustand";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SIGNUP_MUTATION } from "../../../graphql/mutations";

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const { products, clearBasket } = useProductsInBasketStore((state) => ({
  //   products: state.products,
  //   clearBasket: state.clearBasket,
  // }));

  const [signUp, { loading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      router.replace("/Home");
    },
    onError: (error) => {
      setIsError(true);
      if (error.message === "Email address is already in use") {
        setErrorMessage("L'adresse e-mail est déjà utilisée");
      } else {
        console.log(error);
      }
    },
  });

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      setIsError(true);
    } else {
      signUp({
        variables: {
          input: {
            fullName: data.fullName,
            email: data.email,
            number: data.number,
            password: data.password,
          },
        },
      });
    }
  };

  return (
    <div className="bg-lightBeige min-h-screen flex flex-col">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center">S'inscrire</h1>
          {isError && (
            <div
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
              className="block border border-grey-light w-full p-3 rounded mb-4"
              placeholder="Nom et prénom"
              {...register("fullName", { required: true })}
            />
            {errors.fullName && <span>Ce champ est requis.</span>}
            <input
              type="email"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              placeholder="E-mail"
              {...register("email", { required: true })}
            />
            {errors.email && <span>Ce champ est requis.</span>}
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              placeholder="Téléphone"
              {...register("number", { required: true })}
            />
            {errors.number && <span>Ce champ est requis.</span>}
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              placeholder="Mot de passe"
              {...register("password", { required: true, minLength: 8 })}
            />
            {errors.password && errors.password.type === "required" && (
              <span>Ce champ est requis.</span>
            )}
            {errors.password && errors.password.type === "minLength" && (
              <span>Le mot de passe doit comporter au moins 8 caractères.</span>
            )}
            <input
              type="password"
              className="block border border-grey-light w-full p-3 rounded mb-4"
              placeholder="Confirmer votre mot de passe"
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && <span>Ce champ est requis.</span>}
            <button
              type="submit"
              className="w-full text-center py-3 rounded bg-mediumBeige text-white hover:bg-strongBeige focus:outline-none my-1 transition-all"
              disabled={loading}
            >
              {loading ? "Chargement..." : "Créer un compte"}
            </button>
          </form>
          <div className="text-center text-sm text-grey-dark mt-4">
            <p className="no-underline border-b border-grey-dark">
              En vous inscrivant, vous acceptez de vous conformer à nos{" "}
              <span className="font-bold">Conditions d'Utilisation</span>.
            </p>
          </div>
        </div>

        <div className="text-grey-dark mt-4 mb-4">
          Vous avez déjà un compte?{" "}
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
