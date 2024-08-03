"use client";
import { TOP_DEALS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import moment from "moment-timezone";

const DEFAULT_TIMEZONE = "Africa/Tunis";

const TimeCountDown = () => {
  const { data: topDeals } = useQuery(TOP_DEALS);
  const [countdown, setCountdown] = useState<number>(0);

  const createdAt = topDeals?.allDeals[0]?.product?.productDiscounts[0]?.dateOfEnd;

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
  const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

  return (
    <div className="grid grid-flow-col bg-primaryColor text-white text-center auto-cols-max">
      <div className="flex items-center gap-2 md:p-2 p-1 rounded-box">
        <span className="countdown font-mono text-base">
          <span>{days}</span>
        </span>
        <span>Jours</span>
      </div>
      <div className="flex items-center gap-2 md:p-2 p-1 rounded-box">
        <span className="countdown font-mono text-base">
          <span>{hours}</span>
        </span>
        <span>Heures</span>
      </div>
      <div className="flex items-center gap-1 md:p-2 p-1">
        <span className="countdown font-mono text-base">
          <span>{minutes}</span>
        </span>
        <span>Minutes</span>
      </div>
      <div className="flex items-center gap-1 md:p-2 p-1">
        <span className="countdown font-mono text-base">
          <span>{seconds}</span>
        </span>
        <span>Secondes</span>
      </div>
    </div>
  );
};

export default TimeCountDown;
