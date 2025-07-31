import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  Prisma,
  LanguageProficiency,
  RoleStatus,
  AvailabilityType,
} from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth";
import { dayNameToNumber, timeStringToMinutes } from "@/lib/time";

// =============================================================================================
//   STUDENT ONBOARDING ENDPOINTS (GET progress / POST submission)
//   - Updated to work with the new Prisma schema (v2)
// =============================================================================================

// -----------------------------------------------------------
// GET  /api/user/onboarding
// -----------------------------------------------------------
// Returns: { onboardingCompleted: boolean }
// -----------------------------------------------------------
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

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { user_id: user.id },
    });

    return NextResponse.json({
      onboardingCompleted: !!studentProfile?.onboarding_completed,
    });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// -----------------------------------------------------------
// POST /api/user/onboarding
// -----------------------------------------------------------
// Body shape:
// {
//   userName: string,
//   selectedLanguages: Array<{ language: string; proficiency: string }>,
//   selectedTimeSlots: Array<{ day: string; start: string; end: string }>,
//   selectedTimezone: string
// }
// -----------------------------------------------------------
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

    // Request body
    const body = await request.json();
    const {
      firstName,
      lastName,
      userName,
      selectedLanguages: languageDetails,
      selectedTimeSlots,
      selectedTimezone,
      country,
    } = body as {
      firstName: string;
      lastName: string;
      userName: string;
      selectedLanguages: { language: string; proficiency: string }[];
      selectedTimeSlots: { day: string; start: string; end: string }[];
      selectedTimezone: string;
      country: string;
    };

    //------------------------------------------------------------------
    //  Execute onboarding in a DB transaction
    //------------------------------------------------------------------
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      //----------------------------------------------------------------
      // 1. Update basic user fields (username + timezone)
      //----------------------------------------------------------------
      await tx.user.update({
        where: { id: user.id },
        data: {
          username: userName,
          first_name: firstName,
          last_name: lastName,
          country,
          timezone: selectedTimezone,
        },
      });

      //----------------------------------------------------------------
      // 2. Upsert (create if not exists) student profile
      //----------------------------------------------------------------
      const studentProfile = await tx.studentProfile.upsert({
        where: { user_id: user.id },
        create: {
          user_id: user.id,
          onboarding_completed: true,
        },
        update: {
          onboarding_completed: true,
        },
      });

      //----------------------------------------------------------------
      // 3. Handle StudentLanguage join records (many-to-many)
      //----------------------------------------------------------------
      if (languageDetails?.length) {
        // Resolve language codes -> ids
        const languageKeys = languageDetails.map((l) => l.language);
        const languages = await tx.language.findMany({
          where: {
            OR: [
              { code: { in: languageKeys } },
              { name: { in: languageKeys } },
            ],
          },
          select: { id: true, code: true, name: true },
        });
        const codeToId = new Map<string, string>();
        languages.forEach((l) => {
          codeToId.set(l.code, l.id);
          codeToId.set(l.name, l.id);
        });

        // Upsert each language with proficiency
        await Promise.all(
          languageDetails.map(async (detail) => {
            const languageId = codeToId.get(detail.language);
            if (!languageId) return; // Skip if language unknown

            const proficiency =
              detail.proficiency.toUpperCase() as keyof typeof LanguageProficiency;

            await tx.studentLanguage.upsert({
              where: {
                student_id_language_id: {
                  student_id: studentProfile.id,
                  language_id: languageId,
                },
              },
              create: {
                student_id: studentProfile.id,
                language_id: languageId,
                proficiency: proficiency as LanguageProficiency,
              },
              update: {
                proficiency: proficiency as LanguageProficiency,
              },
            });
          }),
        );
      }

      //----------------------------------------------------------------
      // 4. Replace availability slots (schema unchanged)
      //----------------------------------------------------------------
      // Remove existing student availability
      await tx.availability.deleteMany({
        where: {
          user_id: user.id,
          type: AvailabilityType.STUDENT_AVAILABILITY,
        },
      });

      const availabilityData = selectedTimeSlots.map((slot) => ({
        user_id: user.id,
        type: AvailabilityType.STUDENT_AVAILABILITY, // AvailabilityType enum
        day_of_week: dayNameToNumber(slot.day),
        start_minute: timeStringToMinutes(slot.start),
        end_minute: timeStringToMinutes(slot.end),
        timezone: selectedTimezone,
      }));

      if (availabilityData.length) {
        await tx.availability.createMany({ data: availabilityData });
      }

      //----------------------------------------------------------------
      // 5. Ensure the user has the STUDENT role marked as APPROVED
      //----------------------------------------------------------------
      const studentRole = await tx.role.findUnique({
        where: { name: "STUDENT" },
      });
      if (studentRole) {
        await tx.userRoleAssignment.upsert({
          where: {
            user_id_role_id: {
              user_id: user.id,
              role_id: studentRole.id,
            },
          },
          create: {
            user_id: user.id,
            role_id: studentRole.id,
            status: RoleStatus.APPROVED,
          },
          update: {
            status: RoleStatus.APPROVED,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting onboarding:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
