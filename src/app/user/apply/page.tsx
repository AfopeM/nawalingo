"use client";

import Link from "next/link";
import { Button } from "@/common/Button";
import ProtectedRoute from "@/providers/auth/protected-route";

export default function ApplyToTeachPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 p-6">
        <h1 className="text-4xl font-bold capitalize">Apply to Teach</h1>
        <p className="max-w-xl px-8 text-center text-muted-foreground">
          Ready to share your knowledge with students around the world? Submit
          your tutor application and we&apos;ll be in touch once it&apos;s
          reviewed.
        </p>
        <Link href="/user/apply/form">
          <Button className="mt-6 py-6 capitalize">start application</Button>
        </Link>
      </div>
    </ProtectedRoute>
  );
}
