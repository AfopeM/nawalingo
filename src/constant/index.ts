export const AVAILABLE_LANGUAGES = [
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
] as const;

export const LANGUAGE_DIFFICULTY = [
  "native",
  "fluent",
  "intermediate",
  "beginner",
] as const;

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export enum AuthMode {
  Signup = "signup",
  Signin = "signin",
}
