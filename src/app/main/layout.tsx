import type { Metadata } from "next";
import Navbar from "@/layout/Navbar";
import Footer from "@/layout/Footer";

export const metadata: Metadata = {
  title: "Nawalingo | Learn Languages with Confidence",
  description:
    "Nawalingo is a pay-per-lesson language learning platform offering live video sessions with qualified tutors.",
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
