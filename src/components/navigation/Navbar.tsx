"use client";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import AuthLinks from "./AuthLinks";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="relative z-50 container mx-auto flex h-20 w-screen items-center justify-between px-8 py-4">
      <div className="flex items-center gap-6 lg:gap-12">
        <Logo />

        {/* DESKTOP NAVIAGTION */}
        <NavLinks />
      </div>

      <div className="flex items-center gap-4">
        <AuthLinks />
        <ThemeToggle />

        {/* MOBILE MENU*/}
        <MobileMenu />
      </div>
    </nav>
  );
}
