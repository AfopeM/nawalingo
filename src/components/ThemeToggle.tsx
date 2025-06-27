"use client";

import { Button } from "@/components/ui/New-Button";
import { Moon, Sun } from "lucide-react"; // You have lucide-react
import { useTheme } from "@/providers/theme/theme-provider"; // Adjust path if needed

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="rounded-md p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
      ) : (
        <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200" />
      )}
    </Button>
  );
}
