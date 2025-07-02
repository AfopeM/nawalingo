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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("UserRole")
    .select("role")
    .eq("user_id", user.id)
    .eq("status", "approved");
  if (error || !data) return [];
  return data.map((r: { role: string }) => r.role);
}

export async function hasRole(role: string): Promise<boolean> {
  const roles = await getUserRoles();
  return roles.includes(role);
}
