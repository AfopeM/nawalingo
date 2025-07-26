"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SectionHeadingProps {
  className?: string;
  children: React.ReactNode;
}

export default function SectionHeading({
  className = "",
  children,
}: SectionHeadingProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={cn(
        `mb-10 flex max-w-lg flex-col items-center gap-2 text-center transition-all duration-1000 lg:max-w-2xl ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`,
        className,
      )}
    >
      {children}
    </div>
  );
}
