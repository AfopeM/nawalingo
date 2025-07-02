"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/Dropdown-Menu";

const AVAILABLE_LANGUAGES = [
  "Amharic",
  "Swahili",
  "Naija-Pidgin",
  "Kinyarwanda",
  "Igbo",
  "Lingala",
  "Hausa",
  "Igala",
  "Yoruba",
  "Shona",
];

interface LanguageSelectionProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
}

export default function LanguageSelection({
  selectedLanguages,
  onChange,
}: LanguageSelectionProps) {
  // const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      onChange(selectedLanguages.filter((l) => l !== language));
    } else {
      onChange([...selectedLanguages, language]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedLanguages.map((language) => (
          <div
            key={language}
            className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm"
          >
            <span>{language}</span>
            <button
              onClick={() => toggleLanguage(language)}
              className="text-primary hover:text-primary/80"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            Select Languages
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {AVAILABLE_LANGUAGES.map((language) => (
            <DropdownMenuCheckboxItem
              key={language}
              checked={selectedLanguages.includes(language)}
              onCheckedChange={() => toggleLanguage(language)}
            >
              {language}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
