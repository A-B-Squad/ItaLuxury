"use client";
import SideAds from "@/app/components/adverstissment/sideAds";
import { ADVERTISSMENT_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React, { useMemo } from "react";

const DeliveryPage = () => {
  const { data: clientContactSideAds, loading: loadingClientContactSideAds } =
    useQuery(ADVERTISSMENT_QUERY, {
      variables: { position: "clinetContactSideAds" },
    });

  // Memoize ad data to prevent unnecessary re-renders
  const adData = useMemo(() => ({
    image: clientContactSideAds?.advertismentByPosition[0]?.images[0],
    link: clientContactSideAds?.advertismentByPosition[0]?.link,
  }), [clientContactSideAds]);

  return (
    <div className="container mx-auto flex gap-8 lg:gap-14 lg:flex-row items-start justify-between flex-col-reverse py-12 px-4 lg:px-10 bg-white border rounded-lg shadow-sm">
      <aside className="w-full lg:w-1/4 h-fit sticky top-24">
        <SideAds
          adsLoaded={loadingClientContactSideAds}
          image={adData.image}
          link={adData.link}
          adsPositon={"Left Img"}
        />
      </aside>

      <main className="w-full lg:w-3/4 flex flex-col">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-primaryColor">
            Expéditions et retours
          </h1>
        </header>
        
        <div className="space-y-8">
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">1</span>
              Délais d'expédition
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Les colis sont généralement expédiés dans un délai de 2 jours après
              réception du paiement. Ils sont expédiés via Jax Delivery avec un
              numéro de suivi et remis sans signature. Veuillez nous contacter
              avant de choisir ce mode de livraison, car il induit des frais
              supplémentaires. Quel que soit le mode de livraison choisi, nous
              vous envoyons un lien pour suivre votre colis en ligne.
            </p>
          </section>
          
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">2</span>
              Frais d'expédition
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Les frais d'expédition incluent les frais de préparation et
              d'emballage ainsi que les frais de port. Les frais de préparation
              sont fixes, tandis que les frais de transport varient selon le poids
              total du colis. Nous vous recommandons de regrouper tous vos
              articles dans une seule commande. Nous ne pouvons pas regrouper deux
              commandes placées séparément et des frais d'expédition s'appliquent
              à chacune d'entre elles. Votre colis est expédié à vos propres
              risques, mais une attention particulière est portée aux objets
              fragiles.
            </p>
          </section>
          
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">3</span>
              Emballage
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Les dimensions des boîtes sont appropriées et vos articles sont
              correctement protégés.
            </p>
          </section>
          
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">4</span>
              Politique de retour
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Si vous n'êtes pas satisfait de votre achat, nous acceptons les retours 
              dans les 14 jours suivant la réception de votre commande. Les articles 
              doivent être retournés dans leur état d'origine, non utilisés et dans 
              leur emballage d'origine. Veuillez nous contacter avant de retourner 
              un article pour obtenir les instructions de retour.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DeliveryPage;
