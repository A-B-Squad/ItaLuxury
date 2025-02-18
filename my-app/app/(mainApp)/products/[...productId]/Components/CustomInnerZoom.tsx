import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import Image from 'next/legacy/image';

interface CustomInnerZoomProps {
  images: string[];
}

const CustomInnerZoom: React.FC<CustomInnerZoomProps> = ({ images = [] }) => {
  const validImages = Array.isArray(images) ? images : [];
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  interface MousePosition {
    x: number;
    y: number;
  }

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
    const scrollAmount = 88; // Thumbnail height + gap (80px + 8px)
    
    // Check if we're in mobile view
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Horizontal scrolling for mobile
      const newScroll = direction === 'next' 
        ? container.scrollLeft + scrollAmount 
        : container.scrollLeft - scrollAmount;
      
      container.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    } else {
      // Vertical scrolling for desktop
      const newScroll = direction === 'next' 
        ? container.scrollTop + scrollAmount 
        : container.scrollTop - scrollAmount;
      
      container.scrollTo({
        top: newScroll,
        behavior: 'smooth'
      });
    }
  };

  const scrollToSelectedThumbnail = () => {
    if (!thumbnailsRef.current) return;

    const container = thumbnailsRef.current;
    const thumbnailSize = 88; // Thumbnail size + gap
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      container.scrollTo({
        left: selectedImage * thumbnailSize,
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        top: selectedImage * thumbnailSize,
        behavior: 'smooth'
      });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!thumbnailsRef.current) return;
    e.preventDefault();
    
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      thumbnailsRef.current.scrollLeft += e.deltaY;
    } else {
      thumbnailsRef.current.scrollTop += e.deltaY;
    }
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
      <div className="w-full max-w-6xl mx-auto">
        <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Main image container */}
        <div className="order-1 md:order-2 flex-1">
          <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100">
            <div
              className={`relative w-full h-full cursor-zoom-in ${
                isZoomed ? 'scale-150' : 'scale-100'
              } transition-transform duration-300`}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZoomed(false)}
              style={{
                transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center'
              }}
            >
              <Image
                layout="fill"
                src={validImages[selectedImage]}
                alt={`Product image ${selectedImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Main image navigation buttons */}
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

        {/* Thumbnails container */}
        <div className="order-2 md:order-1 md:w-24 w-full max-w-screen-sm mx-auto">
          <div className="relative">
            {/* Thumbnail navigation - Mobile (horizontal) */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => scrollThumbnails('prev')}
                className="absolute left-0 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Scroll thumbnails left"
              >
                <ChevronLeft className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={() => scrollThumbnails('next')}
                className="absolute right-0 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Scroll thumbnails right"
              >
                <ChevronRight className="w-4 h-4 text-gray-800" />
              </button>
            </div>

            {/* Thumbnail navigation - Desktop (vertical) */}
            <div className="hidden md:block">
              <button
                onClick={() => scrollThumbnails('prev')}
                className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Scroll thumbnails up"
              >
                <ChevronUp className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={() => scrollThumbnails('next')}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Scroll thumbnails down"
              >
                <ChevronDown className="w-4 h-4 text-gray-800" />
              </button>
            </div>

            {/* Thumbnails */}
            <div
              ref={thumbnailsRef}
              onWheel={handleWheel}
              className="flex md:flex-col justify-start gap-2 py-8 md:py-12 px-8 md:px-0 overflow-x-auto md:overflow-y-auto md:h-[500px] no-scrollbar scroll-smooth"
            >
              {validImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-16 md:w-20 h-16 md:h-20 overflow-hidden group`}
                >
                  <Image
                    layout="fill"
                    src={image}
                    alt={`Product thumbnail ${index + 1}`}
                    className={`w-full h-full object-cover transition-opacity duration-200 ${
                      selectedImage === index
                        ? 'opacity-100'
                        : 'opacity-60 group-hover:opacity-100'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Fade effects */}
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent md:hidden pointer-events-none" />
            <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent md:hidden pointer-events-none" />
          </div>
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