import Link from "next/link";
import { NAV_PATHS } from "@/constants";
import { Button, Separator } from "@/components/atoms";
import {
  Tagline,
  Heading,
  HeroSection,
  Description,
  PricingSection,
  SectionWrapper,
  HowItWorksSection,
  ChooseLanguageSection,
} from "@/marketing";

export default function MainPage() {
  return (
    <SectionWrapper>
      {/* HERO SECTION */}
      <HeroSection>
        {/* BADGE */}
        <Tagline className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
          Speak with Confidence!
        </Tagline>

        {/* MAIN HEADING */}
        <Heading heading="h1" className="mt-6 mb-2">
          Live <span className="text-nawalingo-primary">Video</span>
          <br />
          Lessons
        </Heading>

        {/* DESCRIPTION */}
        <Description className="mb-10">
          Chat with native speakers around the world! Start speaking from day
          one with personalized lessons that adapt to your learning style.
        </Description>

        {/* BUTTONS */}
        <div className="flex max-w-sm flex-col gap-y-4 lg:flex-row lg:gap-x-6">
          <Link href="/auth/signup" className="w-full">
            <Button size="lg" className="w-full py-6 font-bold uppercase">
              begin your lesson
            </Button>
          </Link>
          <Link href={NAV_PATHS.languages} className="w-full">
            <Button
              size="lg"
              variant="outline"
              className="w-full py-6 font-bold uppercase"
            >
              learn more
            </Button>
          </Link>
        </div>
      </HeroSection>
      <Separator />

      {/* CHOOSE LANGUAGE SECTION */}
      <ChooseLanguageSection />
      <Separator />

      {/* HOW IT WORKS SECTION */}
      <HowItWorksSection />
      <Separator />

      {/* PRICING SECTION */}
      <PricingSection />
    </SectionWrapper>
  );
}
