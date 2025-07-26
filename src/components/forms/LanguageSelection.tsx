"use client";

import { Button } from "@/components/ui/Button";
import { FaSortDown } from "react-icons/fa6";
import { AVAILABLE_LANGUAGES, LANGUAGE_DIFFICULTY } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/ui/DropdownMenu";

interface LanguageSelectionProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
}

export default function LanguageSelection({
  selectedLanguages,
  onChange,
}: LanguageSelectionProps) {
  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      onChange(selectedLanguages.filter((l) => l !== language));
    } else {
      onChange([...selectedLanguages, language]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-2">
        {selectedLanguages.map((language) => (
          <div
            key={language}
            className="flex items-center gap-2 rounded bg-primary/10 px-3 py-1 text-sm"
          >
            <span>{language}</span>
            <button
              onClick={() => toggleLanguage(language)}
              className="cursor-pointer text-primary hover:text-primary/80"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <DropdownMenu>
        <div className="flex justify-center">
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex w-full max-w-xs justify-between py-6"
            >
              Select Languages <FaSortDown className="mb-1.5" />
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent className="w-56">
          {AVAILABLE_LANGUAGES.map((language) => (
            <DropdownMenuCheckboxItem
              key={language}
              className="cursor-pointer"
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

interface LanguageProficiencyProps {
  selectedDifficulty: string[];
  onChange: (languages: string[]) => void;
}

export function LanguageProficiency({
  selectedDifficulty,
  onChange,
}: LanguageProficiencyProps) {
  const toggleDifficulty = (difficulty: string) => {
    if (selectedDifficulty.includes(difficulty)) {
      onChange(selectedDifficulty.filter((d) => d !== difficulty));
    } else {
      onChange([...selectedDifficulty, difficulty]);
    }
  };

  return (
    <div className="space-y-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex w-full justify-center gap-6 py-6"
          >
            Select proficiency <FaSortDown className="mb-1.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {LANGUAGE_DIFFICULTY.map((difficulty) => (
            <DropdownMenuCheckboxItem
              key={difficulty}
              checked={selectedDifficulty.includes(difficulty)}
              onCheckedChange={() => toggleDifficulty(difficulty)}
            >
              {difficulty}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
