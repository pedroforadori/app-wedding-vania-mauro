"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Dias", value: timeLeft?.days },
    { label: "Horas", value: timeLeft?.hours },
    { label: "Minutos", value: timeLeft?.minutes },
    { label: "Segundos", value: timeLeft?.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-6">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex w-16 flex-col items-center rounded-xl border border-primary/30 bg-secondary/30 py-3 backdrop-blur-sm md:w-24 md:py-5"
        >
          <span className="font-serif text-2xl md:text-4xl">
            {unit.value !== undefined ? String(unit.value).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-widest text-primary/80 md:text-xs">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
