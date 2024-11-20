"use client";

import { useQuery } from "@apollo/client";
import { Drawer, IconButton } from "@material-tailwind/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FiUser, FiHeart } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { GoPackageDependents } from "react-icons/go";
import { IoGitCompare, IoHomeOutline } from "react-icons/io5";
import { GrContact } from "react-icons/gr";
import { useDrawerMobileStore } from "../../../store/zustand";
import Category from "./MainCategory";
import { CATEGORY_QUERY, FETCH_USER_BY_ID } from "../../../../graphql/queries";
import Cookies from "js-cookie";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { MdKeyboardArrowRight } from "react-icons/md";
import Loading from "@/app/(mainApp)/Collections/loading";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface DecodedToken extends JwtPayload {
  userId: string;
}

interface Subcategory {
  name: string;
  subcategories?: Subcategory[];
}

function DrawerMobile() {
  const { toast } = useToast();
  const router = useRouter();

  const { isOpen, closeCategoryDrawer } = useDrawerMobileStore();
  const { loading, error, data } = useQuery(CATEGORY_QUERY);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);
  const { data: userData } = useQuery(FETCH_USER_BY_ID, {
    variables: {
      userId: decodedToken?.userId,
    },
    skip: !decodedToken?.userId,
  });
  const handleLogout = async () => {
    try {
      // Supprimer le token
      Cookies.remove("Token", { domain: ".ita-luxury.com", path: "/" });


      // Nettoyer le sessionStorage
      window.sessionStorage.removeItem("products-in-basket");
      window.sessionStorage.removeItem("comparedProducts");

      // Rediriger vers la page d'accueil
      await router.push("https://www.ita-luxury.com");

      // Afficher le toast de confirmation
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur ita-luxury",
        className: "bg-primaryColor text-white",
      });

      // Recharger la page après un court délai
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Veuillez réessayer plus tard",
        variant: "destructive",
      });
    }
  };
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Erreur lors du chargement des catégories : {error.message}</p>;
  }

  return (
    <>
      <Drawer
        placeholder={""}
        open={isOpen}
        onClose={closeCategoryDrawer}
        placement="left"
        size={350}
        className="2xl:hidden overflow-y-auto"
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="px-2 py-3 flex items-center justify-center text-white bg-primaryColor">
          <Link
            href={`${decodedToken?.userId ? "/Collections/tunisie" : "/signin"}`}
            className="font-bold text-lg flex items-center gap-2"
            onClick={closeCategoryDrawer}
          >

            <FaUser />
            {decodedToken?.userId
              ? <p>Bienvenue {userData?.fetchUsersById.fullName}</p>
              : "Bonjour, identifiez-vous pour continuer"}
          </Link>
          <IconButton
            placeholder={""}
            variant="text"
            color="blue-gray"
            onClick={closeCategoryDrawer}
            className="ml-auto"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>

        {/* New navigation items */}
        <div className="list items-center gap-5 cursor-pointer text-base flex flex-col mt-4 px-7">
          <ul className="flex flex-col gap-5 w-full">
            {!decodedToken?.userId && (
              <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
                <Link
                  rel="preload"
                  href={`/signin`}
                  className="flex items-center gap-2 w-full"
                  onClick={closeCategoryDrawer}

                >
                  <FiUser />
                  <span>Se connecter à votre compte</span>
                </Link>
              </li>
            )}
            {decodedToken?.userId && (
              <li
                onClick={handleLogout}
                className="logout flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all"

              >
                <IoIosLogOut />
                <span>Déconnexion de votre compte</span>

              </li>
            )}
            <li className="home flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
              <Link
                rel="preload"
                href={`/`}
                className="flex items-center gap-2 w-full"
                onClick={closeCategoryDrawer}

              >
                <IoHomeOutline />
                <span>Page d'accueil</span>
              </Link>
            </li>
            <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
              <Link
                rel="preload"
                href={`${decodedToken?.userId ? "/FavoriteList" : "/signin"}`}
                className="flex items-center gap-2 w-full"
                onClick={closeCategoryDrawer}

              >
                <FiHeart />
                <span>Mes produits favoris</span>
              </Link>
            </li>
            {decodedToken?.userId && (
              <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
                <Link
                  rel="preload"
                  href={`/TrackingPackages`}
                  className="flex items-center gap-2 w-full"
                  onClick={closeCategoryDrawer}

                >
                  <GoPackageDependents />
                  <span>Suivre mes commandes</span>
                </Link>
              </li>
            )}
            <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
              <Link
                rel="preload"
                href={"/productComparison"}
                className="flex items-center gap-2 w-full"
                onClick={closeCategoryDrawer}

              >
                <IoGitCompare />
                <span>Comparer les produits</span>
              </Link>
            </li>

            <li className="whishlist flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all">
              <Link
                rel="preload"
                href={"/Contact-us"}
                className="flex items-center gap-2 w-full"
                onClick={closeCategoryDrawer}

              >
                <GrContact />
                <span>Nous contacter</span>
              </Link>
            </li>
          </ul>
        </div>

        {data?.categories.length > 0 ? (
          <Category
            data={data}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            closeCategoryDrawer={closeCategoryDrawer}
          />
        ) : (
          <p>
            Aucune catégorie disponible pour le moment. Veuillez revenir plus
            tard !
          </p>
        )}

        <div
          onClick={closeCategoryDrawer}
          className={`flex py-3 cursor-pointer focus:text-red-200 items-center justify-between px-7 w-full border-b-2`}
        >
          <Link
            href={"/Collections/tunisie?page=1"

            }
            className="capitalize font-bold w-full"
            onClick={closeCategoryDrawer}

          >
            Voir tous les produits
          </Link>
          <MdKeyboardArrowRight size={20} />
        </div>
      </Drawer>
    </>
  );
}

export default DrawerMobile;
