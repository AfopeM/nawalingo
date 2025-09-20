import Link from "next/link";
import type { Metadata } from "next";
import { Button, Separator } from "@/components/atoms";
import {
  WHY_TUTOR_WITH_NAWALINGO,
  WHO_SHOULD_APPLY,
} from "@/constants/applyToTutor";
import {
  FaCheck,
  FaBookOpen,
  FaLaptopHouse,
  FaHandsHelping,
  FaHandHoldingUsd,
  FaChalkboardTeacher,
} from "react-icons/fa";
import {
  Tagline,
  Heading,
  Description,
  CTASection,
  SectionHeading,
  SectionWrapper,
  HeroSection,
  InfoCard,
  InfoCardHeading,
  InfoCardBody,
} from "@/marketing";

export const metadata: Metadata = {
  title: "Become a Nawalingo Language Tutor | Apply Now",
  description:
    "Get paid to teach languages online with Nawalingo. Join a global network of certified tutors delivering live video lessons to motivated learners.",
  keywords: [
    "Nawalingo",
    "Apply to Teach Languages",
    "Online Language Tutor Jobs",
    "Teach Languages Online",
    "Nawalingo Tutor Application",
    "Become a Language Tutor",
  ],
  openGraph: {
    title: "Become a Nawalingo Language Tutor | Apply Now",
    description:
      "Get paid to teach languages online with Nawalingo. Join a global network of certified tutors delivering live video lessons to motivated learners.",
  },
};

const icons = [
  FaChalkboardTeacher,
  FaBookOpen,
  FaHandHoldingUsd,
  FaLaptopHouse,
  FaHandsHelping,
];

export default function ApplyToTutorPage() {
  const whyTutorWithNawalingo = WHY_TUTOR_WITH_NAWALINGO.map((item, index) => ({
    icon: icons[index],
    title: item.title,
    body: item.body,
  }));

  return (
    <>
      <SectionWrapper>
        {/* HERO SECTION */}
        <HeroSection>
          <Tagline>Join Nawalingo as a Tutor</Tagline>
          <Heading heading="h1" className="mt-6 mb-2">
            Inspire Learners. <br /> Earn with Flexibility
          </Heading>
          <Description className="mb-2">
            At <strong>Nawalingo</strong>, we connect{" "}
            <strong>vetted teachers</strong> with students worldwide. Our
            platform values <strong>quality teaching</strong> and the{" "}
            <strong>art of learning</strong>, not mass tutoring.
          </Description>
        </HeroSection>
        <Separator />

        {/* WHY TUTOR SECTION */}
        <SectionHeading className="my-24 lg:max-w-2xl xl:max-w-6xl">
          <Tagline className="mb-4">teach. earn. inspire.</Tagline>
          <Heading className="mb-8 text-3xl uppercase md:text-4xl lg:text-5xl">
            Why Tutor with Nawalingo?
          </Heading>

          {/* WHY TUTOR */}
          <div className="grid grid-cols-1 gap-10 text-center xl:grid-cols-2">
            {whyTutorWithNawalingo.map((item, i) => (
              <InfoCard
                key={item.title}
                className={`${i === whyTutorWithNawalingo.length - 1 ? "xl:col-span-2 xl:mx-auto xl:max-w-xl" : ""} flex flex-col items-center px-12`}
              >
                <item.icon className="mb-4 h-16 w-16 text-nawalingo-primary" />
                <InfoCardHeading
                  title={item.title}
                  className="mb-1 text-xl font-bold"
                />
                <InfoCardBody desc={item.body} />
              </InfoCard>
            ))}
          </div>
        </SectionHeading>
        <Separator />

        {/* WHO SHOULD APPLY SECTION */}
        <SectionHeading className="my-24 lg:max-w-6xl">
          <Tagline className="mb-4">passion meets professionalism</Tagline>
          <Heading className="mb-2 text-3xl uppercase md:text-4xl lg:text-5xl">
            Who Should Apply?
          </Heading>

          {/* WHO SHOULD APPLY */}
          <div className="mt-6 grid grid-cols-1 gap-6 text-xl lg:grid-cols-2">
            {WHO_SHOULD_APPLY.map((item) => (
              <InfoCard
                key={item}
                className="flex items-center gap-8 px-8 lg:px-12"
              >
                <FaCheck className="flex-shrink-0 text-2xl text-nawalingo-primary" />
                <InfoCardBody desc={item} className="text-left" />
              </InfoCard>
            ))}
          </div>
        </SectionHeading>
        <Separator />

        {/* DIFFERENCE SECTION */}
        <SectionHeading className="my-24">
          <Tagline>For Teachers Who Care</Tagline>
          <Heading className="mt-6 mb-2 text-3xl uppercase md:text-4xl lg:text-5xl">
            What Makes Nawalingo Different?
          </Heading>

          {/* DIFFERENCE */}
          <Description className="text-nawalingo-dark/70 dark:text-nawalingo-light/70">
            Unlike other platforms that focus on{" "}
            <strong>quantity, Nawalingo</strong> is building a network of{" "}
            <strong>quality-driven tutors</strong>. We believe that{" "}
            <strong>great teachers</strong> deserve platforms that{" "}
            <strong>respect their craft</strong>, value their time, and{" "}
            <strong>support their professional growth</strong>.
          </Description>
        </SectionHeading>
      </SectionWrapper>

      {/* CTA SECTION */}
      <CTASection className="">
        <Heading
          heading="h4"
          className="max-w-xl text-4xl text-nawalingo-light md:text-5xl"
        >
          Ready to Start Teaching with Nawalingo?
        </Heading>
        <Link href="/auth/signup" className="w-full" passHref>
          <Button
            size="lg"
            variant="secondary"
            className="mt-4 border-0 px-12 py-6 text-lg font-bold capitalize hover:border-nawalingo-light hover:bg-nawalingo-light hover:text-nawalingo-primary"
          >
            Sign Up Now
          </Button>
        </Link>
      </CTASection>
    </>
  );
}
