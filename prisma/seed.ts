import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Language data to seed (African languages)
const languages = [
  { code: "am", name: "Amharic", native_name: "አማርኛ" },
  { code: "sw", name: "Swahili", native_name: "Kiswahili" },
  { code: "pcm", name: "Naija-Pidgin", native_name: "Naija" },
  { code: "rw", name: "Kinyarwanda", native_name: "Ikinyarwanda" },
  { code: "ig", name: "Igbo", native_name: "Igbo" },
  { code: "ln", name: "Lingala", native_name: "Lingala" },
  { code: "ha", name: "Hausa", native_name: "Harshen Hausa" },
  { code: "igl", name: "Igala", native_name: "Igala" },
  { code: "yo", name: "Yoruba", native_name: "Yorùbá" },
  { code: "sn", name: "Shona", native_name: "ChiShona" },
];

// Default roles and permissions - Only admin gets permissions
const defaultRoles = [
  {
    name: "ADMIN",
    permissions: [
      "MANAGE_USERS",
      "VIEW_DASHBOARD",
      "MANAGE_ROLES",
      "MANAGE_TUTOR_APPLICATIONS",
      "VIEW_AUDIT_LOGS",
      "SYSTEM_SETTINGS",
    ],
  },
  { name: "TUTOR", permissions: [] },
  { name: "STUDENT", permissions: [] },
];

const defaultPermissions = [
  {
    name: "MANAGE_USERS",
    description: "Approve, reject, suspend or delete users",
  },
  { name: "VIEW_DASHBOARD", description: "Access admin dashboard" },
  { name: "MANAGE_ROLES", description: "Create / edit roles & permissions" },
  {
    name: "MANAGE_TUTOR_APPLICATIONS",
    description: "view/approve/reject tutor applications",
  },
  { name: "VIEW_AUDIT_LOGS", description: "Access system audit logs" },
  { name: "SYSTEM_SETTINGS", description: "Configure system settings" },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // 1. Seed languages
    console.log("📚 Seeding languages...");
    for (const lang of languages) {
      const language = await prisma.language.upsert({
        where: { code: lang.code },
        update: {},
        create: lang,
      });
      console.log(`  ✅ Language: ${language.name} (${language.code})`);
    }

    // 2. Seed permissions
    console.log("\n🔑 Seeding permissions...");
    for (const perm of defaultPermissions) {
      const permission = await prisma.permission.upsert({
        where: { name: perm.name },
        update: {},
        create: perm,
      });
      console.log(`  ✅ Permission: ${permission.name}`);
    }

    // 3. Seed roles and assign permissions
    console.log("\n👥 Seeding roles...");
    for (const roleData of defaultRoles) {
      const role = await prisma.role.upsert({
        where: { name: roleData.name },
        update: {},
        create: { name: roleData.name },
      });
      console.log(`  ✅ Role: ${role.name}`);

      // Assign permissions to role
      if (roleData.permissions.length > 0) {
        console.log(`    📋 Assigning permissions to ${role.name}:`);
        for (const permName of roleData.permissions) {
          const permission = await prisma.permission.findUnique({
            where: { name: permName },
          });

          if (permission) {
            await prisma.rolePermissionAssignment.upsert({
              where: {
                role_id_permission_id: {
                  role_id: role.id,
                  permission_id: permission.id,
                },
              },
              update: {},
              create: {
                role_id: role.id,
                permission_id: permission.id,
              },
            });
            console.log(`      ✅ ${permission.name}`);
          }
        }
      } else {
        console.log(`    📋 No permissions assigned to ${role.name}`);
      }
    }

    console.log("\n🎉 Database seeding completed successfully!");

    // Summary
    console.log("\n📊 Seeding Summary:");
    console.log(`  Languages: ${languages.length}`);
    console.log(`  Permissions: ${defaultPermissions.length}`);
    console.log(`  Roles: ${defaultRoles.length}`);
    console.log(`  Admin permissions: ${defaultRoles[0].permissions.length}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedDatabase().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
