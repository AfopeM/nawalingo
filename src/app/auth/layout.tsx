import Link from "next/link";
import { Button } from "@/components/atoms";
import { FaArrowLeft } from "react-icons/fa";
import ThemeToggle from "@/components/organisms/ThemeToggle";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex h-20 w-full items-center justify-between px-8 md:px-16 lg:px-32">
        <Link href="/">
          <Button variant="ghost">
            <FaArrowLeft />
            Back
          </Button>
        </Link>

        <ThemeToggle />
      </nav>
      {children}
    </div>
  );
}
