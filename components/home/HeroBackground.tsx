"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const IMAGES = ["/images/capa.jpg"];
const INTERVAL_MS = 6000;

export default function HeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % IMAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt="Vania e Mauro"
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 200vw, 100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}
