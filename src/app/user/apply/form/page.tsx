"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/common/Button";
import { Separator } from "@/common/Separator";
import { useAuth } from "@/providers/auth/auth-provider";
import ProtectedRoute from "@/providers/auth/protected-route";
import LanguageSelection from "@/components/forms/LanguageSelection";

// Steps in the tutor application flow
type ApplicationStep = "intro" | "languages" | "experience";

export default function TutorApplicationForm() {
  const [currentStep, setCurrentStep] = useState<ApplicationStep>("intro");
  const [intro, setIntro] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languageDetails, setLanguageDetails] = useState<
    { language: string; proficiency: string }[]
  >([]);
  const [teachingExperience, setTeachingExperience] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit application");
      }

      // Redirect user to tutor dashboard once application is submitted
      router.push("/user/dashboard/profile");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const steps: ApplicationStep[] = ["intro", "languages", "experience"];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 py-8">
        <div className="mt-16 w-full max-w-xl px-12 xl:py-12">
          {/* STEP TRACKER */}
          <div className="mb-1 text-center text-sm text-gray-500 uppercase lg:text-base">
            questions
            <span className="pl-2">
              {steps.indexOf(currentStep) + 1} / {steps.length}
            </span>
          </div>

          {/* INTRO */}
          {currentStep === "intro" && (
            <>
              <h1 className="mb-4 text-center text-2xl font-bold capitalize md:text-3xl">
                Introduce yourself
              </h1>
              <textarea
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                rows={5}
                placeholder="Write a short introduction about yourself"
                className="w-full rounded border px-3 py-2"
              />
            </>
          )}

          {/* LANGUAGES */}
          {currentStep === "languages" && (
            <>
              <h1 className="mb-4 text-center text-2xl font-bold capitalize md:text-3xl">
                Languages you can teach
              </h1>
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
                  <Separator className="my-6 w-full bg-black/10" />
                  <h2 className="mb-2 text-lg font-semibold">
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

          {/* EXPERIENCE */}
          {currentStep === "experience" && (
            <>
              <h1 className="mb-4 text-center text-2xl font-bold capitalize md:text-3xl">
                Teaching experience
              </h1>
              <textarea
                value={teachingExperience}
                onChange={(e) => setTeachingExperience(e.target.value)}
                rows={8}
                placeholder="Describe your teaching experience"
                className="w-full rounded border px-3 py-2"
              />
            </>
          )}

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          {/* NEXT/BACK BUTTON */}
          <div className="mt-10 flex w-full justify-center gap-12">
            {currentStep !== "intro" && (
              <Button
                variant="outline"
                className="w-2/5 p-6 uppercase"
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
              className={`${currentStep === "intro" ? "w-full" : "w-2/5"} p-6 uppercase`}
              onClick={handleNext}
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : currentStep === "experience"
                  ? "Submit"
                  : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
