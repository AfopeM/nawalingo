"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i).map((hour) => ({
  start: `${hour.toString().padStart(2, "0")}:00`,
  end: `${(hour + 1).toString().padStart(2, "0")}:00`,
}));

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
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {DAYS.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? "default" : "outline"}
            onClick={() => setSelectedDay(day)}
            className="whitespace-nowrap"
          >
            {day}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {TIME_SLOTS.map(({ start, end }) => (
          <button
            key={`${start}-${end}`}
            onClick={() => toggleTimeSlot(start, end)}
            className={`rounded-lg border p-2 text-sm transition-colors ${
              isSlotSelected(selectedDay, start, end)
                ? "border-primary bg-primary/10"
                : "border-gray-200 hover:border-primary/50"
            }`}
          >
            {start} - {end}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <h4 className="mb-2 font-medium">Selected Time Slots:</h4>
        <div className="space-y-2">
          {DAYS.map((day) => {
            const daySlots = selectedSlots.filter((slot) => slot.day === day);
            if (daySlots.length === 0) return null;

            return (
              <div key={day} className="rounded-lg border p-2">
                <h5 className="font-medium">{day}</h5>
                <div className="mt-1 flex flex-wrap gap-2">
                  {daySlots.map((slot) => (
                    <span
                      key={`${slot.day}-${slot.start}-${slot.end}`}
                      className="rounded bg-primary/10 px-2 py-1 text-sm"
                    >
                      {slot.start} - {slot.end}
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
