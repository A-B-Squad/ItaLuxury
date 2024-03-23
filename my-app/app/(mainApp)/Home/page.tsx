import SideAds from "@/components/adverstissment/sideAds";
import AdsCarousel from "../../components/adverstissment/carousel";
import Left from "../../components/adverstissment/left";
import Right from "../../components/adverstissment/right";
import Services from "./_components/services";
import ProductTabs from "./_components/productTabs";
const Home = () => {
  const data = [
    {
      id: 1,
      name: "Set D'ustensiles De Cuisine 12 Pièces En Silicone - Gris",
      description: "Description of Product 1",
      price: 29.99,
      image:
        "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895472/set-d-ustensiles-de-cuisine-12-pieces-en-silicone-gris_gwvgbz.jpg",
      categories: [
        {
          name: "Maison & Decorations",
        },
      ],
    },
    {
      id: 1,
      name: "Set D'ustensiles De Cuisine 12 Pièces En Silicone - Gris",
      description: "Description of Product 1",
      price: 29.99,
      image:
        "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895472/set-d-ustensiles-de-cuisine-12-pieces-en-silicone-gris_gwvgbz.jpg",
      categories: [
        {
          name: "Maison & Decorations",
        },
      ],
    },
    {
      id: 1,
      name: "Set D'ustensiles De Cuisine 12 Pièces En Silicone - Gris",
      description: "Description of Product 1",
      price: 29.99,
      image:
        "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895472/set-d-ustensiles-de-cuisine-12-pieces-en-silicone-gris_gwvgbz.jpg",
      categories: [
        {
          name: "Maison & Decorations",
        },
      ],
    },
    {
      id: 1,
      name: "Set D'ustensiles De Cuisine 12 Pièces En Silicone - Gris",
      description: "Description of Product 1",
      price: 29.99,
      image:
        "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895472/set-d-ustensiles-de-cuisine-12-pieces-en-silicone-gris_gwvgbz.jpg",
      categories: [
        {
          name: "Maison & Decorations",
        },
      ],
    },
    {
      id: 2,
      name: "Robot Pétrin 5.5L 1000W Galaxy Naturel MK-36",
      description: "Description of Product 2",
      price: 39.99,
      image:
        "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895549/theiere-en-verre-avec-filtre-a-the-350-ml_ouqqso.jpg",
      categories: [
        {
          name: "Maison & Decorations",
        },
      ],
    },
    {
      id: 3,
      name: "Théière En Verre Avec Filtre À Thé 350 Ml",
      description: "Description of Product 3",
      price: 39.99,
      image:
        "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710895581/robot-petrin-55l-1000w-galaxy-naturel-mk-36_bhs5mp.jpg",
      categories: [
        {
          name: "Maison & Decorations",
        },
      ],
    },
    {
      id: 4,
      name: "Product 4",
      description: "Description of Product 4",
      price: 39.99,
      image:
        "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710583580/four-micro-ondes-isole-fond-transparent_191095-10614_ovxlna.jpg",
      categories: [
        {
          name: "Maison & Decorations",
        },
      ],
    },
    {
      id: 5,
      name: "Product 5",
      description: "Description of Product 5",
      price: 39.9,
      image:
        "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710583580/four-micro-ondes-isole-fond-transparent_191095-10614_ovxlna.jpg",
      categories: [
        {
          name: "Maison & Decorations",
        },
      ],
    },
    {
      id: 6,
      name: "Product 6",
      description: "Description of Product 6",
      price: 49,
      newPrice: 10,
      image:
        "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710583580/four-micro-ondes-isole-fond-transparent_191095-10614_ovxlna.jpg",
      categories: [
        {
          name: "Maison & Decorations",
        },
      ],
    },
  ];

  return (
    <div className="Home py-14 flex min-h-screen flex-col items-center px-10 ">
      <div className="container">
        <section className="flex justify-center  md:flex-row flex-col gap-6 items-center">
          <Left />
          <AdsCarousel />
          <Right />
        </section>
        <Services />
        <div className="nouveaux-product-parent-tabs mt-10 flex gap-3 overflow-hidden items-center ">
          <SideAds
            image={
              "https://res.cloudinary.com/dc1cdbirz/image/upload/v1710535479/meilleur_vente_r0mqti.jpg"
            }
            link={"wwww"}
          />
          <ProductTabs title={"nouveaux Produits"} products={data} />
        </div>
      </div>
    </div>
  );
};

export default Home;
