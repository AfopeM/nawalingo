"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  // Hide the Navbar for any `/user` route (including deeper paths)
  const showNavbar =
    !pathname.startsWith("/user") && !pathname.startsWith("/auth");

  if (showNavbar) {
    return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    );
  }

  return <>{children}</>;
}
