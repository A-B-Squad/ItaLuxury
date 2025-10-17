"use client";

import { ADVERTISSMENT_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";

interface Advertisement {
    link: string[];
    images: string[];
}

const CenterAds = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { data: centerAdsData } = useQuery<{ advertismentByPosition: Advertisement[] }>(
        ADVERTISSMENT_QUERY,
        {
            variables: { position: "BigAds" },
            fetchPolicy: "cache-first",
        }
    );

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10000);
        return () => clearTimeout(timer);
    }, []);

    const advertisement = centerAdsData?.advertismentByPosition[0];

    if (!advertisement) return null;

    return (
        <div
            className={`fixed inset-0 hidden lg:flex items-center justify-center transition-all ${isVisible ? "opacity-100 z-[1000]" : "opacity-0 pointer-events-none"
                }`}
        >
            <div className="bg-black/80 absolute inset-0" />

            <div className={`relative bg-white rounded-lg transition-transform ${isVisible ? "scale-100" : "scale-90"
                }`}>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full border-4 border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center"
                >
                    <RiCloseLine size={20} color="#6B7280" />
                </button>

                <Link
                    href={advertisement.link[0] || "#"}
                    className="block w-[700px] h-[450px]"
                    target="_blank"
                    rel="noopener"
                >
                    <Image
                        src={advertisement.images[0]}
                        alt="Advertisement"
                        fill
                        className="object-contain"
                        quality={75}
                    />
                </Link>
            </div>
        </div>
    );
};

export default CenterAds;