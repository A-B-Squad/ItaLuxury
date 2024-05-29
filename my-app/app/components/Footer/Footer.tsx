import { FaFacebookSquare, FaInstagram } from "react-icons/fa";

import Image from "next/legacy/image";
import Link from "next/link";
import prepRoute from "../../Helpers/_prepRoute";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { MdEmail, MdLocalPhone, MdMyLocation } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
// Reusable SocialIcon component with hover effect
const SocialIcon = ({ icon: Icon, navLink }: any) => (
  <a href={navLink} target="_blank" rel="noopener noreferrer">
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
          location
          email
        }
      }
  `,
      }),
    },
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
        <div className="leading-7 w-60">
          <div className="flex gap-1 items-start tracking-wider text-gray-700">
            <IoLocationSharp size={40} />

            <p>{CompanyInfoData?.companyInfo?.location}</p>
          </div>
          <div className="flex gap-5 tracking-wider items-center text-gray-700 ">
            <MdEmail size={18} />

            <p> {CompanyInfoData?.companyInfo?.email}</p>
          </div>
          <div className="flex gap-1 items-center tracking-wider text-gray-700 ">
            <MdLocalPhone size={18} />

            <p>(+216) {CompanyInfoData?.companyInfo?.phone}</p>
          </div>
        </div>
      ),
      items: [
        {
          name: CompanyInfoData?.companyInfo?.location,
          navLink: "",

          id: "0",
        },
        {
          name: `
          ${CompanyInfoData?.companyInfo?.email}`,
          navLink: "",

          id: "1",
        },
        {
          name: `(+216) ${CompanyInfoData?.companyInfo?.phone}`,
          navLink: "",

          id: "2",
        },
      ],
    },
    {
      title: "Nos Catégories",
      items: CategoryData?.categories.map((category: any) => ({
        name: category.name,
        navLink: `/Collections/tunisie/?category=${category.id}`,
        id: category.id,
      })),
    },
    {
      title: "Notre Entreprise",
      content: (
        <>
          <Link
            href={"/Delivery"}
            className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
          >
            {" "}
            Livraison
          </Link>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            {" "}
            Politique de Confidentialité
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            {" "}
            Conditions d'utilisation
          </p>
          <Link
            href={"/Contact-us"}
            className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
          >
            {" "}
            Contactez-nous
          </Link>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            {" "}
            Plan du site
          </p>
        </>
      ),
      items: [
        {
          name: "Livraison",
          navLink: "/Delivery",
          id: "0",
        },
        {
          name: "Politique de Confidentialité",
          navLink: "/",

          id: "1",
        },
        {
          name: "Conditions d'utilisation",
          id: "2",
        },
        {
          name: " Contactez-nous",
          navLink: "/Contact-us",

          id: "3",
        },
        {
          name: "Plan du site",
          navLink: "/",
          id: "4",
        },
      ],
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
            Adresses
          </p>
          {/* <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            Bons de réduction
          </p> */}
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            Mes listes de souhaits
          </p>
          <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
            Mes alertes
          </p>
        </>
      ),

      items: [
        {
          name: "Informations personnelles",
          navLink: "/",
          id: "0",
        },
        {
          name: "Commandes",
          navLink: "/",
          id: "1",
        },
        {
          name: "Adresses",
          navLink: "/",

          id: "2",
        },
        {
          name: " Mes listes de souhaits",
          navLink: "/",

          id: "3",
        },
        {
          name: " Mes alertes",
          navLink: "/",

          id: "4",
        },
      ],
    },
    {
      title: "Newsletter",
      content: (
        <div>
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            className="p-2 rounded w-full border text-black"
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
    <div className="bg-white shadow-2xl shadow-black border-t-2 text-black flex flex-col items-center pt-3">
      <div className="text-center  flex justify-center items-center flex-col">
        <Image
          src={CompanyInfoData?.companyInfo?.logo}
          width={250}
          height={250}
          alt="Maison Ng"
          objectFit="contain"
        />
        <p className="my-5 w-11/12 md:w-3/4 font-light text-base leading-7 tracking-wider">
          Maison Ng s'engage à simplifier et à embellir votre quotidien. Notre
          site propose une sélection raffinée d'articles de cuisine, d'arts de
          la table, d'accessoires de salle de bain et de bagagerie, tous
          reconnus pour leur design épuré et élégant. Découvrez un concept
          unique et original. Simplement extraordinaire !
        </p>
      </div>
      <div className="w-full hidden lg:grid max-w-7xl px-3   lg:grid-cols-5 place-content-center gap-4 border-t pt-8">
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
      <div className="flex flex-col lg:hidden w-full px-5">
        <Accordion type="single" collapsible>
          {sections.map((section, index) => (
            <div key={index}>
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                {section.items?.map(
                  (
                    item: { name: string; id: string; navLink: string },
                    subIndex: number,
                  ) => (
                    <AccordionContent key={subIndex}>
                      <Link
                        className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
                        href={item?.navLink}
                        key={subIndex}
                      >
                        {item.name}
                      </Link>
                    </AccordionContent>
                  ),
                )}
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </div>
      <div className="mt-8 flex gap-5">
        <SocialIcon
          icon={FaFacebookSquare}
          navLink={CompanyInfoData?.companyInfo?.facebook}
        />
        <SocialIcon
          icon={FaInstagram}
          navLink={CompanyInfoData?.companyInfo?.instagram}
        />
      </div>
      <div className="border-t py-5 pl-12 text-gray-500 tracking-wider text-base font-light mt-2 w-full">
        © 2024 MaisonNg.Tn By Maison Ng Team
      </div>
    </div>
  );
};

export default Footer;
