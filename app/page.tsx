import Image from "next/image";

import { DashedBox } from "@/components/dashed-box";
import { CTAButton } from "@/components/cta-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      {/* Centered container for both columns */}
      <div className="flex flex-col-reverse md:flex-row gap-8 w-full max-w-[1150px]">
        {/* Left Column: fully scrollable copy */}
        <div
          className="w-[561px] overflow-y-auto h-screen hide-scrollbar"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 150px)",
            maskImage: "linear-gradient(to bottom, transparent, black 150px)",
          }}
        >
          <div className="p-8 lg:p-16">
            <h1 className="text-4xl font-bold mb-8">Founders Inc.</h1>
            <CTAButton href="/apply" className="mb-12">
              join us - apply here
            </CTAButton>
            {/* Add audio player UI */}
            <div className="flex items-center gap-4 mb-8 text-gray-500">
              <button className="p-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                </svg>
              </button>
              <div className="text-sm">0:00 / 1:44</div>
            </div>
            <h2 className="text-2xl font-semibold mb-6">[ship it]</h2>
            <p className="mb-6">
              We&apos;re running a 4 week sprint from Feb 24th to March 21st out
              of Fort Mason, SF.
            </p>
            <p className="mb-8">
              50 teams will be selected to make 10 years of progress in 30 days.
            </p>
            <p className="mb-6">tldr;</p>

            <ul className="space-y-6 mb-8">
              <li className="flex gap-4">
                <span className="font-medium">1.</span>
                <p>
                  full access to our SF lab, where you can work alongside 100s
                  of builders 1-3 steps ahead of you.
                </p>
              </li>
              <li className="flex gap-4">
                <span className="font-medium">2.</span>
                <p>
                  office hours with our team + founders to help you figure out
                  growth, marketing, product &amp; what to focus on.
                </p>
              </li>
              <li className="flex gap-4">
                <span className="font-medium">3.</span>
                <p>
                  A final demo day where you could get funded to go all in on
                  your startup. We&apos;ll be investing $1,000,000 this round.
                </p>
              </li>
            </ul>

            <div className="space-y-6 mb-12">
              <p>
                Every week you&apos;ll set a goal &amp; we&apos;ll give you
                everything we have to make it happen.
              </p>
              <p>
                At the end of each week, you&apos;ll present your progress in
                front of the whole batch.
              </p>
              <p>
                If you kill it, you&apos;ll get your first check and a permanent
                home for life at our SF lab.
              </p>
              <p>
                We&apos;re looking for the most ambitious founders around the
                world.
              </p>
              <p>
                If that sounds like you - tell us who you are &amp; what
                you&apos;re building.
              </p>
            </div>

            <section className="space-y-6 mb-12">
              <h2 className="text-2xl font-semibold">But...</h2>
              <p>You&apos;re probably wondering what this is.</p>
              <p>We&apos;re Founders, Inc.</p>
              <p>
                Over the last 3 years we&apos;ve built what we call a &apos;home
                for founders&apos;.
              </p>
              <p>Yes, we&apos;re a VC.</p>
              <p>
                We invest in early stage founders &amp; hopefully that means
                you.
              </p>
              <p>But we do a whole lot more than just write a check.</p>
              <p>
                Working w/ us means you have a permanent home for life at our SF
                lab.
              </p>
              <p>
                Whether you pivot, shut down, or go to the moon, we&apos;ll be
                here to support you.
              </p>
              <p>
                Because we&apos;re founders too, &amp; we deeply understand what
                it really takes to make it.
              </p>
              <p>It&apos;s not MRR, PMF, etc.</p>
              <p>
                It&apos;s being more ambitious &amp; resilient than anyone on
                earth.
              </p>
              <p>
                &amp; that&apos;s our goal. To give you the perfect environment
                to become that.
              </p>
              <p>
                Our sole belief is that when we bring together ambitious people
                to work shoulder to shoulder, eat together &amp; share ideas,
                great things happen.
              </p>
              <p>
                So that&apos;s what this is: a genuine community of founders
                &amp; all the resources that brings.
              </p>
            </section>

            <CTAButton href="/apply" variant="solid">
              we built this for you - join us
            </CTAButton>
          </div>
        </div>
        {/* Right Column: sticky video with dashed overlay */}
				<div
					className="relative w-[561px] bg-black overflow-hidden min-w-full max-h-[50vh] md:inline md:max-h-[100%] md:min-w-fit"
					style={{ height: "calc(100vh - 2rem)" }}
				>
					<video
						autoPlay
						loop
						muted
						playsInline
						className="absolute inset-0 w-full h-full object-cover"
					>
						<source src="/website-video.mp4" type="video/mp4" />
					</video>
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
    </div>
  );
}
