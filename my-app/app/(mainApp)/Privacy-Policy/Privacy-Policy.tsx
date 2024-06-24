"use client";
import { useQuery } from "@apollo/client";
import React from "react";
import { COMPANY_INFO_QUERY } from "@/graphql/queries";

export default function PrivacyPolicy() {
  const { data: companyInfoData } = useQuery(COMPANY_INFO_QUERY);

  const companyInfo = companyInfoData?.companyInfo;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="leftAds h-fit  sticky top-24">
        {/* <SideAds
            adsLoaded={loadingclinetContactSideAds}
            image={clinetContactSideAds?.advertismentByPosition[0]?.images[0]}
            link={clinetContactSideAds?.advertismentByPosition[0]?.link}
            adsPositon={"Left Ads"}
          /> */}
      </div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Politique de Confidentialité</h1>
      </header>
      <main>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Collecte et Utilisation des Informations
          </h2>
          <p className="mb-2">
            Cette politique de confidentialité décrit la manière dont nous
            recueillons, utilisons et protégeons les informations que vous nous
            fournissez lorsque vous utilisez notre service.
          </p>
          <p>
            Nous recueillons différents types d'informations à diverses fins
            pour fournir et améliorer notre service.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Conservation des Données
          </h2>
          <p className="mb-2">
            Nous ne conserverons vos données que le temps nécessaire aux fins
            énoncées dans la présente politique de confidentialité.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Divulgation des Données
          </h2>
          <p className="mb-2">
            Nous pouvons divulguer vos données personnelles dans certaines
            circonstances prévues par la loi.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Sécurité des Données</h2>
          <p className="mb-2">
            Nous nous efforçons de protéger vos données personnelles, mais
            rappelez-vous qu'aucune méthode de transmission sur Internet ou de
            stockage électronique n'est sécurisée à 100%.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Liens Vers D'autres Sites
          </h2>
          <p className="mb-2">
            Notre service peut contenir des liens vers d'autres sites. Si vous
            cliquez sur un lien tiers, vous serez redirigé vers ce site. Nous
            n'avons aucun contrôle et n'assumons aucune responsabilité quant au
            contenu, aux politiques de confidentialité ou aux pratiques de tout
            site tiers.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Modifications de la Politique de Confidentialité
          </h2>
          <p className="mb-2">
            Nous nous réservons le droit de mettre à jour ou de modifier notre
            politique de confidentialité à tout moment. Les modifications
            prendront effet dès leur publication sur cette page.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Nous Contacter</h2>
          <ul>
            <li>Par email : {companyInfo?.email}</li>
            <li>Par téléphone : {companyInfo?.phone}</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
