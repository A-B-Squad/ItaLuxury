import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/legacy/image';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

interface CustomInnerZoomProps {
  images: string[];
  alt?: string;
}

const CustomInnerZoom: React.FC<CustomInnerZoomProps> = memo(({ images = [], alt = "Product image" }) => {
  const validImages = Array.isArray(images) ? images : [];
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for zoom effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  }, [isZoomed]);

  // Toggle zoom state
  const toggleZoom = useCallback(() => {
    setIsZoomed(prev => !prev);
  }, []);

  // Reset zoom when changing images
  useEffect(() => {
    setIsZoomed(false);
  }, [selectedImage]);

  // Scroll thumbnails in the specified direction
  const scrollThumbnails = useCallback((direction: 'prev' | 'next') => {
    if (!thumbnailsRef.current) return;

    const container = thumbnailsRef.current;
    const scrollAmount = 88; // Thumbnail height + gap
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
  }, []);

  // Scroll to the selected thumbnail
  const scrollToSelectedThumbnail = useCallback(() => {
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
  }, [selectedImage]);

  // Handle wheel event for thumbnail scrolling
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (!thumbnailsRef.current) return;
    e.preventDefault();

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      thumbnailsRef.current.scrollLeft += e.deltaY;
    } else {
      thumbnailsRef.current.scrollTop += e.deltaY;
    }
  }, []);

  // Navigate to next/previous image
  const nextImage = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const previousImage = useCallback(() => {
    setSelectedImage((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mainImageRef.current && document.activeElement === mainImageRef.current) {
        switch (e.key) {
          case 'ArrowRight':
            nextImage();
            break;
          case 'ArrowLeft':
            previousImage();
            break;
          case ' ':
            toggleZoom();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, previousImage, toggleZoom]);

  // Scroll to selected thumbnail when it changes
  useEffect(() => {
    scrollToSelectedThumbnail();
  }, [selectedImage, scrollToSelectedThumbnail]);

  // Handle empty images array
  if (validImages.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Aucune image disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Main image container */}
        <div className="order-1 md:order-2 flex-1">
          <div
            className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100  border-gray-200"
            ref={mainImageRef}
            tabIndex={0}
            aria-label={`Image ${selectedImage + 1} of ${validImages.length}. Press space to zoom, arrow keys to navigate.`}
          >
            <div
              className={`relative w-full h-full ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'} ${isZoomed ? 'scale-150' : 'scale-100'
                } transition-transform duration-300`}
              onClick={toggleZoom}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZoomed(false)}
              style={{
                transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center'
              }}
            >
              <Image
                layout="fill"
                src={validImages[selectedImage]}
                alt={`${alt} ${selectedImage + 1}`}
                className="w-full h-full object-contain"
                priority={selectedImage === 0}
                quality={90}
              />
            </div>

            {/* Zoom indicator */}
            <div className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow-sm z-10">
              {isZoomed ? (
                <ZoomOut className="w-5 h-5 text-gray-700" />
              ) : (
                <ZoomIn className="w-5 h-5 text-gray-700" />
              )}
            </div>

            {/* Main image navigation buttons */}
            {!isZoomed && validImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    previousImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {selectedImage + 1} / {validImages.length}
            </div>
          </div>
        </div>

        {/* Thumbnails container */}
        <div className="order-2 md:order-1 md:w-24 w-full max-w-screen-sm mx-auto">
          <div className="relative">
            {/* Thumbnail navigation - Mobile (horizontal) */}
            {validImages.length > 4 && (
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => scrollThumbnails('prev')}
                  className="absolute left-0 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  aria-label="Défiler les vignettes vers la gauche"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-800" />
                </button>
                <button
                  onClick={() => scrollThumbnails('next')}
                  className="absolute right-0 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  aria-label="Défiler les vignettes vers la droite"
                >
                  <ChevronRight className="w-4 h-4 text-gray-800" />
                </button>
              </div>
            )}

            {/* Thumbnail navigation - Desktop (vertical) */}
            {validImages.length > 4 && (
              <div className="hidden md:block">
                <button
                  onClick={() => scrollThumbnails('prev')}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  aria-label="Défiler les vignettes vers le haut"
                >
                  <ChevronUp className="w-4 h-4 text-gray-800" />
                </button>
                <button
                  onClick={() => scrollThumbnails('next')}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  aria-label="Défiler les vignettes vers le bas"
                >
                  <ChevronDown className="w-4 h-4 text-gray-800" />
                </button>
              </div>
            )}

            {/* Thumbnails */}
            <div
              ref={thumbnailsRef}
              onWheel={handleWheel}
              className="flex md:flex-col justify-start gap-2 py-8 md:py-12 px-8 md:px-0 overflow-x-auto md:overflow-y-auto md:h-[500px] no-scrollbar scroll-smooth"
              aria-label="Vignettes de produit"
            >
              {validImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-16 md:w-20 h-16 md:h-20 overflow-hidden rounded-md border-2 transition-all duration-200 ${selectedImage === index
                    ? 'border-primaryColor shadow-md'
                    : 'border-transparent hover:border-gray-300'
                    }`}
                  aria-label={`Sélectionner l'image ${index + 1}`}
                  aria-current={selectedImage === index ? 'true' : 'false'}
                >
                  <Image
                    src={image}
                    alt={`Product image ${index}`}
                    width={600}
                    height={600}
                    priority={index === 0} // Only prioritize the first image
                    quality={80} // Reduce quality slightly for faster loading
                    className="object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Fade effects */}
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent md:hidden pointer-events-none" />
            <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent md:hidden pointer-events-none" />
            <div className="hidden md:block absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent pointer-events-none" />
            <div className="hidden md:block absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
});

CustomInnerZoom.displayName = 'CustomInnerZoom';

// Add CSS for hiding scrollbars
if (typeof document !== 'undefined') {
  if (!document.getElementById('custom-inner-zoom-style')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'custom-inner-zoom-style';
    styleElement.textContent = `
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(styleElement);
  }
}

export default CustomInnerZoom;