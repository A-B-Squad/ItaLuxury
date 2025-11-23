"use client";
import { useToast } from "@/components/ui/use-toast";
import { UPDATE_STATUS_PAYMENT_ONLINE_MUTATION } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaHome,
  FaShoppingBag,
  FaTimesCircle,
  FaEnvelope,
  FaPhone,
  FaBox,
  FaExclamationTriangle,
} from "react-icons/fa";

interface SearchParams {
  packageId: string;
  status: string;
}

const EndCheckoutPage: React.FC<{ searchParams: SearchParams }> = ({
  searchParams,
}) => {
  const { packageId, status } = searchParams;
  const router = useRouter();
  const [updatePaymentStatus] = useMutation(UPDATE_STATUS_PAYMENT_ONLINE_MUTATION);
  const { toast } = useToast();
  const [mutationSent, setMutationSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isPayed = status?.toUpperCase() === "PAYED_NOT_DELIVERED" || status === undefined;

  useEffect(() => {
    const sendMutation = async () => {
      if (status && !mutationSent) {
        const localStorageKey = `mutation_sent_${packageId}`;
        const isMutationSent = localStorage.getItem(localStorageKey);

        if (isMutationSent) {

          setMutationSent(true);

        } else {
          try {
            await updatePaymentStatus({
              variables: {
                packageId: packageId,
                paymentStatus: status.toUpperCase(),
              },
            });
            localStorage.setItem(localStorageKey, "true");
            setMutationSent(true);
          } catch (err) {
            console.error("Error updating payment status:", err);
            toast({
              title: "Erreur",
              description: "Impossible de mettre à jour le statut. Veuillez contacter le support.",
              variant: "destructive",
            });
          }
        }
      }
      setIsLoading(false);
    };

    sendMutation();
  }, [status, packageId, updatePaymentStatus, mutationSent, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primaryColor border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Traitement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logos/LOGO.png"
            alt="ITA Luxury Logo"
            width={140}
            height={70}
            className="mx-auto"
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div
            className={`${isPayed
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-red-500 to-red-600"
              } px-8 py-6 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <h1 className="text-2xl font-bold text-white">
                {isPayed ? "Commande Confirmée" : "Paiement Échoué"}
              </h1>
              <p className="text-white/90 mt-1">
                {isPayed
                  ? "Votre commande a été enregistrée avec succès"
                  : "Votre paiement n'a pas pu être traité"}
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            {isPayed ? (
              <>
                {/* Success Content */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
                    <FaCheckCircle className="text-green-600 text-5xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Merci pour votre confiance !
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Nous avons bien reçu votre commande et nous la préparons avec soin.
                  </p>
                </div>

                {/* Order Details */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primaryColor/10 rounded-xl flex items-center justify-center">
                        <FaBox className="text-primaryColor text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Numéro de commande</p>
                        <p className="text-lg font-bold text-gray-900 break-all">{packageId}</p>
                      </div>
                    </div>


                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-6 mb-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Prochaines étapes</h3>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Confirmation par email</h4>
                      <p className="text-gray-600">
                        Un email avec tous les détails de votre commande vous a été envoyé à l'adresse indiquée.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Préparation de votre commande</h4>
                      <p className="text-gray-600">
                        Notre équipe prépare votre commande avec soin et vous contactera pour confirmer la livraison.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Suivi de livraison</h4>
                      <p className="text-gray-600">
                        Suivez l'état de votre commande en temps réel depuis votre espace client.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.push("/")}
                    className="flex-1 flex items-center justify-center gap-3 bg-gray-100 text-gray-800 px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                  >
                    <FaHome className="text-xl" />
                    <span>Retour à l'accueil</span>
                  </button>

                  <Link
                    href="/TrackingPackages"
                    className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-primaryColor to-primaryColor/90 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    <FaShoppingBag className="text-xl" />
                    <span>Suivre ma commande</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Error Content */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                    <FaTimesCircle className="text-red-600 text-5xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Paiement non effectué
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Nous n'avons pas pu traiter votre paiement. Veuillez réessayer.
                  </p>
                </div>

                {/* Error Details */}
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <FaExclamationTriangle className="text-red-600 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm text-red-600 mb-1">Référence</p>
                      <p className="text-lg font-bold text-red-900 break-all">{packageId}</p>
                    </div>
                  </div>
                </div>

                {/* Possible Reasons */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Raisons possibles
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Informations de carte bancaire incorrectes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Solde insuffisant sur votre compte</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Problème technique temporaire</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Limite de transaction atteinte</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => router.push("/")}
                    className="flex-1 flex items-center justify-center gap-3 bg-gray-100 text-gray-800 px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                  >
                    <FaHome className="text-xl" />
                    <span>Retour à l'accueil</span>
                  </button>

                  <button
                    onClick={() => router.push("/Checkout")}
                    className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-primaryColor to-primaryColor/90 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    <FaShoppingBag className="text-xl" />
                    <span>Réessayer</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Contact */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg px-6 py-4 inline-block">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaPhone className="text-primaryColor" />
                <span>
                  <strong className="text-gray-900">Support:</strong> +216 23 212 892
                </span>
              </div>
              <span className="hidden sm:inline text-gray-300">|</span>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-primaryColor" />
                <span>
                  <strong className="text-gray-900">Email:</strong> italuxury2002@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center mt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} ITA Luxury. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default EndCheckoutPage;