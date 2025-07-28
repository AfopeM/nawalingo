"use client";

import { LuMenu } from "react-icons/lu";
import { createPortal } from "react-dom";
import { FaXmark } from "react-icons/fa6";
import { useEffect, Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/common/Button";
import { useResponsive } from "@/hooks/useResponsive";
import NavLinks from "@/components/navigation/NavLinks";
import AuthLinks from "@/components/navigation/AuthLinks";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  // Close the menu whenever the user navigates to a different route
  const pathname = usePathname();
  useEffect(() => {
    // Whenever pathname changes (i.e., a navigation happened) close the menu
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  // Close the menu automatically if the screen becomes large (≥ lg breakpoint)
  const { isDesktop } = useResponsive();
  useEffect(() => {
    if (isDesktop) {
      setIsOpen(false);
    }
  }, [isDesktop, setIsOpen]);

  useLockBodyScroll(isOpen);

  // Render overlay via React Portal so it sits outside nav stacking context
  const overlayPortal = isOpen
    ? createPortal(
        <div
          className="fixed inset-0 z-40 bg-nawalingo-dark lg:hidden dark:bg-nawalingo-light"
          onClick={() => setIsOpen(false)}
        />,
        document.body,
      )
    : null;

  return (
    <>
      <Button
        variant="ghost"
        className={`cursor-pointer text-nawalingo-dark duration-300 hover:bg-nawalingo-light/10 lg:hidden dark:hover:bg-nawalingo-dark/10 ${isOpen ? "absolute top-4 right-4 z-50" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <FaXmark
            size={20}
            className="text-nawalingo-light/25 dark:text-nawalingo-dark/25"
          />
        ) : (
          <LuMenu size={20} />
        )}
      </Button>

      {/* FULL-SCREEN OVERLAY (rendered outside navbar via portal) */}
      {overlayPortal}

      {isOpen ? (
        <div className="absolute top-1/2 left-1/2 z-50 w-4/5 -translate-x-1/2 translate-y-[45%] px-12 py-6 text-center md:w-1/2 lg:hidden">
          <NavLinks isMobile />
          <div className="mt-16">
            <AuthLinks isMobile />
          </div>
        </div>
      ) : null}
    </>
  );
}
