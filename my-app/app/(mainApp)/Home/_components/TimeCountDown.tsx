"use client";
import React, { useEffect, useState } from 'react';

const TimeCountDown = () => {
  const [countdownToNextDay, setCountdownToNextDay] = useState<number>(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const timeUntilNextDay = tomorrow.getTime() - now.getTime();
      setCountdownToNextDay(timeUntilNextDay > 0 ? timeUntilNextDay : 0);
    };

    updateCountdown(); // Initialize the countdown immediately
    const interval = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-flow-col bg-strongBeige text-white text-center auto-cols-max">
      <div className="flex items-center gap-2 md:p-2 p-1 rounded-box">
        <span className="countdown font-mono text-base">
          <span>
            {Math.floor(countdownToNextDay / (1000 * 60 * 60))}
          </span>
        </span>
        <span className="">Heures</span>
      </div>
      <div className="flex items-center gap-1 md:p-2 p-1">
        <span className="countdown font-mono text-base">
          <span>
            {Math.floor(
              (countdownToNextDay % (1000 * 60 * 60)) / (1000 * 60)
            )}
          </span>
        </span>
        <span>Minutes</span>
      </div>
      <div className="flex items-center gap-1 md:p-2 p-1">
        <span className="countdown font-mono text-base">
          <span>
            {Math.floor((countdownToNextDay % (1000 * 60)) / 1000)}
          </span>
        </span>
        <span>Secondes</span>
      </div>
    </div>
  );
};

export default TimeCountDown;
