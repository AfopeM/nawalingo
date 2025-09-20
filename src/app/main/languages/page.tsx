import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Button, Separator } from "@/components/atoms";
import { languages as languageData } from "@/constants/languages";
import {
  SectionWrapper,
  Tagline,
  Heading,
  Description,
  CTASection,
  HeroSection,
} from "@/marketing";

export const metadata: Metadata = {
  title: "Learn African Languages Online | Nawalingo Language Library",
  description:
    "Explore a wide range of African languages with Nawalingo. Learn the language, understand the culture, and connect with vibrant communities through live lessons.",
  keywords: [
    "African Languages",
    "Learn African Languages Online",
    "Nawalingo Language Library",
    "Online Language Learning",
    "African Language Courses",
    "Learn Yoruba Online",
    "Learn Igbo Online",
    "Learn Swahili Online",
  ],
  openGraph: {
    title: "Learn African Languages Online | Nawalingo Language Library",
    description:
      "Explore a wide range of African languages with Nawalingo. Learn the language, understand the culture, and connect with vibrant communities through live lessons.",
  },
};

export default function LanguagesPage() {
  return (
    <>
      <SectionWrapper>
        {/* HERO SECTION */}
        <HeroSection>
          {/* BADGE */}
          <Tagline>Your Gateway to African Languages</Tagline>

          {/* MAIN HEADING */}
          <Heading heading="h1" className="mt-6 mb-2">
            Unlock a World of Conversation
          </Heading>

          {/* DESCRIPTION */}
          <Description>
            Discover a diverse array of African languages, each a unique key to
            rich cultures and vibrant communities. Start your journey to fluency
            today.
          </Description>
        </HeroSection>

        {/* LANGUAGE SHOWCASE SECTION */}
        <div className="my-24 space-y-24 lg:space-y-32">
          {languageData.map((item, index) => (
            <React.Fragment key={item.language}>
              <div
                className={`relative z-10 flex flex-col items-center gap-12 xl:flex-row xl:gap-16 ${index % 2 === 1 ? "xl:flex-row-reverse" : ""} `}
              >
                {/* LANGUAGE VISUAL/ICON */}
                <div
                  className={`relative w-full flex-shrink-0 rounded-3xl bg-gradient-to-br p-8 sm:p-12 md:p-16 xl:w-1/2 xl:w-2/5 xl:p-20 ${item.color} flex min-h-[250px] transform items-center justify-center border border-white/10 backdrop-blur-sm transition-transform duration-500 ease-out hover:scale-[1.01] sm:min-h-[300px] lg:min-h-[400px]`}
                >
                  <span className="flex items-center justify-center text-6xl font-black text-white uppercase transition-transform duration-300 group-hover:scale-105 md:text-7xl">
                    {item.word}
                  </span>
                </div>

                {/* LANGUAGE CONTENT */}
                <div className="w-full text-center xl:w-1/2 xl:w-3/5 xl:text-left">
                  <h3 className="font-pop mb-4 text-4xl leading-tight font-black text-nawalingo-dark uppercase sm:text-5xl xl:text-6xl dark:text-nawalingo-light/90">
                    {item.language}
                  </h3>
                  <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-nawalingo-dark/70 sm:text-xl dark:text-nawalingo-light/70">
                    {item.longDesc}
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row xl:justify-start">
                    {/* <Link href="/signup" passHref>
                  <Button size="lg" className="font-bold">
                    Start Learning {item.language}
                  </Button>
                </Link> */}
                    <Link href="/main/pricing" passHref>
                      <Button variant="outline" size="lg">
                        View Pricing
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              {index !== languageData.length - 1 ? (
                <Separator className="bg-nawalingo-dark/10 dark:bg-nawalingo-light/10" />
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA SECTION */}
      <CTASection>
        <Heading
          heading="h4"
          className="max-w-xl text-4xl text-nawalingo-light md:text-5xl"
        >
          Your Fluency Journey Starts Here
        </Heading>
        <Description className="mx-auto mt-3 mb-4 max-w-xl text-nawalingo-light/70">
          Don&apos;t wait! Take the first step towards speaking a new language
          with confidence. Our flexible plans and native tutors are ready to
          guide you.
        </Description>

        <Link href="/auth/signup" className="w-full" passHref>
          <Button
            size="lg"
            variant="secondary"
            className="mt-4 border-0 px-16 py-8 text-xl font-bold tracking-wide uppercase hover:bg-nawalingo-light hover:text-nawalingo-primary"
          >
            Enroll Now
          </Button>
        </Link>
      </CTASection>
    </>
  );
}
