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

export const LANGUAGE_PROFICIENCY = [
  "NATIVE",
  "FLUENT",
  "ADVANCED",
  "INTERMEDIATE",
  "BEGINNER",
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

export const NAV_PATHS = {
  languages: "/main/languages",
  "apply to tutor": "/main/apply-to-tutor",
  pricing: "/main/pricing",
} as const;
