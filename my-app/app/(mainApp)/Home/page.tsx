import React from "react";
import AdsCarousel from "../../components/adverstissment/carousel";
import Left from "../../components/adverstissment/left";
import Right from "../../components/adverstissment/right";
import Services from "@/components/services"

const Home = () => {



  return (
    <div className="Home py-14 flex min-h-screen flex-col items-center px-5 ">
      <section className="flex justify-center  md:flex-row flex-col gap-6 items-center">
        <Left />
        <AdsCarousel />
        <Right/>
      </section>
        
      <Services/>

    </div>
  );
};

export default Home;
