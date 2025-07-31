import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma, LanguageProficiency, AvailabilityType } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  numberToDayName,
  timeStringToMinutes,
  minutesToTimeString,
  dayNameToNumber,
} from "@/lib/time";

// =============================================================================================
//   USER PROFILE ENDPOINTS (GET current profile / PUT update)
//   - Updated to align with the revised Prisma schema (v2)
// =============================================================================================

// -----------------------------------------------------------
// GET  /api/user/profile
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

    // ------------------------------------------------------
    // 1. Basic user record
    // ------------------------------------------------------
    const userRecord = await prisma.user.findUnique({ where: { id: user.id } });
    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ------------------------------------------------------
    // 2. Student profile + languages
    // ------------------------------------------------------
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { user_id: user.id },
    });

    let selectedLanguages: string[] = [];
    if (studentProfile) {
      const studentLangs = await prisma.studentLanguage.findMany({
        where: { student_id: studentProfile.id },
        include: { language: true },
      });
      selectedLanguages = studentLangs.map((sl) => sl.language.code);
    }

    // ------------------------------------------------------
    // 3. Availability
    // ------------------------------------------------------
    const availabilities = await prisma.availability.findMany({
      where: { user_id: user.id, type: AvailabilityType.STUDENT_AVAILABILITY },
    });

    const selectedTimeSlots = availabilities.map((a) => ({
      day: numberToDayName(a.day_of_week),
      start: minutesToTimeString(a.start_minute),
      end: minutesToTimeString(a.end_minute),
    }));

    const responsePayload = {
      fullName: userRecord.username || "",
      selectedTimezone: userRecord.timezone || "",
      selectedLanguages,
      selectedTimeSlots,
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// -----------------------------------------------------------
// PUT /api/user/profile
// -----------------------------------------------------------
export async function PUT(request: Request) {
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
    const {
      fullName,
      selectedLanguages: languageCodes,
      selectedTimeSlots,
      selectedTimezone,
    } = body as {
      fullName: string;
      selectedLanguages: string[];
      selectedTimeSlots: { day: string; start: string; end: string }[];
      selectedTimezone: string;
    };

    // ------------------------------------------------------
    // Execute updates in a transaction
    // ------------------------------------------------------
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Update basic user fields
      await tx.user.update({
        where: { id: user.id },
        data: {
          username: fullName,
          timezone: selectedTimezone,
        },
      });

      // 2. Ensure student profile exists
      const studentProfile = await tx.studentProfile.upsert({
        where: { user_id: user.id },
        create: {
          user_id: user.id,
          onboarding_completed: true,
        },
        update: {},
      });

      // 3. Sync languages
      if (languageCodes?.length) {
        // Resolve codes to ids
        const languages = await tx.language.findMany({
          where: { code: { in: languageCodes } },
          select: { id: true, code: true },
        });
        const codeToId = new Map<string, string>(
          languages.map((l) => [l.code, l.id]),
        );

        // Remove languages not present anymore
        await tx.studentLanguage.deleteMany({
          where: {
            student_id: studentProfile.id,
            language: {
              code: { notIn: languageCodes },
            },
          },
        });

        // Upsert remaining / new languages (default proficiency BEGINNER)
        await Promise.all(
          languageCodes.map(async (code) => {
            const languageId = codeToId.get(code);
            if (!languageId) return;
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
                proficiency: LanguageProficiency.BEGINNER,
              },
              update: {},
            });
          }),
        );
      } else {
        // If client cleared all languages, remove them
        await tx.studentLanguage.deleteMany({
          where: { student_id: studentProfile.id },
        });
      }

      // 4. Replace availability entries
      await tx.availability.deleteMany({
        where: {
          user_id: user.id,
          type: AvailabilityType.STUDENT_AVAILABILITY,
        },
      });

      const availabilityData = selectedTimeSlots.map((slot) => ({
        user_id: user.id,
        type: AvailabilityType.STUDENT_AVAILABILITY,
        day_of_week: dayNameToNumber(slot.day),
        start_minute: timeStringToMinutes(slot.start),
        end_minute: timeStringToMinutes(slot.end),
        timezone: selectedTimezone,
      }));

      if (availabilityData.length) {
        await tx.availability.createMany({ data: availabilityData });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
