import Link from "next/link";
import Image from "next/image";
import Tagline from "@/components/typography/Tagline";
import Heading from "@/components/typography/Heading";
import { Button } from "@/components/ui/Button";
import Description from "@/components/typography/Description";
import SectionHeading from "@/components/ui/SectionHeading";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-between text-center">
      {/* HERO IMAGE */}
      <Image
        width={280}
        height={280}
        alt="hero-image-1"
        src="/hero/hero-1.png"
        className="absolute bottom-0 left-0 hidden h-[280px] w-[280px] translate-x-6 duration-300 lg:block xl:h-[360px] xl:w-[360px] 2xl:h-[420px] 2xl:w-[420px]"
      />

      <Image
        width={280}
        height={280}
        alt="hero-image-2"
        src="/hero/hero-2.png"
        className="absolute right-0 bottom-0 hidden h-[280px] w-[280px] -translate-x-12 scale-x-[-1] duration-300 lg:block xl:h-[360px] xl:w-[360px] 2xl:h-[420px] 2xl:w-[420px]"
      />

      {/* MAIN CONTENT */}
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
        {/* HERO CONTENT */}
        <SectionHeading
          className={`relative z-10 flex max-w-md flex-col items-center px-4 lg:max-w-6xl`}
        >
          {/* BADGE */}
          <Tagline className="mb-6 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
            Speak with Confidence!
          </Tagline>

          {/* MAIN HEADING */}
          <Heading heading="h1">
            Live <span className="text-nawalingo-primary">Video</span>
            <br />
            Lessons
          </Heading>

          {/* DESCRIPTION */}
          <Description className="mb-12">
            Chat with native speakers around the world! Start speaking from day
            one with personalized lessons that adapt to your learning style.
          </Description>

          {/* BUTTONS */}
          <div className="flex max-w-sm flex-col gap-y-4 lg:flex-row lg:gap-x-6">
            <Link href="/signup" className="w-full">
              <Button size="lg" className="w-full py-6 font-bold uppercase">
                begin your lesson
              </Button>
            </Link>
            <Link href="/languages" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="w-full py-6 font-bold uppercase"
              >
                learn more
              </Button>
            </Link>
          </div>
        </SectionHeading>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-nawalingo-dark/25 dark:border-nawalingo-light/25">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-nawalingo-dark/50 dark:bg-nawalingo-light/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
