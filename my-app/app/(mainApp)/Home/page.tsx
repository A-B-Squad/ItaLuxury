"use client";
import ProductTabs from "@/components/ProductCarousel/productTabs";
import TitleProduct from "@/components/ProductCarousel/titleProduct";
import AdsCarousel from "@/components/adverstissment/carousel";
import FullWidth from "@/components/adverstissment/FullWidth";
import Left from "@/components/adverstissment/left";
import Right from "@/components/adverstissment/right";
import { gql, useQuery } from "@apollo/client";
import ProductDetails from "../../components/ProductDetails/ProductDetails";
import Services from "./_components/services";
import TopDeals from "./TopDeals/TopDeals";
import ClientServices from "./_components/ClientServices";
import SideAds from "@/components/adverstissment/sideAds";
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
        inventory
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
  const TAKE_6_PRODUCTS_PRICE_20 = gql`
    query ProductsLessThen20($limit: Int!) {
      productsLessThen20(limit: $limit) {
        id
        name
        price
        reference
        description
        createdAt
        inventory
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
  const { loading: loadingNewProduct, data: Products_6 } = useQuery(
    TAKE_6_PRODUCTS,
    {
      variables: { limit: 6 },
    }
  );
  const { loading: loadingProduct, data: Product_less_20 } = useQuery(
    TAKE_6_PRODUCTS_PRICE_20,
    {
      variables: { limit: 6 },
    }
  );

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
  const calculateTimeLeft = () => {
    const difference = +new Date("2024-04-10T00:00:00") - +new Date();
    let timeLeft: any = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="Home py-10 flex min-h-screen flex-col items-center px-8 ">
      <div className="container">
        <section className="flex justify-center  lg:flex-row flex-col gap-4 items-center">
          <Left />
          <AdsCarousel />
          <Right />
        </section>
        <Services />
        <ProductDetails />
        <div className="nouveaux-product-parent-tabs flex flex-col ">
          <TitleProduct title={"nouveaux Produits"} />
          <div className="Carousel_new_product flex gap-3">
            <SideAds
              adsLoaded={loadingLeftAdsNewProduct}
              image={leftAds?.advertismentByPosition[0]?.images[0]}
              link={leftAds?.advertismentByPosition[0]?.link}
              adsPositon={"Left Ads"}
            />

            <ProductTabs
              title={"nouveaux Produits"}
              data={Products_6}
              loadingNewProduct={loadingNewProduct}
            />
          </div>
        </div>
        <FullWidth />
        <div className="TopDeals">
          <div className=" flex justify-between gap-2 items-start  ">
            <TitleProduct title={"Meilleures offres du jour"} />
            <div className="flex items-start flex-col md:flex-row pt-3  ">
              <p className="md:p-2 font-bold">
                Hâtez-vous ! L'offre se termine dans :
              </p>
              <div className="grid grid-flow-col bg-strongBeige text-white  text-center  auto-cols-max">
                <div className="flex items-center gap-2 md:p-2 p-1  rounded-box">
                  <span className="countdown font-mono text-base">
                    <span>{timeLeft.days}</span>
                  </span>
                  <span className="">days</span>
                </div>
                <div className="flex items-center gap-1  md:p-2 p-1  ">
                  <span className="countdown font-mono text-base">
                    <span>{timeLeft.hours}</span>
                  </span>
                  <span>hours</span>
                </div>
                <div className="flex items-center gap-1  md:p-2 p-1  ">
                  <span className="countdown font-mono text-base">
                    <span>{timeLeft.minutes}</span>
                  </span>
                  <span>min</span>
                </div>
                <div className="flex items-center gap-1  md:p-2 p-1  ">
                  <span className="countdown font-mono text-base">
                    <span>{timeLeft.seconds}</span>
                  </span>
                  <span>sec</span>
                </div>
              </div>
            </div>
          </div>
          <TopDeals />
        </div>
        <FullWidth />
        <div className="Carousel_A_20DT">
          <TitleProduct title={"l'essentiel a 20DT"} />
          <div>
            <ProductTabs
              data={Product_less_20}
              loadingNewProduct={loadingProduct}
              carouselWidthClass={
                Product_less_20?.productsLessThen20?.length < 5
                  ? "xl:basis-1/2"
                  : ""
              }
            />
          </div>
        </div>
        <FullWidth />
        <div className="Promotion flex flex-col ">
          <TitleProduct title={"Promotions"} />

          <div className="flex  gap-3">
            <ProductTabs
              data={Products_6}
              loadingNewProduct={loadingNewProduct}
            />
            <SideAds
              adsLoaded={loadingRightAdsNewProduct}
              image={rightAds?.advertismentByPosition[0]?.images[0]}
              link={rightAds?.advertismentByPosition[0]?.link}
              adsPositon={"Right Ads"}
            />
          </div>
        </div>
        <ClientServices />
      </div>
    </div>
  );
};

export default Home;
