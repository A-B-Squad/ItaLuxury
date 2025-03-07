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
  <div className="bg-gray-100 px-3 py-2 rounded-md flex flex-col items-center">
    <span className="text-xl font-mono font-bold text-gray-800">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
));

TimeBlock.displayName = 'TimeBlock';

const DiscountCountDown = memo(({ discount }: DiscountProps) => {
  const DEFAULT_TIMEZONE = useMemo(() => "Africa/Tunis", []);

  const targetDate = useMemo(() => {
    if (!discount?.dateOfEnd && !discount?.endDate) return null;
    const dateValue = discount?.dateOfEnd || discount?.endDate;
    return new Date(typeof dateValue === 'string' && !isNaN(parseInt(dateValue))
      ? parseInt(dateValue) - 3600000
      : dateValue || '');
  }, [discount?.dateOfEnd, discount?.endDate]);

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
    show: false
  });

  const calculateTimeRemaining = useCallback((): TimeRemaining | null => {
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
    const initialTimeRemaining = calculateTimeRemaining();
    if (initialTimeRemaining) {
      setTimeRemaining(initialTimeRemaining);
    }

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

  // Don't render anything if more than 24 hours remaining or no discount
  if (!timeRemaining.show || !discount) {
    return null;
  }

  return (
    <div className="discount-countdown mt-2 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-sm bg-red-600 text-white px-2 py-1 rounded-sm font-medium">
          Économisez {priceDifference} TND
        </div>
        <span className="text-xs text-gray-500">TTC</span>
      </div>

      {timeRemaining.isExpired ? (
        <div className="text-red-500 font-medium mt-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          La réduction a expiré
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-600 font-medium">
            Offre se termine dans:
          </p>
          <div className="flex items-center gap-1.5">
            <TimeBlock value={timeRemaining.days} label="jours" />
            <span className="text-gray-400">:</span>
            <TimeBlock value={timeRemaining.hours} label="heures" />
            <span className="text-gray-400">:</span>
            <TimeBlock value={timeRemaining.minutes} label="min" />
            <span className="text-gray-400">:</span>
            <TimeBlock value={timeRemaining.seconds} label="sec" />
          </div>
        </div>
      )}
    </div>
  );
});


export default DiscountCountDown;