import React, { useEffect, useState, useCallback } from 'react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  show: boolean;
}

interface DiscountProps {
  discount: {
    dateOfEnd?: string;
    price?: number;
    newPrice?: number;
    endDate?: string;
  };
}

const DiscountCountDown = ({ discount }: DiscountProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    show: true
  });

  const calculateTimeRemaining = useCallback((): TimeRemaining => {
    if (!discount?.dateOfEnd) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        show: false
      };
    }

    const now = new Date().getTime();
    const endDate = new Date(discount.dateOfEnd).getTime();
    const distance = endDate - now;

    if (distance < 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        show: false
      };
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      show: days <= 2
    };
  }, [discount?.dateOfEnd]);

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  // Don't render if no discount, expired, or more than 2 days remaining
  if (!discount || !timeRemaining.show || timeRemaining.isExpired) {
    return null;
  }

  return (
    <div className="flex items-center justify-center py-2">
      <div className="bg-gray-100 px-4 py-2 rounded-md border border-gray-300">
        <span className="font-mono text-lg text-gray-800 tracking-wider">
          {timeRemaining.days.toString().padStart(2, '0')} : {timeRemaining.hours.toString().padStart(2, '0')} : {timeRemaining.minutes.toString().padStart(2, '0')} : {timeRemaining.seconds.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default React.memo(DiscountCountDown);

