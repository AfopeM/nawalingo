"use client";
import { useState } from "react";
import Logo from "@/navigation/Logo";
import NavLinks from "@/navigation/NavLinks";
import AuthLinks from "@/components/navigation/AuthLinks";
import MobileMenu from "@/layout/MobileMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  // Track whether the mobile menu is currently open
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 container mx-auto flex h-20 w-full items-center justify-between px-8">
      {/* LEFT SECTION: Logo + Desktop nav links */}
      <div
        className={`flex items-center gap-6 ${isMobileMenuOpen ? "hidden lg:flex" : ""}`}
      >
        <Logo />

        {/* DESKTOP NAVIGATION */}
        <NavLinks />
      </div>

      {/* RIGHT SECTION: Auth links, theme toggle & mobile menu button */}
      <div className="flex items-center gap-4">
        {/* Hide these while the mobile menu is open so that only the X icon is visible */}
        {!isMobileMenuOpen && <AuthLinks />}
        {!isMobileMenuOpen && <ThemeToggle />}

        {/* MOBILE MENU TOGGLE */}
        <MobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      </div>
    </nav>
  );
}
