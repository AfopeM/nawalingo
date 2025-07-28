import Link from "next/link";

interface LogoProps {
  className?: string;
  isFooter?: boolean;
}

export default function Logo({ className, isFooter = false }: LogoProps) {
  const baseStyles =
    "flex items-center justify-center gap-x-2 font-black text-xl tracking-tighter uppercase inline-flex";

  const textStyles = isFooter
    ? "text-nawalingo-light dark:text-nawalingo-dark"
    : "text-nawalingo-dark dark:text-nawalingo-light";

  return (
    <Link href="/main" className={`${baseStyles} ${className}`}>
      <span className="tracking-[-0.15em] text-nawalingo-primary">ነዋሊንጎ</span>
      <span className={textStyles}>nawalingo</span>
    </Link>
  );
}
