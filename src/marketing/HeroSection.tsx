import { SectionHeading } from "@/marketing";

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
