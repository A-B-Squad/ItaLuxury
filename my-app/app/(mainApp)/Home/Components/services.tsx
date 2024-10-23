import { CiDeliveryTruck } from "react-icons/ci";
import { FaTags } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { MdOutlineSupportAgent } from "react-icons/md";

const Services = () => {
  return (
    <section className="mt-10 border px-5 h-24 md:flex md:items-center md:justify-center hidden w-full justify-between bg-white">
      <ul className="grid place-content-between w-full grid-cols-3">
        <li className="flex text-center justify-center items-center gap-3 pr-4 text-base border-r-2">
          <CiDeliveryTruck size={50} className="text-primaryColor" />
          <div>
            <h3 className="font-semibold">LIVRAISON OFFERTE</h3>
            <h4 className="text-sm">Dès 499 TND d'achats</h4>
          </div>
        </li>
        <li className="flex text-center justify-center items-center gap-3 pr-4 border-r-2">
          <MdOutlineSupportAgent className="text-primaryColor" size={50} />
          <div>
            <h3 className="font-semibold">ASSISTANCE 24H/7J</h3>
            <h4 className="text-sm">Service en ligne 24/7</h4>
          </div>
        </li>
        <li className="flex text-center justify-center items-center gap-3 pr-4">
          <FaTags className="text-primaryColor" size={40} />
          <div>
            <h3 className="font-semibold">OFFRES EXCLUSIVES</h3>
            <h4 className="text-sm">Profitez de nos promotions spéciales</h4>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default Services;
