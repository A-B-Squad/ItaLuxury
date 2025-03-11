"use client";
import { useQuery } from "@apollo/client";
import React, { useMemo } from "react";
import { ADVERTISSMENT_QUERY, COMPANY_INFO_QUERY } from "@/graphql/queries";
import SideAds from "@/app/components/adverstissment/sideAds";

export default function PrivacyPolicy() {
  const { data: companyInfoData, loading: companyInfoLoading } = useQuery(COMPANY_INFO_QUERY);
  const { data: clientContactSideAds, loading: loadingClientContactSideAds } =
    useQuery(ADVERTISSMENT_QUERY, {
      variables: { position: "clinetContactSideAds" },
    });

  // Memoize company info to prevent unnecessary re-renders
  const companyInfo = useMemo(() => companyInfoData?.companyInfo, [companyInfoData]);
  
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
            Politique de Confidentialité
          </h1>
        </header>
        
        <div className="space-y-8">
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">1</span>
              Collecte et Utilisation des Informations
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                Cette politique de confidentialité décrit la manière dont nous
                recueillons, utilisons et protégeons les informations que vous
                nous fournissez lorsque vous utilisez notre service.
              </p>
              <p>
                Nous recueillons différents types d'informations à diverses fins
                pour fournir et améliorer notre service.
              </p>
            </div>
          </section>
          
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">2</span>
              Conservation des Données
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous ne conserverons vos données que le temps nécessaire aux fins
              énoncées dans la présente politique de confidentialité.
            </p>
          </section>
          
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">3</span>
              Divulgation des Données
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous pouvons divulguer vos données personnelles dans certaines
              circonstances prévues par la loi.
            </p>
          </section>
          
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">4</span>
              Sécurité des Données
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous nous efforçons de protéger vos données personnelles, mais
              rappelez-vous qu'aucune méthode de transmission sur Internet ou de
              stockage électronique n'est sécurisée à 100%.
            </p>
          </section>
          
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">5</span>
              Liens Vers D'autres Sites
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Notre service peut contenir des liens vers d'autres sites. Si vous
              cliquez sur un lien tiers, vous serez redirigé vers ce site. Nous
              n'avons aucun contrôle et n'assumons aucune responsabilité quant
              au contenu, aux politiques de confidentialité ou aux pratiques de
              tout site tiers.
            </p>
          </section>
          
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">6</span>
              Modifications de la Politique de Confidentialité
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nous nous réservons le droit de mettre à jour ou de modifier notre
              politique de confidentialité à tout moment. Les modifications
              prendront effet dès leur publication sur cette page.
            </p>
          </section>
          
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-primaryColor text-white rounded-full flex items-center justify-center mr-2 text-sm">7</span>
              Nous Contacter
            </h2>
            <ul className="space-y-2 text-gray-700">
              {companyInfoLoading ? (
                <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              ) : (
                <>
                  <li className="flex items-center">
                    <span className="font-medium mr-2">Email:</span> {companyInfo?.email}
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium mr-2">Téléphone:</span> {companyInfo?.phone}
                  </li>
                </>
              )}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
