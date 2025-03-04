"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Hls from "hls.js";

import { CTAButton } from "@/components/cta-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { TextScramble } from "@/components/ui/text-scramble";
import { MorphingText } from "@/components/ui/morphing-text";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/* CountdownTimer component that shows days/hours/minutes/seconds until the target date */
function CountdownTimer({ timeLeft }) {
  return (
    <div
      className={`flex items-center text-[22.5px] tracking-[-0.055em] text-[#3a3a3a] ${
        timeLeft.isNegative ? "line-through opacity-50" : ""
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="flex items-center gap-0">
          <AnimatedCounter value={timeLeft.original.days} />
          <span>d</span>
        </div>
        <div className="flex items-center gap-0">
          <AnimatedCounter value={timeLeft.original.hours} />
          <span>h</span>
        </div>
        <div className="flex items-center gap-0">
          <AnimatedCounter value={timeLeft.original.minutes} />
          <span>m</span>
        </div>
        <div className="flex items-center gap-0">
          <AnimatedCounter value={timeLeft.original.seconds} />
          <span>s</span>
        </div>
      </div>
    </div>
  );
}

/* A delayed button that forces the user to wait 3 seconds before redirecting them to the target URL */
function DelayedCTAButton({
  href,
  variant = "solid",
  children,
  isTimeDelayed = true,
}) {
  const [waiting, setWaiting] = useState(false);
  const waitTime = isTimeDelayed ? 3 : 0;

  const handleClick = () => {
    if (waiting) return;
    setWaiting(true);
    setTimeout(() => {
      window.location.href = href;
    }, waitTime * 1000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={waiting}
      className={`px-14 py-[22px] transition-colors duration-200 tracking-[-0.055em] font-semibold text-[1.25rem] ${
        !waiting
          ? "bg-zinc-800 text-white hover:bg-zinc-700"
          : "bg-zinc-400 text-zinc-200 cursor-not-allowed"
      }`}
    >
      {isTimeDelayed
        ? !waiting
          ? children
          : `Wait ${waitTime} seconds... (just like you made us wait)`
        : children}
    </button>
  );
}

export default function Home() {
  // Audio state / refs
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Add timeLeft state to the Home component
  const [timeLeft, setTimeLeft] = useState(() => {
    const targetDate = new Date("2025-02-21T00:00:00");
    const now = new Date();
    const originalDifference = targetDate.getTime() - now.getTime();

    return {
      isNegative: originalDifference < 0,
      original: {
        days: Math.max(
          0,
          Math.floor(originalDifference / (1000 * 60 * 60 * 24))
        ),
        hours: Math.max(
          0,
          Math.floor((originalDifference / (1000 * 60 * 60)) % 24)
        ),
        minutes: Math.max(
          0,
          Math.floor((originalDifference / (1000 * 60)) % 60)
        ),
        seconds: Math.max(0, Math.floor((originalDifference / 1000) % 60)),
      },
    };
  });

  // Video refs (separate for desktop and mobile)
  const videoDesktopRef = useRef<HTMLVideoElement | null>(null);
  const videoMobileRef = useRef<HTMLVideoElement | null>(null);

  // Breakpoint: md (>=768px) is desktop
  const [isDesktop, setIsDesktop] = useState(true);

  // State for section visibility
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Audio events handling
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.pause();
    };
  }, []);

  // Attach HLS to the visible video element (desktop or mobile)
  useEffect(() => {
    const videoElement = isDesktop
      ? videoDesktopRef.current
      : videoMobileRef.current;
    if (!videoElement) return;

    const source = isDesktop ? "/desktop/index.m3u8" : "/mobile/index.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls({
        autoStartLoad: true,
        startLevel: 0,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        backBufferLength: 30,
        enableWorker: true,
        lowLatencyMode: true,
        progressive: true,
        abrEwmaDefaultEstimate: 500000,
        abrEwmaFastLive: 3,
        abrEwmaSlowLive: 9,
      });

      hls.loadSource(source);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("fatal network error encountered, try to recover");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("fatal media error encountered, try to recover");
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = source;
    }
  }, [isDesktop]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((err) => console.error("Audio playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col justify-center items-center ">
        {/* Mobile Video Container */}
        {!isDesktop && (
          <div className="w-full bg-black overflow-hidden h-[55vh] relative mb-8 items-center ">
            <video
              ref={videoMobileRef}
              autoPlay
              loop
              muted
              poster="/video-poster.jpg"
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              x-webkit-airplay="allow"
              x-webkit-playsinline="true"
              controlsList="nodownload"
            />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.50)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <div className="relative w-[288px] h-[77px]">
                <Image
                  alt="4 weeks"
                  fill
                  src="/4weeks.svg"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="relative w-[288px] h-[77px]">
                <Image
                  alt="Feb 24th"
                  fill
                  src="/feb24.svg"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="relative w-[288px] h-[77px]">
                <Image
                  alt="SF"
                  fill
                  src="/SF.svg"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Container */}
        <div className="flex flex-col md:flex-row items-stretch gap-8 w-full max-w-[1150px]">
          {/* Left Column: Text & Audio UI */}
          <div className="w-full md:w-[561px] overflow-y-auto md:h-screen hide-scrollbar">
            <div className="p-8 lg:p-16">
              {/* Title (desktop only) */}
              <h1
                onClick={() => {
                  window.open("https://f.inc", "_blank");
                }}
                className="hidden hover:cursor-pointer md:block font-black text-zinc-800 mb-8 text-6xl tracking-[-0.055em]"
              >
                Founders Inc.
              </h1>
              {/* CTA Button and Timer for desktop (rendered above heading) */}
              {isDesktop && (
                <div className="mb-12">
                  {/* Explanatory text when deadline passed - now above the CTA button */}
                  {timeLeft.isNegative && (
                    <div className="mb-4">
                      <p className="text-[22.5px] tracking-[-0.055em] text-[#3a3a3a]">
                        You missed both deadlines...
                      </p>
                      <p className="mt-4 text-[22.5px] tracking-[-0.055em] text-[#3a3a3a]">
                        but we also review applications to visit the lab on a
                        rolling basis
                      </p>
                    </div>
                  )}
                  <div className="flex flex-row gap-4 items-center justify-center md:justify-start">
                    <DelayedCTAButton
                      href="https://tally.so/r/n0MkYQ"
                      variant="solid"
                    >
                      Visit the lab
                    </DelayedCTAButton>
                    <CountdownTimer timeLeft={timeLeft} />
                  </div>
                </div>
              )}
              {/* [ship it] Heading */}
              <h2
                className={`font-bold mb-6 text-zinc-800 tracking-[-0.055em] ${
                  isDesktop ? "text-[32px]" : "text-[36px]"
                }`}
              >
                <span className="whitespace-nowrap">
                  {/* <TextScramble
                    duration={5}
                    speed={0.05}
                    className="font-bold text-zinc-800 tracking-[-0.055em] inline"
                    characterSet="abcdefghijklmnopqrstuvwxyz"
                  >
                    Shipped It
                  </TextScramble> */}
                  <MorphingText
                    // loop={false}
                    startDelay={2}
                    texts={["[Ship it]", "[We Shipped it]"]}
                  />
                </span>
              </h2>
              {/* For mobile, the CTA Button and Timer are rendered right below the heading */}
              {!isDesktop && (
                <div className="mb-12">
                  {/* Explanatory text when deadline passed - now above the CTA button */}
                  {timeLeft.isNegative && (
                    <div className="mb-4">
                      <p className="text-[22.5px] tracking-[-0.055em] text-[#3a3a3a]">
                        You missed both deadlines...
                      </p>
                      <p className="mt-4 text-[22.5px] tracking-[-0.055em] text-[#3a3a3a]">
                        but we also review applications to visit the lab on a
                        rolling basis
                      </p>
                    </div>
                  )}
                  <div className="flex flex-row items-center gap-4">
                    <div className="flex-shrink">
                      <DelayedCTAButton
                        href="https://tally.so/r/n0MkYQ"
                        variant="solid"
                      >
                        Visit the lab
                      </DelayedCTAButton>
                    </div>
                    <div className="flex-shrink-0">
                      <CountdownTimer timeLeft={timeLeft} />
                    </div>
                  </div>
                </div>
              )}
              {/* Audio Player UI (only on desktop) */}
              {isDesktop && (
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <button className="p-2 text-[#3a3a3a]" onClick={togglePlay}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {isPlaying ? (
                        <path
                          d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
                          fill="currentColor"
                        />
                      ) : (
                        <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                      )}
                    </svg>
                  </button>
                  <div className="flex-1 flex flex-wrap items-center gap-4">
                    <div className="h-1 flex-1 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-[#3a3a3a] rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-md text-[#3a3a3a]">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                </div>
              )}
              {/* Additional Text Content */}
              <p className="mb-6 tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                <span className="font-bold">
                  [Ship It] is happening right now.
                </span>
              </p>
              <p className="mb-8 tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                50 teams are building from our lab for the next four weeks.
              </p>
              <p className="mb-6 tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                Demo day is <span className="font-bold">March 21st</span>.
              </p>
              <p className="mb-6 tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                Missed this cohort?
              </p>
              <p className="mb-6 tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                We actually review applications to visit the lab on a rolling
                basis:
              </p>
              {/* <ul className="space-y-6 mb-8">
                <li className="flex gap-4">
                  <span className="font-large text-[22.5px] text-[#3a3a3a]">
                    1.
                  </span>
                  <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                    full access to our SF lab, where you can work alongside 100+
                    of builders 1-3 steps ahead of you.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="font-large text-[22.5px] text-[#3a3a3a]">
                    2.
                  </span>
                  <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                    office hours with our team + founders to help you figure out
                    growth, marketing, product & what to focus on.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="font-large text-[22.5px] text-[#3a3a3a]">
                    3.
                  </span>
                  <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                    a final demo day where you could get funded to go all in on
                    your startup. We&apos;re looking to invest $1,000,000 this
                    round.
                  </p>
                </li>
              </ul> */}
              <div className="space-y-6 mb-12">
                <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                  whether it&apos;s for future [ship it] cohorts, events, or
                  just to visit our lab in SF, apply and let us know who you
                  are.
                </p>
                {/* <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]"></p>
                <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                  If you kill it, you&apos;ll get your first check and a
                  permanent home for life at our SF lab.
                </p>
                <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                  We&apos;re looking for the most ambitious founders around the
                  world.
                </p>
                <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                  If that sounds like you - tell us who you are & what
                  you&apos;re building.
                </p> */}
              </div>
              <DelayedCTAButton
                href="https://tally.so/r/n0MkYQ"
                variant="solid"
                isTimeDelayed={false}
              >
                Apply rn bruh
              </DelayedCTAButton>

              {/* Social Media Icons */}
              <div className="flex gap-4 justify-start mt-6 ml-2">
                {/* X Icon */}
                <a
                  href="https://twitter.com/fdotinc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    className="text-[#3a3a3a] hover:text-zinc-600 transition-colors"
                  >
                    <path
                      d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>

                {/* YouTube Icon */}
                <a
                  href="https://youtube.com/@fdotinc"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 50 50"
                    className="text-[#3a3a3a] hover:text-zinc-600 transition-colors"
                  >
                    <path
                      d="M 44.898438 14.5 C 44.5 12.300781 42.601563 10.699219 40.398438 10.199219 C 37.101563 9.5 31 9 24.398438 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.398438 17 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.898438 40.5 17.898438 41 24.5 41 C 31.101563 41 37.101563 40.5 40.601563 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.101563 35.5 C 45.5 33 46 29.398438 46.101563 25 C 45.898438 20.5 45.398438 17 44.898438 14.5 Z M 19 32 L 19 18 L 31.199219 25 Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
              </div>

              {/* Collapsible section */}
              <div className="mt-16 mb-12">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2 text-[22.5px] text-[#3a3a3a] hover:opacity-80 transition-opacity"
                >
                  <span className="font-semibold">
                    But you&apos;re probably wondering ...
                  </span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transform transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M7 10l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isExpanded
                      ? "max-h-[2000px] opacity-100 mt-6"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-6">
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      You&apos;re probably wondering who we are.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      We&apos;re Founders, Inc.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      Over the last 3 years we&apos;ve built what we call a
                      &apos;home for founders&apos;.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      Yes, we&apos;re a VC.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      We invest in early stage founders & hopefully that means
                      you.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      But we do not exist to just write checks. It&apos;s not
                      what drives us to do what we do.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      We exist to find you, someone who&apos;s been overlooked,
                      working on something they know will leave a mark.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      Working w/ us means we will have your back for the rest of
                      your life.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      Whether you pivot, shut down, or buy 6 Miatas, we&apos;ll
                      be here to support you.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      Because we&apos;re founders too, & we deeply understand
                      what it really takes to make it.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      It&apos;s not just MRR, PMF, etc.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      It&apos;s being more ambitious & resilient than anyone on
                      earth.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      & that&apos;s our goal. To give you the perfect
                      environment to become that person.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      Our sole belief is that when we bring together ambitious
                      people to work shoulder to shoulder, eat together & share
                      ideas, great things happen.
                    </p>
                    <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                      So that&apos;s what this is: a genuine community of
                      founders & all the resources that brings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Video Container */}
          {isDesktop && (
            <div className="relative w-full md:w-[561px] bg-black overflow-hidden h-screen">
              <video
                ref={videoDesktopRef}
                autoPlay
                loop
                muted
                poster="/video-poster.jpg"
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                x-webkit-airplay="allow"
                x-webkit-playsinline="true"
                controlsList="nodownload"
              />
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.50)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <div className="relative w-[288px] h-[77px]">
                  <Image
                    alt="4 weeks"
                    fill
                    src="/4weeks.svg"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="relative w-[288px] h-[77px]">
                  <Image
                    alt="Feb 24th"
                    fill
                    src="/feb24.svg"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="relative w-[288px] h-[77px]">
                  <Image
                    alt="SF"
                    fill
                    src="/SF.svg"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src="/seeyourselfinmyeyes.mp3"
          playsInline
          preload="metadata"
          className="hidden"
        />
      </div>
    </>
  );
}
