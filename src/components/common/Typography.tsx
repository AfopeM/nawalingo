import { cn } from "@/lib/utils";

// TAGLINE
interface TaglineProps {
  children: React.ReactNode;
  className?: string;
}

function Tagline({ children, className }: TaglineProps) {
  const baseStyles =
    "mb-2 rounded-lg border border-nawalingo-primary/25 bg-gradient-to-r from-nawalingo-primary/20 to-nawalingo-primary/20 px-4 py-2 text-sm tracking-widest text-nawalingo-primary uppercase backdrop-blur-sm dark:to-orange-900/20";

  return <p className={cn(baseStyles, className)}>{children}</p>;
}

// HEADING
interface HeadingProps {
  heading?: "h1" | "h2" | "h4";
  className?: string;
  children: React.ReactNode;
}

function Heading({ heading, className, children }: HeadingProps) {
  switch (heading) {
    case "h1":
      return (
        <h1
          className={cn(
            "mb-4 text-5xl font-black tracking-tight uppercase md:text-7xl",
            className,
          )}
        >
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2
          className={cn(
            "text-3xl font-black tracking-tight text-nawalingo-dark capitalize lg:text-5xl dark:text-nawalingo-light",
            className,
          )}
        >
          {children}
        </h2>
      );
    case "h4":
      return (
        <h4
          className={cn("text-2xl font-black uppercase lg:text-4xl", className)}
        >
          {children}
        </h4>
      );
    default:
      return (
        <h2
          className={cn(
            "text-3xl font-black tracking-tight text-nawalingo-dark capitalize lg:text-5xl dark:text-nawalingo-light",
            className,
          )}
        >
          {children}
        </h2>
      );
  }
}

// DESCRIPTION
interface DescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export default function Description({ className, children }: DescriptionProps) {
  const baseStyle =
    "text-lg text-nawalingo-dark/50 md:text-xl dark:text-nawalingo-light/50 leading-relaxed w-full";
  return <p className={cn(baseStyle, className)}>{children}</p>;
}

export { Tagline, Heading, Description };
