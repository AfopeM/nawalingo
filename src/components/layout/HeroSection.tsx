import SectionHeading from "@/common/SectionHeading";

interface HeroSectionProps {
  children: React.ReactNode;
}

export default function HeroSection({ children }: HeroSectionProps) {
  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      {/* HERO CONTENT */}
      <SectionHeading className="relative z-10 flex flex-col items-center">
        {children}
      </SectionHeading>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-nawalingo-dark/25 dark:border-nawalingo-light/25">
          <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-nawalingo-dark/50 dark:bg-nawalingo-light/50" />
        </div>
      </div>
    </div>
  );
}

// const imgStyle =
// "absolute hidden h-[200px] w-[200px] duration-300 lg:block xl:h-[280px] xl:w-[280px] object-contain";
// <Image
// width={280}
// height={280}
// alt="hero-image-1"
// src="/hero/hero-1.png"
// className={`${imgStyle} bottom-0 left-0 -translate-x-8 lg:-translate-x-[10%]`}
// />

// <Image
// width={280}
// height={280}
// alt="hero-image-2"
// src="/hero/hero-2.png"
// className={`${imgStyle} right-0 bottom-0 -translate-x-12 scale-x-[-1]`}
// />
