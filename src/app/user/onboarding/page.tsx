"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/common/Button";
import LanguageSelection from "@/components/forms/LanguageSelection";
import AvailabilitySelection from "@/components/forms/AvailabilitySelection";
import TimezoneSelection from "@/components/forms/TimezoneSelection";
import { useAuth } from "@/providers/auth/auth-provider";

interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

type OnboardingStep = "name" | "languages" | "availability" | "timezone";
const onboardingSteps = ["name", "languages", "availability", "timezone"];

interface AuthError {
  message: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("name");
  const [userName, setUserName] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languageDetails, setLanguageDetails] = useState<
    { language: string; proficiency: string }[]
  >([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const { session } = useAuth();

  // Check if user is logged in and onboarding status
  useEffect(() => {
    const checkOnboarding = async () => {
      // If no session, redirect to signin
      if (!session) {
        router.replace("/signin");
        return;
      }

      try {
        // Check onboarding status through API
        const response = await fetch("/api/user/onboarding", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const data = await response.json();

        // If onboarding is completed, redirect to dashboard
        if (data.onboardingCompleted) {
          router.replace("/dashboard");
          return;
        }

        // Otherwise, show onboarding form
        setChecking(false);
      } catch (error) {
        console.error("Error checking onboarding:", error);
        setError("Failed to check onboarding status");
        setChecking(false);
      }
    };

    checkOnboarding();
  }, [router, session]);

  const handleNext = () => {
    setError(null);
    switch (currentStep) {
      case "name":
        if (!userName.trim()) {
          setError("Please enter your full name");
          return;
        }
        setCurrentStep("languages");
        break;
      case "languages":
        if (selectedLanguages.length === 0) {
          setError("Please select at least one language to learn.");
          return;
        }

        // Synchronize languageDetails with the current selections
        const updated = selectedLanguages.map((lang) => {
          const existing = languageDetails.find((d) => d.language === lang);
          return existing ?? { language: lang, proficiency: "" };
        });
        setLanguageDetails(updated);

        if (updated.some((d) => !d.proficiency)) {
          setError("Please set proficiency for each selected language.");
          return;
        }

        setCurrentStep("availability");
        break;
      case "availability":
        if (selectedTimeSlots.length === 0) {
          setError("Please select at least one time slot.");
          return;
        }
        setCurrentStep("timezone");
        break;
      case "timezone":
        handleSubmit();
        break;
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!session) {
        throw new Error("No user found");
      }

      // Submit onboarding data through API
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userName,
          selectedLanguages: languageDetails,
          selectedTimeSlots,
          selectedTimezone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit onboarding");
      }

      // Redirect to dashboard after successful submission
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        setError((error as AuthError).message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking onboarding status...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-8">
      <div className="flex w-full max-w-3xl flex-col items-center justify-center px-12 xl:py-12">
        {/* STEP TRACKER */}
        <div className="item-center mb-1 flex justify-center">
          <div className="text-center text-sm text-gray-500 uppercase lg:text-base">
            questions{" "}
            <span className="pl-2">
              {onboardingSteps.indexOf(currentStep) + 1} /{" "}
              {onboardingSteps.length}
            </span>
          </div>
        </div>

        {/* NAME */}
        {currentStep === "name" && (
          <>
            <h1 className="mb-4 text-center text-2xl font-bold capitalize lg:text-3xl">
              What&apos;s your name?
            </h1>
            <div className="w-3/4">
              <input
                type="text"
                value={userName}
                autoComplete="name"
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your username"
                className="w-full rounded-sm p-4 outline-1 outline-black/10"
              />
            </div>
          </>
        )}

        {/* LANGUAGES */}
        {currentStep === "languages" && (
          <>
            <h1 className="mb-4 text-center text-2xl font-bold capitalize lg:text-3xl">
              What languages do you want to learn?
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
                <h2 className="mt-8 mb-4 text-lg font-semibold capitalize">
                  language proficiency
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

        {/* AVAILABILITY */}
        {currentStep === "availability" && (
          <>
            <h1 className="mb-4 text-center text-2xl font-bold capitalize">
              When are you available for lessons?
            </h1>
            <AvailabilitySelection
              selectedSlots={selectedTimeSlots}
              onChange={setSelectedTimeSlots}
            />
          </>
        )}

        {/* TIMEZONE */}
        {currentStep === "timezone" && (
          <>
            <h1 className="mb-4 text-2xl font-bold capitalize">
              What&apos;s your timezone?
            </h1>
            <TimezoneSelection
              selectedTimezone={selectedTimezone}
              onChange={setSelectedTimezone}
            />
          </>
        )}

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {/* NEXT/BACK BUTTONS */}
        <div className="mt-10 flex w-full justify-center gap-12">
          {currentStep !== "name" && (
            <Button
              variant="outline"
              className="w-1/3 p-6 uppercase"
              onClick={() => {
                setError(null);
                const currentIndex = onboardingSteps.indexOf(currentStep);
                setCurrentStep(
                  onboardingSteps[currentIndex - 1] as OnboardingStep,
                );
              }}
            >
              Back
            </Button>
          )}
          <Button
            disabled={loading}
            onClick={handleNext}
            className={`${currentStep === "name" ? "mx-auto w-3/4" : "w-1/3"} p-6 uppercase`}
          >
            {loading
              ? "Saving..."
              : currentStep === "timezone"
                ? "Complete"
                : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
