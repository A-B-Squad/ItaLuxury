"use client";

import React, { useEffect, useState } from "react";
import { TbPackages } from "react-icons/tb";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useQuery } from "@apollo/client";
import { PACKAGE_QUERY } from "@/graphql/queries";
import { PiPackage } from "react-icons/pi";

import {
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
} from "date-fns";

const getStats = (packages: any) => {
  const stats = {
    today: [0, 0],
    lastDay: [0, 0],
    thisWeek: [0, 0],
    thisMonth: [0, 0],
    thisYear: [0, 0],
  };
console.log(packages);

  packages.forEach((pkg: any) => {
    const packageDate = pkg.createdAt;
    
    if (pkg.status === "DELIVERED") {
      console.log(packageDate);
      console.log("====================================");
      console.log(isToday(packageDate));
      console.log("====================================");
      if (isToday(packageDate)) {
        stats.today[0]++;
        stats.today[1] += pkg.Checkout.total;
      } else if (isYesterday(packageDate)) {
        stats.lastDay[0]++;
        stats.lastDay[1] += pkg.Checkout.total;
      } else if (isThisWeek(packageDate)) {
        stats.thisWeek[0]++;
        stats.thisWeek[1] += pkg.Checkout.total;
      } else if (isThisMonth(packageDate)) {
        stats.thisMonth[0]++;
        stats.thisMonth[1] += pkg.Checkout.total;
      } else if (isThisYear(packageDate)) {
        stats.thisYear[0]++;
        stats.thisYear[1] += pkg.Checkout.total;
      }
    }
  });

  console.log("Stats:", stats);
  return stats;
};

const Dashborad = () => {
  const [packageData, setPackageData] = useState([]);
  const [stats, setStats] = useState({
    today: [0, 0],
    lastDay: [0, 0],
    thisWeek: [0, 0],
    thisMonth: [0, 0],
    thisYear: [0, 0],
  });

  const { loading } = useQuery(PACKAGE_QUERY, {
    onCompleted: (data) => {
      setPackageData(data.getAllPackages);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (packageData.length) {
      const calculatedStats = getStats(packageData);
      setStats(calculatedStats);
    }
  }, [packageData]);

  return (
    <div className="w-full p-8">
      <div className="main-cards container grid grid-cols-4 gap-5 my-4">
        <div className="card flex flex-col justify-around p-4 px-6 rounded bg-white border shadow-md">
          <div className="card-inner text-lg text-mainColorAdminDash flex items-center justify-between">
            <h3>PRODUITS</h3>
            <PiPackage className="card_icon" />
          </div>
          <h1 className="text-mainColorAdminDash">300</h1>
        </div>
        <div className="card flex flex-col justify-around p-4 px-6 rounded bg-white border shadow-md">
          <div className="card-inner text-lg text-mainColorAdminDash flex items-center justify-between">
            <h3 className="tracking-wider">COMMANDES</h3>
            <TbPackages className="card_icon" />
          </div>
          <h1 className="text-mainColorAdminDash">12</h1>
        </div>
        <div className="card flex flex-col justify-around p-4 px-6 rounded bg-white border shadow-md">
          <div className="card-inner text-lg text-mainColorAdminDash flex items-center justify-between">
            <h3>CLIENTS</h3>
            <LuUsers2 className="card_icon" />
          </div>
          <h1 className="text-mainColorAdminDash">33</h1>
        </div>
        <div className="card flex flex-col justify-around p-4 px-6 rounded bg-white border shadow-md">
          <div className="card-inner text-lg text-mainColorAdminDash flex items-center justify-between">
            <h3>UP SELLS</h3>
            <MdKeyboardDoubleArrowUp className="card_icon" />
          </div>
          <h1 className="text-mainColorAdminDash">42</h1>
        </div>
      </div>
      <div className="w-full mt-10 border shadow-md rounded-sm">
        <h1 className="font-semibold py-5 px-4 border-b-2 w-full">
          Aperçu de votre tableau de bord
        </h1>
        <div className="flex justify-around mt-8 p-5">
          <div className="border w-[45%] rounded-sm">
            <h1 className="flex items-center justify-center gap-2 p-3 font-bold w-full border-b-2">
              <PiPackage className="card_icon" size={24} />
              Commandes
            </h1>
            <div className="m-5 border rounded-sm flex flex-col">
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">Aujourd’hui</span>
                <span className="font-semibold">{stats.today[0]}</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">Hier</span>
                <span className="font-semibold">{stats.lastDay[0]}</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">
                  Cette semaine
                </span>
                <span className="font-semibold">{stats.thisWeek[0]}</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">Ce mois-ci</span>
                <span className="font-semibold">{stats.thisMonth[0]}</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">Cette année</span>
                <span className="font-semibold">{stats.thisYear[0]}</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">Total</span>
                <span className="font-semibold">{packageData.length}</span>
              </div>
            </div>
          </div>
          <div className="border w-[45%] rounded-sm">
            <h1 className="flex items-center justify-center gap-2 p-3 tracking-wider font-bold w-full border-b-2">
              <MdOutlineAttachMoney size={24} />
              Gains
            </h1>
            <div className="m-5 border rounded-sm flex flex-col">
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">Aujourd’hui</span>
                <span className="font-semibold">{stats.today[1]} TND</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">Hier</span>
                <span className="font-semibold">{stats.lastDay[1]} TND</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">
                  Cette semaine
                </span>
                <span className="font-semibold">{stats.thisWeek[1]} TND</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">Ce mois-ci</span>
                <span className="font-semibold">{stats.thisMonth[1]} TND</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">Cette année</span>
                <span className="font-semibold">{stats.thisYear[1]} TND</span>
              </div>
              <div className="flex justify-between border-b-2 p-4">
                <span className="font-semibold text-gray-600">Total</span>
                <span className="font-semibold">
                  {stats.today[1] +
                    stats.lastDay[1] +
                    stats.thisWeek[1] +
                    stats.thisMonth[1] +
                    stats.thisYear[1]}{" "}
                  TND
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashborad;
