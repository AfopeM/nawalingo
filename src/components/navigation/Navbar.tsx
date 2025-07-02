"use client";

import MobileMenu from "./MobileMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

export default function Navbar() {
  return (
    <nav className="flex h-16 w-full items-center justify-between px-8 py-4">
      <Logo />

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Desktop Navigation */}
      <div className="hidden items-center gap-4 md:flex">
        <NavLinks />
        <ThemeToggle />
      </div>
    </nav>
  );
}
