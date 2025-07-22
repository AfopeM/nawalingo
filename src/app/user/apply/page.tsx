"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import ProtectedRoute from "@/providers/auth/protected-route";

export default function ApplyToTeachPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 p-6">
        <h1 className="text-2xl font-bold md:text-4xl">Apply to Teach</h1>
        <p className="max-w-xl text-center text-muted-foreground">
          Ready to share your knowledge with students around the world? Submit
          your tutor application and we&apos;ll be in touch once it&apos;s
          reviewed.
        </p>
        <Button
          className="mt-6 py-6 capitalize"
          onClick={() => router.push("/apply/form")}
        >
          start application
        </Button>
      </div>
    </ProtectedRoute>
  );
}
