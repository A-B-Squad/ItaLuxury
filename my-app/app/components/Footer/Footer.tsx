import { FaFacebookSquare, FaInstagram } from "react-icons/fa";

import Image from "next/image";
import Link from "next/link";
import prepRoute from "../Helpers/_prepRoute";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
// Reusable SocialIcon component with hover effect
const SocialIcon = ({ icon: Icon, link }: any) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <Icon className="social-icon hover:text-[#00df9a]" size={30} />
  </a>
);

// Footer component
const Footer = async () => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const { data: CompanyInfoData } = await fetch(
    process.env.NEXT_PUBLIC_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
      query CompanyInfo {
        companyInfo {
          id
          phone
          deliveringPrice
          logo
          facebook
          instagram
        }
      }
  `,
      }),
    }
  ).then((res) => res.json());
  
  const { data: CategoryData } = await fetch(process.env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query Categories {
        categories {
          id
          name
        }
      }
  `,
    }),
  }).then((res) => res.json());

  // Footer sections
  const sections = [
    {
      title: "Informations",
      content: (
        <>
          <p>(+216) {CompanyInfoData?.companyInfo?.phone}</p>
        </>
      ),
    },
    {
      title: "Nos Catégories",
      items: CategoryData?.categories.map((category: any) => ({
        name: category.name,
        id: category.id,
      })),
    },
    {
      title: "Notre Entreprise",
      content: (
        <>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            {" "}
            Livraison
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            {" "}
            Politique de Confidentialité
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            {" "}
            Conditions d'utilisation
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            {" "}
            Contactez-nous
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            {" "}
            Plan du site
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            {" "}
            Magasins
          </p>
        </>
      ),
    },
    {
      title: "Votre Compte",
      content: (
        <>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            Informations personnelles
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            Commandes
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            Avoirs
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            Adresses
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            Bons de réduction
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            Mes listes de souhaits
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            Mes alertes
          </p>
        </>
      ),
    },
    {
      title: "Newsletter",
      content: (
        <div>
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            className="p-2 rounded w-full text-black"
          />
          <button className="mt-2 p-2 bg-[#00df9a] text-white rounded w-full">
            S'ABONNER
          </button>
          <p className="mt-2 text-sm">
            Vous pouvez vous désinscrire à tout moment. Vous trouverez pour cela
            nos informations de contact dans les conditions d'utilisation du
            site.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white shadow-2xl shadow-black text-black flex flex-col items-center pt-10">
      <div className="text-center mb-5 flex justify-center items-center flex-col">
        <Image
          src={CompanyInfoData?.companyInfo?.logo}
          width={250}
          height={250}
          alt="Maison Ng"
          objectFit="contain"
        />
        <p className="mt-5 w-11/12 md:w-3/4 font-light">
          Maison Ng s'engage à simplifier et à embellir votre quotidien. Notre
          site propose une sélection raffinée d'articles de cuisine, d'arts de
          la table, d'accessoires de salle de bain et de bagagerie, tous
          reconnus pour leur design épuré et élégant. Découvrez un concept
          unique et original. Simplement extraordinaire !
        </p>
      </div>
      <div className="w-full hidden md:grid max-w-6xl px-4  lg:grid-cols-5 place-content-center gap-8 border-t pt-8">
        {sections.map((section, index) => (
          <div key={index}>
            <h6 className="font-medium text-xl mb-4">{section.title}</h6>
            {section.items ? (
              <ul>
                {section.items.map((item: any, subIndex: number) => (
                  <Link
                    href={`/Collections/tunisie/?category=${item.id}`}
                    key={subIndex}
                  >
                    <li className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
                      {item.name}
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              section.content
            )}
          </div>
        ))}
      </div>
      {/* Mobile accordion */}
      <div className="flex flex-col md:hidden w-full px-5">
        <Accordion type="single" collapsible>
          {sections.map((section, index) => (
            <div key={index}>
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                {/* {section.items?.map(
                  (item: { name: string; id: string }, subIndex: number) => (
                    <AccordionContent key={subIndex}>
                      <Link
                        className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
                        href={`/Collections/tunisie/?category=${item.id}`}
                        key={subIndex}
                      >
                        {item.name}
                      </Link>
                    </AccordionContent>
                  )
                )} */}
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </div>
      <div className="mt-8 flex gap-5">
        <SocialIcon
          icon={FaFacebookSquare}
          link={CompanyInfoData?.companyInfo?.facebook}
        />
        <SocialIcon
          icon={FaInstagram}
          link={CompanyInfoData?.companyInfo?.instagram}
        />
      </div>
      <div className="border-t py-5 pl-12 text-gray-500 tracking-wider text-base font-light mt-2 w-full">
        © 2024 MaisonNg.Tn By Maison Ng Team
      </div>
    </div>
  );
};

export default Footer;
