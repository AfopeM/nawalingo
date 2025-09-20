"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/common/Button";
import LanguageSelection from "@/components/forms/LanguageSelection";
import AvailabilitySelection from "@/components/forms/AvailabilitySelection";
import TimezoneSelection from "@/components/forms/TimezoneSelection";
import { useAuth } from "@/providers/auth/auth-provider";
import { Separator } from "@/common/Separator";
import { ProficiencyDropdown } from "@/components/forms/ProficiencyDropdown";
import CountrySelection from "@/components/forms/CountrySelection";

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

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("name");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languageDetails, setLanguageDetails] = useState<
    { language: string; proficiency: string }[]
  >([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
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
        router.replace("/auth/signin");
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
          router.replace("/user/dashboard");
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
        if (!firstName.trim() || !lastName.trim()) {
          setError("Please enter your first and last name");
          return;
        }
        if (!/^[A-Za-z0-9_]+$/.test(userName)) {
          setError(
            "Username must be one word (letters, numbers or underscore)",
          );
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
          firstName,
          lastName,
          userName,
          selectedLanguages: languageDetails,
          selectedTimeSlots,
          selectedTimezone,
          country: selectedCountry,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit onboarding");
      }

      // Redirect to dashboard after successful submission
      router.push("/user/dashboard");
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

  const h1ClassName =
    "mb-4 text-center text-3xl font-bold capitalize lg:text-4xl";

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-8 py-10">
      {/* FORM WRAPPER */}
      <div className="flex w-full max-w-xs flex-col items-center justify-center md:max-w-lg lg:max-w-2xl xl:py-12">
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

        {/*FIRST NAME, LAST NAME AND USERNAME */}
        {currentStep === "name" && (
          <>
            <h1 className={h1ClassName}>Tell us about you</h1>
            <div className="flex w-full flex-col gap-4">
              <input
                type="text"
                value={firstName}
                autoComplete="given-name"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full rounded-sm p-4 outline-1 outline-black/10 focus:outline-2 focus:outline-nawalingo-primary"
              />
              <input
                type="text"
                value={lastName}
                autoComplete="family-name"
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full rounded-sm p-4 outline-1 outline-black/10 focus:outline-2 focus:outline-nawalingo-primary"
              />
              <input
                type="text"
                value={userName}
                autoComplete="username"
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Choose a username (one word)"
                className="w-full rounded-sm p-4 outline-1 outline-black/10 focus:outline-2 focus:outline-nawalingo-primary"
              />
            </div>
          </>
        )}

        {/* LANGUAGES */}
        {currentStep === "languages" && (
          <>
            <h1 className={h1ClassName + " mb-8"}>
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
                <Separator className="mt-10 mb-6" />
                <h2 className="mt-12 mb-4 font-bold uppercase">
                  language proficiency
                </h2>
                <div className="flex w-full flex-col gap-4">
                  {languageDetails.map((detail, idx) => (
                    <div
                      key={detail.language}
                      className="flex items-center justify-between gap-8"
                    >
                      <span className="flex-1 font-bold capitalize">
                        {detail.language}
                      </span>
                      <div className="w-2/3 self-end lg:w-1/3">
                        <ProficiencyDropdown
                          value={detail.proficiency}
                          onChange={(val) => {
                            setLanguageDetails((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], proficiency: val };
                              return copy;
                            });
                          }}
                        />
                      </div>
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
            <h1 className={h1ClassName}>When are you available for lessons?</h1>
            <AvailabilitySelection
              selectedSlots={selectedTimeSlots}
              onChange={setSelectedTimeSlots}
            />
          </>
        )}

        {/* TIMEZONE */}
        {currentStep === "timezone" && (
          <>
            <h1 className={h1ClassName}>
              What&apos;s your timezone and country?
            </h1>
            <div className="mb-6 flex w-full flex-col items-center justify-center gap-6">
              <div className="w-full md:w-2/3">
                <TimezoneSelection
                  selectedTimezone={selectedTimezone}
                  onChange={setSelectedTimezone}
                />
              </div>
              <div className="w-full md:w-2/3">
                <CountrySelection
                  selectedCountry={selectedCountry}
                  onChange={setSelectedCountry}
                />
              </div>
            </div>
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
            className={`${currentStep === "name" ? "w-full" : "w-1/3"} p-6 uppercase`}
          >
            {loading
              ? "Saving..."
              : currentStep === "timezone"
                ? "Complete"
                : "Next"}
          </Button>
        </div>
      </div>
    </section>
  );
}
