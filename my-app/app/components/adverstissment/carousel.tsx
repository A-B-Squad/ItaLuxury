"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

interface Ad {
  images: string[]
  link: string
}

interface AdsCarouselProps {
  centerCarouselAds: Ad[]
  loadingCenterAdsCarousel: boolean
}

const AdsCarousel = ({ centerCarouselAds, loadingCenterAdsCarousel }: AdsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({})
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const images = useMemo(() => {
    if (!centerCarouselAds?.length) return []
    return centerCarouselAds.flatMap((ad) => ad.images).filter(Boolean)
  }, [centerCarouselAds])

  const firstAdLink = centerCarouselAds?.[0]?.link || "#"

  // Preload next and previous images for smooth transitions
  useEffect(() => {
    if (images.length <= 1) return
    
    const preloadImages = () => {
      const nextIndex = (currentIndex + 1) % images.length
      const prevIndex = (currentIndex - 1 + images.length) % images.length
      
      // Preload next image
      const nextImg = new window.Image()
      nextImg.src = images[nextIndex]
      
      // Preload previous image
      const prevImg = new window.Image()
      prevImg.src = images[prevIndex]
    }
    
    preloadImages()
  }, [currentIndex, images])

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, images.length])

  if (loadingCenterAdsCarousel || images.length === 0) {
    return <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-muted" />
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div
      className="group relative w-full overflow-hidden rounded-2xl shadow-lg transition-shadow hover:shadow-xl"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <Link href={firstAdLink} className="block" prefetch={true}>
        <div className="relative aspect-[16/9] bg-muted">
          {/* Main visible image */}
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Advertisement ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            quality={90}
            priority={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
            loading="eager"
            fetchPriority="high"
            onLoad={() => setImageLoaded({ ...imageLoaded, [currentIndex]: true })}
          />

          {/* Preload next image invisibly */}
          {images.length > 1 && (
            <>
              <Image
                src={images[(currentIndex + 1) % images.length]}
                alt="Preload next"
                fill
                className="hidden"
                quality={90}
                priority={currentIndex === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
              />
              {/* Preload previous image invisibly */}
              <Image
                src={images[(currentIndex - 1 + images.length) % images.length]}
                alt="Preload previous"
                fill
                className="hidden"
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
              />
            </>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    goToSlide(index)
                  }}
                  className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-white shadow-lg" : "w-2 bg-white/60 hover:bg-white/80"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  prevSlide()
                }}
                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  nextSlide()
                }}
                className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </Link>
    </div>
  )
}

export default AdsCarousel