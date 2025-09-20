"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { Separator } from "@/components/atoms/Separator";
import LanguageSelection from "@/features/user/LanguageSelection";
import AvailabilitySelection from "@/features/user/AvailabilitySelection";
import TimezoneSelection from "@/features/user/TimezoneSelection";
import { useAuth } from "@/providers/auth/auth-provider";

interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

interface ProfileFormProps {
  onSuccess?: () => void;
}

export default function ProfileForm({ onSuccess }: ProfileFormProps) {
  const [fullName, setFullName] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { session } = useAuth();

  // Keep originals for cancel functionality
  const [initialState, setInitialState] = useState({
    fullName: "",
    selectedLanguages: [] as string[],
    selectedTimeSlots: [] as TimeSlot[],
    selectedTimezone: "",
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!session) {
        setInitialLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to load profile");
        }

        const data = await response.json();

        setFullName(data.fullName || "");
        setSelectedTimezone(data.selectedTimezone || "");
        setSelectedLanguages(data.selectedLanguages || []);
        setSelectedTimeSlots(data.selectedTimeSlots || []);

        setInitialState({
          fullName: data.fullName || "",
          selectedLanguages: data.selectedLanguages || [],
          selectedTimeSlots: data.selectedTimeSlots || [],
          selectedTimezone: data.selectedTimezone || "",
        });
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
  }, [session]);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!session) {
        throw new Error("No user session found");
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          fullName,
          selectedLanguages,
          selectedTimeSlots,
          selectedTimezone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

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

  const handleCancel = () => {
    // Reset state to initial values
    setFullName(initialState.fullName);
    setSelectedLanguages(initialState.selectedLanguages);
    setSelectedTimeSlots(initialState.selectedTimeSlots);
    setSelectedTimezone(initialState.selectedTimezone);
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

      <Separator className="my-6" />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Languages</h2>
        <LanguageSelection
          selectedLanguages={selectedLanguages}
          onChange={setSelectedLanguages}
        />
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Availability</h2>
        <AvailabilitySelection
          selectedSlots={selectedTimeSlots}
          onChange={setSelectedTimeSlots}
        />
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Timezone</h2>
        <TimezoneSelection
          selectedTimezone={selectedTimezone}
          onChange={setSelectedTimezone}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
