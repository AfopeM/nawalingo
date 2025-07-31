import { NextResponse } from "next/server";
// Note: After Prisma generation, replace this fallback union with the enum from `@prisma/client`.
type AdminPermission =
  | "MANAGE_ADMINS"
  | "MANAGE_TUTOR_APPLICATIONS"
  | "MANAGE_PAYMENTS"
  | "MANAGE_USERS";

const ALL_PERMISSIONS: AdminPermission[] = [
  "MANAGE_ADMINS",
  "MANAGE_TUTOR_APPLICATIONS",
  "MANAGE_PAYMENTS",
  "MANAGE_USERS",
];
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { hasAdminPermission, listAdminPermissions } from "@/lib/permissions";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const authResult = await getAuthenticatedUser(request);
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }
  const requester = authResult.user;

  // Only admins with MANAGE_ADMINS permission (or core) can view others' permissions.
  const allowed = await hasAdminPermission(requester.id, "MANAGE_ADMINS");
  if (!allowed && requester.id !== params.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const permissions = await listAdminPermissions(params.userId);
  return NextResponse.json({ permissions });
}

// Update admin permissions for a user
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const authResult = await getAuthenticatedUser(request);
  if ("error" in authResult) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }
  const requester = authResult.user;

  // Only admins with MANAGE_ADMINS permission (or core) can update
  const allowed = await hasAdminPermission(requester.id, "MANAGE_ADMINS");
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { permissions } = body as { permissions: AdminPermission[] };
  if (!permissions || !Array.isArray(permissions)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Validate that provided values are valid enum members
  const validEnumValues = ALL_PERMISSIONS;
  for (const p of permissions) {
    if (!validEnumValues.includes(p)) {
      return NextResponse.json(
        { error: `Invalid permission: ${p}` },
        { status: 400 },
      );
    }
  }

  // Sync permissions
  await prisma.$transaction(async (tx) => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const adminPermRepo = (tx as any).adminPermissionAssignment;
    // Remove permissions not in the new list
    await adminPermRepo.deleteMany({
      where: {
        user_id: params.userId,
        permission: { notIn: permissions },
      },
    });

    // Add new permissions
    for (const permission of permissions) {
      await adminPermRepo.upsert({
        where: {
          user_id_permission: {
            user_id: params.userId,
            permission,
          },
        },
        create: {
          user_id: params.userId,
          permission,
        },
        update: {},
      });
    }
  });

  return NextResponse.json({ success: true });
}
