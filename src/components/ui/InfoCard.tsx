import { cn } from "@/lib/utils";

interface InfoCardProps {
  children: React.ReactNode;
  className?: string;
}

function InfoCard({ children, className }: InfoCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-nawalingo-dark/10 bg-nawalingo-dark/5 px-6 py-8 text-center backdrop-blur-md dark:border-nawalingo-light/10 dark:bg-nawalingo-light/5",
        className,
      )}
    >
      {children}
    </article>
  );
}

interface InfoCardHeadingProps {
  title: string;
  className?: string;
}

function InfoCardHeading({ title, className }: InfoCardHeadingProps) {
  return (
    <h3
      className={cn(
        "text-lg font-bold text-nawalingo-dark capitalize dark:text-nawalingo-light",
        className,
      )}
    >
      {title}
    </h3>
  );
}

interface InfoCardBodyProps {
  desc: string;
  className?: string;
}

function InfoCardBody({ desc, className }: InfoCardBodyProps) {
  return (
    <p
      className={cn(
        "text-nawalingo-dark/50 md:text-lg dark:text-nawalingo-light/50",
        className,
      )}
    >
      {desc}
    </p>
  );
}

export { InfoCard, InfoCardHeading, InfoCardBody };
