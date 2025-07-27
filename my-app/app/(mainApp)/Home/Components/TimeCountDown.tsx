"use client";
  
import React, { useEffect, useState } from "react";

const TimeCountDown = () => {
  const [countdown, setCountdown] = useState<number>(0);

  const getTimeUntilNextDay = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight
    
    return tomorrow.getTime() - now.getTime();
  };

  useEffect(() => {
    // Initialize countdown with time until next day
    setCountdown(getTimeUntilNextDay());

    const updateCountdown = () => {
      const timeLeft = getTimeUntilNextDay();
      setCountdown(timeLeft);
    };

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time units
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

// Professional time box component with pulsing animation for urgency
const TimeBox = ({ 
  value, 
  label
}: { 
  value: number; 
  label: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="bg-red-500 text-white px-3 py-2 rounded text-center w-[45px] md:w-[55px] animate-pulse">
      <span className="font-bold text-base md:text-xl">
        {value.toString().padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] mt-1 font-medium text-center w-full text-red-600">
      {label}
    </span>
  </div>
);

export default TimeCountDown;