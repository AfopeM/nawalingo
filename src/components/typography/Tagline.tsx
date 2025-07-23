import { cn } from "@/lib/utils";

interface TaglineProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tagline({ children, className }: TaglineProps) {
  const baseStyles =
    "mb-2 rounded-lg border border-nawalingo-primary/25 bg-gradient-to-r from-nawalingo-primary/20 to-nawalingo-primary/20 px-4 py-2 text-sm tracking-widest text-nawalingo-primary uppercase backdrop-blur-sm dark:to-orange-900/20";

  return <p className={cn(baseStyles, className)}>{children}</p>;
}
