"use client";
import prepRoute from "@/app/Helpers/_prepRoute";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { CATEGORY_QUERY, COMPANY_INFO_QUERY } from "@/graphql/queries";
import { useAuth } from "@/lib/auth/useAuth";
import { useQuery } from "@apollo/client";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaFacebookSquare, FaInstagram, FaArrowUp } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail, MdLocalPhone } from "react-icons/md";

// Reusable SocialIcon component with hover effect
const SocialIcon = ({
  icon: Icon,
  navLink,
}: {
  icon: any;
  navLink: string;
}) => (
  <Link href={navLink} target="_blank" rel="noopener noreferrer">
    <div className="p-2 rounded-full bg-gray-100 hover:bg-primaryColor hover:text-white transition-all duration-300 transform hover:scale-110">
      <Icon className="social-icon" size={24} />
    </div>
  </Link>
);

// Footer component
const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const { data: companyInfoData } = useQuery(COMPANY_INFO_QUERY);
  const { data: categoriesData } = useQuery(CATEGORY_QUERY);
  const { isAuthenticated } = useAuth();

  const companyInfo = companyInfoData?.companyInfo;
  const categories = categoriesData?.categories || [];


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    toast({
      title: "Notification de S'ABONNER",
      description: `Merci de vous abonner avec ${email}`,
      className: "bg-primaryColor text-white",
    });
    setEmail("");
  };

  return (
    <footer className="Footer container pb-24 md:pb-0 bg-white shadow-sm pt-2 border-t-2 text-black flex flex-col items-center relative">

      <div
        className="hidden lg:flex bg-center bg-cover bg-no-repeat min-h-[200px] h-[304px] max-w-[1419px] w-full justify-center items-center"
        style={{
          backgroundImage: `url('/footerImage.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
      </div>

      <div className="lg:hidden text-center flex justify-center items-center flex-col">
        {companyInfo?.logo && (
          <Image
            src={companyInfo.logo}
            width={180}
            height={180}
            alt="ita-luxury"
            objectFit="contain"
            priority
          />
        )}
        <p className="my-5 w-11/12 md:w-3/4 font-light text-base leading-7 tracking-wider">
          ita-luxury s'engage à simplifier et à embellir votre quotidien. Notre
          site propose une sélection raffinée d'articles de cuisine, d'arts de
          la table, d'accessoires de salle de bain et de bagagerie, tous
          reconnus pour leur design épuré et élégant. Découvrez un concept
          unique et original. Simplement extraordinaire !
        </p>
      </div>
      {/* Laptop View */}
      <div className=" w-full hidden lg:grid max-w-7xl lg:grid-cols-6 place-content-center gap-4 border-t pt-8">
        {/* Scroll to top button */}
        <div className="lg:col-span-6 flex justify-center mb-4">
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-primaryColor text-white shadow-lg hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
            aria-label="Scroll to top"
          >
            <FaArrowUp /> <span>Retour en haut</span>
          </button>
        </div>

        {/* Full width map for laptop view */}
        {/* <div className="lg:col-span-6 mb-6">
          <h6 className="font-medium text-xl mb-4">Notre Boutique</h6>
          <div className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d393.3607920290625!2d10.60973703774928!3d35.85338306229638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd8a723f3aaec3%3A0x41866312c6399eab!2sBoutique%20Ita%20Sousse!5e0!3m2!1sen!2stn!4v1743255721777!5m2!1sen!2stn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Boutique Ita Sousse Location"
            ></iframe>
          </div>
          <div className="mt-2">
            <Link
              href="https://maps.app.goo.gl/BtPhSeEzDxVmStDBA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primaryColor hover:underline flex items-center gap-1"
            >
              <IoLocationSharp size={16} />
              Voir sur Google Maps
            </Link>
          </div>
        </div> */}

        <div className="CompanyInfo w-full lg:col-span-2">
          <h6 className="font-medium text-xl mb-4">Informations</h6>
          <div className="leading-8">
            <div className="flex gap-5 items-center tracking-wider text-gray-700">
              <IoLocationSharp size={20} className="text-primaryColor" />
              <p>{companyInfo?.location}</p>
            </div>
            <div className="flex gap-1 items-center tracking-wider text-gray-700">
              <MdLocalPhone size={18} className="text-primaryColor" />
              <p>(+216) {companyInfo?.phone?.[0]}</p>
              <p>/ (+216) {companyInfo?.phone?.[1]}</p>
            </div>
            <div className="flex gap-5 tracking-wider items-center text-gray-700">
              <MdEmail size={18} className="text-primaryColor" />
              <p>{companyInfo?.email}</p>
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
                    href={`/Collections/tunisie/${prepRoute(category.name)}/?${new URLSearchParams(
                      {
                        category: category.name,
                        categories: category.name,
                      }
                    )}`}
                    className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700 text-sm block"
                  >
                    {category?.name}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="entreprise">
          <h6 className="font-medium text-xl mb-4">Notre Entreprise</h6>
          <div className="flex flex-col">
            <Link
              href="/Delivery"
              className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700 text-sm"
            >
              Livraison
            </Link>
            <Link
              href="/Privacy-Policy"
              className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700 text-sm"
            >
              Politique de Confidentialité
            </Link>
            <Link
              href="/Terms-of-use"
              className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700 text-sm"
            >
              Conditions d'utilisation
            </Link>
            <Link
              href="/Contact-us"
              className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700 text-sm"
            >
              Contactez-nous
            </Link>
          </div>
        </div>

        <div className="YourAccount">
          <h6 className="font-medium text-xl mb-4">Votre Compte</h6>
          <div className="flex flex-col">
            <Link
              href={isAuthenticated ? `/TrackingPackages` : "/signin"}
              className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700 text-sm"
            >
              Mes Commandes
            </Link>
            <Link
              href={isAuthenticated ? `/FavoriteList` : "/signin"}
              className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700 text-sm"
            >
              Ma Liste D'envies
            </Link>
            <Link
              href="/Basket"
              className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700 text-sm"
            >
              Mon Panier
            </Link>
          </div>
        </div>

        <div>
          <h6 className="font-medium text-xl mb-4">Newsletter</h6>
          <form onSubmit={handleSubscription} className="space-y-2">
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded w-full border text-black focus:border-primaryColor focus:outline-none"
              required
            />
            <button
              type="submit"
              className="mt-2 p-2 bg-primaryColor text-white rounded w-full hover:bg-opacity-90 transition-all"
            >
              S'ABONNER
            </button>
          </form>
          <span className="mt-2 text-sm text-gray-600 block">
            Vous pouvez vous désinscrire à tout moment. Vous trouverez pour cela
            nos informations de contact dans les conditions d'utilisation du
            site.
          </span>
        </div>
      </div>

      {/* Mobile accordion */}
      <div className="flex flex-col lg:hidden w-full px-5 mt-4">
        {/* Mobile scroll to top button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-primaryColor text-white shadow-lg hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
            aria-label="Scroll to top"
          >
            <FaArrowUp /> <span>Retour en haut</span>
          </button>
        </div>

        {/* Mobile map section - shown directly before accordion */}
        {/* <div className="mb-6">
          <h6 className="font-medium text-lg mb-2">Notre Boutique</h6>
          <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d393.3607920290625!2d10.60973703774928!3d35.85338306229638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd8a723f3aaec3%3A0x41866312c6399eab!2sBoutique%20Ita%20Sousse!5e0!3m2!1sen!2stn!4v1743255721777!5m2!1sen!2stn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Boutique Ita Sousse Location"
            ></iframe>
          </div>
          <div className="mt-2">
            <Link
              href="https://maps.app.goo.gl/BtPhSeEzDxVmStDBA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primaryColor hover:underline flex items-center gap-1"
            >
              <IoLocationSharp size={16} />
              Voir sur Google Maps
            </Link>
          </div>
        </div> */}

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium">Informations</AccordionTrigger>
            <AccordionContent>
              <div className="leading-7 space-y-3">
                <div className="flex gap-4 items-start tracking-wider text-gray-700">
                  <IoLocationSharp size={20} className="text-primaryColor mt-1" />
                  <p>{companyInfo?.location}</p>
                </div>
                <div className="flex gap-4 items-center tracking-wider text-gray-700">
                  <MdLocalPhone size={18} className="text-primaryColor" />
                  <div>
                    <p>(+216) {companyInfo?.phone?.[0]}</p>
                    <p>/ (+216) {companyInfo?.phone?.[1]}</p>
                  </div>
                </div>
                <div className="flex gap-4 tracking-wider items-center text-gray-700">
                  <MdEmail size={18} className="text-primaryColor" />
                  <p>{companyInfo?.email}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium">Nos Catégories</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {categories.map((category: { name: string; id: string }) => (
                  <li key={category?.id}>
                    <Link
                      href={`/Collections/tunisie/${prepRoute(category.name)}/?${new URLSearchParams(
                        {
                          category: category.name,
                          categories: category.name,
                        }
                      )}`}
                      className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700 block"
                    >
                      {category?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium">Notre Entreprise</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/Delivery"
                  className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700"
                >
                  Livraison
                </Link>
                <Link
                  href="/Privacy-Policy"
                  className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700"
                >
                  Politique de Confidentialité
                </Link>
                <Link
                  href="/Terms-of-use"
                  className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700"
                >
                  Conditions d'utilisation
                </Link>
                <Link
                  href="/Contact-us"
                  className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700"
                >
                  Contactez-nous
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium">Votre Compte</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2">
                <Link
                  href={isAuthenticated ? `/TrackingPackages` : "/signin"}
                  className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700"
                >
                  Mes Commandes
                </Link>
                <Link
                  href={isAuthenticated ? `/FavoriteList` : "/signin"}
                  className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700"
                >
                  Ma Liste D'envies
                </Link>
                <Link
                  href="/Basket"
                  className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700"
                >
                  Mon Panier
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-medium">Newsletter</AccordionTrigger>
            <AccordionContent>
              <form onSubmit={handleSubscription} className="space-y-2">
                <input
                  type="email"
                  placeholder="Votre adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 rounded w-full border text-black focus:border-primaryColor focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="mt-2 p-2 bg-primaryColor text-white rounded w-full hover:bg-opacity-90 transition-all"
                >
                  S'ABONNER
                </button>
              </form>
              <span className="mt-2 text-sm text-gray-600 block">
                Vous pouvez vous désinscrire à tout moment.
              </span>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mt-8 flex gap-4">
        <SocialIcon
          icon={FaFacebookSquare}
          navLink={companyInfo?.facebook || "#"}
        />
        <SocialIcon
          icon={FaInstagram}
          navLink={companyInfo?.instagram || "#"}
        />
      </div>

      <div className="border-t py-5 text-center md:text-left md:pl-12 text-gray-500 tracking-wider text-sm font-light mt-2 w-full hover:text-primaryColor transition-colors">
        © 2024 ita-luxury.com By Ahmed Haddada
      </div>
    </footer>
  );
};

export default Footer;
