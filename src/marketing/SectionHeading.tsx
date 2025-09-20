"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  className?: string;
  children: React.ReactNode;
}

export default function SectionHeading({
  className = "",
  children,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.2 }} // play only once when ~20% of component is in view
      className={cn(
        "my-24 flex max-w-xl flex-col items-center text-center md:max-w-2xl lg:max-w-4xl",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
