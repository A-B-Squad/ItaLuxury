import Image from "next/image";
import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./globals.css";
import { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

export const metadata: Metadata = {
  title: "Page non trouvée",
  description:
    "Cette page est introuvable. Veuillez vérifier l'URL que vous avez saisie ou retourner à la page d'accueil.",
};
if (process.env.NODE_ENV !== "production") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const openSans = Open_Sans({
  subsets: ["latin"],
});
export default function NotFound() {
  return (
    // <html lang="en">
      <body className={openSans.className}>
        <Header />
        <div className="flex flex-col items-center justify-center w-full ">
          <Image
            alt="The guitarist in the concert."
            src={
              "https://res.cloudinary.com/dc1cdbirz/image/upload/v1715507897/muvdju2ecqaf7zsdfhog.jpg"
            }
            priority={true}
            objectFit="contain"
            width={500}
            height={500}
            quality={100}
          />
          <p className="pt-2 pb-5 text-lg font-light">
            Je suis désolé, mais la page que vous demandez est introuvable.
          </p>
        </div>
        <Footer />
      </body>
    // </html>
  );
}
