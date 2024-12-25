import { useEffect, useMemo, useState, useCallback } from 'react';

const DiscountCountDown = ({ discount }: any) => {
  const DEFAULT_TIMEZONE = useMemo(() => "Africa/Tunis", []);

  const targetDate = useMemo(() => {
    if (!discount?.dateOfEnd) return null;
    return new Date(parseInt(discount.dateOfEnd) - 3600000);
  }, [discount?.dateOfEnd]);

  const priceDifference = useMemo(() => {
    if (!discount?.price || !discount?.newPrice) return "0.000";
    return (discount.price - discount.newPrice).toFixed(3);
  }, [discount?.price, discount?.newPrice]);

  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    show: false
  });

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
        isExpired: true,
        show: false
      };
    }

    // Calculate time components
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Show only if 24 hours or less remaining
    const totalHours = days * 24 + hours;
    const show = totalHours <= 24;

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      show
    };
  }, [targetDate]);

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining() || timeRemaining);

    if (!targetDate) return;

    const interval = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining();
      if (newTimeRemaining) {
        setTimeRemaining(newTimeRemaining);
        if (newTimeRemaining.isExpired) {
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, calculateTimeRemaining]);

  const TimeBlock = ({ value, label }: any) => (
    <div className="bg-gray-100 px-3 py-2 rounded-md">
      <span className="text-xl font-mono font-bold text-gray-800">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs text-gray-500 ml-1">{label}</span>
    </div>
  );

  // Don't render anything if more than 24 hours remaining
  if (!timeRemaining.show) {
    return null;
  }

  return (
    <>
      <div className="text-gray-400 tracking-wide flex items-center text-xl gap-2">
        <p className="text-sm bg-blue-800 text-white p-1">
          Économisez
          <span className="font-bold ml-1">{priceDifference} TND</span>
        </p>
        <span className="text-sm">TTC</span>
      </div>
      {timeRemaining.isExpired ? (
        <div className="text-red-500 font-medium mt-2">
          La réduction a expiré
        </div>
      ) : (
        <div className="flex items-center gap-1 mt-2">
          <div className="flex gap-1">
            <TimeBlock value={timeRemaining.days} label="j" />
            <TimeBlock value={timeRemaining.hours} label="h" />
            <TimeBlock value={timeRemaining.minutes} label="m" />
            <TimeBlock value={timeRemaining.seconds} label="s" />
          </div>
        </div>
      )}
    </>
  );
};

export default DiscountCountDown;