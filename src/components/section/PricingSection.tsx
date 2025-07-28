"use client";
import { Button } from "@/common/Button";
import React, { useState } from "react";
import PricingCard from "@/ui/PricingCard";
import SectionHeading from "@/common/SectionHeading";
import { pricingTiers } from "@/constants/pricing";
import { Tagline, Heading, Description } from "@/common/Typography";

export default function PricingSection() {
  const [view, setView] = useState<"single" | "group">("single");

  return (
    <SectionHeading>
      {/* SECTION HEADER */}
      <Tagline>Invest in Fluency, Not Just Lessons</Tagline>
      <Heading className="mt-4">
        Simple Pricing. No contracts. No hidden fees.
      </Heading>
      <Description>
        Choose a plan that fits your goals, your schedule, and your pace. No
        pressure. Just progress.
      </Description>

      {/* TOGGLE */}
      <div className="mt-6 mb-10 flex justify-center rounded-full border border-nawalingo-dark/10 bg-nawalingo-dark/5 p-2 dark:border-nawalingo-light/10 dark:bg-nawalingo-light/5">
        {/* Inner pill container */}
        <div className="relative">
          {/* Sliding background */}
          <span
            aria-hidden
            className={`absolute top-0 left-0 h-full w-1/2 rounded-full bg-nawalingo-primary transition-transform duration-300 ${
              view === "group" ? "translate-x-full" : "translate-x-0"
            }`}
          />

          {/* Single option */}
          <Button
            variant="blank"
            type="button"
            onClick={() => setView("single")}
            className={`relative z-10 rounded-full px-6 py-2 text-sm font-semibold tracking-widest transition-colors duration-200 ${
              view === "single"
                ? "text-nawalingo-light"
                : "text-nawalingo-dark/50 hover:text-nawalingo-dark dark:text-nawalingo-light/50 dark:hover:text-nawalingo-light"
            }`}
          >
            Single
          </Button>

          {/* Group option */}
          <Button
            variant="blank"
            type="button"
            onClick={() => setView("group")}
            className={`relative z-10 rounded-full px-6 py-2 text-sm font-semibold tracking-widest transition-colors duration-200 ${
              view === "group"
                ? "text-nawalingo-light"
                : "text-nawalingo-dark/50 hover:text-nawalingo-dark dark:text-nawalingo-light/50 dark:hover:text-nawalingo-light"
            }`}
          >
            Group
          </Button>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="mx-auto mb-10 grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-3">
        {pricingTiers.map(({ tier, single, group, isPopular }) => {
          const data = view === "single" ? single : group;
          return (
            <PricingCard
              key={tier}
              tier={tier}
              price={data.price}
              isPopular={isPopular}
              features={data.features}
            />
          );
        })}
      </div>

      {/* GUARANTEE */}
      <p className="text-sm tracking-wider text-nawalingo-gray-light dark:text-nawalingo-gray-dark">
        First session is backed by our satisfaction guarantee.
      </p>
    </SectionHeading>
  );
}
