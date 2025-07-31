import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { RoleStatus } from "@prisma/client";

// Return the list of approved roles for the authenticated user
export async function GET(request: Request) {
  try {
    const authResult = await getAuthenticatedUser(request);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }
    const { user } = authResult;

    // Fetch roles that have been approved for this user via UserRoleAssignment
    const assignments = await prisma.userRoleAssignment.findMany({
      where: { user_id: user.id, status: RoleStatus.APPROVED },
      include: { role: true },
    });

    // Return role strings in lowercase so the client can simply compare e.g. "tutor", "student".
    return NextResponse.json({
      roles: assignments.map((a) => a.role.name.toLowerCase()),
    });
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
