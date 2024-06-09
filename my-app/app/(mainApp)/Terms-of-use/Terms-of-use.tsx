"use client";
import { COMPANY_INFO_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React from "react";

export default function TermsOfUse() {
  const { data: companyInfoData } = useQuery(COMPANY_INFO_QUERY);

  const companyInfo = companyInfoData?.companyInfo;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Conditions d'Utilisation</h1>
      </header>
      <main>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            1. Acceptation des Conditions d'Utilisation
          </h2>
          <p>
            En utilisant ce site, vous acceptez d'être lié par ces conditions
            d'utilisation, toutes les lois et réglementations applicables, et
            acceptez d'être responsable de la conformité avec toutes les lois
            locales applicables.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            2. Utilisation de Licence
          </h2>
          <ol>
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
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            3. Commandes et Paiements
          </h2>
          <p>
            Les commandes effectuées sur ce site sont soumises à disponibilité.
            Nous nous réservons le droit de refuser ou d'annuler votre commande
            à tout moment pour des raisons telles que la disponibilité des
            produits, des erreurs dans la description ou le prix des produits,
            ou d'autres raisons.
          </p>
          <p>
            Les prix des produits sont indiqués en devise locale et sont sujets
            à changement sans préavis.
          </p>
          <p>
            Les paiements sont sécurisés et traités conformément à notre
            politique de confidentialité.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            4. Livraison et Retours
          </h2>
          <p>
            Nous nous efforçons de livrer vos commandes dans les délais estimés,
            mais les délais de livraison peuvent varier en fonction de la
            destination et d'autres facteurs indépendants de notre volonté.
          </p>
          <p>
            Consultez notre politique de livraison et de retours pour plus
            d'informations sur les conditions de livraison et les procédures de
            retour.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            5. Propriété Intellectuelle
          </h2>
          <p>
            Tous les contenus de ce site, y compris les textes, les images, les
            vidéos, les logos et les graphiques, sont la propriété de notre
            société ou de ses concédants de licence et sont protégés par les
            lois sur la propriété intellectuelle.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            6. Modifications des Conditions d'Utilisation
          </h2>
          <p>
            Nous nous réservons le droit de mettre à jour ou de modifier nos
            conditions d'utilisation à tout moment. Les modifications prendront
            effet dès leur publication sur cette page.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Contact</h2>
          <p>
            Si vous avez des questions concernant nos conditions d'utilisation,
            veuillez nous contacter à l'adresse suivante :
          </p>
          <ul>
            <li>Par email : {companyInfo?.email}</li>
            <li>Par téléphone : {companyInfo?.phone}</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
