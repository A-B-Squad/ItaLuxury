"use client"

import React,{useState} from "react";
import { useQuery, gql } from "@apollo/client";


const Left = () => {

  const [images,setImages] = useState([])
  const ADVERTISSMENT_QUERY = gql`
    query AdvertismentByPosition($position: String!) {
      advertismentByPosition(position: $position) {
        images
      }
    }
  `;

  const {data,loading,error} = useQuery(ADVERTISSMENT_QUERY,{
    variables:{position:"left"},
    onCompleted:(data)=>{
        setImages(data.advertismentByPosition.images);
    }
  })


  return (
    <div className="left flex md:flex-col flex-row gap-5 md:gap-12">
      <img
        src={images[0]}
        alt="image 1"
        className="rounded-xl w-[10rem] md:w-[22rem]"
      />
      <img
        src={images[1]}
        alt="image 2"
        className="rounded-xl w-[10rem] md:w-[22rem]"
      />
    </div>
  );
};

export default Left;
