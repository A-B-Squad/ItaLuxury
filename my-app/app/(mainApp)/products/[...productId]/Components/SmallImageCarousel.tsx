import React, {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@react-hook/media-query";

type ImageType = string | StaticImageData;

interface SmallImageCarouselProductInfoProps {
    images: ImageType[] | null;
    bigImage: ImageType | null;
    setBigImage: Dispatch<SetStateAction<ImageType | null>>;
  }
  
const ImageCarousel: React.FC<SmallImageCarouselProductInfoProps> = ({
  images,
  bigImage,
  setBigImage,
}) => {
  const isLargeScreen = useMediaQuery("(min-width: 960px)");

  const safeImages = useMemo(() => images || [], [images]);

  useEffect(() => {
    if (safeImages.length > 0 && !bigImage) {
      setBigImage(safeImages[0]);
    }
  }, [safeImages, bigImage, setBigImage]);

  const carouselOptions = useMemo(
    () => ({
      align: "start" as const,
      loop: true,
    }),
    []
  );

  if (safeImages.length === 0) {
    return null;
  }

  const getItemBasis = (imageCount: number) =>
    imageCount > 3 ? "basis-1/3" : "basis-1/1";
  return (
    <div className="w-fit  max-w-lg mx-auto mb-6 mt-10">
      <Carousel
        opts={carouselOptions}
        orientation={isLargeScreen ? "vertical" : "horizontal"}
        className="w-full relative  max-w-xs md:max-w-md sm:max-w-sm lg:max-w-full"
      >
        <CarouselContent className="  gap-2 w-full h-full lg:max-h-[400px] lg:w-fit ">
          {safeImages.map((image, index) => (
            <CarouselItem
              key={index}
              className={`${getItemBasis(safeImages.length)} md:basis-1/5`}
            >
              <div
                className={cn(
                  "  rounded-lg w-[90px] h-[90px] cursor-pointer",
                  "transition-all duration-300 ease-in-out",
                  "border-2 hover:border-secondaryColor",
                  image === bigImage
                    ? "ring-2 ring-primaryColor ring-offset-2"
                    : "ring-1 ring-gray-200"
                )}
                onMouseEnter={() => setBigImage(image)}
              >
                <Image
                  width={90}
                  height={90}
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="object-cover "
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-1/3   -top-5  -translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2  lg:-top-5" />

        <CarouselNext className="absolute left-2/4 lg:right-0 -top-5 -translate-y-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:rotate-90 lg:-bottom-16 lg:top-auto" />
      </Carousel>
    </div>
  );
};

export default memo(ImageCarousel);
