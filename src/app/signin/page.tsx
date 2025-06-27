import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import SigninForm from "@/components/auth/Signin-Form";

export default function SigninPage() {
  return (
    <div className="container mx-auto h-screen">
      <nav className="flex h-[5%] items-center justify-between">
        <Link href="/">Back</Link>
        <ThemeToggle />
      </nav>
      <div className="flex h-[95%] items-center justify-center">
        <SigninForm />
      </div>
    </div>
  );
}
