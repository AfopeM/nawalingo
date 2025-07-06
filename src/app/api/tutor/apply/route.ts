import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role, RoleStatus } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const authResult = await getAuthenticatedUser(request);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }
    const { user } = authResult;

    const body = await request.json();
    const { intro, languagesTaught, teachingExperience, country } = body;

    // Basic validation
    if (
      !intro ||
      !Array.isArray(languagesTaught) ||
      languagesTaught.length === 0 ||
      !teachingExperience ||
      !country
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      // Upsert tutor profile
      await tx.tutorProfile.upsert({
        where: { user_id: user.id },
        create: {
          user_id: user.id,
          intro,
          languages_taught: languagesTaught,
          teaching_experience: teachingExperience,
          country,
        },
        update: {
          intro,
          languages_taught: languagesTaught,
          teaching_experience: teachingExperience,
          country,
        },
      });

      // Ensure the user has a tutor role (pending by default)
      await tx.userRole.upsert({
        where: {
          user_id_role: {
            user_id: user.id,
            role: Role.TUTOR,
          },
        },
        create: {
          user_id: user.id,
          role: Role.TUTOR,
          status: RoleStatus.SUBMITTED,
        },
        update: {
          status: RoleStatus.SUBMITTED,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error submitting tutor application:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
