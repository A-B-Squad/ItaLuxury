import Image from "next/image";
import Link from "next/link";

/**
 * FullWidth Advertisement Component
 * 
 * DESIGNER SPECIFICATIONS - Use these dimensions for ALL images:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OPTIMAL IMAGE SIZE: 1920 x 240 pixels                      │
 * │  Aspect Ratio: 8:1 (landscape)                              │
 * │  Format: WebP + PNG fallback                                │
 * │  Resolution: 72-96 DPI                                      │
 * │  Color Mode: RGB                                            │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * Display Sizes:
 * • Mobile: 375px+ wide × 96px high (h-24)
 * • Desktop: 1280px+ wide × 192px high (h-48)
 * • Single 1920×240 image works perfectly for all devices
 */

interface FullWidthAdsProps {
  FullAdsLoaded: boolean;
  FullImageAds: string;
  LinkTo: string;
  priority?: boolean;
}

const FullWidthAds = ({ FullAdsLoaded, FullImageAds, LinkTo, priority = false }: FullWidthAdsProps) => {
  if (FullAdsLoaded) {
    return (
      <div className="max-w-screen-2xl mx-auto my-2 px-4">
        <div className="w-full h-24 md:h-48 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!FullImageAds) {
    return (
      <div className="max-w-screen-2xl mx-auto my-2 px-4">
        <div className="w-full h-24 md:h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-sm">Advertisement unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto my-2 px-">
      <Link href={LinkTo || "#"} className="block group">
        {/*  Mobile h-24(96px) | Desktop h-48(192px) |  1920×240px */}
        <div className="relative w-full h-24 md:h-48 rounded-lg overflow-hidden">
          <Image
            src={FullImageAds}
            alt="Advertisement"
            fill
            className="object-cover transition-transform group-hover:scale-105"
            quality={75}
            priority={priority}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
        </div>
      </Link>
    </div>
  );
};

export default FullWidthAds;