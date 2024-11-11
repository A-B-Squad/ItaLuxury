import { useEffect, useMemo, useState, useCallback } from 'react';

const DiscountCountDown = ({ discount }:any) => {
  // Memoize timezone to avoid recreating it
  const DEFAULT_TIMEZONE = useMemo(() => "Africa/Tunis", []);
  
  // Pre-calculate the target date once
  const targetDate = useMemo(() => {
    if (!discount?.dateOfEnd) return null;
    return new Date(parseInt(discount.dateOfEnd) - 3600000); 
  }, [discount?.dateOfEnd]);

  // Memoize price difference calculation
  const priceDifference = useMemo(() => {
    if (!discount?.price || !discount?.newPrice) return "0.000";
    return (discount.price - discount.newPrice).toFixed(3);
  }, [discount?.price, discount?.newPrice]);

  // Use more efficient date calculations without moment.js
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  // Memoize the calculation function to prevent recreation on each render
  const calculateTimeRemaining = useCallback(() => {
    if (!targetDate) return null;
    
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;
    
    if (distance <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
      isExpired: false
    };
  }, [targetDate]);

  useEffect(() => {
    // Initial calculation
    setTimeRemaining(calculateTimeRemaining() || timeRemaining);

    // Only set up interval if we have a valid target date
    if (!targetDate) return;

    const interval = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining();
      if (newTimeRemaining) {
        setTimeRemaining(newTimeRemaining);
        
        // Clear interval if expired
        if (newTimeRemaining.isExpired) {
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, calculateTimeRemaining]);

  // Memoize the countdown display to prevent unnecessary re-renders
  const countdownDisplay = useMemo(() => {
    if (timeRemaining.isExpired) {
      return "La réduction a expiré";
    }
    
    return (
      <>
        La réduction se termine dans :{' '}
        <span className="font-semibold text-lg">
          {timeRemaining.days} jrs,{' '}
          {timeRemaining.hours} hrs : {timeRemaining.minutes} mins : {timeRemaining.seconds} secs
        </span>
      </>
    );
  }, [timeRemaining]);

  return (
    <>
      <div className="text-gray-400 tracking-wide flex items-center text-xl gap-2">
        <p className="text-sm bg-blue-800 text-white p-1">
          Économisez
          <span className="font-bold ml-1">{priceDifference} TND</span>
        </p>
        <span className="text-sm">TTC</span>
      </div>
      <div className="text-sm text-green-400">
        {countdownDisplay}
      </div>
    </>
  );
};

export default DiscountCountDown;