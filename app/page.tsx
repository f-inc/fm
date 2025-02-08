"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Hls from "hls.js";

import { CTAButton } from "@/components/cta-button";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ref for the scrollable text container
  const textContainerRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Force the browser to load the audio metadata
    audio.load();

    const handleLoadedMetadata = () => {
      console.log("Loaded metadata:", audio.duration);
      setDuration(audio.duration);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Update current time while the audio is playing
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    // Reset state when audio ends
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          autoStartLoad: true,
          startLevel: -1, // Let HLS choose the appropriate quality
          initialLiveManifestSize: 3, // Load first 3 segments
          maxLoadingDelay: 1,
          maxBufferLength: 300, // Increase buffer length to store more segments
          maxMaxBufferLength: 600,
          backBufferLength: 300, // Increase back buffer to keep more previous segments
          enableWorker: true,
          lowLatencyMode: false, // Disable low latency mode for better buffering
          progressive: false, // Disable progressive download for complete segment loading
          // More aggressive bandwidth estimation
          abrEwmaDefaultEstimate: 1000000, // 1Mbps default
          abrEwmaFastLive: 2,
          abrEwmaSlowLive: 5,
        });

        hls.loadSource("/index.m3u8");
        hls.attachMedia(videoRef.current);

        // Optional: Log segment loading for debugging
        hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
          console.log("Loaded segment:", data.frag.sn);
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          hls.startLoad(); // Remove the -1 parameter
        });

        return () => {
          hls.destroy();
        };
      } else {
        // Fallback for browsers with native HLS support (e.g. Safari)
        videoRef.current.src = "/index.m3u8";
      }
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Safari may reject play() if not triggered by a trusted event,
      // so catch and log any potential error.
      audioRef.current
        .play()
        .catch((err) => console.error("Audio playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-white flex justify-center">
      {/* Centered container for both columns */}
      <div className="flex flex-col-reverse md:flex-row items-stretch gap-8 w-full max-w-[1150px]">
        {/* Left Column: fully scrollable copy */}
        <div
          ref={textContainerRef}
          className="w-full md:w-[561px] overflow-y-auto h-screen hide-scrollbar"
        >
          <div className="p-8 lg:p-16">
            {/* The title is hidden on small screens and only shown on md and up */}
            <h1 className="hidden md:block font-black text-zinc-800 mb-8 text-6xl tracking-[-0.055em]">
              Founders Inc.
            </h1>
            <CTAButton
              href="https://tally.so/r/3X8ypP"
              variant="solid"
              className="mb-12"
            >
              join us - apply here
            </CTAButton>
            {/* Audio player UI */}
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
            <h2 className="text-[32px] font-bold mb-6 text-zinc-800 tracking-[-0.055em]">
              [ship it]
            </h2>
            <p className="mb-6 tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
              We&apos;re running a 4 week sprint from Feb 24th to March 21st out
              of Fort Mason, SF.
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
                  growth, marketing, product &amp; what to focus on.
                </p>
              </li>
              <li className="flex gap-4">
                <span className="font-large text-[22.5px] text-[#3a3a3a]">
                  3.
                </span>
                <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                  A final demo day where you could get funded to go all in on
                  your startup. We&apos;re looking to invest $1,000,000 this
                  round.
                </p>
              </li>
            </ul>

            <div className="space-y-6 mb-12">
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                Every week you&apos;ll set a goal &amp; we&apos;ll give you
                everything we have to make it happen.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                At the end of each week, you&apos;ll present your progress in
                front of the whole batch.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                If you kill it, you&apos;ll get your first check and a permanent
                home for life at our SF lab.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                We&apos;re looking for the most ambitious founders around the
                world.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                If that sounds like you - tell us who you are &amp; what
                you&apos;re building.
              </p>
            </div>

            <section className="space-y-6 mb-12">
              <h2 className="text-2xl font-semibold">But...</h2>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                You&apos;re probably wondering who we are.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                We&apos;re Founders, Inc.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                Over the last 3 years we&apos;ve built what we call a &apos;home
                for founders&apos;.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                Yes, we&apos;re a VC.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                We invest in early stage founders &amp; hopefully that means
                you.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                But we do not exist to just write checks. It&apos;s not what
                drives us to do what we do.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                We exist to find you, someone who&apos;s been overlooked,
                working on something they know will leave a mark.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                Working w/ us means you have a permanent home for life at our SF
                lab.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                Whether you pivot, shut down, or buy 6 Miatas, we&apos;ll be
                here to support you.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                Because we&apos;re founders too, &amp; we deeply understand what
                it really takes to make it.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                It&apos;s not just MRR, PMF, etc.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                It&apos;s being more ambitious &amp; resilient than anyone on
                earth.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                &amp; that&apos;s our goal. To give you the perfect environment
                to become that person.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                Our sole belief is that when we bring together ambitious people
                to work shoulder to shoulder, eat together &amp; share ideas,
                great things happen.
              </p>
              <p className="tracking-[-0.055em] text-[22.5px] text-[#3a3a3a]">
                So that&apos;s what this is: a genuine community of founders
                &amp; all the resources that brings.
              </p>
            </section>

            <CTAButton href="https://tally.so/r/3X8ypP" variant="solid">
              we built this for you - join us
            </CTAButton>
          </div>
        </div>
        {/* Right Column: sticky video with dashed overlay */}
        <div className="relative w-full md:w-[561px] bg-black overflow-hidden h-screen">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            poster="/video-poster.jpg"
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
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
      </div>

      {/* Hidden audio element added to the DOM for improved compatibility in Safari */}
      <audio
        ref={audioRef}
        src="/seeyourselfinmyeyes.mp3"
        playsInline
        preload="metadata"
        className="hidden"
      />
    </div>
  );
}
