"use client";
import { Carousel } from "@material-tailwind/react";
import { useQuery, gql } from "@apollo/client";
import React, { useState } from "react";

const AdsCarousel = () => {
  const [images, setImages] = useState([]);
  const ADVERTISSMENT_QUERY = gql`
    query AdvertismentByPosition($position: String!) {
      advertismentByPosition(position: $position) {
        images
      }
    }
  `;

  const { data, loading, error } = useQuery(ADVERTISSMENT_QUERY, {
    variables: { position: "slider" },
    onCompleted: (data) => {
      setImages(data.advertismentByPosition.images);
    },
  });

  return (
    <Carousel
      autoplay
      className="rounded-xl md:w-[55%] lg:w-[52%] w-[100%] "
      placeholder={""}
    >
      {images.map((image, index) => (
        <img
          src={image}
          key={index}
          alt="image 1"
          className="h-full w-full object-fill"
        />
      ))}
    </Carousel>
  );
};

export default AdsCarousel;
