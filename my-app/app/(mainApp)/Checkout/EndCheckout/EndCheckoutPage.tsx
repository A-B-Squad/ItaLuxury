"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaHome, FaShoppingBag } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { UPDATE_STATUS_PAYMENT_ONLINE_MUTATION } from "@/graphql/mutations";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import Image from "next/image";

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
  const [updatePaymentStatus, { loading }] = useMutation(
    UPDATE_STATUS_PAYMENT_ONLINE_MUTATION,
  );
  const { toast } = useToast();
  const [mutationSent, setMutationSent] = useState(false);

  const isPayed =
    status?.toUpperCase() === "PAYED_NOT_DELIVERED" || status === undefined;

  useEffect(() => {
    const sendMutation = async () => {
      if (status && !mutationSent) {
        const localStorageKey = `mutation_sent_${packageId}`;
        const isMutationSent = localStorage.getItem(localStorageKey);

        if (!isMutationSent) {
          try {
            await updatePaymentStatus({
              variables: {
                packageId: packageId,
                paymentStatus: status.toUpperCase(),
              },
            });
            console.log("Payment status updated successfully");
            localStorage.setItem(localStorageKey, "true");
            setMutationSent(true);
          } catch (err) {
            console.error("Error updating payment status:", err);

            toast({
              title: "Erreur",
              description: "Impossible de mettre à jour le statut du paiement. Veuillez contacter le support.",
              variant: "destructive",
            });
          }
        } else {
          console.log("Mutation already sent for this package");
          setMutationSent(true);
        }
      }
    };

    sendMutation();
  }, [status, packageId, updatePaymentStatus, mutationSent, toast]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-6">
          <Image 
            src="/LOGO.jpg" 
            alt="ITA Luxury Logo" 
            width={120} 
            height={60} 
            className="mx-auto mb-4"
          />
        </div>
        
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-primaryColor text-white py-4 px-6">
            <h1 className="text-xl font-bold">
              {isPayed ? "Confirmation de commande" : "Échec du paiement"}
            </h1>
          </div>
          
          <div className="p-8">
            {isPayed ? (
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <FaCheckCircle className="text-green-500 text-4xl" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Merci pour votre commande!
                </h2>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Numéro de commande</p>
                    <p className="text-lg font-semibold text-gray-800">{packageId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-lg font-semibold text-gray-800">{email}</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-left mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-700">
                        Nous avons envoyé un email avec les détails de votre facture à l'adresse indiquée.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-700">
                        Notre équipe vous contactera sous peu pour confirmer votre commande et organiser la livraison.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">3</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-700">
                        Vous pouvez suivre l'état de votre commande dans votre espace client.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                    <FaTimesCircle className="text-red-500 text-4xl" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Paiement refusé
                </h2>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Numéro de référence</p>
                    <p className="text-lg font-semibold text-gray-800">{packageId}</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-left mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-bold">!</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-700">
                        Nous sommes désolés, mais votre paiement n'a pas pu être traité.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-bold">?</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-700">
                        Veuillez vérifier vos informations de paiement et réessayer, ou contactez notre service client pour obtenir de l'aide.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button
                onClick={() => router.push("/")}
                className="flex items-center justify-center gap-2 bg-primaryColor text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition duration-300 w-full sm:w-auto"
              >
                <FaHome /> Retour à l'accueil
              </button>
              
              {isPayed && (
                <Link
                  href="/TrackingPackages"
                  className="flex items-center justify-center gap-2 border border-primaryColor text-primaryColor px-6 py-3 rounded-md hover:bg-gray-50 transition duration-300 w-full sm:w-auto"
                >
                  <FaShoppingBag /> Mes commandes
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Pour toute question, contactez notre service client au +216 23 212 892</p>
          <p className="mt-2">© {new Date().getFullYear()} ITA Luxury. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmationPage;
