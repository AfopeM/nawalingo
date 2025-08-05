"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const processRedirect = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth/signin");
        return;
      }

      try {
        const res = await fetch("/api/user/onboarding", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch onboarding status");

        const { onboardingCompleted } = await res.json();

        if (onboardingCompleted) {
          router.replace("/user/student/dashboard");
        } else {
          router.replace("/user/onboarding");
        }
      } catch (error) {
        console.error("Redirect error:", error);
        router.replace("/user/student/dashboard");
      }
    };

    processRedirect();
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
      <p className="text-lg font-medium">Signing you in&hellip;</p>
    </div>
  );
}
