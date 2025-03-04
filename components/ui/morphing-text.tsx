"use client";

import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const morphTime = 2;
const cooldownTime = 5.5;

const useMorphingText = (
  texts: string[],
  loop: boolean = true,
  startDelay: number = 0
) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());
  const startTimeRef = useRef<number | null>(null);
  const isFirstRenderRef = useRef(true);
  const animationCompleteRef = useRef(false);
  const hasStartedRef = useRef(false);

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2) return;

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(
        8 / invertedFraction - 8,
        100
      )}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts]
  );

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;

      if (!loop && textIndexRef.current >= texts.length - 1) {
        animationCompleteRef.current = true;
      }
    }
  }, [setStyles, loop, texts.length]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    if (text1Ref.current && text2Ref.current) {
      text1Ref.current.textContent = texts[0];
      text2Ref.current.textContent = texts[1 % texts.length];

      text1Ref.current.style.opacity = "100%";
      text1Ref.current.style.filter = "none";
      text2Ref.current.style.opacity = "0%";
      text2Ref.current.style.filter = "none";
    }
  }, [texts]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const currentTime = newTime.getTime();

      if (isFirstRenderRef.current) {
        startTimeRef.current = currentTime;
        isFirstRenderRef.current = false;
      }

      if (startDelay > 0 && !hasStartedRef.current) {
        if (currentTime - (startTimeRef.current || 0) < startDelay * 1000) {
          return;
        } else {
          hasStartedRef.current = true;
          timeRef.current = newTime;
        }
      }

      const dt = (currentTime - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      if (animationCompleteRef.current) {
        return;
      }

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown, startDelay]);

  return { text1Ref, text2Ref };
};

interface MorphingTextProps {
  className?: string;
  texts: string[];
  loop?: boolean;
  startDelay?: number;
}

const Texts: React.FC<
  Pick<MorphingTextProps, "texts" | "loop" | "startDelay">
> = ({ texts, loop = true, startDelay = 0 }) => {
  const { text1Ref, text2Ref } = useMorphingText(texts, loop, startDelay);
  return (
    <>
      <span
        className="absolute text-[32px] text-zinc-800 inset-x-0 top-0 m-auto inline-block w-full"
        ref={text1Ref}
      />
      <span
        className="absolute text-[32px] text-zinc-800 inset-x-0 top-0 m-auto inline-block w-full"
        ref={text2Ref}
      />
    </>
  );
};

const SvgFilters: React.FC = () => (
  <svg id="filters" className="hidden" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
  loop = true,
  startDelay = 0,
}) => (
  <div
    className={cn(
      "relative mx-auto h-16 w-full max-w-screen-md text-left text-[40pt] font-bold leading-none [filter:url(#threshold)_blur(0.6px)] md:h-24 lg:text-[6rem]",
      className
    )}
  >
    <Texts texts={texts} loop={loop} startDelay={startDelay} />
    <SvgFilters />
  </div>
);

export { MorphingText };
