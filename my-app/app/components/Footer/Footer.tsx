"use client";
import { useAuth } from "@/app/hooks/useAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { MAIN_CATEGORY_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import Services from "../adverstissment/Services";

import Link from "next/link";
import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import Image from "next/image";

// SocialIcon component with hover effect
const SocialIcon = ({
  icon: Icon,
  navLink,
  hoverColor = "hover:text-primaryColor",
}: {
  icon: any;
  navLink: string;
  hoverColor?: string;
}) => (
  <Link href={navLink} target="_blank" rel="noopener noreferrer">
    <div className={`p-2 rounded-full bg-gray-100 hover:bg-primaryColor hover:text-white transition-all duration-300 transform hover:scale-110 ${hoverColor}`}>
      <Icon className="social-icon" size={20} />
    </div>
  </Link>
);

const Footer = ({ companyData }: any) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const { data: categoriesData } = useQuery(MAIN_CATEGORY_QUERY);
  const { isAuthenticated } = useAuth();

  const companyInfo = companyData;
  const categories = categoriesData?.fetchMainCategories || [];

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
    <footer className="Footer bg-white shadow-sm text-black w-full">
      {/* Client Services Component */}
      <div className="w-full lg:p-10">
        <Services />
      </div>

      {/* Main Footer Content */}
      <div className="w-full">
        {/* Laptop View */}
        <div className="hidden lg:block w-full">
          {/* Full width map section */}
          <div className="w-full px-10 py-6">
            <h6 className="font-medium text-xl mb-4">Notre Boutique</h6>
            <div className="relative w-full h-[300px] rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d393.3607920290625!2d10.60973703774928!3d35.85338306229638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd8a723f3aaec3%3A0x41866312c6399eab!2sBoutique%20Ita%20Sousse!5e0!3m2!1sen!2stn!4v1743255721777!5m2!1sen!2stn"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
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
          </div>

          {/* Footer columns - full width with padding */}
          <div className="w-full px-10 py-6 grid grid-cols-6 gap-8 border-t">
            <div className="CompanyInfo col-span-2">
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
                        href={`/Collections?${new URLSearchParams({
                          category: category.name,
                        })}`}
                        className="py-1 tracking-wider hover:text-primaryColor transition-all text-gray-700 text-sm block"
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
                  href={`/TrackingPackages`}
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
        </div>

        {/* Mobile accordion */}
        <div className="flex flex-col lg:hidden w-full px-5 mt-4">
          {/* Mobile map section - shown directly before accordion */}
          <div className="mb-6">
            <h6 className="font-medium text-lg mb-2">Notre Boutique</h6>
            <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d393.3607920290625!2d10.60973703774928!3d35.85338306229638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd8a723f3aaec3%3A0x41866312c6399eab!2sBoutique%20Ita%20Sousse!5e0!3m2!1sen!2stn!4v1743255721777!5m2!1sen!2stn"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
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
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">
                Informations
              </AccordionTrigger>
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
              <AccordionTrigger className="text-lg font-medium">
                Nos Catégories
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {categories.map((category: { name: string; id: string }) => (
                    <li key={category?.id}>
                      <Link
                        href={`/Collections?${new URLSearchParams({
                          category: category.name,
                        })}`}
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
              <AccordionTrigger className="text-lg font-medium">
                Notre Entreprise
              </AccordionTrigger>
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
              <AccordionTrigger className="text-lg font-medium">
                Votre Compte
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2">
                  <Link
                    href={`/TrackingPackages`}
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
              <AccordionTrigger className="text-lg font-medium">
                Newsletter
              </AccordionTrigger>
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

        {/* Payment Methods & Social Media Section */}
        <div className="mt-8 flex flex-col items-center gap-6 border-t pt-6 px-10">
          {/* Payment Methods */}
          <div className="flex flex-col items-center gap-3">
            <h6 className="text-sm font-medium text-gray-600">Modes de paiement acceptés</h6>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Visa */}
              <div className="flex items-center justify-center w-14 h-9 bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <Image
                  src="/images/paymentMethods/visa.png"
                  alt="Visa"
                  width={56}
                  height={36}
                  className="object-contain"
                />
              </div>

              {/* Mastercard */}
              <div className="flex items-center justify-center w-14 h-9 bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <Image
                  src="/images/paymentMethods/Master-Card.webp"
                  alt="Mastercard"
                  width={56}
                  height={36}
                  className="object-contain"
                />
              </div>

              {/* Maestro */}
              <div className="flex items-center justify-center w-14 h-9 bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <Image
                  src="/images/paymentMethods/maestro.png"
                  alt="Maestro"
                  width={56}
                  height={36}
                  className="object-contain"
                />
              </div>

              {/* Poste Edinar */}
              <div className="flex items-center justify-center w-14 h-9 bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <Image
                  src="/images/paymentMethods/poste-edinars.webp"
                  alt="Poste eDinar"
                  width={56}
                  height={36}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Cash on Delivery */}
            <div className="flex items-center justify-center px-2 h-9 bg-white border border-gray-200 rounded shadow-sm">
              <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">Paiement à la livraison</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center gap-3">
            <h6 className="text-sm font-medium text-gray-600">Suivez-nous</h6>
            <div className="flex gap-3">
              {companyInfo?.facebook && (
                <SocialIcon icon={FaFacebookF} navLink={companyInfo.facebook} />
              )}
              {companyInfo?.instagram && (
                <SocialIcon icon={FaInstagram} navLink={companyInfo.instagram} />
              )}
              <SocialIcon
                icon={FaTiktok}
                navLink="https://www.tiktok.com/@ita_luxury?lang=en"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t py-5 text-center md:text-left md:pl-12 text-gray-500 tracking-wider text-sm font-light mt-2 w-full hover:text-primaryColor transition-colors px-10">
          © {new Date().getFullYear()} ita-luxury.com By Ahmed Haddada
        </div>
      </div>
    </footer>
  );
};

export default Footer;