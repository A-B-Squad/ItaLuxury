"use client";

import React from "react";
import { Truck, Shield, Headphones, Gift, DollarSign, Store } from "lucide-react";
import { RiVisaFill } from "react-icons/ri";

interface ServiceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Services: React.FC = () => {
  const services: ServiceFeature[] = [
    {
      icon: <Truck className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Livraison rapide",
      description: "Entre 24 et 72 heures"
    },
    {
      icon: <RiVisaFill className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Paiement sécurisé",
      description: "Certificat SSL"
    },
    {
      icon: <Headphones className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Support client",
      description: "Disponible 7j/7"
    },
    {
      icon: <Truck className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Livraison gratuite",
      description: "Dès 499 DT d'achat"
    },
    {
      icon: <DollarSign className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Paiement à la livraison",
      description: "En espèces"
    },
    {
      icon: <Store className="w-7 h-7 sm:w-8 sm:h-8" />,
      title: "Retrait en magasin",
      description: "Gratuit et immédiat"
    }
  ];

  return (
    <div className="service_client w-full bg-white border border-gray-200 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex items-center gap-3 group px-3 py-2 sm:py-0 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <div className="flex-shrink-0 text-logoColor group-hover:text-logoColor/80 transition-colors">
                {service.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-gray-900 font-semibold text-sm sm:text-base leading-tight truncate">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;