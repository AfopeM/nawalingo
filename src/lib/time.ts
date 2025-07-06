export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type DayName = (typeof DAY_NAMES)[number];

// Convert day name (e.g. "Monday") to 0-6 index.
export function dayNameToNumber(day: string): number {
  return DAY_NAMES.indexOf(day as DayName);
}

// Convert 0-6 index to day name.
export function numberToDayName(num: number): DayName {
  return DAY_NAMES[num] as DayName;
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
