import React from "react";
import AdsCarousel from "../../components/adverstissment/carousel";
import Left from "../../components/adverstissment/left";
import Right from "../../components/adverstissment/right";
import { cookies } from "next/headers";

const Home = () => {

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-5">
      <section className="flex justify-center  md:flex-row flex-col gap-6 items-center">
        <Left />
        <AdsCarousel />
        <Right/>
      </section>
    </div>
  );
};

export default Home;
