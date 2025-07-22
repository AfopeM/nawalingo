"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth/auth-provider";
import { getUserRoles } from "@/lib/roles";

export default function ProtectedRoute({
  children,
  requiredRoles,
}: {
  children: React.ReactNode;
  requiredRoles?: string[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [roleCheck, setRoleCheck] = useState<"checking" | "ok" | "forbidden">(
    "checking",
  );

  useEffect(() => {
    // Check 1: Are you even logged in?
    if (!loading && !user) {
      router.replace("/auth/signin"); // No, send them to the sign-in page!
      return; // Stop here, no more checks needed.
    }

    // Check 2: If logged in, do you need specific roles?
    if (!loading && user && requiredRoles && requiredRoles.length > 0) {
      // Yes, specific roles are needed. Let's ask about the user's roles.
      getUserRoles().then((roles) => {
        // Do any of the user's roles match any of the required roles?
        if (roles.some((r) => requiredRoles.includes(r))) {
          setRoleCheck("ok"); // Yes, you have a matching VIP pass!
        } else {
          setRoleCheck("forbidden"); // No, you don't have the right VIP pass.
        }
      });
    }
    // Check 3: If logged in, but no specific roles are required for THIS area.
    else if (!loading && user) {
      setRoleCheck("ok"); // You're logged in, and that's all that's needed here.
    }
  }, [user, loading, router, requiredRoles]);

  if (loading || !user || roleCheck === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  if (roleCheck === "forbidden") {
    // Optionally redirect or show error
    router.replace("/user/dashboard");
    return null;
  }
  return <>{children}</>;
}
