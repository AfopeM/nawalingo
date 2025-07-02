"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div>
      {/* Main Logo Text */}
      <Link
        href="/"
        className={cn(
          "text-center text-xl leading-none font-black tracking-tight text-black uppercase dark:text-white",
          className,
        )}
      >
        nawalingo
      </Link>

      {/* Slanted Gradient Underline */}
      <div className="relative mt-[1px]">
        <div className="relative h-1 w-full overflow-hidden rounded-full">
          {/* Orange section */}
          <div
            className="absolute inset-0 bg-amber-500"
            style={{
              clipPath: "polygon(0 0, 50% 0, 45% 100%, 0 100%)",
            }}
          />
          {/* Teal section */}
          <div
            className="absolute inset-0 bg-cyan-400"
            style={{
              clipPath: "polygon(55% 0, 100% 0, 100% 100%, 50% 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
