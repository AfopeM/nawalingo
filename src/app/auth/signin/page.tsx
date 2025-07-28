import type { Metadata } from "next";
import { AuthMode } from "@/constants";
import AuthForm from "@/components/forms/AuthForm";
import SectionHeading from "@/common/SectionHeading";
import { Heading, Tagline, Description } from "@/common/Typography";

export const metadata: Metadata = {
  title: "Sign In to Nawalingo | Continue Your Language Learning Journey",
  description:
    "Log in to Nawalingo to seamlessly pick up where you left off and keep building your language skills, one word at a time.",
  keywords: [
    "Nawalingo Sign In",
    "Login to Nawalingo",
    "Continue Language Learning",
    "Language Learning Platform Login",
  ],
  openGraph: {
    title: "Sign In to Nawalingo | Continue Your Language Learning Journey",
    description:
      "Log in to Nawalingo to seamlessly pick up where you left off and keep building your language skills, one word at a time.",
  },
};

export default function SigninPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <SectionHeading className="max-w-md md:max-w-lg lg:max-w-lg">
        <Tagline>Your Next Breakthrough Awaits.</Tagline>
        <Heading className="mt-6 mb-2">Sign In to Nawalingo!</Heading>
        <Description className="mb-10">
          Log in to seamlessly pick up where you left off. Let&apos;s continue
          building your fluency, one word at a time.
        </Description>
        <AuthForm mode={AuthMode.Signin} />
      </SectionHeading>
    </div>
  );
}
