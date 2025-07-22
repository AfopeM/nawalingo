"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/auth/auth-provider";

interface AuthLinksProps {
  isMobile?: boolean;
}

export default function AuthLinks({ isMobile = false }: AuthLinksProps) {
  const { user, signOut } = useAuth();

  // Define base styles common to all auth buttons
  const baseButtonStyles = "font-black tracking-wider capitalize";

  // Define mobile-specific styles for the 'outline' variant button (Login/Dashboard)
  const mobileOutlineStyles =
    "w-full border border-nawalingo-light/10 bg-nawalingo-light py-6 text-xl text-nawalingo-dark hover:border-nawalingo-primary hover:bg-transparent hover:text-nawalingo-light dark:bg-nawalingo-dark dark:text-nawalingo-light hover:dark:bg-transparent hover:dark:text-nawalingo-primary";

  // Define mobile-specific styles for the 'default' variant button (Signup/Logout)
  const mobileDefaultStyles =
    "mt-4 w-full py-6 text-xl hover:bg-transparent hover:dark:bg-nawalingo-primary/20 hover:dark:text-nawalingo-primary";

  // Define desktop-specific styles (primarily hiding on small screens)
  const desktopStyles = "hidden lg:flex";

  // Helper function to combine classes conditionally
  const getButtonClasses = (
    isOutlineVariant: boolean, // true for Login/Dashboard, false for Signup/Logout
  ) => {
    return cn(
      baseButtonStyles,
      isMobile
        ? isOutlineVariant
          ? mobileOutlineStyles
          : mobileDefaultStyles
        : desktopStyles,
    );
  };

  if (user) {
    return (
      <>
        {/* DASHBOARD BUTTON */}
        <Link href="/user/dashboard" passHref>
          <Button variant="outline" className={getButtonClasses(true)}>
            Dashboard
          </Button>
        </Link>
        {/* LOGOUT BUTTON*/}
        <Button
          onClick={signOut}
          className={getButtonClasses(false)} // Logout uses default button variant
        >
          Logout
        </Button>
      </>
    );
  } else {
    return (
      <>
        {/* LOGIN BUTTON*/}
        <Link href="/auth/signin" passHref>
          <Button variant="outline" className={getButtonClasses(true)}>
            Login
          </Button>
        </Link>

        {/* SIGNUP BUTTON*/}
        <Link href="/auth/signup" passHref>
          <Button className={getButtonClasses(false)}>Signup</Button>
        </Link>
      </>
    );
  }
}
