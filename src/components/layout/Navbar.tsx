"use client";
import Logo from "@/navigation/Logo";
import NavLinks from "@/navigation/NavLinks";
import AuthLinks from "@/components/navigation/AuthLinks";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="relative z-50 container mx-auto flex h-20 w-full items-center justify-between px-8">
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
