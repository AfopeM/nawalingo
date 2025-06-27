import React from "react";

export type Role = "student" | "tutor";

interface RoleSelectionProps {
  selectedRoles: Role[];
  onChange: (roles: Role[]) => void;
}

export default function RoleSelection({
  selectedRoles,
  onChange,
}: RoleSelectionProps) {
  const handleToggle = (role: Role) => {
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter((r) => r !== role));
    } else {
      onChange([...selectedRoles, role]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="mb-1 font-semibold">Select your role(s):</label>
      <div className="flex gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={selectedRoles.includes("student")}
            onChange={() => handleToggle("student")}
          />
          Student
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={selectedRoles.includes("tutor")}
            onChange={() => handleToggle("tutor")}
          />
          Tutor
        </label>
      </div>
    </div>
  );
}
