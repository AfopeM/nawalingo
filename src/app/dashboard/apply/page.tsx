"use client";

import ProtectedRoute from "@/providers/auth/protected-route";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function ApplyToTeachPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-3xl font-bold">Apply to Teach</h1>
        <p className="max-w-md text-center text-muted-foreground">
          Ready to share your knowledge with students around the world? Submit
          your tutor application and we&apos;ll be in touch once it&apos;s
          reviewed.
        </p>
        <Button onClick={() => router.push("/dashboard/apply/form")}>
          Start Application
        </Button>
      </div>
    </ProtectedRoute>
  );
}
