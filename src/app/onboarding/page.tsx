"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import LanguageSelection from "@/components/onboarding/LanguageSelection";
import AvailabilitySelection from "@/components/onboarding/AvailabilitySelection";
import TimezoneSelection from "@/components/onboarding/TimezoneSelection";
import { useAuth } from "@/providers/auth/auth-provider";

interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

type OnboardingStep = "name" | "languages" | "availability" | "timezone";

interface AuthError {
  message: string;
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("name");
  const [fullName, setFullName] = useState("");
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
        if (!fullName.trim()) {
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
          fullName,
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
    <div className="mx-auto mt-16 max-w-md rounded border bg-white p-8 shadow">
      <div className="mb-8">
        <div className="flex justify-between">
          {["name", "languages", "availability", "timezone"].map(
            (step, index) => (
              <div
                key={step}
                className={`h-2 w-full ${index > 0 ? "ml-2" : ""} rounded ${
                  getStepIndex(currentStep) >= index
                    ? "bg-primary"
                    : "bg-gray-200"
                }`}
              />
            ),
          )}
        </div>
      </div>

      {currentStep === "name" && (
        <>
          <h1 className="mb-4 text-2xl font-bold">What&apos;s your name?</h1>
          <div className="space-y-4">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded border px-3 py-2"
              autoComplete="name"
            />
          </div>
        </>
      )}

      {currentStep === "languages" && (
        <>
          <h1 className="mb-4 text-2xl font-bold">
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
              <h2 className="mt-6 mb-2 text-lg font-semibold">
                Set proficiency
              </h2>
              <div className="space-y-4">
                {languageDetails.map((detail, idx) => (
                  <div
                    key={detail.language}
                    className="flex items-center gap-4"
                  >
                    <span className="flex-1 capitalize">{detail.language}</span>
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

      {currentStep === "availability" && (
        <>
          <h1 className="mb-4 text-2xl font-bold">
            When are you available for lessons?
          </h1>
          <AvailabilitySelection
            selectedSlots={selectedTimeSlots}
            onChange={setSelectedTimeSlots}
          />
        </>
      )}

      {currentStep === "timezone" && (
        <>
          <h1 className="mb-4 text-2xl font-bold">
            What&apos;s your timezone?
          </h1>
          <TimezoneSelection
            selectedTimezone={selectedTimezone}
            onChange={setSelectedTimezone}
          />
        </>
      )}

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-8 flex justify-between">
        {currentStep !== "name" && (
          <Button
            variant="outline"
            onClick={() => {
              setError(null);
              const steps: OnboardingStep[] = [
                "name",
                "languages",
                "availability",
                "timezone",
              ];
              const currentIndex = steps.indexOf(currentStep);
              setCurrentStep(steps[currentIndex - 1]);
            }}
          >
            Back
          </Button>
        )}
        <Button
          className={currentStep === "name" ? "w-full" : ""}
          onClick={handleNext}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : currentStep === "timezone"
              ? "Complete"
              : "Continue"}
        </Button>
      </div>
    </div>
  );
}

function getStepIndex(step: OnboardingStep): number {
  const steps: OnboardingStep[] = [
    "name",
    "languages",
    "availability",
    "timezone",
  ];
  return steps.indexOf(step);
}
