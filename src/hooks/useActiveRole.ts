// hooks/useActiveRole.ts
import { useState, useEffect } from "react";
import { getUserRoles } from "@/lib/roles";
import { useAuth } from "@/providers/auth/auth-provider";

export function useActiveRole(): [
  string | null,
  string[],
  (role: string) => void,
] {
  const { session } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
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
      }
    };
    fetchRoles();
  }, [session]);

  const switchRole = (role: string) => {
    setActiveRole(role);
    if (typeof window !== "undefined") localStorage.setItem("activeRole", role);
  };

  return [activeRole, roles, switchRole];
}
