"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const CheckoutConfirmationPage = ({ searchParams }: any) => {
  const { packageId, email } = searchParams;
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Merci pour votre commande!</h1>
        <p className="text-gray-700 mb-4">
          Votre numéro de colis est :{" "}
          <span className="font-semibold">{packageId}</span>
        </p>
        <p className="text-gray-700 mb-4">
          Nous avons envoyé un email avec les détails de votre facture à{" "}
          <span className="font-semibold">{email}</span>. Veuillez vérifier
          votre boîte de réception pour plus d'informations.
        </p>
        <p className="text-gray-700 mb-4">
          Nous vous contacterons sous peu pour confirmer votre commande.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-[#202939] text-white px-4 py-2 rounded-lg mt-4"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default CheckoutConfirmationPage;
