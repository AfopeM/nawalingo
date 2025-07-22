import type { Metadata } from "next";
import { AuthMode } from "@/constant";
import AuthForm from "@/components/auth/AuthForm";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Join Nawalingo",
  description:
    "Don't just learn a language, live it! Create your account and immediately access all the tools you need to become fluent.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <SectionHeader
        tagline="Start Speaking Confidently!"
        heading="Join Nawalingo 💬"
        // desc="Don't just learn a language, live it! Create your account and immediately access all the tools you need to become fluent."
      />
      <AuthForm mode={AuthMode.Signup} />
    </div>
  );
}
