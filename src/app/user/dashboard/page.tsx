"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRoles } from "@/lib/roles";
import { Button } from "@/common/Button";
import { useAuth } from "@/providers/auth/auth-provider";

interface OnboardingData {
  onboardingCompleted: boolean;
  error?: string;
}

export default function DashboardPage() {
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null,
  );
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    const checkOnboardingAndFetchRoles = async () => {
      setLoading(true);

      if (!session) {
        router.replace("/auth/signin");
        return;
      }

      try {
        // Check if onboarding is completed via API
        const onboardingRes = await fetch("/api/user/onboarding", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!onboardingRes.ok) {
          const errorData = await onboardingRes.json();
          console.error("Error checking onboarding status:", errorData.error);
          setOnboardingData({
            onboardingCompleted: false,
            error: errorData.error,
          });
          setLoading(false);
          return;
        }

        const onboardingData = await onboardingRes.json();
        setOnboardingData(onboardingData);

        if (!onboardingData.onboardingCompleted) {
          setLoading(false);
          return;
        }

        // Fetch roles if onboarding is completed via backend API
        const userRoles = await getUserRoles();
        setRoles(userRoles);

        const stored =
          typeof window !== "undefined"
            ? localStorage.getItem("activeRole")
            : null;

        if (stored && userRoles.includes(stored)) {
          setActiveRole(stored);
        } else if (userRoles.length > 0) {
          setActiveRole(userRoles[0]);
          if (typeof window !== "undefined")
            localStorage.setItem("activeRole", userRoles[0]);
        }
      } catch (error) {
        console.error("Error:", error);
        setOnboardingData({
          onboardingCompleted: false,
          error: "An unexpected error occurred",
        });
      }

      setLoading(false);
    };

    checkOnboardingAndFetchRoles();
  }, [router, session]);

  const handleSwitch = (role: string) => {
    setActiveRole(role);
    if (typeof window !== "undefined") localStorage.setItem("activeRole", role);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  // Show blurred state if onboarding is not completed
  if (!onboardingData?.onboardingCompleted) {
    return (
      <div className="mx-auto mt-16 max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Welcome to Dashboard</h1>
        <div className="relative">
          {/* Blurred content */}
          <div className="pointer-events-none blur-sm">
            <div className="rounded border bg-white p-8 shadow">
              <div className="h-48 animate-pulse rounded bg-gray-200"></div>
              <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
              <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
          {/* Overlay message */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80">
            <p className="mb-4 text-lg text-gray-700">
              Please complete your onboarding to access the dashboard
            </p>
            <Button
              onClick={() => router.push("/onboarding")}
              className="rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Complete Onboarding
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded border bg-white p-8 shadow">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      {roles.length > 1 && (
        <div className="mb-6">
          <label className="mb-2 block font-semibold">Switch Role:</label>
          <div className="flex gap-2">
            {roles.map((role) => (
              <button
                key={role}
                className={`rounded border px-4 py-2 ${
                  activeRole === role ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
                onClick={() => handleSwitch(role)}
                disabled={activeRole === role}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="mb-2">
        Active Role:{" "}
        <span className="font-semibold">
          {activeRole
            ? activeRole.charAt(0).toUpperCase() + activeRole.slice(1)
            : "None"}
        </span>
      </p>
      <p>Welcome to your dashboard! More features coming soon.</p>
    </div>
  );
}
