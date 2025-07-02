"use client";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/Sheet";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="mt-12">
          <SheetTitle>
            <Logo className="text-xl" />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <NavLinks isMobile />
          </div>

          <div className="mx-auto mt-2">
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
