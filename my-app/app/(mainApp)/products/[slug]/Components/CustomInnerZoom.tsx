"use client";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const VISIBLE_THUMBNAILS = 5;
  const THUMBNAIL_SIZE = 88; 

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  }, [isZoomed]);

  const toggleZoom = useCallback(() => setIsZoomed(prev => !prev), []);

  useEffect(() => {
    setIsZoomed(false);
  }, [selectedImage]);

  const scrollThumbnails = useCallback((direction: 'prev' | 'next') => {
    if (!thumbnailsRef.current) return;
    const container = thumbnailsRef.current;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    setScrollPosition(prev => {
      const maxScroll = Math.max(0, validImages.length - VISIBLE_THUMBNAILS);
      let newPos = direction === 'next' ? prev + 1 : prev - 1;
      newPos = Math.max(0, Math.min(maxScroll, newPos));

      if (isMobile) {
        container.scrollTo({
          left: newPos * THUMBNAIL_SIZE,
          behavior: 'smooth'
        });
      } else {
        container.scrollTo({
          top: newPos * THUMBNAIL_SIZE,
          behavior: 'smooth'
        });
      }

      return newPos;
    });
  }, [validImages.length]);

  const nextImage = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const previousImage = useCallback(() => {
    setSelectedImage((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const canScrollPrev = scrollPosition > 0;
  const canScrollNext = scrollPosition < validImages.length - VISIBLE_THUMBNAILS;

  if (validImages.length === 0) {
    return (
      <div className="w-full mx-auto">
        <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Aucune image disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-[500px] md:max-w-6xl">
      <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">

        {/* Main image */}
        <div className="order-1 md:order-2 flex-1 w-full">
          <div
            className="relative w-full aspect-square overflow-hidden rounded-lg border border-gray-200"
            ref={mainImageRef}
          >

            <button
              type="button"
              className={`relative w-full h-full ${isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in scale-100'} transition-transform duration-300 border-0 bg-transparent p-0`}
              onClick={toggleZoom}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZoomed(false)}
              style={{
                transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center'
              }}
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              <Image
                fill
                src={validImages[selectedImage]}
                alt={`${alt} ${selectedImage + 1}`}
                className="object-contain"
                priority={selectedImage === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </button>

            <div className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow-sm">
              {isZoomed ? <ZoomOut className="w-5 h-5 text-gray-700" /> : <ZoomIn className="w-5 h-5 text-gray-700" />}
            </div>

            {!isZoomed && validImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); previousImage(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {selectedImage + 1} / {validImages.length}
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="order-2 md:order-1 w-full md:w-24">
          <div className="relative">
            {/* Scroll buttons - only show if more images than visible */}
            {validImages.length > VISIBLE_THUMBNAILS && (
              <>
                {/* Desktop vertical arrows */}
                <button
                  onClick={() => scrollThumbnails('prev')}
                  disabled={!canScrollPrev}
                  className={`hidden md:block absolute -top-8 left-1/2 -translate-x-1/2 z-10 bg-white border border-gray-200 p-1.5 rounded-full shadow-md transition-all ${canScrollPrev ? 'hover:bg-gray-50 hover:shadow-lg' : 'opacity-40 cursor-not-allowed'
                    }`}
                  aria-label="Scroll thumbnails up"
                >
                  <ChevronUp className="w-4 h-4 text-gray-800" />
                </button>
                <button
                  onClick={() => scrollThumbnails('next')}
                  disabled={!canScrollNext}
                  className={`hidden md:block absolute -bottom-8 left-1/2 -translate-x-1/2 z-10 bg-white border border-gray-200 p-1.5 rounded-full shadow-md transition-all ${canScrollNext ? 'hover:bg-gray-50 hover:shadow-lg' : 'opacity-40 cursor-not-allowed'
                    }`}
                  aria-label="Scroll thumbnails down"
                >
                  <ChevronDown className="w-4 h-4 text-gray-800" />
                </button>

                {/* Mobile horizontal arrows */}
                <button
                  onClick={() => scrollThumbnails('prev')}
                  disabled={!canScrollPrev}
                  className={`md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 p-1.5 rounded-full shadow-md transition-all ${canScrollPrev ? 'hover:bg-gray-50 hover:shadow-lg' : 'opacity-40 cursor-not-allowed'
                    }`}
                  aria-label="Scroll thumbnails left"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-800" />
                </button>
                <button
                  onClick={() => scrollThumbnails('next')}
                  disabled={!canScrollNext}
                  className={`md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 p-1.5 rounded-full shadow-md transition-all ${canScrollNext ? 'hover:bg-gray-50 hover:shadow-lg' : 'opacity-40 cursor-not-allowed'
                    }`}
                  aria-label="Scroll thumbnails right"
                >
                  <ChevronRight className="w-4 h-4 text-gray-800" />
                </button>
              </>
            )}

            <div
              ref={thumbnailsRef}
              className="flex md:flex-col gap-2 py-3 px-8 xl:p-0 md:px-2 md:py-4 overflow-x-auto md:overflow-y-auto no-scrollbar w-full md:max-h-[440px] scroll-smooth"
            >
              {validImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md border-2 overflow-hidden transition-all duration-200 ${selectedImage === index
                    ? 'border-primaryColor shadow-md'
                    : 'border-transparent hover:border-gray-300'
                    }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
});

CustomInnerZoom.displayName = 'CustomInnerZoom';

if (typeof document !== 'undefined') {
  if (!document.getElementById('custom-inner-zoom-style')) {
    const style = document.createElement('style');
    style.id = 'custom-inner-zoom-style';
    style.textContent = `
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
  }
}

export default CustomInnerZoom;