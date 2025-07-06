"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/providers/auth/protected-route";
import { Button } from "@/components/ui/Button";
import LanguageSelection from "@/components/onboarding/LanguageSelection";
import { useAuth } from "@/providers/auth/auth-provider";
import { countries as COUNTRIES_MAP } from "countries-list";

// Steps in the tutor application flow
type ApplicationStep = "intro" | "languages" | "experience" | "country";

const COUNTRIES = Object.values(COUNTRIES_MAP)
  .map((c) => c.name)
  .sort();

export default function TutorApplicationForm() {
  const [currentStep, setCurrentStep] = useState<ApplicationStep>("intro");
  const [intro, setIntro] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languageDetails, setLanguageDetails] = useState<
    { language: string; proficiency: string }[]
  >([]);
  const [teachingExperience, setTeachingExperience] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { session } = useAuth();
  const router = useRouter();

  const handleNext = () => {
    setError(null);

    switch (currentStep) {
      case "intro":
        if (!intro.trim()) {
          setError("Please provide a short introduction.");
          return;
        }
        setCurrentStep("languages");
        break;
      case "languages":
        if (selectedLanguages.length === 0) {
          setError("Select at least one language you teach.");
          return;
        }
        // Ensure languageDetails stays in sync with selections
        const updated = selectedLanguages.map((lang) => {
          const existing = languageDetails.find((d) => d.language === lang);
          return existing ?? { language: lang, proficiency: "" };
        });
        setLanguageDetails(updated);

        if (updated.some((d) => !d.proficiency)) {
          setError("Please set proficiency for each selected language.");
          return;
        }
        setCurrentStep("experience");
        break;
      case "experience":
        if (!teachingExperience.trim()) {
          setError("Describe your teaching experience.");
          return;
        }
        setCurrentStep("country");
        break;
      case "country":
        handleSubmit();
        break;
    }
  };

  const handleSubmit = async () => {
    if (!session) {
      setError("You must be signed in to apply.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tutor/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          intro,
          languagesTaught: languageDetails,
          teachingExperience,
          country,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit application");
      }

      // Redirect user to tutor dashboard once application is submitted
      router.push("/dashboard/profile");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const steps: ApplicationStep[] = [
    "intro",
    "languages",
    "experience",
    "country",
  ];

  return (
    <ProtectedRoute>
      <div className="mx-auto mt-16 max-w-md rounded border bg-white p-8 shadow">
        {/* Progress bar */}
        <div className="mb-8 flex justify-between">
          {steps.map((step, idx) => (
            <div
              key={step}
              className={`h-2 w-full ${idx > 0 ? "ml-2" : ""} rounded ${
                steps.indexOf(currentStep) >= idx ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        {currentStep === "intro" && (
          <>
            <h1 className="mb-4 text-2xl font-bold">Introduce yourself</h1>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={5}
              placeholder="Write a short introduction about yourself"
              className="w-full rounded border px-3 py-2"
            />
          </>
        )}

        {currentStep === "languages" && (
          <>
            <h1 className="mb-4 text-2xl font-bold">Languages you teach</h1>
            <LanguageSelection
              selectedLanguages={selectedLanguages}
              onChange={(langs) => {
                setSelectedLanguages(langs);
                setLanguageDetails((prev) =>
                  langs.map(
                    (l) =>
                      prev.find((d) => d.language === l) ?? {
                        language: l,
                        proficiency: "",
                      },
                  ),
                );
              }}
            />

            {selectedLanguages.length > 0 && (
              <>
                <h2 className="mt-6 mb-2 text-lg font-semibold">
                  Set proficiency
                </h2>
                <div className="space-y-4">
                  {languageDetails.map((detail, idx) => (
                    <div
                      key={detail.language}
                      className="flex items-center gap-4"
                    >
                      <span className="flex-1 capitalize">
                        {detail.language}
                      </span>
                      <select
                        value={detail.proficiency}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLanguageDetails((prev) => {
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], proficiency: val };
                            return copy;
                          });
                        }}
                        className="flex-1 rounded border px-3 py-2"
                      >
                        <option value="" disabled>
                          Select proficiency
                        </option>
                        <option value="native">Native</option>
                        <option value="fluent">Fluent</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="beginner">Beginner</option>
                      </select>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {currentStep === "experience" && (
          <>
            <h1 className="mb-4 text-2xl font-bold">Teaching experience</h1>
            <textarea
              value={teachingExperience}
              onChange={(e) => setTeachingExperience(e.target.value)}
              rows={6}
              placeholder="Describe your teaching experience"
              className="w-full rounded border px-3 py-2"
            />
          </>
        )}

        {currentStep === "country" && (
          <>
            <h1 className="mb-4 text-2xl font-bold">Where are you based?</h1>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              <option value="" disabled>
                Select your country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </>
        )}

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {currentStep !== "intro" && (
            <Button
              variant="outline"
              onClick={() => {
                setError(null);
                const currentIdx = steps.indexOf(currentStep);
                setCurrentStep(steps[currentIdx - 1]);
              }}
            >
              Back
            </Button>
          )}
          <Button
            className={currentStep === "intro" ? "w-full" : ""}
            onClick={handleNext}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : currentStep === "country"
                ? "Submit"
                : "Next"}
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
