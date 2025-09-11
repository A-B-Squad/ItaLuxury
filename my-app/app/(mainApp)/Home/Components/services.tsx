import { CiDeliveryTruck } from "react-icons/ci";
import { FaTags } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { MdOutlineSupportAgent } from "react-icons/md";
import { motion } from "framer-motion";

const Services = () => {
  const services = [
    {
      icon: <CiDeliveryTruck size={50} className="text-primaryColor" />,
      title: "LIVRAISON OFFERTE",
      description: "Dès 499 TND d'achats",
    },
    {
      icon: <MdOutlineSupportAgent className="text-primaryColor" size={50} />,
      title: "ASSISTANCE 24H/7J",
      description: "Service en ligne 24/7",
    },
    {
      icon: <FaTags className="text-primaryColor" size={40} />,
      title: "OFFRES EXCLUSIVES",
      description: "Profitez de nos promotions spéciales",
    },
   
  ];

  return (
    <>
      {/* Desktop version */}
      <section className="mt-10 border px-5 py-6 md:flex md:items-center md:justify-center hidden w-full bg-white rounded-lg shadow-sm">
        <ul className="grid place-content-between w-full grid-cols-3   gap-4">
          {services.map((service, index) => (
            <li 
              key={index} 
              className={`flex text-center justify-center items-center gap-3 pr-4 text-base ${
                index < services.length - 1 ? "border-r-2" : ""
              } hover:bg-gray-50 transition-colors duration-300 py-2 px-3 rounded-md`}
            >
              {service.icon}
              <div>
                <h3 className="font-semibold text-gray-800">{service.title}</h3>
                <h4 className="text-sm text-gray-600">{service.description}</h4>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Mobile version */}
      <section className="mt-6 mb-4 md:hidden w-full">
        <div className="overflow-x-auto pb-4 no-scrollbar">
          <div className="flex space-x-4 px-4">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 min-w-[140px] max-w-[160px]"
              >
                <div className="mb-3 text-primaryColor bg-amber-50 p-3 rounded-full">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-sm text-center text-gray-800 mb-1">{service.title}</h3>
                <p className="text-xs text-center text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
