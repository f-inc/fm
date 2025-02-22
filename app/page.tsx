"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Hls from "hls.js";

import { CTAButton } from "@/components/cta-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/* CountdownTimer component that shows days/hours/minutes/seconds until the target date */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const targetDate = new Date("2025-02-21T00:00:00");
    const nextDay = new Date("2025-02-22T00:00:00");
    const now = new Date();
    const originalDifference = targetDate.getTime() - now.getTime();
    const extensionDifference = nextDay.getTime() - now.getTime();

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
      extension: {
        days: Math.max(
          0,
          Math.floor(extensionDifference / (1000 * 60 * 60 * 24))
        ),
        hours: Math.max(
          0,
          Math.floor((extensionDifference / (1000 * 60 * 60)) % 24)
        ),
        minutes: Math.max(
          0,
          Math.floor((extensionDifference / (1000 * 60)) % 60)
        ),
        seconds: Math.max(0, Math.floor((extensionDifference / 1000) % 60)),
      },
    };
  });

  useEffect(() => {
    const targetDate = new Date("2025-02-21T00:00:00");
    const nextDay = new Date("2025-02-22T00:00:00");

    const interval = setInterval(() => {
      const now = new Date();
      const originalDifference = targetDate.getTime() - now.getTime();
      const extensionDifference = nextDay.getTime() - now.getTime();

      setTimeLeft({
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
        extension: {
          days: Math.max(
            0,
            Math.floor(extensionDifference / (1000 * 60 * 60 * 24))
          ),
          hours: Math.max(
            0,
            Math.floor((extensionDifference / (1000 * 60 * 60)) % 24)
          ),
          minutes: Math.max(
            0,
            Math.floor((extensionDifference / (1000 * 60)) % 60)
          ),
          seconds: Math.max(0, Math.floor((extensionDifference / 1000) % 60)),
        },
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center my-2">
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
      {timeLeft.isNegative && (
        <>
          <div className="flex items-center mt-4 text-[22.5px] tracking-[-0.055em] text-[#3a3a3a] line-through opacity-50">
            <div className="flex items-center space-x-2">
              <div className="flex items-center gap-0">
                <AnimatedCounter value={timeLeft.extension.days} />
                <span>d</span>
              </div>
              <div className="flex items-center gap-0">
                <AnimatedCounter value={timeLeft.extension.hours} />
                <span>h</span>
              </div>
              <div className="flex items-center gap-0">
                <AnimatedCounter value={timeLeft.extension.minutes} />
                <span>m</span>
              </div>
              <div className="flex items-center gap-0">
                <AnimatedCounter value={timeLeft.extension.seconds} />
                <span>s</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[18px] px-4 tracking-[-0.055em] text-[#3a3a3a] opacity-80">
            You missed both deadlines, but we're running another batch in
            summer.
          </p>
        </>
      )}
    </div>
  );
}

/* A new "delayed" button that forces the user to wait 3 seconds.
   After two quick attempts, the real CTA appears (a link rendered via CTAButton). */
function DelayedCTAButton({ href, variant = "solid", children }) {
  const [waiting, setWaiting] = useState(false);
  const [showRealButton, setShowRealButton] = useState(false);
  const waitTime = 3;

  const handleClick = () => {
    if (waiting) return;
    setWaiting(true);
    setTimeout(() => {
      setShowRealButton(true);
    }, waitTime * 1000);
  };

  if (showRealButton) {
    return (
      <CTAButton href={href} variant={variant}>
        Grab Your Comeback Application
      </CTAButton>
    );
  }

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
      {!waiting
        ? children
        : `Wait ${waitTime} seconds... (just like you made us wait)`}
    </button>
  );
}

export default function Home() {
  // Audio state / refs
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

        {/* Big Countdown Timer */}
        <CountdownTimer />

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
              {/* CTA Button for desktop (rendered above heading) */}
              {isDesktop && (
                <div className="mb-12 flex justify-center md:justify-start">
                  <DelayedCTAButton
                    href="https://tally.so/r/waaaR2"
                    variant="solid"
                  >
                    join us - apply here
                  </DelayedCTAButton>
                </div>
              )}
              {/* [ship it] Heading */}
              <h2
                className={`font-bold mb-6 text-zinc-800 tracking-[-0.055em] ${
                  isDesktop ? "text-[32px]" : "text-[36px]"
                }`}
              >
                [ship it]
              </h2>
              {/* For mobile, the CTA Button is rendered right below the heading */}
              {!isDesktop && (
                <div className="mb-12 flex">
                  <DelayedCTAButton
                    href="https://tally.so/r/waaaR2"
                    variant="solid"
                  >
                    join us - apply here
                  </DelayedCTAButton>
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
                We&apos;re running a 4 week sprint from Feb 24th to March 21st
                out of Fort Mason, SF.
              </p>
              <p className="mb-8 tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                50 teams will be invited to gain life changing momentum in 30
                days.
              </p>
              <p className="mb-6 tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                tldr;
              </p>
              <ul className="space-y-6 mb-8">
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
              </ul>
              <div className="space-y-6 mb-12">
                <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                  Every week you&apos;ll set a goal & we&apos;ll give you
                  everything we have to make it happen.
                </p>
                <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                  At the end of each week, you&apos;ll present your progress in
                  front of the whole batch.
                </p>
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
                </p>
              </div>
              <DelayedCTAButton
                href="https://tally.so/r/waaaR2"
                variant="solid"
              >
                we built this for you - join us
              </DelayedCTAButton>
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
