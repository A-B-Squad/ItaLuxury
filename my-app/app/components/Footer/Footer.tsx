"use client";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import Cookies from "js-cookie";
import { IoLocationSharp } from "react-icons/io5";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@apollo/client";
import { CATEGORY_QUERY, COMPANY_INFO_QUERY } from "@/graphql/queries";
import jwt from "jsonwebtoken";

interface DecodedToken extends jwt.JwtPayload {
  userId: string;
}

// Reusable SocialIcon component with hover effect
const SocialIcon = ({
  icon: Icon,
  navLink,
}: {
  icon: any;
  navLink: string;
}) => (
  <Link href={navLink} target="_blank" rel="noopener noreferrer">
    <Icon className="social-icon hover:text-[#00df9a]" size={30} />
  </Link>
);

// Footer component
const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const { data: companyInfoData } = useQuery(COMPANY_INFO_QUERY);
  const { data: categoriesData } = useQuery(CATEGORY_QUERY);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const companyInfo = companyInfoData?.companyInfo;
  const categories = categoriesData?.categories || [];

  const handleSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification de S'ABONNER",
      description: `Merci de vous abonner avec ${email}`,
      className: "bg-strongBeige text-white",
    });
    setEmail("");
  };

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  return (
    <div className="bg-white shadow-2xl shadow-black border-t-2 text-black flex flex-col items-center pt-3">
      <div className="text-center flex justify-center items-center flex-col">
        <Image
          src={companyInfo?.logo}
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
      <div className="w-full hidden lg:grid max-w-7xl  lg:grid-cols-6 place-content-center gap-4 border-t pt-8">
        <div className="CompanyInfo w-full lg:col-span-2">
          <h6 className="font-medium text-xl mb-4">Informations</h6>
          <div className="leading-8 ">
            <div className="flex gap-1 items-start tracking-wider text-gray-700">
              <IoLocationSharp size={40} />
              <p>{companyInfo?.location}</p>
            </div>
            <div className="flex gap-5 tracking-wider items-center text-gray-700">
              <MdEmail size={18} />
              <p>{companyInfo?.email}</p>
            </div>
            <div className="flex gap-1 items-center tracking-wider text-gray-700">
              <MdLocalPhone size={18} />
              <p>(+216) {companyInfo?.phone}</p>
            </div>
          </div>
        </div>
        <div className="Categories">
          <h6 className="font-medium text-xl mb-4">Nos Catégories</h6>
          <ul>
            {categories.map(
              (category: { name: string; id: string }, subIndex: number) => (
                <li key={subIndex}>
                  <Link
                    href={`/Collections/tunisie/?category=${category?.id}`}
                    className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
                  >
                    {category?.name}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
        <div className="entreprise">
          <h6 className="font-medium text-xl mb-4">Notre Entreprise</h6>
          <div className="flex flex-col">
            <Link
              href="/Delivery"
              className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
            >
              Livraison
            </Link>
            <Link
              href={"/Privacy-Policy"}
              className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
            >
              Politique de Confidentialité
            </Link>
            <Link
              href={"/Terms-of-use"}
              className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
            >
              Conditions d'utilisation
            </Link>
            <Link
              href="/Contact-us"
              className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
            >
              Contactez-nous
            </Link>
            <p className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm">
              Plan du site
            </p>
          </div>
        </div>
        <div className="entreprise">
          <h6 className="font-medium text-xl mb-4">Votre Compte</h6>
          <div className="flex flex-col">
            <Link
              href={decodedToken?.userId ? `/TrackingPackages` : "/signin"}
              className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
            >
              Mes Commandes
            </Link>
            <Link
              href={decodedToken?.userId ? `/FavoriteList` : "/signin"}
              className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
            >
              Ma Liste D'envies
            </Link>

            <Link
              href={""}
              className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
            >
              Mes listes de souhaits
            </Link>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubscription}>
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded w-full border text-black"
              required
            />
            <button
              type="submit"
              className="mt-2 p-2 bg-[#00df9a] text-white rounded w-full"
            >
              S'ABONNER
            </button>
          </form>
          <p className="mt-2 text-sm">
            Vous pouvez vous désinscrire à tout moment. Vous trouverez pour cela
            nos informations de contact dans les conditions d'utilisation du
            site.
          </p>
        </div>
      </div>
      {/* Mobile accordion */}
      <div className="flex flex-col lg:hidden w-full px-5">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Informations</AccordionTrigger>
            <AccordionContent>
              <div className="leading-7">
                <div className="flex gap-1 items-start tracking-wider text-gray-700">
                  <IoLocationSharp size={20} />
                  <p>{companyInfo?.location}</p>
                </div>
                <div className="flex gap-5 tracking-wider items-center text-gray-700">
                  <MdEmail size={18} />
                  <p>{companyInfo?.email}</p>
                </div>
                <div className="flex gap-1 items-center tracking-wider text-gray-700">
                  <MdLocalPhone size={18} />
                  <p>(+216) {companyInfo?.phone}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Nos Catégories</AccordionTrigger>
            <AccordionContent>
              <ul>
                {categories.map((category: { name: string; id: string }) => (
                  <li key={category?.id} className="py-2">
                    <Link
                      href={`/Collections/tunisie/?category=${category?.id}`}
                      className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 "
                    >
                      {category?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Notre Entreprise</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col">
                <Link
                  href="/Delivery"
                  className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
                >
                  Livraison
                </Link>
                <Link
                  href={""}
                  className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
                >
                  Politique de Confidentialité
                </Link>
                <Link
                  href={""}
                  className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
                >
                  Conditions d'utilisation
                </Link>
                <Link
                  href="/Contact-us"
                  className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
                >
                  Contactez-nous
                </Link>
                <Link
                  href={""}
                  className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
                >
                  Plan du site
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Votre Compte</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col">
                <Link
                  href={decodedToken?.userId ? `/TrackingPackages` : "/signin"}
                  className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
                >
                  Mes Commandes
                </Link>
                <Link
                  href={decodedToken?.userId ? `/FavoriteList` : "/signin"}
                  className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
                >
                  Ma Liste D'envies
                </Link>

                <Link
                  href={""}
                  className="py-1 tracking-wider hover:opacity-75 transition-all text-gray-700 text-sm"
                >
                  Mes listes de souhaits
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="mt-8 flex gap-5">
        <SocialIcon
          icon={FaFacebookSquare}
          navLink={companyInfo?.facebook || "/"}
        />
        <SocialIcon
          icon={FaInstagram}
          navLink={companyInfo?.instagram || "/"}
        />
      </div>
      <div className="border-t py-5 pl-12 text-gray-500 tracking-wider text-sm font-light mt-2 w-full hover:text-strongBeige transition-colors ">
        © 2024 MaisonNg.Tn By Maison Ng Team
      </div>
    </div>
  );
};

export default Footer;
