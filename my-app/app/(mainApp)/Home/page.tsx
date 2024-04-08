"use client";
import SideAds from "@/app/components/adverstissment/SideAds";
import AdsCarousel from "@/components/adverstissment/carousel";
import Left from "@/components/adverstissment/Left";
import Right from "@/components/adverstissment/Right";
import Services from "./_components/services";
import ProductTabs from "@/components/ProductCarousel/productTabs";
import { gql, useQuery } from "@apollo/client";
import FullWidth from "@/components/adverstissment/FullWidth";
import TitleProduct from "@/app/components/ProductCarousel/titleProduct";
import TopDeals from "./TopDeals/TopDeals";
import { useEffect, useState } from "react";
const Home = () => {
  const TAKE_6_PRODUCTS = gql`
    query Products($limit: Int!) {
      products(limit: $limit) {
        id
        name
        price
        reference
        description
        createdAt
        images
        categories {
          name
        }
        Colors {
          color
          Hex
        }
        productDiscounts {
          price
          newPrice
          Discount {
            percentage
          }
        }
      }
    }
  `;
  const { loading: loadingNewProduct, data } = useQuery(TAKE_6_PRODUCTS, {
    variables: { limit: 6 },
  });

  const SIDE_ADS_NEW_PRODUCT = gql`
    query Query($position: String!) {
      advertismentByPosition(position: $position) {
        images
        link
      }
    }
  `;
  const { loading: loadingLeftAdsNewProduct, data: leftAds } = useQuery(
    SIDE_ADS_NEW_PRODUCT,
    { variables: { position: "left_new_product" } }
  );
  const { loading: loadingRightAdsNewProduct, data: rightAds } = useQuery(
    SIDE_ADS_NEW_PRODUCT,
    { variables: { position: "rigth_new_product" } }
  );
  // const calculateTimeLeft = () => {
  //   const difference = +new Date("2024-04-10T00:00:00") - +new Date();
  //   let timeLeft: any = {};

  //   if (difference > 0) {
  //     timeLeft = {
  //       days: Math.floor(difference / (1000 * 60 * 60 * 24)),
  //       hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
  //       minutes: Math.floor((difference / 1000 / 60) % 60),
  //       seconds: Math.floor((difference / 1000) % 60),
  //     };
  //   }

  //   return timeLeft;
  // };

  // const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setTimeLeft(calculateTimeLeft());
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // });
  return (
    <div className="Home py-14 flex min-h-screen flex-col items-center px-8 ">
      <div className="container">
        <section className="flex justify-center  md:flex-row flex-col gap-6 items-center">
          <Left />
          <AdsCarousel />
          <Right />
        </section>
        <Services />
        <div className="nouveaux-product-parent-tabs flex flex-col     ">
          <TitleProduct title={"nouveaux Produits"} />
          <div className="Carousel_new_product flex gap-3">
            <SideAds
              adsLoaded={loadingLeftAdsNewProduct}
              image={leftAds?.advertismentByPosition?.images[0]}
              link={leftAds?.advertismentByPosition?.link}
              adsPositon={"Left Ads"}
            />

            <ProductTabs
              title={"nouveaux Produits"}
              data={data}
              loadingNewProduct={loadingNewProduct}
            />
          </div>
        </div>
        <FullWidth />
        <div className="TopDeals">
          <div className=" flex justify-between  ">
            <TitleProduct title={"Meilleures offres du jour"} />
            <div className="flex items-start  pt-3 ">
              <p className="p-2 font-bold"  >Hâtez-vous ! L'offre se termine dans :</p>
              {/* <div className="grid grid-flow-col bg-strongBeige text-white  text-center auto-cols-max">
                <div className="flex items-center gap-2 p-2 bg-neutral rounded-box text-neutral-content">
                  <span className="countdown font-mono text-base">
                    <span>{timeLeft.days}</span>
                  </span>
                  days
                </div>
                <div className="flex items-center gap-1  p-2 bg-neutral rounded-box text-neutral-content">
                  <span className="countdown font-mono text-base">
                    <span>{timeLeft.hours}</span>
                  </span>
                  hours
                </div>
                <div className="flex items-center gap-1  p-2 bg-neutral rounded-box text-neutral-content">
                  <span className="countdown font-mono text-base">
                    <span>{timeLeft.minutes}</span>
                  </span>
                  min
                </div>
                <div className="flex items-center gap-1  p-2 bg-neutral rounded-box text-neutral-content">
                  <span className="countdown font-mono text-base">
                    <span>{timeLeft.seconds}</span>
                  </span>
                  sec
                </div>
              </div> */}
            </div>
          </div>
          <TopDeals
          data={data}
          loadingNewProduct={loadingNewProduct}
          />
        </div>
        <FullWidth />
        <div className="Carousel_A_20DT">
          <TitleProduct title={"l'essentiel a 20DT"} />

          <ProductTabs data={data} loadingNewProduct={loadingNewProduct} />
        </div>
        <FullWidth />
        <div className="Promotion flex flex-col ">
          <TitleProduct title={"nouveaux Produits"} />

          <div className="flex  gap-3">
            <ProductTabs data={data} loadingNewProduct={loadingNewProduct} />
            <SideAds
              adsLoaded={loadingRightAdsNewProduct}
              image={rightAds?.advertismentByPosition?.images[0]}
              link={rightAds?.advertismentByPosition?.link}
              adsPositon={"Right Ads"}
            />
          </div>
        </div>
        <div className="servise_client grid gap-5 py-10 grid-cols-2 md:grid-cols-3 items-center">
          <div className="bg-mediumBeige w-full h-52">
            Service clent image 1
          </div>
          <div className="bg-mediumBeige w-full h-52">
            Service clent image 2
          </div>
          <div className="bg-mediumBeige col-span-2 md:col-span-1 w-full h-52">
            Service clent image 3
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
