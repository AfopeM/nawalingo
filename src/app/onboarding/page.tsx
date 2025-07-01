"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import RoleSelection, { Role } from "@/components/auth/RoleSelection";

export default function OnboardingPage() {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkRoles = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/signin");
        return;
      }
      const { data: roles, error } = await supabase
        .from("UserRole")
        .select("role")
        .eq("user_id", user.id);
      if (!error && roles && roles.length > 0) {
        router.replace("/dashboard");
        return;
      }
      setChecking(false);
    };
    checkRoles();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking onboarding status...
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (selectedRoles.length === 0) {
      setError("Please select at least one role.");
      return;
    }
    setLoading(true);
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      setError("Could not get user info.");
      setLoading(false);
      return;
    }
    // Save roles to your backend (this is a placeholder, actual logic may vary)
    // Example: call a Supabase function or insert into a roles table
    // Here, we'll assume a 'user_roles' table with user_id and role columns
    try {
      // Remove existing roles (optional, for idempotency)
      await supabase.from("UserRole").delete().eq("user_id", user.id);
      // Insert new roles
      const inserts = selectedRoles.map((role) => ({ user_id: user.id, role }));
      const { error: insertError } = await supabase
        .from("UserRole")
        .insert(inserts);
      if (insertError) throw insertError;
      router.push("/dashboard");
    } catch (err: unknown) {
      let message = "Failed to save roles.";
      if (isErrorWithMessage(err)) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded border bg-white p-8 shadow">
      <h1 className="mb-4 text-2xl font-bold">Welcome! Select your role(s)</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <RoleSelection
          selectedRoles={selectedRoles}
          onChange={setSelectedRoles}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}

function isErrorWithMessage(err: unknown): err is { message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  );
}
