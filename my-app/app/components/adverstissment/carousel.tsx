"use client"
import { Carousel } from "@material-tailwind/react";
import React from 'react'

const AdsCarousel = () => {
  return (
    <Carousel autoplay className="rounded-xl md:w-[55%] lg:w-[53%] w-[100%] " placeholder={''}>
      <img
        src="https://wamia-media.s3.eu-west-1.amazonaws.com/wysiwyg/wamia-ramadan/SlidesS1.2.jpg"
        alt="image 1"
        className="h-full w-full object-fill"
      />
      <img
        src="https://wamia-media.s3.eu-west-1.amazonaws.com/wysiwyg/wamia-ramadan/SlidesS1.3.jpg"
        alt="image 2"
        className="h-full w-full object-fill"
      />
      <img
        src="https://wamia-media.s3.eu-west-1.amazonaws.com/wysiwyg/wamia-ramadan/SlidesS1.1.jpg"
        alt="image 3"
        className="h-full w-full object-fill"
      />
      <img
        src="https://wamia-media.s3.eu-west-1.amazonaws.com/wysiwyg/wamia-ramadan/SlidesS1.1.jpg"
        alt="image 3"
        className="h-full w-full object-fill"
      />
    </Carousel>
  )
}

export default AdsCarousel