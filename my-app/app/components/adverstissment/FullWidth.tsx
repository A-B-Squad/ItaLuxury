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
    <div className="py-10">
      <div className="tesx bg-mediumBeige w-full h-40">ADS</div>
      {/* <Image src={"ddd"} alt="adsFullWidth" /> */}
    </div>
  );
};

export default FullWidth;
