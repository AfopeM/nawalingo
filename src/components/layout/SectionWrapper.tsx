import { cn } from "@/lib/utils";

export default function SectionWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "relative container mx-auto flex flex-col items-center px-12 text-center",
        className,
      )}
    >
      {children}
    </main>
  );
}
