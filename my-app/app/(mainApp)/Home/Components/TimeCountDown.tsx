"use client";
  
import React, { useEffect, useState } from "react";


const TimeCountDown = () => {
  const [countdown, setCountdown] = useState<number>(24 * 60 * 60 * 1000); // Start with 24 hours

  useEffect(() => {
    const updateCountdown = () => {
      // Decrease countdown by 1 second
      setCountdown(prevCountdown => {
        // If countdown reaches 0, reset to 24 hours
        if (prevCountdown <= 1000) {
          return 24 * 60 * 60 * 1000;
        }
        return prevCountdown - 1000;
      });
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
    <div className="bg-[#1e2a4a] text-white px-3 py-2 rounded text-center w-[45px] md:w-[55px] animate-pulse">
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
