import type { Metadata } from "next";
import { AuthMode } from "@/constants";
import Heading from "@/components/typography/Heading";
import Tagline from "@/components/typography/Tagline";
import AuthForm from "@/components/forms/AuthForm";
import Description from "@/components/typography/Description";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Join Nawalingo",
  description:
    "Don't just learn a language, live it! Create your account and immediately access all the tools you need to become fluent.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <SectionHeading>
        <Tagline>Start Speaking Confidently!</Tagline>
        <Heading>Join Nawalingo 💬</Heading>
        <Description className="mb-10">
          Don&apos;t just learn a language, live it! Create your account and
          immediately access all the tools you need to become fluent.
        </Description>
        <AuthForm mode={AuthMode.Signup} />
      </SectionHeading>
    </div>
  );
}
