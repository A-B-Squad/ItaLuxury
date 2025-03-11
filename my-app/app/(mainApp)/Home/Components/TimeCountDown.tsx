"use client";
import { TOP_DEALS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import moment from "moment-timezone";

const DEFAULT_TIMEZONE = "Africa/Tunis";

const TimeCountDown = () => {
  const { data: topDeals } = useQuery(TOP_DEALS);
  const [countdown, setCountdown] = useState<number>(0);

  const createdAt =
    topDeals?.allDeals[0]?.product?.productDiscounts[0]?.dateOfEnd;

  useEffect(() => {
    const updateCountdown = () => {
      if (createdAt) {
        const now = moment().tz(DEFAULT_TIMEZONE);
        const targetDate = moment.tz(parseInt(createdAt), DEFAULT_TIMEZONE);
        targetDate.subtract(1, "hours");

        const timeUntilTarget = targetDate.diff(now);
        setCountdown(timeUntilTarget > 0 ? timeUntilTarget : 0);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

  return (
    <div className="flex justify-end w-full">
      <div className="flex space-x-2">
        <TimeBox value={days} label="JOURS" />
        <TimeBox value={hours} label="HEURES" />
        <TimeBox value={minutes} label="MIN" />
        <TimeBox value={seconds} label="SEC" />
      </div>
    </div>
  );
};

// Professional time box component
const TimeBox = ({ 
  value, 
  label
}: { 
  value: number; 
  label: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="bg-[#1e2a4a] text-white px-3 py-2 rounded text-center w-[45px] md:w-[55px]">
      <span className="font-bold text-base md:text-xl">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] mt-1 font-medium text-center w-full">
      {label}
    </span>
  </div>
);

export default TimeCountDown;
