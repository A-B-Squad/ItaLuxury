"use client";
import SideAds from "@/app/components/adverstissment/sideAds";
import { ADVERTISSMENT_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React, { useMemo } from "react";

export default function TermsOfUse({ companyData }: any) {
  const companyEmail: string = companyData?.email ?? "Non disponible";
  const companyPhone = companyData?.phone ?? [];
  const { data: clientContactSideAds, loading: loadingClientContactSideAds } =
    useQuery(ADVERTISSMENT_QUERY, {
      variables: { position: "clinetContactSideAds" },
    });


  // Memoize ad data
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
          adsPositon={"clinet Contact"}
        />
      </aside>

      <main className="w-full lg:w-3/4 flex flex-col">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-primaryColor">
            Conditions d'Utilisation
          </h1>
        </header>

        <div className="space-y-8">
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">1</span>
              Acceptation des Conditions d'Utilisation
            </h2>
            <p className="text-gray-700 leading-relaxed">
              En utilisant ce site, vous acceptez d'être lié par ces conditions
              d'utilisation, toutes les lois et réglementations applicables, et
              acceptez d'être responsable de la conformité avec toutes les lois
              locales applicables.
            </p>
          </section>

          {/* Additional sections with similar styling */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">2</span>
              Utilisation de Licence
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700 leading-relaxed">
              <li>
                Il est permis de télécharger temporairement une copie des
                documents (informations ou logiciels) sur ce site web pour un
                usage personnel et non commercial seulement.
              </li>
              <li>
                Il est permis de faire des contributions sur notre site web dans
                la mesure où cela est expressément autorisé.
              </li>
            </ol>
          </section>

          {/* Continue with remaining sections */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">3</span>
              Commandes et Paiements
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Les commandes effectuées sur ce site sont soumises à
                disponibilité. Nous nous réservons le droit de refuser ou
                d'annuler votre commande à tout moment pour des raisons telles que
                la disponibilité des produits, des erreurs dans la description ou
                le prix des produits, ou d'autres raisons.
              </p>
              <p>
                Les prix des produits sont indiqués en devise locale et sont
                sujets à changement sans préavis.
              </p>
              <p>
                Les paiements sont sécurisés et traités conformément à notre
                politique de confidentialité.
              </p>
            </div>
          </section>

          {/* Additional sections follow the same pattern */}

          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">7</span>
              Contact
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Si vous avez des questions concernant nos conditions
              d'utilisation, veuillez nous contacter à l'adresse suivante :
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="font-medium mr-2">Email:</span> {companyEmail}
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Téléphone:</span>
                {companyPhone.length > 0
                  ? `(+216) ${companyPhone[0]}${companyPhone[1] ? ` / (+216) ${companyPhone[1]}` : ""}`
                  : "Non disponible"}
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
