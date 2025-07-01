import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SignupForm from "@/components/auth/Signup-Form";

export default function SignupPage() {
  return (
    <div className="container mx-auto h-screen px-8 py-4">
      <nav className="flex h-[5%] items-center justify-between">
        <Link href="/">Back</Link>
        <ThemeToggle />
      </nav>
      <div className="flex h-[95%] items-center justify-center">
        <SignupForm />
      </div>
    </div>
  );
}
