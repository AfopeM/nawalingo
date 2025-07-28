"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/ui/DropdownMenu";
import { Button } from "@/common/Button";
import { FaSortDown } from "react-icons/fa6";

interface TimezoneSelectionProps {
  selectedTimezone: string;
  showDetectedTimeZone?: boolean;
  onChange: (timezone: string) => void;
}

export default function TimezoneSelection({
  selectedTimezone,
  showDetectedTimeZone = true,
  onChange,
}: TimezoneSelectionProps) {
  const [detectedTimezone, setDetectedTimezone] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const localZone = DateTime.local().zoneName;
    setDetectedTimezone(localZone || "UTC");
    if (!selectedTimezone) {
      onChange(localZone || "UTC");
    }
  }, [selectedTimezone, onChange]);

  // Get all available timezones using Intl API
  const timezones = Intl.supportedValuesOf("timeZone");

  // Filter timezones based on search query
  const filteredTimezones = timezones.filter((zone: string) =>
    zone.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatTimezone = (zone: string) => {
    const now = DateTime.now().setZone(zone);
    const offset = now.toFormat("ZZ");
    return `${zone} (UTC${offset})`;
  };

  return (
    <div className="space-y-4">
      {showDetectedTimeZone && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-sm text-gray-500">Detected timezone:</span>
          <span className="font-medium">
            {formatTimezone(detectedTimezone)}
          </span>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-around py-6">
            {selectedTimezone
              ? formatTimezone(selectedTimezone)
              : "Select timezone"}{" "}
            <FaSortDown className="mb-1.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search timezones..."
              className="w-full rounded-md border px-3 py-2 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredTimezones.map((zone: string) => (
              <DropdownMenuItem
                key={zone}
                className="cursor-pointer"
                onClick={() => onChange(zone)}
              >
                {formatTimezone(zone)}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
