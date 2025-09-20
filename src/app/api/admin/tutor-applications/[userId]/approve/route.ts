import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { hasAdminPermission } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { RoleStatus } from "@prisma/client";

export async function POST(
  request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const params = await context.params;
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
    const tutorRole = await prisma.role.findUnique({
      where: { name: "TUTOR" },
    });
    if (!tutorRole) {
      return NextResponse.json(
        { error: "Tutor role not found" },
        { status: 404 },
      );
    }

    await prisma.userRoleAssignment.update({
      where: {
        user_id_role_id: {
          user_id: params.userId,
          role_id: tutorRole.id,
        },
      },
      data: {
        status: RoleStatus.APPROVED,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving tutor application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
