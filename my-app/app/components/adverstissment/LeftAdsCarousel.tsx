"use client"

import Link from "next/link"
import Image from "next/image"

interface Ad {
  images: string[]
  link: string
}

interface LeftAdsCarouselProps {
  AdsNextToCarousel: Ad[]
  loadingLeftAdsCarousel: boolean
}

const LeftAdsCarousel = ({ AdsNextToCarousel, loadingLeftAdsCarousel }: LeftAdsCarouselProps) => {
  if (loadingLeftAdsCarousel) {
    return (
      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="h-[200px] w-full animate-pulse rounded-2xl bg-muted lg:h-[230px] lg:w-[455px]" />
        <div className="h-[200px] w-full animate-pulse rounded-2xl bg-muted lg:h-[230px] lg:w-[455px]" />
      </div>
    )
  }

  const ads = AdsNextToCarousel?.slice(0, 2).filter((ad) => ad.images?.[0]) || []

  if (ads.length === 0) return null

  return (
    <div className="flex flex-row gap-4 xl:flex-col lg:gap-6">
      {ads.map((ad, index) => (
        <Link
          key={`${index}-${ad.images[0]}`}
          href={ad.link || "#"}
          className="group relative block h-[200px] w-full overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-xl lg:h-[230px] lg:w-[455px]"
        >
          <Image
            src={ad.images[0] || "/placeholder.svg"}
            alt={`Advertisement ${index + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            quality={85}
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 455px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  )
}

export default LeftAdsCarousel
