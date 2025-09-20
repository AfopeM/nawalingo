"use client";

import { useState } from "react";
import ProfileForm from "@/features/user/ProfileForm";
import ProtectedRoute from "@/providers/auth/protected-route";
import { useAuth } from "@/providers/auth/auth-provider";
import { Button } from "@/components/atoms/Button";

export default function TeacherProfilePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();

  const fullName = user?.user_metadata?.full_name || user?.email || "Tutor";
  const initials = (
    fullName
      .split(" ")
      .filter(Boolean)
      .map((n: string) => n[0])
      .join("") || "T"
  ).toUpperCase();

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <ProtectedRoute requiredRoles={["tutor"]}>
      <div className="mt-12 w-full px-6 md:px-12">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 flex-none">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary">
              {initials}
            </div>
            <div className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow">
              ✓
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl leading-tight font-bold text-gray-900">
              {fullName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              tutor.nawalingo.com/{user?.id?.slice(0, 8) ?? "me"}
            </p>
          </div>
          <div className="ml-auto">
            <Button variant="outline">View teacher profile</Button>
          </div>
        </div>

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
