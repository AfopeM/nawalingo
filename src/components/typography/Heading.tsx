import { cn } from "@/lib/utils";

interface HeadingProps {
  heading?: "h1" | "h2";
  className?: string;
  children: React.ReactNode;
}

export default function Heading({
  heading,
  className,
  children,
}: HeadingProps) {
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
