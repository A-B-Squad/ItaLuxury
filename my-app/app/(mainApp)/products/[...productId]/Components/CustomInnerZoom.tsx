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
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
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
    const scrollAmount = 88;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      container.scrollTo({
        left: direction === 'next'
          ? container.scrollLeft + scrollAmount
          : container.scrollLeft - scrollAmount,
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        top: direction === 'next'
          ? container.scrollTop + scrollAmount
          : container.scrollTop - scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const nextImage = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const previousImage = useCallback(() => {
    setSelectedImage((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

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
            className="relative w-full aspect-square overflow-hidden rounded-lg  border border-gray-200"
            ref={mainImageRef}
          >
            <div
              className={`relative w-full h-full ${isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in scale-100'} transition-transform duration-300`}
              onClick={toggleZoom}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZoomed(false)}
              style={{
                transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center'
              }}
            >
              <Image
                fill
                src={validImages[selectedImage]}
                alt={`${alt} ${selectedImage + 1}`}
                className="object-contain"
                priority={selectedImage === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow-sm">
              {isZoomed ? <ZoomOut className="w-5 h-5 text-gray-700" /> : <ZoomIn className="w-5 h-5 text-gray-700" />}
            </div>

            {!isZoomed && validImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); previousImage(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
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
          <div className="relative flex md:block">
            {/* Scroll buttons */}
            {validImages.length > 4 && (
              <>
                <button
                  onClick={() => scrollThumbnails('prev')}
                  className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-800" />
                </button>
                <button
                  onClick={() => scrollThumbnails('next')}
                  className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
                >
                  <ChevronRight className="w-4 h-4 text-gray-800" />
                </button>
              </>
            )}

            <div
              ref={thumbnailsRef}
              className="flex md:flex-col gap-2 py-3 px-2 md:py-4 overflow-x-auto md:overflow-y-auto no-scrollbar w-full justify-center"
            >
              {validImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md border-2 overflow-hidden transition-all duration-200 ${selectedImage === index
                    ? 'border-primaryColor shadow-md'
                    : 'border-transparent hover:border-gray-300'
                    }`}
                >
                  <Image
                    src={image}
                    alt={`Product image ${index}`}
                    width={80}
                    height={80}
                    className="object-contain"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
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
