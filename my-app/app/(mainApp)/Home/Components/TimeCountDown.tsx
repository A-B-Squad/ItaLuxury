"use client";

import React, { useEffect, useState, useRef } from "react";

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div
      className="bg-red-500 text-white px-3 py-2 rounded text-center w-[45px] md:w-[55px] animate-pulse"
      style={{ minHeight: '40px' }}
    >
      <span className="font-bold text-base md:text-xl">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <span
      className="text-[10px] mt-1 font-medium text-center w-full text-red-600"
      style={{ minHeight: '12px' }}
    >
      {label}
    </span>
  </div>
);

const TimeCountDown = () => {
  const [countdown, setCountdown] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const getTimeUntilNextDay = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  };

  const timeUnits = (() => {
    const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
    const hours = Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countdown % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  })();

  const updateCountdown = () => {
    if (!mountedRef.current) return;
    const timeLeft = getTimeUntilNextDay();
    setCountdown(timeLeft);
  };

  useEffect(() => {
    setIsClient(true);
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="flex justify-end w-full">
        <div className="flex space-x-2">
          {['JOURS', 'HEURES', 'MIN', 'SEC'].map((label) => (
            <TimeBox key={label} value={0} label={label} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end w-full">
      <div className="flex space-x-2">
        <TimeBox value={timeUnits.days} label="JOURS" />
        <TimeBox value={timeUnits.hours} label="HEURES" />
        <TimeBox value={timeUnits.minutes} label="MIN" />
        <TimeBox value={timeUnits.seconds} label="SEC" />
      </div>
    </div>
  );
};

export default TimeCountDown;