import { useAuth } from "@/providers/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/molecules/DropdownMenu";
import { hasRole } from "@/lib/roles";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function UserInfoMenu() {
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState<string>("");
  const [isTutor, setIsTutor] = useState(false);

  useEffect(() => {
    const fetchName = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();
      setFullName(data?.name ?? "");
    };
    fetchName();
  }, [user]);

  // Determine if the current user already has the tutor role
  useEffect(() => {
    hasRole("tutor").then(setIsTutor);
  }, []);

  if (!user) return null;

  const email = user.email ?? "";

  const initials = (
    fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("") || email.charAt(0)
  ).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent focus:ring-2 focus:ring-sidebar-ring focus:outline-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-white uppercase">
            {initials}
          </div>
          <div className="flex flex-col overflow-hidden text-left">
            <span className="truncate text-xs text-sidebar-foreground/70 lowercase">
              {email.toLowerCase()}
            </span>
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              {fullName || "User"}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/user/dashboard/profile">Profile</Link>
        </DropdownMenuItem>
        {isTutor ? (
          <DropdownMenuItem asChild>
            <Link href="/user/dashboard/tutor/profile">
              Switch to Teacher Profile
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/user/apply">Apply to Teach</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Button className="w-full" onClick={signOut}>
            Log Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
