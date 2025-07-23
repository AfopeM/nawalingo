import { cn } from "@/lib/utils";

interface DescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export default function Description({ className, children }: DescriptionProps) {
  const baseStyle =
    "text-lg text-nawalingo-dark/50 md:text-xl dark:text-nawalingo-light/50 leading-relaxed";
  return <p className={cn(baseStyle, className)}>{children}</p>;
}
