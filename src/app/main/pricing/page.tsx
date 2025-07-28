import type { Metadata } from "next";
import SectionWrapper from "@/layout/SectionWrapper";
import HeroSection from "@/layout/HeroSection";
import { Tagline, Heading, Description } from "@/common/Typography";
import PricingSection from "@/components/section/PricingSection";
import { Separator } from "@/common/Separator";
import { FaCheck } from "react-icons/fa";
import SectionHeading from "@/common/SectionHeading";

export const metadata: Metadata = {
  title: "Nawalingo Pricing | Affordable Language Learning Plans",
  description:
    "Explore transparent and flexible pricing options at Nawalingo. Pay per lesson and learn languages with certified tutors at rates that fit your budget.",
  keywords: [
    "Nawalingo pricing",
    "Language learning pricing",
    "Affordable language lessons",
    "Pay per lesson language platform",
    "Certified tutor rates",
  ],
  openGraph: {
    title: "Nawalingo Pricing | Affordable Language Learning Plans",
    description:
      "Explore transparent and flexible pricing options at Nawalingo. Pay per lesson and learn languages with certified tutors at rates that fit your budget.",
  },
};

export default function PricingPage() {
  return (
    <SectionWrapper>
      {/* HERO SECTION */}
      <HeroSection>
        <Tagline>flexible payment plans</Tagline>
        <Heading heading="h1" className="mt-6 mb-2">
          Transparent Pricing for Every Learner
        </Heading>
        <Description>
          Choose the plan that suits your goals and budget. No hidden fees—just
          clear, straightforward pricing.
        </Description>
      </HeroSection>

      {/* PRICING SECTION */}
      <PricingSection />

      <Separator />

      {/* PAYMENT & REFUND TERMS */}
      <SectionHeading className="my-24 lg:max-w-2xl xl:max-w-4xl">
        <Tagline className="mb-4">Peace of Mind, Guaranteed</Tagline>
        <Heading className="mb-4 text-3xl uppercase md:text-4xl lg:text-5xl">
          Payment & Refund Terms
        </Heading>
        <Description className="mb-8 text-nawalingo-dark/70 dark:text-nawalingo-light/70">
          We believe in transparent pricing and customer satisfaction. If our
          service doesn’t meet your expectations, you’re protected by our refund
          policy.
        </Description>

        <ul className="space-y-4 text-left text-base leading-relaxed text-nawalingo-dark/80 dark:text-nawalingo-light/80">
          <li className="flex items-start gap-3">
            <FaCheck className="mt-1 flex-shrink-0 text-nawalingo-primary" />
            <span>
              <strong>Full refund:</strong> Request within{" "}
              <strong>7&nbsp;days</strong> of your initial purchase—provided you
              haven’t accessed any course materials or been matched with a
              tutor.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheck className="mt-1 flex-shrink-0 text-nawalingo-primary" />
            <span>
              <strong>Partial refund:</strong> If you’ve started lessons, we’ll
              calculate a fair refund based on your progress and usage.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheck className="mt-1 flex-shrink-0 text-nawalingo-primary" />
            <span>
              To initiate a refund, email our support team at{" "}
              <a href="mailto:customercare@nawalingo.com" className="underline">
                customercare@nawalingo.com
              </a>{" "}
              with your purchase details.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheck className="mt-1 flex-shrink-0 text-nawalingo-primary" />
            <span>
              <strong>No refunds</strong> are issued after{" "}
              <strong>30&nbsp;days</strong> from the purchase date.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <FaCheck className="mt-1 flex-shrink-0 text-nawalingo-primary" />
            <span>
              Approved refunds are processed within{" "}
              <strong>8–14&nbsp;business days</strong>.
            </span>
          </li>
        </ul>
      </SectionHeading>
    </SectionWrapper>
  );
}
