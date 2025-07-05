"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import LanguageSelection from "@/components/onboarding/LanguageSelection";
import AvailabilitySelection from "@/components/onboarding/AvailabilitySelection";
import TimezoneSelection from "@/components/onboarding/TimezoneSelection";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

interface PreferredAvailability {
  slots: TimeSlot[];
}

interface ProfileFormProps {
  onSuccess?: () => void;
}

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export default function ProfileForm({ onSuccess }: ProfileFormProps) {
  const [fullName, setFullName] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user profile and preferences
        const userProfile = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            studentPreferences: true,
          },
        });

        if (userProfile) {
          setFullName(userProfile.full_name || "");
          setSelectedTimezone(userProfile.timezone || "");

          if (userProfile.studentPreferences) {
            setSelectedLanguages(
              userProfile.studentPreferences.target_languages || [],
            );
            setSelectedTimeSlots(
              (
                userProfile.studentPreferences
                  .preferred_availability as unknown as PreferredAvailability
              )?.slots || [],
            );
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Convert TimeSlot array to a proper JSON object
      const availabilityJson = {
        slots: selectedTimeSlots.map((slot) => ({
          day: slot.day,
          start: slot.start,
          end: slot.end,
        })),
      };

      // Update user profile and preferences in a transaction
      await prisma.$transaction(async (tx: TransactionClient) => {
        // Update user profile
        await tx.user.update({
          where: { id: user.id },
          data: {
            full_name: fullName,
            timezone: selectedTimezone,
          },
        });

        // Upsert student preferences
        await tx.studentPreferences.upsert({
          where: { user_id: user.id },
          create: {
            user_id: user.id,
            target_languages: selectedLanguages,
            preferred_availability: availabilityJson,
            timezone: selectedTimezone,
            onboarding_completed: true,
          },
          update: {
            target_languages: selectedLanguages,
            preferred_availability: availabilityJson,
            timezone: selectedTimezone,
          },
        });
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Personal Information</h2>
        <div>
          <label className="mb-2 block text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Languages</h2>
        <LanguageSelection
          selectedLanguages={selectedLanguages}
          onChange={setSelectedLanguages}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Availability</h2>
        <AvailabilitySelection
          selectedSlots={selectedTimeSlots}
          onChange={setSelectedTimeSlots}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Timezone</h2>
        <TimezoneSelection
          selectedTimezone={selectedTimezone}
          onChange={setSelectedTimezone}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
