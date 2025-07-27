import { useEffect, useMemo, useState, useCallback, memo } from 'react';

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

interface TimeBlockProps {
  value: number;
  label: string;
}

const TimeBlock = memo(({ value, label }: TimeBlockProps) => (
  <div className="bg-red-600 text-white px-3 py-2 rounded-md flex flex-col items-center animate-pulse">
    <span className="text-xl font-mono font-bold">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-xs opacity-90">{label}</span>
  </div>
));

TimeBlock.displayName = 'TimeBlock';

const DiscountCountDown = memo(({ discount }: DiscountProps) => {
  const priceDifference = useMemo(() => {
    if (!discount?.price || !discount?.newPrice) return "0.000";
    return (discount.price - discount.newPrice).toFixed(3);
  }, [discount?.price, discount?.newPrice]);

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    show: true
  });

  const getTimeUntilNextDay = useCallback(() => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight
    
    return tomorrow.getTime() - now.getTime();
  }, []);

  const calculateTimeRemaining = useCallback((): TimeRemaining => {
    const distance = getTimeUntilNextDay();

    // Calculate time components
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
      show: true
    };
  }, [getTimeUntilNextDay]);

  useEffect(() => {
    // Initialize countdown
    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  // Don't render if no discount
  if (!discount) {
    return null;
  }

  return (
    <div className="discount-countdown mt-2 mb-4 border-2 border-red-200 rounded-lg p-3 bg-red-50">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-sm bg-red-600 text-white px-3 py-1 rounded-full font-bold animate-bounce">
          🔥 OFFRE LIMITÉE - Économisez {priceDifference} TND
        </div>
        <span className="text-xs text-gray-500">TTC</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <span className="text-red-600 font-bold text-sm">⏰</span>
          <p className="text-sm text-red-700 font-bold">
            Cette offre se termine dans:
          </p>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <TimeBlock value={timeRemaining.days} label="jours" />
          <span className="text-red-600 font-bold text-xl animate-pulse">:</span>
          <TimeBlock value={timeRemaining.hours} label="heures" />
          <span className="text-red-600 font-bold text-xl animate-pulse">:</span>
          <TimeBlock value={timeRemaining.minutes} label="min" />
          <span className="text-red-600 font-bold text-xl animate-pulse">:</span>
          <TimeBlock value={timeRemaining.seconds} label="sec" />
        </div>
        <p className="text-xs text-center text-red-600 font-medium mt-1">
          ⚡ Profitez-en avant qu'il ne soit trop tard!
        </p>
      </div>
    </div>
  );
});

export default DiscountCountDown;