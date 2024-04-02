import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex m-auto justify-center items-center relative">
      <Image
        alt="The guitarist in the concert."
        src={
          "https://img.freepik.com/vecteurs-premium/erreur-404-page-introuvable-illustration_478440-416.jpg?w=826            "
        }
        priority={true}
        style={{ objectFit: "contain" }}
        sizes="(max-width: 768px) 100vw, 33vw"
        width={600}
        height={600}
        quality={100}
      />
      <Link className="absolute bottom-0" href="/">
        Return Home
      </Link>
    </div>
  );
}
