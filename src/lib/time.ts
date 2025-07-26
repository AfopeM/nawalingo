import { DAYS } from "@/constants";

export type DayName = (typeof DAYS)[number];

// Convert day name (e.g. "Monday") to 0-6 index.
export function dayNameToNumber(day: string): number {
  return DAYS.indexOf(day as DayName);
}

// Convert 0-6 index to day name.
export function numberToDayName(num: number): DayName {
  return DAYS[num] as DayName;
}

// Convert "HH:MM" string to minutes since midnight.
export function timeStringToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Convert minutes since midnight back to "HH:MM".
export function minutesToTimeString(mins: number): string {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

// Convert 24-hour time to 12-hour AM/PM
export const formatTimeForDisplay = (hour24: number) => {
  // Special handling for midnight (00:00 or 24:00)
  if (hour24 === 24 || hour24 === 0) {
    return "12 AM";
  }
  const hour = hour24 % 12; // Get the hour in 1-11 range, 0 for 12
  const displayHour = hour === 0 ? 12 : hour; // Convert 0 to 12 for 12 PM/AM
  const ampm = hour24 < 12 ? "AM" : "PM";
  return `${displayHour} ${ampm}`;
};
