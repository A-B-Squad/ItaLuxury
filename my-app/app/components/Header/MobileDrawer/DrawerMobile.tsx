"use client";

import Loading from "@/app/(mainApp)/Collections/loading";
import { useAuth } from "@/app/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@apollo/client";
import { Drawer, IconButton } from "@material-tailwind/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FiHeart, FiUser } from "react-icons/fi";
import { GoPackageDependents } from "react-icons/go";
import { GrContact } from "react-icons/gr";
import { IoIosLogOut } from "react-icons/io";
import { IoGitCompare, IoHomeOutline } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import { CATEGORY_QUERY } from "../../../../graphql/queries";
import { useDrawerMobileStore } from "../../../store/zustand";
import Category from "./MainCategory";

function DrawerMobile({ userData }: any) {
  const { toast } = useToast();
  const router = useRouter();
  const { isOpen, closeCategoryDrawer } = useDrawerMobileStore();
  const { loading, error, data } = useQuery(CATEGORY_QUERY, {
    fetchPolicy: 'cache-first'
  });
  const { decodedToken, isAuthenticated, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("");



  // Memoize user name for better performance
  const userName = useMemo(() => {
    return userData?.fullName || '';
  }, [userData]);

  // Handle logout with useCallback to prevent unnecessary re-renders
  const handleLogout = useCallback(async () => {
    try {
      // Remove token
      logout();
      // Redirect to home page
      await router.push("https://www.ita-luxury.com");

      // Show confirmation toast
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur ita-luxury",
        className: "bg-primaryColor text-white",
      });

      // Reload page after a short delay
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
  }, [router, toast]);

  // Navigation items with memoization
  const navigationItems = useMemo(() => [
    {
      id: 'login',
      icon: <FiUser />,
      text: 'Se connecter à votre compte',
      href: "/signin",
      show: !decodedToken?.userId,
      onClick: closeCategoryDrawer
    },
    {
      id: 'logout',
      icon: <IoIosLogOut />,
      text: 'Déconnexion de votre compte',
      href: "/",
      show: !!decodedToken?.userId,
      onClick: handleLogout
    },
    {
      id: 'home',
      icon: <IoHomeOutline />,
      text: "Page d'accueil",
      href: "/",
      show: true,
      onClick: closeCategoryDrawer
    },
    {
      id: 'favorites',
      icon: <FiHeart />,
      text: 'Mes produits favoris',
      href: isAuthenticated ? "/FavoriteList" : "/signin",
      show: true,
      onClick: closeCategoryDrawer
    },
    {
      id: 'orders',
      icon: <GoPackageDependents />,
      text: 'Suivre mes commandes',
      href: "/TrackingPackages",
      show: true,
      onClick: closeCategoryDrawer
    },
    {
      id: 'compare',
      icon: <IoGitCompare />,
      text: 'Comparer les produits',
      href: "/productComparison",
      show: true,
      onClick: closeCategoryDrawer
    },
    {
      id: 'contact',
      icon: <GrContact />,
      text: 'Nous contacter',
      href: "/Contact-us",
      show: true,
      onClick: closeCategoryDrawer
    }
  ], [decodedToken, isAuthenticated, closeCategoryDrawer, handleLogout]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Erreur lors du chargement des catégories : {error.message}
      </div>
    );
  }

  return (
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
      <div className="px-2 py-3 flex items-center justify-between text-white bg-primaryColor">
        <Link
          href={isAuthenticated ? "/Collections/tunisie" : "/signin"}
          className="font-bold text-lg flex items-center gap-2"
          onClick={closeCategoryDrawer}
        >
          <FaUser />
          {decodedToken?.userId
            ? <p>Bienvenue {userName}</p>
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
          aria-label="Fermer"
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

      {/* Navigation items */}
      <div className="list items-center gap-5 cursor-pointer text-base flex flex-col mt-4 px-7">
        <ul className="flex flex-col gap-5 w-full">
          {navigationItems
            .filter(item => item.show)
            .map(item => (
              <li
                key={item.id}
                className="flex items-center gap-2 cursor-pointer hover:text-primaryColor transition-all"
                onClick={item.onClick}
              >
                {item.href ? (
                  <Link
                    rel="preload"
                    href={item.href}
                    className="flex items-center gap-2 w-full"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </Link>
                ) : (
                  <div>
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                )}
              </li>
            ))}
        </ul>
      </div>

      {/* Categories */}
      {data?.categories?.length > 0 ? (
        <Category
          data={data}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          closeCategoryDrawer={closeCategoryDrawer}
        />
      ) : (
        <p className="px-7 py-4 text-gray-600">
          Aucune catégorie disponible pour le moment. Veuillez revenir plus tard !
        </p>
      )}

      {/* View all products link */}
      <div
        className="flex py-3 cursor-pointer hover:bg-gray-50 items-center justify-between px-7 w-full border-b-2"
      >
        <Link
          href="/Collections/tunisie?page=1"
          className="capitalize font-bold w-full"
          onClick={closeCategoryDrawer}
        >
          Voir tous les produits
        </Link>
        <MdKeyboardArrowRight size={20} />
      </div>
    </Drawer>
  );
}

export default React.memo(DrawerMobile);