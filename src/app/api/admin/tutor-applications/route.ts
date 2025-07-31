import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { hasAdminPermission } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { RoleStatus } from "@prisma/client";

export async function GET(request: Request) {
  const authResult = await getAuthenticatedUser(request);
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }
  const requester = authResult.user;

  const allowed = await hasAdminPermission(
    requester.id,
    "MANAGE_TUTOR_APPLICATIONS",
  );
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const applications = await prisma.userRoleAssignment.findMany({
      where: {
        role: { name: "TUTOR" },
        status: RoleStatus.SUBMITTED,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            tutorProfile: {
              select: {
                intro: true,
                teaching_experience: true,
                country: true,
                tutorLanguages: {
                  where: { is_teaching: true },
                  select: {
                    language: {
                      select: { name: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching tutor applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
