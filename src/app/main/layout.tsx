import type { Metadata } from "next";
import Navbar from "@/layout/Navbar";
import Footer from "@/layout/Footer";

export const metadata: Metadata = {
  title: "Nawalingo | Learn Languages Online with Certified Tutors",
  description:
    "Learn languages through live, one-on-one video lessons with professionally trained tutors. Pay per session and study at your own pace on Nawalingo.",
  keywords: [
    "Nawalingo",
    "Learn Languages Online",
    "Online Language Lessons",
    "Certified Language Tutors",
    "Flexible Language Learning",
    "Pay Per Lesson Language Platform",
  ],
  openGraph: {
    title: "Nawalingo | Learn Languages Online with Certified Tutors",
    description:
      "Learn languages through live, one-on-one video lessons with professionally trained tutors. Pay per session and study at your own pace on Nawalingo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
