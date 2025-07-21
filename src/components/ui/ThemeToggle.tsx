"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/providers/theme/theme-provider";

export default function ThemeToggle() {
  const iconStyling = "h-5 w-5";
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? (
        <Moon className={iconStyling} />
      ) : (
        <Sun className={iconStyling} />
      )}
    </Button>
  );
}
