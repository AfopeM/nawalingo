import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { hasAdminPermission } from "@/lib/permissions";
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

  // Need MANAGE_ADMINS permission
  const allowed = await hasAdminPermission(requester.id, "MANAGE_ADMINS");
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Ensure the ADMIN role exists
    const adminRole = await prisma.role.upsert({
      where: { name: "ADMIN" },
      create: { name: "ADMIN" },
      update: {},
    });

    await prisma.userRoleAssignment.upsert({
      where: {
        user_id_role_id: {
          user_id: params.userId,
          role_id: adminRole.id,
        },
      },
      create: {
        user_id: params.userId,
        role_id: adminRole.id,
        status: RoleStatus.APPROVED,
      },
      update: {
        status: RoleStatus.APPROVED,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
