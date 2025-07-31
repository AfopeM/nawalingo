import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | Start Learning Today",
  description:
    "Join Nawalingo and access live language lessons with certified tutors. Experience real conversations, cultural immersion, and personalized learning paths. Sign up now and start speaking confidently.",
  keywords: [
    "Nawalingo Sign Up",
    "Join Nawalingo",
    "Create Nawalingo Account",
    "Language Learning Platform",
    "Live Language Lessons",
  ],
  openGraph: {
    title: "Onboarding | Start Learning Today",
    description:
      "Join Nawalingo and access live language lessons with certified tutors. Experience real conversations, cultural immersion, and personalized learning paths.",
  },
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
