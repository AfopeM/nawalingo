import { prisma } from "@/lib/prisma";
import { RoleStatus } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AdminPermission =
  | "MANAGE_ADMINS"
  | "MANAGE_TUTOR_APPLICATIONS"
  | "MANAGE_PAYMENTS"
  | "MANAGE_USERS";

// List of all permissions
const ALL_PERMISSIONS: AdminPermission[] = [
  "MANAGE_ADMINS",
  "MANAGE_TUTOR_APPLICATIONS",
  "MANAGE_PAYMENTS",
  "MANAGE_USERS",
];

/**
 * Checks if the user has a specific admin permission.
 * Having the ADMIN role automatically grants all permissions.
 */
export async function hasAdminPermission(
  userId: string,
  permission: AdminPermission,
): Promise<boolean> {
  // ---------------------------------------------
  // 1. If user has ADMIN role assignment approved, full access
  // ---------------------------------------------
  const adminAssignment = await prisma.userRoleAssignment.findFirst({
    where: {
      user_id: userId,
      role: { name: "ADMIN" },
      status: RoleStatus.APPROVED,
    },
    select: { id: true },
  });
  if (adminAssignment) return true;

  // ---------------------------------------------
  // 2. Otherwise, check explicit permission assignment (RolePermissionAssignment)
  // ---------------------------------------------
  const assignment = await prisma.rolePermissionAssignment.findFirst({
    where: {
      role: {
        userRoles: {
          some: {
            user_id: userId,
            status: RoleStatus.APPROVED,
          },
        },
      },
      permission: {
        name: permission,
      },
    },
    select: { id: true },
  });
  return Boolean(assignment);
}

/**
 * Lists all admin permissions for the user.
 * If user has ADMIN role, returns all permissions.
 */
export async function listAdminPermissions(
  userId: string,
): Promise<AdminPermission[]> {
  const adminAssignment = await prisma.userRoleAssignment.findFirst({
    where: {
      user_id: userId,
      role: { name: "ADMIN" },
      status: RoleStatus.APPROVED,
    },
    select: { id: true },
  });
  if (adminAssignment) {
    return ALL_PERMISSIONS;
  }

  const permissionAssignments = await prisma.rolePermissionAssignment.findMany({
    where: {
      role: {
        userRoles: {
          some: {
            user_id: userId,
            status: RoleStatus.APPROVED,
          },
        },
      },
    },
    include: { permission: true },
  });

  return permissionAssignments.map((a) => a.permission.name as AdminPermission);
}
