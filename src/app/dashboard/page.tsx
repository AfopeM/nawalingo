"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true); // Tell the screen we're starting to load.

      // 1. Get the current user's general info from Supabase.
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If no user is logged in, clear roles and stop loading.
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      // 2. If a user is logged in, ask Supabase for their specific "approved" roles.
      const { data, error } = await supabase
        .from("UserRole") // Look in the "UserRole" table
        .select("role") // Only get the "role" column
        .eq("user_id", user.id) // For this specific user's ID
        .eq("status", "approved"); // And only roles that are "approved"

      // 3. Process the roles we got back.
      if (!error && data) {
        // If there were no errors and we got data
        const userRoles = data.map((r: { role: string }) => r.role); // Extract just the role names (e.g., ["student", "tutor"])
        setRoles(userRoles); // Put these roles on our notepad.

        // 4. Decide which role should be "active" right now.
        const stored =
          typeof window !== "undefined"
            ? localStorage.getItem("activeRole") // Check if the user previously saved an active role in their browser's memory.
            : null;

        if (stored && userRoles.includes(stored)) {
          setActiveRole(stored); // If a saved role exists AND it's one of the user's actual roles, use it.
        } else if (userRoles.length > 0) {
          setActiveRole(userRoles[0]); // Otherwise, if the user has any roles, make the very first one active by default.
          if (typeof window !== "undefined")
            localStorage.setItem("activeRole", userRoles[0]); // And save this default active role for next time.
        }
      }
      setLoading(false); // Done loading, update the screen.
    };

    fetchRoles(); // Run this whole process when the page first loads.
  }, []); // The empty square brackets mean "run this only once when the component appears."

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

  return (
    <div className="mx-auto mt-16 max-w-md rounded border bg-white p-8 shadow">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      {roles.length > 1 && ( // Only show the role switch if the user has more than one role
        <div className="mb-6">
          <label className="mb-2 block font-semibold">Switch Role:</label>
          <div className="flex gap-2">
            {roles.map(
              (
                role, // For each role the user has...
              ) => (
                <button
                  key={role}
                  className={`rounded border px-4 py-2 ${activeRole === role ? "bg-blue-600 text-white" : "bg-gray-100"}`} // Make the active role's button look different
                  onClick={() => handleSwitch(role)} // When clicked, call the switch function
                  disabled={activeRole === role} // Disable the button for the role that's already active
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
                  {/* Show role name, like "Student" instead of "student" */}
                </button>
              ),
            )}
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
