"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/providers/auth/protected-route";
import { useAuth } from "@/providers/auth/auth-provider";
import { Button } from "@/components/atoms/Button";

interface TutorApplication {
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    country: string | null;
    tutorProfile: {
      intro: string | null;
      teaching_experience: string | null;
      tutorLanguages?: {
        language: {
          name: string;
        };
      }[];
    } | null;
  };
}

export default function TutorApplicationsPage() {
  const { session } = useAuth();
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchApplications = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tutor-applications", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load applications");
      }
      const data = (await res.json()) as { applications: TutorApplication[] };
      setApplications(data.applications);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleAction = async (userId: string, action: "approve" | "reject") => {
    if (!session) return;
    try {
      const res = await fetch(
        `/api/admin/tutor-applications/${userId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${action}`);
      }
      // Remove from list on success
      setApplications((prev) => prev.filter((a) => a.user.id !== userId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold">Tutor Applications</h1>
        {loading && <p>Loading applications...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && applications.length === 0 && (
          <p>No pending applications.</p>
        )}
        {!loading && applications.length > 0 && (
          <table className="w-full table-auto border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Applicant</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Country</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <React.Fragment key={app.user.id}>
                  <tr>
                    <td className="border px-4 py-2">
                      {app.user.first_name} {app.user.last_name}
                    </td>
                    <td className="border px-4 py-2">{app.user.email}</td>
                    <td className="border px-4 py-2">{app.user.country}</td>
                    <td className="space-x-2 border px-4 py-2">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setExpandedId((prev) =>
                            prev === app.user.id ? null : app.user.id,
                          )
                        }
                      >
                        {expandedId === app.user.id ? "Hide" : "View"}
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleAction(app.user.id, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAction(app.user.id, "reject")}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>

                  {expandedId === app.user.id && (
                    <tr>
                      <td colSpan={4} className="border bg-gray-50 px-4 py-4">
                        <p>
                          <strong>Intro:</strong>{" "}
                          {app.user.tutorProfile?.intro || "N/A"}
                        </p>
                        <p>
                          <strong>Languages to Teach:</strong>{" "}
                          {app.user.tutorProfile?.tutorLanguages?.length
                            ? app.user.tutorProfile?.tutorLanguages
                                ?.map((tl) => tl.language.name)
                                .join(", ")
                            : "N/A"}
                        </p>
                        <p>
                          <strong>Teaching Experience:</strong>{" "}
                          {app.user.tutorProfile?.teaching_experience || "N/A"}
                        </p>
                        <p>
                          <strong>Country:</strong> {app.user.country || "N/A"}
                        </p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ProtectedRoute>
  );
}
