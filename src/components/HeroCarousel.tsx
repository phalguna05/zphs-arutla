"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Corners } from "./Corners";

type Slide = { src: string; alt: string };

const INTERVAL_MS = 5000;

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, count]);

  if (!count) return null;

  return (
    <figure
      className="carousel blueprint ratio-4-3"
      aria-roledescription="carousel"
      aria-label="School photos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="carousel-track">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className="carousel-slide"
            data-active={i === index}
            aria-hidden={i !== index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 820px) 100vw, 580px"
              priority={i === 0}
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      {count > 1 && (
        <>
          <button type="button" className="carousel-arrow carousel-prev" aria-label="Previous photo" onClick={() => go(index - 1)}>
            ‹
          </button>
          <button type="button" className="carousel-arrow carousel-next" aria-label="Next photo" onClick={() => go(index + 1)}>
            ›
          </button>
          <div className="carousel-dots">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                className="carousel-dot"
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </>
      )}
      <Corners />
    </figure>
  );
}
