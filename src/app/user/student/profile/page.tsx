"use client";

import { useState } from "react";
import { ProfileForm } from "@/features/user";
import ProtectedRoute from "@/providers/auth/protected-route";
import { useAuth } from "@/providers/auth/auth-provider";
import { Button } from "@/components/atoms";

export default function ProfilePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();

  const fullName = user?.user_metadata?.full_name || user?.email || "User";
  const initials = (
    fullName
      .split(" ")
      .filter(Boolean)
      .map((n: string) => n[0])
      .join("") || "U"
  ).toUpperCase();

  const handleSuccess = () => {
    setShowSuccess(true);
    // Hide the success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <ProtectedRoute>
      <div className="mt-12 w-full px-6 md:px-12">
        {/* Header section */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative h-24 w-24 flex-none">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary">
              {initials}
            </div>
            {/* Small verification tick in bottom-right */}
            <div className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow">
              ✓
            </div>
          </div>

          {/* Name + slug */}
          <div className="flex-1">
            <h1 className="text-3xl leading-tight font-bold text-gray-900">
              {fullName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              nawalingo.com/{user?.id?.slice(0, 8) ?? "me"}
            </p>
          </div>

          {/* View profile button */}
          <div className="ml-auto">
            <Button variant="outline">View profile</Button>
          </div>
        </div>

        {/* Success alert */}
        {showSuccess && (
          <div className="mb-6 rounded bg-green-100 p-4 text-green-700">
            Your changes have been saved successfully!
          </div>
        )}
        <ProfileForm onSuccess={handleSuccess} />
      </div>
    </ProtectedRoute>
  );
}
