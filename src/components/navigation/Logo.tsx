import Link from "next/link";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  const baseStyles =
    "flex items-center justify-center gap-x-2 font-black text-xl tracking-tighter uppercase inline-flex";

  return (
    <Link href="/" className={`${baseStyles} ${className}`}>
      <span className="tracking-[-0.15em] text-nawalingo-primary">ነዋሊንጎ</span>
      <span className="text-nawalingo-dark dark:text-nawalingo-light">
        nawalingo
      </span>
    </Link>
  );
}
