"use client";

import Link from "next/link";
import { hasRole } from "@/lib/roles";
import { Button } from "@/components/atoms";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth/auth-provider";

export type Role = "student" | "tutor" | "admin";

interface ProfileMenuItemsProps {
  role: Role;
  /**
   * Optional callback to run after any menu item is clicked (e.g., to close a sidebar).
   */
  onItemClick?: () => void;
}

export default function ProfileMenuItems({
  role,
  onItemClick,
}: ProfileMenuItemsProps) {
  const { signOut } = useAuth();
  const [isTutor, setIsTutor] = useState(false);

  useEffect(() => {
    // Determine if the user already has the tutor role
    hasRole("tutor").then(setIsTutor);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Link href={`/user/${role}/dashboard/profile`} onClick={onItemClick}>
        <Button
          variant="ghost"
          className="w-full py-6 text-start text-lg tracking-widest lg:text-center"
        >
          Profile
        </Button>
      </Link>
      {/* If user is not already a tutor */}
      {!isTutor && (
        <Link href="/user/apply-to-tutor" onClick={onItemClick}>
          <Button
            variant="secondary"
            className="w-full py-6 tracking-widest capitalize"
          >
            apply to tutor
          </Button>
        </Link>
      )}
      <Button
        onClick={() => {
          signOut();
          onItemClick?.();
        }}
        className="w-full py-6 tracking-widest"
      >
        Log Out
      </Button>
    </div>
  );
}
