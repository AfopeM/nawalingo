import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

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

    // Fetch roles that have been approved for this user
    const roles = await prisma.userRole.findMany({
      where: { user_id: user.id, status: "APPROVED" },
      select: { role: true },
    });

    // Return role strings in lowercase so the client can simply compare e.g. "tutor", "student".
    return NextResponse.json({
      roles: roles.map((r: { role: string }) => r.role.toLowerCase()),
    });
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
