"use client";

import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const fontSize = 22.5;
const padding = 15;
const height = fontSize + padding;

export function AnimatedCounter({ value }: { value: number }) {
  const showTens = value >= 10;

  return (
    <div
      style={{ fontSize }}
      className="flex items-center overflow-hidden leading-none text-[#3a3a3a] tracking-[-0.055em] font-[var(--font-inter)]"
    >
      {showTens && <Digit place={10} value={value} />}
      <Digit place={1} value={value} />
    </div>
  );
}

function Digit({ place, value }: { place: number; value: number }) {
  let valueRoundedToPlace = Math.floor((value / place) % 10);
  let animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div
      style={{ height }}
      className="relative w-[1ch] tabular-nums font-[var(--font-inter)]"
    >
      {[...Array(10).keys()].map((i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </div>
  );
}

function Number({ mv, number }: { mv: MotionValue; number: number }) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center font-[var(--font-inter)]"
    >
      {number}
    </motion.span>
  );
}
