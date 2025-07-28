import type { Metadata } from "next";
import { AuthMode } from "@/constants";
import AuthForm from "@/components/forms/AuthForm";
import SectionHeading from "@/common/SectionHeading";
import { Heading, Tagline, Description } from "@/common/Typography";

export const metadata: Metadata = {
  title: "Create Your Nawalingo Account | Start Learning Languages Today",
  description:
    "Join Nawalingo and access live language lessons with certified tutors. Don't just learn a language — live it with real conversations and cultural immersion.",
  keywords: [
    "Nawalingo Sign Up",
    "Join Nawalingo",
    "Create Nawalingo Account",
    "Learn Languages Online",
    "Live Language Lessons",
    "Certified Language Tutors",
  ],
  openGraph: {
    title: "Create Your Nawalingo Account | Start Learning Languages Today",
    description:
      "Join Nawalingo and access live language lessons with certified tutors. Don't just learn a language — live it with real conversations and cultural immersion.",
  },
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <SectionHeading className="max-w-md md:max-w-lg lg:max-w-lg">
        <Tagline>Start Speaking Confidently!</Tagline>
        <Heading className="mt-6 mb-2">Join Nawalingo 💬</Heading>
        <Description className="mb-10">
          Don&apos;t just learn a language, live it! Create your account and
          immediately access all the tools you need to become fluent.
        </Description>
        <AuthForm mode={AuthMode.Signup} />
      </SectionHeading>
    </div>
  );
}
