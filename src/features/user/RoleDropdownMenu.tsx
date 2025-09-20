"use client";

import { FaSortDown } from "react-icons/fa6";
import { Button } from "@/components/atoms/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/molecules/DropdownMenu";
import { useActiveRole } from "@/hooks/useActiveRole";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function RoleDropdownMenu() {
  const router = useRouter();
  const [activeRole, roles, switchRole] = useActiveRole();

  const handleRoleChange = useCallback(
    (role: string) => {
      if (!role || role === activeRole) return;
      switchRole(role);
      // Navigate to the appropriate dashboard based on the selected role
      router.push(`/user/${role}/dashboard`);
    },
    [activeRole, router, switchRole],
  );

  return (
    <div className="w-36">
      {roles.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex w-full justify-between bg-transparent py-4 capitalize"
            >
              {activeRole
                ? activeRole.charAt(0) + activeRole.slice(1).toLowerCase()
                : "Select proficiency"}
              <FaSortDown className="mb-1.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuRadioGroup
              value={activeRole || ""}
              onValueChange={handleRoleChange}
            >
              {roles.map((role) => (
                <DropdownMenuRadioItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
