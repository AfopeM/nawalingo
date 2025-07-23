"use client";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import AuthLinks from "@/components/navigation/AuthLinks";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="relative z-50 flex h-20 w-full items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <Logo />

        {/* DESKTOP NAVIAGTION */}
        <NavLinks />
      </div>

      <div className="flex items-center gap-4">
        {/* AUTH LINKS */}
        <AuthLinks />

        {/* THEME TOGGLE */}
        <ThemeToggle />

        {/* MOBILE MENU*/}
        <MobileMenu />
      </div>
    </nav>
  );
}
