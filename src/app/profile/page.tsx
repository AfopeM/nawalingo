"use client";

import { useState } from "react";
import ProfileForm from "@/components/profile/ProfileForm";
import ProtectedRoute from "@/providers/auth/protected-route";

export default function ProfilePage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    // Hide the success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <ProtectedRoute>
      <div className="mx-auto mt-16 max-w-2xl rounded border bg-white p-8 shadow">
        <h1 className="mb-8 text-3xl font-bold">Profile Settings</h1>
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
