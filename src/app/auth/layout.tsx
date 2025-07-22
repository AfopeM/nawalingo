import Link from "next/link";
import { Button } from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { FaArrowLeft } from "react-icons/fa";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex h-20 w-full items-center justify-between px-4">
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
