"use client";

import { LuMenu } from "react-icons/lu";
import { createPortal } from "react-dom";
import { FaXmark } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useResponsive } from "@/hooks/useResponsive";
import NavLinks from "@/components/navigation/NavLinks";
import AuthLinks from "@/components/navigation/AuthLinks";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Close the menu whenever the user navigates to a different route
  const pathname = usePathname();
  useEffect(() => {
    // Whenever pathname changes (i.e., a navigation happened) close the menu
    setIsOpen(false);
  }, [pathname]);

  // Close the menu automatically if the screen becomes large (≥ lg breakpoint)
  const { isDesktop } = useResponsive();
  useEffect(() => {
    if (isDesktop) {
      setIsOpen(false);
    }
  }, [isDesktop]);

  useLockBodyScroll(isOpen);

  // Render overlay via React Portal so it sits outside nav stacking context
  const overlayPortal = isOpen
    ? createPortal(
        <div
          className="fixed inset-0 z-40 bg-nawalingo-dark/20 backdrop-blur-sm lg:hidden dark:bg-nawalingo-light/20"
          onClick={() => setIsOpen(false)}
        />,
        document.body,
      )
    : null;

  return (
    <>
      <Button
        variant="ghost"
        className="cursor-pointer text-nawalingo-dark duration-300 lg:hidden dark:text-nawalingo-light"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaXmark size={20} /> : <LuMenu size={20} />}
      </Button>

      {/* FULL-SCREEN OVERLAY (rendered outside navbar via portal) */}
      {overlayPortal}
      {isOpen ? (
        <div className="absolute top-0 left-1/2 z-50 w-4/5 -translate-x-1/2 translate-y-24 rounded-lg bg-nawalingo-dark px-12 py-6 text-center md:w-1/2 lg:hidden dark:bg-nawalingo-light">
          <NavLinks isMobile />
          <div className="mt-4">
            <AuthLinks isMobile />
          </div>
        </div>
      ) : null}
    </>
  );
}
