import React, { useEffect } from 'react';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type ImageType = string | StaticImageData;

interface SmallImageCarouselProductInfoProps {
    images: ImageType[];
    bigImage: ImageType | null;
    setBigImage: (image: ImageType) => void;
}

const SmallImageCarouselProductInfo: React.FC<SmallImageCarouselProductInfoProps> = ({
    images,
    bigImage,
    setBigImage
}) => {
    const safeImages = images || [];

    useEffect(() => {
        if (safeImages.length > 0 && !bigImage) {
            setBigImage(safeImages[0]);
        }
    }, [safeImages, bigImage, setBigImage]);

    if (safeImages.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-3xl mx-auto mt-6">
            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {safeImages.map((image, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/5 md:basis-1/6 lg:basis-1/7">
                            <div
                                className={cn(
                                    "aspect-square overflow-hidden rounded-lg cursor-pointer",
                                    "transition-all duration-300 ease-in-out",
                                    "border-2 hover:border-secondaryColor",
                                    image === bigImage
                                        ? "ring-2 ring-primaryColor ring-offset-2"
                                        : "ring-1 ring-gray-200"
                                )}
                                onMouseEnter={() => setBigImage(image)}

                            >
                                <Image
                                    width={120}
                                    height={120}
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
            </Carousel>
        </div>
    );
};

export default SmallImageCarouselProductInfo;