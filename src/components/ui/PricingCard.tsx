"use client";
import React from "react";
import { Separator } from "@/common/Separator";
// import { Check, Star } from "lucide-react";
import { Button } from "@/common/Button";
import { FaCheck, FaStar } from "react-icons/fa";
import { useTheme } from "@/providers/theme/theme-provider";

interface PricingCardProps {
  tier: string;
  price: string;
  features: readonly string[];
  isPopular?: boolean;
}

export default function PricingCard({
  tier,
  price,
  features,
  isPopular = false,
}: PricingCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <article
      className={`mx-auto w-full max-w-lg rounded-2xl border p-2 backdrop-blur-xl ${isPopular ? "border-nawalingo-primary/50 bg-nawalingo-primary/50" : "border-nawalingo-dark/5 bg-nawalingo-dark/5 dark:border-nawalingo-light/5 dark:bg-nawalingo-light/5"}`}
    >
      <div
        className={`relative flex h-96 flex-col justify-between rounded-2xl border border-white/10 p-6 backdrop-blur-xl transition-all duration-300 ${
          isPopular
            ? "z-10 bg-nawalingo-dark text-nawalingo-dark dark:bg-nawalingo-light"
            : "bg-nawalingo-dark/5 text-nawalingo-light dark:bg-nawalingo-light/5"
        }`}
      >
        {isPopular && (
          <div className="absolute -top-4 left-1/2 flex w-[58%] -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-nawalingo-primary p-1 text-xs font-bold tracking-wider text-nawalingo-dark uppercase md:-translate-y-0.5">
            <FaStar className="h-3.5 w-3.5 fill-current" />
            Most Popular
          </div>
        )}

        <div className="text-start">
          <h4
            className={`mb-2 text-sm tracking-wider uppercase ${
              isPopular
                ? "text-nawalingo-gray-light dark:text-nawalingo-gray-dark"
                : "text-nawalingo-gray-dark dark:text-nawalingo-gray-light"
            }`}
          >
            {tier}
          </h4>
          <h2
            className={`mb-6 text-5xl font-black lg:text-6xl ${
              isPopular
                ? "text-nawalingo-primary dark:text-nawalingo-dark"
                : "text-nawalingo-primary dark:text-nawalingo-primary"
            }`}
          >
            {price}
          </h2>

          <Separator
            className={`mb-6 ${isPopular ? "bg-nawalingo-gray-light/25 dark:bg-nawalingo-gray-dark/25" : "bg-nawalingo-gray-dark/25 dark:bg-nawalingo-gray-light/25"}`}
          />

          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center space-x-3">
                <FaCheck className="w-3 text-nawalingo-primary" />
                <span
                  className={`text-base leading-snug ${
                    isPopular
                      ? "text-nawalingo-light/50 dark:text-nawalingo-dark"
                      : "text-nawalingo-dark/75 dark:text-nawalingo-gray-dark"
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {isPopular ? (
          <Button className="py-6 font-bold capitalize dark:hover:text-nawalingo-primary">
            get started
          </Button>
        ) : (
          <Button
            className="py-6 font-bold capitalize"
            variant={isDark ? "outline" : "secondary"}
          >
            get started
          </Button>
        )}
      </div>
    </article>
  );
}
