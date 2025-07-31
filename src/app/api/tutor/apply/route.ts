import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { RoleStatus, LanguageProficiency } from "@prisma/client";
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
    const { intro, languagesTaught, teachingExperience } = body as {
      intro: string;
      languagesTaught: Array<{ language: string; proficiency: string }>;
      teachingExperience: string;
    };

    // Basic validation
    if (
      !intro ||
      !Array.isArray(languagesTaught) ||
      languagesTaught.length === 0 ||
      !teachingExperience
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      // ----------------------------------------------------------
      // 1. Upsert tutor profile (no more languages_taught column)
      // ----------------------------------------------------------
      const tutorProfile = await tx.tutorProfile.upsert({
        where: { user_id: user.id },
        create: {
          user_id: user.id,
          intro,
          teaching_experience: teachingExperience,
        },
        update: {
          intro,
          teaching_experience: teachingExperience,
        },
      });

      // ----------------------------------------------------------
      // 2. Upsert tutor languages (join table)
      // ----------------------------------------------------------
      const languageKeys = languagesTaught.map((l) => l.language);
      const languages = await tx.language.findMany({
        where: {
          OR: [{ code: { in: languageKeys } }, { name: { in: languageKeys } }],
        },
        select: { id: true, code: true, name: true },
      });
      const codeToId = new Map<string, string>();
      languages.forEach((l) => {
        codeToId.set(l.code, l.id);
        codeToId.set(l.name, l.id);
      });

      await Promise.all(
        languagesTaught.map(async (detail) => {
          const languageId = codeToId.get(detail.language);
          if (!languageId) return;
          const proficiency =
            detail.proficiency.toUpperCase() as keyof typeof LanguageProficiency;
          await tx.tutorLanguage.upsert({
            where: {
              tutor_id_language_id: {
                tutor_id: tutorProfile.id,
                language_id: languageId,
              },
            },
            create: {
              tutor_id: tutorProfile.id,
              language_id: languageId,
              proficiency: proficiency as LanguageProficiency,
              is_teaching: true,
            },
            update: {
              proficiency: proficiency as LanguageProficiency,
              is_teaching: true,
            },
          });
        }),
      );

      // ----------------------------------------------------------
      // 3. Ensure user has TUTOR role assignment (submitted/pending)
      // ----------------------------------------------------------
      const tutorRole = await tx.role.upsert({
        where: { name: "TUTOR" },
        create: { name: "TUTOR" },
        update: {},
      });

      await tx.userRoleAssignment.upsert({
        where: {
          user_id_role_id: {
            user_id: user.id,
            role_id: tutorRole.id,
          },
        },
        create: {
          user_id: user.id,
          role_id: tutorRole.id,
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
