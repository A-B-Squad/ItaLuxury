import SideAds from "@/app/components/adverstissment/sideAds";
import keywords from "@/public/keywords";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Livraison",
  description: "maisonNg.tn",
  keywords: keywords,
};
const DeliveryPage = () => {
  return (
    <div className="flex  items-center justify-center py-10 relative ">
      <div className="container flex gap-8 relative h-screen">
        <div className="leftAds h-fit  sticky top-24">
          <SideAds />
        </div>
        <div className="">
          <h1 className="font-bold text-5xl py-3">Expéditions et retours</h1>
          <h3 className="font-semibold text-4xl py-3">
            Expédition de votre colis
          </h3>
          <div className="flex flex-col gap-5">
            <p className="tracking-wider leading-6">
              Les colis sont généralement expédiés dans un délai de 2 jours
              après réception du paiement. Ils sont expédiés via Jax Delivery
              avec un numéro de suivi et remis sans signature. Les colis peuvent
              également être expédiés via Jax Delivery et remis contre
              signature. Veuillez nous contacter avant de choisir ce mode de
              livraison, car il induit des frais supplémentaires. Quel que soit
              le mode de livraison choisi, nous vous envoyons un lien pour
              suivre votre colis en ligne.
            </p>
            <p className="tracking-wider  leading-7">
              Les frais d'expédition incluent les frais de préparation et
              d'emballage ainsi que les frais de port. Les frais de préparation
              sont fixes, tandis que les frais de transport varient selon le
              poids total du colis. Nous vous recommandons de regrouper tous vos
              articles dans une seule commande. Nous ne pouvons pas regrouper
              deux commandes placées séparément et des frais d'expédition
              s'appliquent à chacune d'entre elles. Votre colis est expédié à
              vos propres risques, mais une attention particulière est portée
              aux objets fragiles.
            </p>
            <p className="tracking-wider  leading-7">
              Les dimensions des boîtes sont appropriées et vos articles sont
              correctement protégés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
