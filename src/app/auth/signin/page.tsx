import type { Metadata } from "next";
import { AuthMode } from "@/constant";
import AuthForm from "@/components/auth/AuthForm";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Sign In to Nawalingo!",
  description:
    "Log in to seamlessly pick up where you left off. Let&apos;s continue building your fluency, one word at a time.",
};

export default function SigninPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <SectionHeader
        tagline="Your Next Breakthrough Awaits."
        heading="Sign In to Nawalingo!"
        // desc="Log in to seamlessly pick up where you left off. Let's continue building your fluency, one word at a time."
      />
      <AuthForm mode={AuthMode.Signin} />
    </div>
  );
}
