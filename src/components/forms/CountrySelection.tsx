import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/Dropdown-Menu";
import { FaSortDown } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { countries as COUNTRIES_MAP } from "countries-list";

interface CountrySelectionProps {
  selectedCountry: string;
  onChange: (country: string) => void;
}
const COUNTRIES = Object.values(COUNTRIES_MAP)
  .map((c) => c.name)
  .sort();

export default function CountrySelection({
  selectedCountry,
  onChange,
}: CountrySelectionProps) {
  return (
    <DropdownMenu>
      <div className="flex justify-center">
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full max-w-xs justify-between py-6"
          >
            {selectedCountry ? selectedCountry : "select country"}
            <FaSortDown className="mb-1.5" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-72">
        <div className="max-h-[300px] overflow-y-auto">
          {COUNTRIES.map((country: string) => (
            <DropdownMenuItem
              key={country}
              className="cursor-pointer"
              onClick={() => onChange(country)}
            >
              {country}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
