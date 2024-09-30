import SideAds from "@/app/components/adverstissment/sideAds";
import React from "react";

const DeliveryPage = async () => {
  if (
    !process.env.NEXT_PUBLIC_API_URL ||
    !process.env.NEXT_PUBLIC_BASE_URL_DOMAIN
  ) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const { data: clinetContactSideAds, loading: loadingclinetContactSideAds } =
    await fetch(process.env.NEXT_PUBLIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
           query Query($position: String!) {
        advertismentByPosition(position: $position) {
          images
          link
        }
      }
      `,
        variables: { position: "clinetContactSideAds" },
      }),
    }).then((res) => res.json());

  return (
    <div className="container flex gap-14  lg:flex-row items-center lg:items-start justify-center flex-col-reverse py-2 px-10 bg-white border ">
      <div className="leftAds h-fit  sticky top-24">
        <SideAds
          adsLoaded={loadingclinetContactSideAds}
          image={clinetContactSideAds?.advertismentByPosition[0]?.images[0]}
          link={clinetContactSideAds?.advertismentByPosition[0]?.link}
          adsPositon={"Left Ads"}
        />
      </div>
      <div className="h-full ml-5">
        <h1 className="font-bold list-item text-3xl md:text-4xl w-full py-3">
          Expéditions et retours
        </h1>
        <div className="ml-4">
          <h3 className="font-semibold text-xl md:text-4xl py-3">
            Expédition de votre colis
          </h3>
          <div className="flex flex-col gap-5 h-full">
            <p className="tracking-wider leading-9">
              Les colis sont généralement expédiés dans un délai de 2 jours
              après réception du paiement. Ils sont expédiés via Jax Delivery
              avec un numéro de suivi et remis sans signature. Veuillez nous
              contacter avant de choisir ce mode de livraison, car il induit des
              frais supplémentaires. Quel que soit le mode de livraison choisi,
              nous vous envoyons un lien pour suivre votre colis en ligne.
            </p>
            <p className="tracking-wider  leading-9">
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
            <p className="tracking-wider  leading-9">
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
