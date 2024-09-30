"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { UPDATE_STATUS_PAYMENT_ONLINE_MUTATION } from "@/graphql/mutations";

interface SearchParams {
  packageId: string;
  email: string;
  status: string;
}

const CheckoutConfirmationPage: React.FC<{ searchParams: SearchParams }> = ({
  searchParams,
}) => {
  const { packageId, email, status } = searchParams;
  const router = useRouter();
  const [updatePaymentStatus] = useMutation(
    UPDATE_STATUS_PAYMENT_ONLINE_MUTATION,
  );
  const [error, setError] = useState<string | null>(null);

  const isPayed = status?.toUpperCase() === "PAYED_NOT_DELIVERED";

  useEffect(() => {
    const sendMutation = async () => {
      if (status) {
        try {
          await updatePaymentStatus({
            variables: {
              packageId: packageId,
              paymentStatus: status.toUpperCase(),
            },
          });
          console.log("Payment status updated successfully");
        } catch (err) {
          console.error("Error updating payment status:", err);
          setError("Failed to update payment status. Please contact support.");
        }
      }
    };

    sendMutation();
  }, [status, packageId, updatePaymentStatus]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-xl w-full">
        {isPayed ? (
          <>
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">
              Merci pour votre commande!
            </h1>
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
          </>
        ) : (
          <>
            <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Paiement refusé</h1>
            <p className="text-gray-700 mb-4">
              Nous sommes désolés, mais votre paiement n'a pas pu être traité.
            </p>
            <p className="text-gray-700 mb-4">
              Veuillez vérifier vos informations de paiement et réessayer, ou
              contactez notre service client pour obtenir de l'aide.
            </p>
            <p className="text-gray-700 mb-4">
              Numéro de référence :{" "}
              <span className="font-semibold">{packageId}</span>
            </p>
          </>
        )}
        <button
          onClick={() => router.push("/")}
          className="bg-[#202939] text-white px-6 py-2 rounded-lg mt-4 hover:bg-[#2c3a4f] transition duration-300"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default CheckoutConfirmationPage;
