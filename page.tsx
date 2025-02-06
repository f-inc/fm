import Image from "next/image"
import { DashedBox } from "@/components/dashed-box"
import { CTAButton } from "@/components/cta-button"

export default function Home() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left Column - Scrollable */}
      <div className="min-h-screen overflow-auto">
        <div className="p-8 lg:p-16">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold mb-8">Founders Inc.</h1>

            <CTAButton href="/apply" className="mb-12">
              join us - apply here
            </CTAButton>

            <h2 className="text-2xl font-semibold mb-6">[ship it]</h2>

            <p className="mb-6">
              We&apos;re running a 4 week sprint from Feb 24th to March 21st out of Fort Mason, SF.
            </p>

            <p className="mb-8">50 teams will be selected to make 10 years of progress in 30 days.</p>

            <p className="mb-6">tldr;</p>

            <ul className="space-y-6 mb-8">
              <li className="flex gap-4">
                <span className="font-medium">1.</span>
                <p>full access to our SF lab, where you can work alongside 100s of builders 1-3 steps ahead of you.</p>
              </li>
              <li className="flex gap-4">
                <span className="font-medium">2.</span>
                <p>
                  office hours with our team + founders to help you figure out growth, marketing, product & what to
                  focus on.
                </p>
              </li>
              <li className="flex gap-4">
                <span className="font-medium">3.</span>
                <p>
                  A final demo day where you could get funded to go all in on your startup. We&apos;ll be investing
                  $1,000,000 this round.
                </p>
              </li>
            </ul>

            <div className="space-y-6 mb-12">
              <p>Every week you&apos;ll set a goal & we&apos;ll give you everything we have to make it happen.</p>
              <p>At the end of each week, you&apos;ll present your progress in front of the whole batch.</p>
              <p>If you kill it, you&apos;ll get your first check and a permanent home for life at our SF lab.</p>
              <p>We&apos;re looking for the most ambitious founders around the world.</p>
              <p>If that sounds like you - tell us who you are & what you&apos;re building.</p>
            </div>

            <section className="space-y-6 mb-12">
              <h2 className="text-2xl font-semibold">But...</h2>
              <p>You&apos;re probably wondering what this is.</p>
              <p>We&apos;re Founders, Inc.</p>
              <p>Over the last 3 years we&apos;ve built what we call a &apos;home for founders&apos;.</p>
              <p>Yes, we&apos;re a VC.</p>
              <p>We invest in early stage founders & hopefully that means you.</p>
              <p>But we do a whole lot more than just write a check.</p>
              <p>Working w/ us means you have a permanent home for life at our lab in SF.</p>
              <p>Whether you pivot, shut down, or go to the moon, we&apos;ll be here to support you.</p>
              <p>Because we&apos;re founders too, & we deeply understand what it really takes to make it.</p>
              <p>It&apos;s not MRR, PMF, etc.</p>
              <p>It&apos;s being more ambitious & resilient than anyone on earth.</p>
              <p>& that&apos;s our goal. To give you the perfect environment to become that.</p>
              <p>
                Our sole belief, is that when we bring together ambitious people to work shoulder to shoulder, eat
                together & share ideas, great things happen.
              </p>
              <p>So that&apos;s what this is, a genuine community of founders & all the resources that brings.</p>
            </section>

            <CTAButton href="/apply" variant="solid">
              we built this for you - join us
            </CTAButton>
          </div>
        </div>
      </div>

      {/* Right Column - Fixed */}
      <div className="fixed top-0 right-0 w-1/2 h-screen hidden lg:block bg-black">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/your-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 text-white">
          <DashedBox>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/joinus-BnvcSgVwQNu49WUXKIjY7cIJnLq2HG.svg"
              alt="Join us text"
              width={200}
              height={50}
              className="w-auto h-auto"
            />
          </DashedBox>
          <DashedBox>4 weeks</DashedBox>
          <DashedBox>Feb 24th</DashedBox>
          <DashedBox>San Francisco</DashedBox>
        </div>
      </div>
    </div>
  )
}

