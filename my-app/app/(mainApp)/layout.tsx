import React from "react";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import dynamic from "next/dynamic";
import { ApolloWrapper } from "../../lib/apollo-wrapper";
import Header from "../components/Header/Header";
import { cookies } from "next/headers";
import { decodeToken } from "@/utils/tokens/token";
import { getUser } from "@/utils/getUser";
import { getCompanyInfo } from "@/utils/getCompanyInfo";

const BasketDrawer = dynamic(() => import("../components/MobileDrawer/BasketDrawer"), { ssr: false });
const Footer = dynamic(() => import("../components/Footer/Footer"), { ssr: false });
const SideBarMobileDrawer = dynamic(() => import("../components/MobileDrawer/SideBarMobileDrawer/SideBarDrawerMobile"), { ssr: false });
const CategoryMobileDrawer = dynamic(() => import("../components/MobileDrawer/Category/CategoryDrawer"), { ssr: false });
const SearchMobileDrawer = dynamic(() => import("../components/MobileDrawer/SearchMobileDrawer/SearchMobileDrawer"), { ssr: false });
const ProductQuickView = dynamic(() => import("@/app/components/ProductQuickView/ProductQuickView"), { ssr: false });
const PurchaseOptions = dynamic(() => import("@/app/components/PurchaseOptions"), { ssr: false });

if (process.env.NODE_ENV !== "production") {
  loadDevMessages();
  loadErrorMessages();
}


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = cookies().get('Token')?.value;
  const decodedUser = token ? decodeToken(token) : null;
  const userData = await getUser(decodedUser?.userId);
  const companyData = await getCompanyInfo();


  return (

    <div className="relative">
      <Header userData={userData} companyData={companyData} />
      <ApolloWrapper>{children}</ApolloWrapper>
      <SideBarMobileDrawer userData={userData} />
      <CategoryMobileDrawer userData={userData} />
      <SearchMobileDrawer />
      <BasketDrawer userData={userData} />
      <PurchaseOptions companyData={companyData} />
      <ProductQuickView userData={userData} />
      <Footer companyData={companyData} />
    </div>

  );
}