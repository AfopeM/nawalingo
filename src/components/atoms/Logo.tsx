import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  isFooter?: boolean;
}

export default function Logo({
  className,
  isFooter = false,
  showText = true,
}: LogoProps) {
  const baseStyles =
    "flex items-center justify-center gap-x-2 font-black text-xl tracking-tighter uppercase inline-flex";

  const textStyles = isFooter
    ? "text-nawalingo-light dark:text-nawalingo-dark"
    : "text-nawalingo-dark dark:text-nawalingo-light";

  return (
    <Link href="/main" className={cn(baseStyles, className)}>
      <span className="tracking-[-0.15em] text-nawalingo-primary">ነዋሊንጎ</span>
      {showText && <span className={textStyles}>nawalingo</span>}
    </Link>
  );
}
