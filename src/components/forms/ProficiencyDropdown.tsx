import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/ui/DropdownMenu";
import { Button } from "@/common/Button";
import { LANGUAGE_PROFICIENCY } from "@/constants";
import { FaSortDown } from "react-icons/fa6";

export function ProficiencyDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full max-w-xs justify-between py-6"
        >
          {value
            ? value.charAt(0) + value.slice(1).toLowerCase()
            : "Select proficiency"}
          <FaSortDown className="mb-1.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {LANGUAGE_PROFICIENCY.map((level) => (
            <DropdownMenuRadioItem key={level} value={level}>
              {level.charAt(0) + level.slice(1).toLowerCase()}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
