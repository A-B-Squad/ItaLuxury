import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
const FullWidth = () => {
  const [images, setImages] = useState([]);
  const ADVERTISSMENT_QUERY = gql`
    query AdvertismentByPosition($position: String!) {
      advertismentByPosition(position: $position) {
        images
      }
    }
  `;

  const { data, loading, error } = useQuery(ADVERTISSMENT_QUERY, {
    variables: { position: "left" },
    onCompleted: (data) => {
      setImages(data.advertismentByPosition.images);
    },
  });
  return (
    <div className="md:py-32 py-12 w-full h-full relative ">
      <Image
        src={
          "https://res.cloudinary.com/dc1cdbirz/image/upload/v1711937168/gdgjwty4swrew5vyna74.jpg"
        }
        layout="fill"
        objectFit="contain"
        alt="adsFullWidth"
      />
    </div>
  );
};

export default FullWidth;
