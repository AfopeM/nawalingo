// import { FaFlagGhana, FaFlagNigeria, etc. } from 'react-icons/fa';
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/ui/Button";
import Tagline from "@/typography/Tagline";
import Heading from "@/typography/Heading";
import SectionHeading from "@/ui/SectionHeading";
import Description from "@/typography/Description";
import SectionWrapper from "@/layout/SectionWrapper";
import { languages as languageData } from "@/constants/languages";
import { Separator } from "@/ui/Separator";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "All Languages | Nawalingo",
  description:
    "Discover a diverse array of African languages, each a unique key to rich cultures and vibrant communities. Start your journey to fluency today.",
};

export default function AllLanguagesPage() {
  return (
    <>
      <SectionWrapper className="px-10">
        {/* Page Header */}
        <SectionHeading>
          <Tagline>Your Gateway to African Languages</Tagline>
          <Heading heading="h1">Unlock a World of Conversation</Heading>
          <Description>
            Discover a diverse array of African languages, each a unique key to
            rich cultures and vibrant communities. Start your journey to fluency
            today.
          </Description>
        </SectionHeading>

        {/* Language Showcase Sections */}
        <div className="container mx-auto space-y-24 px-4 py-12 lg:space-y-32">
          {languageData.map((item, index) => (
            <React.Fragment key={item.language}>
              <div
                className={`relative z-10 flex flex-col items-center gap-12 lg:flex-row lg:gap-16 xl:gap-24 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""} `}
              >
                {/* Language Visual/Icon */}
                <div
                  className={`relative w-full flex-shrink-0 rounded-3xl bg-gradient-to-br p-8 sm:p-12 md:p-16 lg:w-1/2 lg:p-20 xl:w-2/5 ${item.color} flex min-h-[250px] transform items-center justify-center border border-white/10 backdrop-blur-sm transition-transform duration-500 ease-out hover:scale-[1.01] sm:min-h-[300px] lg:min-h-[400px]`}
                >
                  <span className="flex items-center justify-center text-6xl font-black text-white/80 uppercase opacity-70 transition-transform duration-300 group-hover:scale-105 md:text-8xl">
                    {item.word}
                  </span>
                  {/* Could add abstract patterns or shapes here */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-3xl"
                    style={{
                      background: `radial-gradient(circle at ${index % 2 === 0 ? "top left" : "top right"}, rgba(255,255,255,0.05) 0%, transparent 70%)`,
                    }}
                  ></div>
                </div>

                {/* Language Content */}
                <div className="w-full text-center lg:w-1/2 lg:text-left xl:w-3/5">
                  <h3 className="font-pop mb-4 text-4xl leading-tight font-black text-nawalingo-dark uppercase sm:text-5xl lg:text-6xl dark:text-nawalingo-light">
                    {item.language}
                  </h3>
                  <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-nawalingo-dark/70 sm:text-xl lg:max-w-none dark:text-nawalingo-light/70">
                    {item.longDesc}
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                    {/* <Link href="/signup" passHref>
                  <Button size="lg" className="font-bold">
                    Start Learning {item.language}
                  </Button>
                </Link> */}
                    <Link href="/pricing" passHref>
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

      {/* Call to Action at the bottom */}
      <div className="relative flex items-center justify-center bg-nawalingo-primary/75 px-16 py-24 text-center lg:justify-around">
        <SectionHeading className="lg:text-left">
          <Heading className="mx-auto max-w-xl text-4xl text-nawalingo-light md:text-5xl lg:text-6xl">
            Your Fluency Journey Starts Here
          </Heading>
          <Description className="mx-auto mt-3 mb-4 max-w-xl text-nawalingo-light/50">
            Don&apos;t wait! Take the first step towards speaking a new language
            with confidence. Our flexible plans and native tutors are ready to
            guide you.
          </Description>

          <Link href="/auth/signup" className="w-full" passHref>
            <Button
              size="lg"
              variant="secondary"
              className="mt-4 border-0 px-10 py-6 font-bold tracking-wide uppercase hover:bg-nawalingo-light hover:text-nawalingo-primary"
            >
              Enroll Now
            </Button>
          </Link>
        </SectionHeading>
        <Image
          width={400}
          height={400}
          alt="Languages"
          src="/hero/hero-1.png"
          className="hidden object-cover lg:block"
        />
      </div>
    </>
  );
}
