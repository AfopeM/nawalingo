import { supabase } from "./supabase/client";

export function getActiveRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("activeRole");
}

export function setActiveRole(role: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("activeRole", role);
}

export async function getUserRoles(): Promise<string[]> {
  // First get the current session so we can forward the access token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (!token) return [];

  try {
    const res = await fetch("/api/user/roles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as { roles?: string[] };
    return json.roles ?? [];
  } catch {
    return [];
  }
}

export async function hasRole(role: string): Promise<boolean> {
  const roles = await getUserRoles();
  return roles.includes(role);
}
