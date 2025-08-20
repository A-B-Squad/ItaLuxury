import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image'


interface CustomInnerZoomProps {
  images: string[];
}

const CustomInnerZoom: React.FC<CustomInnerZoomProps> = ({ images = [] }) => {
  const validImages = Array.isArray(images) ? images : [];
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Reset selected image when images change
  useEffect(() => {
    setSelectedImage(0);
    setIsZoomed(false);
  }, [images]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const scrollThumbnails = (direction: 'prev' | 'next') => {
    if (!thumbnailsRef.current) return;

    const container = thumbnailsRef.current;
    const scrollAmount = window.innerWidth < 768 ? 84 : 96; // Thumbnail + gap
    const newScroll = direction === 'next'
      ? container.scrollLeft + scrollAmount
      : container.scrollLeft - scrollAmount;

    container.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  };

  const scrollToSelectedThumbnail = () => {
    if (!thumbnailsRef.current) return;

    const container = thumbnailsRef.current;
    const thumbnailWidth = window.innerWidth < 768 ? 84 : 96;
    const scrollPosition = selectedImage * thumbnailWidth;

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!thumbnailsRef.current) return;
    e.preventDefault();
    thumbnailsRef.current.scrollLeft += e.deltaY;
  };

  useEffect(() => {
    scrollToSelectedThumbnail();
  }, [selectedImage]);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % validImages.length);
  };

  const previousImage = () => {
    setSelectedImage((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  if (validImages.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col-reverse gap-4">
        {/* Thumbnails */}
        <div className="w-full max-w-lg mx-auto relative">
          {/* Thumbnail Navigation Arrows */}
          {validImages.length > 4 && (
            <>
              <button
                onClick={() => scrollThumbnails('prev')}
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Previous thumbnails"
              >
                <ChevronLeft className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={() => scrollThumbnails('next')}
                className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Next thumbnails"
              >
                <ChevronRight className="w-4 h-4 text-gray-800" />
              </button>
            </>
          )}

          <div className="relative w-full">
            <div
              ref={thumbnailsRef}
              onWheel={handleWheel}
              className="flex gap-4 justify-start overflow-x-auto no-scrollbar px-6 py-2 mx-auto"
            >
              {validImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden 
                    ${selectedImage === index
                      ? 'ring-2 ring-offset-2 ring-primaryColor shadow-lg'
                      : 'ring-1 ring-gray-200'
                    }`}
                >
                  <Image
                    src={image}
                    alt={`Product thumbnail ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className={`transition-opacity duration-200 ${selectedImage === index
                      ? 'opacity-100'
                      : 'opacity-70 hover:opacity-100'
                      }`}
                  />
                </button>
              ))}
            </div>
            {validImages.length > 4 && (
              <>
                <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              </>
            )}
          </div>
        </div>

        {/* Main image */}
        <div className="relative h-[350px] sm:h-[400px] md:h-[450px] w-full mx-auto overflow-hidden rounded-lg bg-gray-100">
          <div
            className={`relative w-full h-full cursor-zoom-in ${isZoomed ? 'scale-150' : 'scale-100'
              } transition-transform duration-300`}
            onClick={() => setIsZoomed(!isZoomed)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
            style={{
              transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center'
            }}
          >
            <Image
              src={validImages[selectedImage]}
              alt={`Product image ${selectedImage + 1}`}
              layout="fill"
              objectFit="contain"
              className="w-full h-full"
              priority
            />
          </div>

          {!isZoomed && validImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  previousImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const style = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = style;
  document.head.appendChild(styleElement);
}

export default CustomInnerZoom;