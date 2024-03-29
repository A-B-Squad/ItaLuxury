"use client";
import SideAds from "@/components/adverstissment/sideAds";
import AdsCarousel from "../../components/adverstissment/carousel";
import Left from "../../components/adverstissment/left";
import Right from "../../components/adverstissment/right";
import Services from "./_components/services";
import ProductTabs from "../../components/ProductCarousel/productTabs";
import { gql, useQuery } from "@apollo/client";

const Home = () => {
  // const data = [
  //   {
  //     id: 1,
  //     createdAt: new Date(),
  //     name: "Set D'ustensiles De Cuisine 12 Pièces En Silicone - Gris",
  //     description: "Description of Product 1",
  //     price: 29.99,
  //     image:
  //       "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895472/set-d-ustensiles-de-cuisine-12-pieces-en-silicone-gris_gwvgbz.jpg",
  //     categories: [
  //       {
  //         name: "Maison & Decorations",
  //       },
  //     ],
  //     productDiscount: [
  //       {
  //         price: 49,
  //         newPrice: 10,
  //       },
  //     ],
  //   },
  //   {
  //     id: 1,
  //     createdAt: new Date(),
  //     name: "Set D'ustensiles De Cuisine 12 Pièces En Silicone - Gris",
  //     description: "Description of Product 1",
  //     price: 29.99,
  //     image:
  //       "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895472/set-d-ustensiles-de-cuisine-12-pieces-en-silicone-gris_gwvgbz.jpg",
  //     categories: [
  //       {
  //         name: "Maison & Decorations",
  //       },
  //     ],
  //   },
  //   {
  //     id: 1,
  //     createdAt: new Date(),
  //     name: "Set D'ustensiles De Cuisine 12 Pièces En Silicone - Gris",
  //     description: "Description of Product 1",
  //     price: 29.99,
  //     image:
  //       "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895472/set-d-ustensiles-de-cuisine-12-pieces-en-silicone-gris_gwvgbz.jpg",
  //     categories: [
  //       {
  //         name: "Maison & Decorations",
  //       },
  //     ],
  //     productDiscount: [
  //       {
  //         price: 49,
  //         newPrice: 10,
  //       },
  //     ],
  //   },
  //   {
  //     id: 1,
  //     createdAt: new Date(2003),
  //     name: "Set D'ustensiles De Cuisine 12 Pièces En Silicone - Gris",
  //     description: "Description of Product 1",
  //     price: 29.99,
  //     image:
  //       "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895472/set-d-ustensiles-de-cuisine-12-pieces-en-silicone-gris_gwvgbz.jpg",
  //     categories: [
  //       {
  //         name: "Maison & Decorations",
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     createdAt: new Date(),
  //     name: "Robot Pétrin 5.5L 1000W Galaxy Naturel MK-36",
  //     description: "Description of Product 2",
  //     price: 39.99,
  //     image:
  //       "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895549/theiere-en-verre-avec-filtre-a-the-350-ml_ouqqso.jpg",
  //     categories: [
  //       {
  //         name: "Maison & Decorations",
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     createdAt: new Date(),
  //     name: "Théière En Verre Avec Filtre À Thé 350 Ml",
  //     description: "Description of Product 3",
  //     price: 39.99,
  //     image:
  //       "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895581/robot-petrin-55l-1000w-galaxy-naturel-mk-36_bhs5mp.jpg",
  //     categories: [
  //       {
  //         name: "Maison & Decorations",
  //       },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     createdAt: new Date(),
  //     name: "Product 4",
  //     description: "Description of Product 4",
  //     price: 39.99,
  //     image:
  //       "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710583580/four-micro-ondes-isole-fond-transparent_191095-10614_ovxlna.jpg",
  //     categories: [
  //       {
  //         name: "Maison & Decorations",
  //       },
  //     ],
  //   },
  //   {
  //     id: 5,
  //     createdAt: new Date(),
  //     name: "Product 5",
  //     description: "Description of Product 5",
  //     price: 39.9,
  //     image:
  //       "https://res.cloudinary.com/dc1cdbirz/image/upload/v1702581442/1699375528_M0565OBXZ_M933_E01_ZHC-removebg-preview_sy9kl7.png",

  //     categories: [
  //       {
  //         name: "Maison & Decorations",
  //       },
  //     ],
  //   },
  //   {
  //     id: 6,
  //     createdAt: new Date(2003),
  //     name: "Product 6",
  //     description: "Description of Product 6",
  //     price: 20.9,

  //     image:
  //       "https://res.cloudinary.com/dc1cdbirz/image/upload/v1702579584/1698925472_M0455CBAA_M30G_E01_ZHC-removebg-preview_gthcjl.png",
  //     categories: [
  //       {
  //         name: "Maison & Decorations",
  //       },
  //     ],
  //   },
  // ];

  const TAKE_6_PRODUCTS = gql`
    query Products($limit: Int!) {
      products(limit: $limit) {
        id
        name
        price
        reference
        description
        createdAt
        categories {
          name
        }
        ProductColorImage {
          images
          Colors {
            color
            Hex
          }
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
  const { loading: loadingAdsNewProduct, data: leftAds } = useQuery(
    SIDE_ADS_NEW_PRODUCT,
    { variables: { position: "left_new_product" } }
  );

  return (
    <div className="Home py-14 flex min-h-screen flex-col items-center px-8 ">
      <div className="container">
        <section className="flex justify-center  md:flex-row flex-col gap-6 items-center">
          <Left />
          <AdsCarousel />
          <Right />
        </section>
        <Services />
        <div className="nouveaux-product-parent-tabs  mt-10 flex gap-3 ">
          <SideAds
            adsLoaded={loadingAdsNewProduct}
            image={leftAds?.advertismentByPosition?.images[0]}
            link={leftAds?.advertismentByPosition?.link}
          />

          <ProductTabs
            title={"nouveaux Produits"}
            data={data}
            loadingNewProduct={loadingNewProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
