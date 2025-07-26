import type { Metadata } from "next";
import { AuthMode } from "@/constants";
import Heading from "@/components/typography/Heading";
import Tagline from "@/components/typography/Tagline";
import AuthForm from "@/components/forms/AuthForm";
import Description from "@/components/typography/Description";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Sign In to Nawalingo!",
  description:
    "Log in to seamlessly pick up where you left off. Let&apos;s continue building your fluency, one word at a time.",
};

export default function SigninPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center">
      <SectionHeading>
        <Tagline>Your Next Breakthrough Awaits.</Tagline>
        <Heading>Sign In to Nawalingo!</Heading>
        <Description className="mb-10">
          Log in to seamlessly pick up where you left off. Let&apos;s continue
          building your fluency, one word at a time.
        </Description>
        <AuthForm mode={AuthMode.Signin} />
      </SectionHeading>
    </div>
  );
}
