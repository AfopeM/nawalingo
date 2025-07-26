"use client";

import { useState } from "react";
import { DAYS } from "@/constants";
import { Button } from "@/components/ui/Button";
import { formatTimeForDisplay } from "@/lib/time";
import { Separator } from "@/components/ui/Separator";

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const startHour24 = i;
  const endHour24 = i + 1;

  return {
    // These are the internal values used for logic (24-hour format)
    start: `${startHour24.toString().padStart(2, "0")}:00`,
    end: `${endHour24.toString().padStart(2, "0")}:00`,
    // These are the display values (12-hour AM/PM format)
    displayStart: formatTimeForDisplay(startHour24),
    displayEnd: formatTimeForDisplay(endHour24),
  };
});

interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

interface AvailabilitySelectionProps {
  selectedSlots: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
}

export default function AvailabilitySelection({
  selectedSlots,
  onChange,
}: AvailabilitySelectionProps) {
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);

  const isSlotSelected = (day: string, start: string, end: string) => {
    return selectedSlots.some(
      (slot) => slot.day === day && slot.start === start && slot.end === end,
    );
  };

  const toggleTimeSlot = (start: string, end: string) => {
    const isSelected = isSlotSelected(selectedDay, start, end);
    let newSlots: TimeSlot[];

    if (isSelected) {
      newSlots = selectedSlots.filter(
        (slot) =>
          !(
            slot.day === selectedDay &&
            slot.start === start &&
            slot.end === end
          ),
      );
    } else {
      newSlots = [...selectedSlots, { day: selectedDay, start, end }];
    }

    onChange(newSlots);
  };

  return (
    <div className="space-y-4">
      {/* DAY SELECTION */}
      <div className="flex flex-wrap justify-center gap-2 overflow-x-auto pb-2">
        {DAYS.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? "default" : "outline"}
            onClick={() => setSelectedDay(day)}
            className="flex-shrink-0 whitespace-nowrap"
          >
            {day}
          </Button>
        ))}
      </div>

      {/* TIME SLOT SELECTION */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {TIME_SLOTS.map(({ start, end, displayStart, displayEnd }) => (
          <button
            key={`${start}-${end}`} // Use the original 24-hour format for the key
            onClick={() => toggleTimeSlot(start, end)} // Pass original 24-hour format to toggle
            className={`rounded-lg border p-3 text-sm font-medium transition-all duration-200 ease-in-out ${
              isSlotSelected(selectedDay, start, end) // Check using original 24-hour format
                ? "border-primary bg-primary text-white shadow-md"
                : "border-gray-300 bg-white text-gray-800 hover:border-primary hover:bg-primary/5 hover:text-primary"
            } `}
          >
            {displayStart} - {displayEnd} {/* Display the formatted time */}
          </button>
        ))}
      </div>

      <Separator
        className={`${selectedSlots.length <= 0 ? "hidden" : "block"} my-8 bg-black/10`}
      />

      {/* SELECTED TIME SLOT DISPLAY */}
      <div className={`${selectedSlots.length <= 0 ? "hidden" : "block"} mt-4`}>
        <h3 className="mb-4 text-center text-lg font-semibold">
          Your Selections:
        </h3>
        <div className="space-y-2">
          {DAYS.map((day) => {
            const daySlots = selectedSlots.filter((slot) => slot.day === day);
            if (daySlots.length === 0) return null;

            return (
              <div key={day} className="rounded-lg border bg-gray-50 px-6 py-4">
                <h4 className="mb-2 font-semibold text-gray-700">{day}</h4>
                <div className="flex flex-wrap gap-2">
                  {daySlots.map((slot) => (
                    <span
                      key={`${slot.day}-${slot.start}-${slot.end}`}
                      className="inline-flex items-center rounded bg-primary/10 px-3 py-1 text-sm font-medium text-primary/50"
                    >
                      {/* Format the selected slot times for display here as well */}
                      {formatTimeForDisplay(parseInt(slot.start.split(":")[0]))}{" "}
                      - {formatTimeForDisplay(parseInt(slot.end.split(":")[0]))}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
