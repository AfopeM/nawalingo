import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  numberToDayName,
  timeStringToMinutes,
  minutesToTimeString,
  dayNameToNumber,
} from "@/lib/time";

// Fetch the current user's profile data
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

    const userRecord = await prisma.user.findUnique({ where: { id: user.id } });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { user_id: user.id },
    });

    const availabilities = await prisma.availability.findMany({
      where: { user_id: user.id, type: "STUDENT_AVAILABILITY" },
    });

    const selectedTimeSlots = availabilities.map((a) => ({
      day: numberToDayName(a.day_of_week),
      start: minutesToTimeString(a.start_minute),
      end: minutesToTimeString(a.end_minute),
    }));

    const responsePayload = {
      fullName: userRecord.username || "",
      selectedTimezone: userRecord.timezone || "",
      selectedLanguages: studentProfile?.target_languages ?? [],
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

// Update the current user's profile data
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
    const { fullName, selectedLanguages, selectedTimeSlots, selectedTimezone } =
      body;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          username: fullName,
          timezone: selectedTimezone,
        },
      });

      await tx.studentProfile.upsert({
        where: { user_id: user.id },
        create: {
          user_id: user.id,
          target_languages: selectedLanguages,
          onboarding_completed: true,
        },
        update: {
          target_languages: selectedLanguages,
        },
      });

      // Replace existing availability entries for the student
      await tx.availability.deleteMany({
        where: { user_id: user.id, type: "STUDENT_AVAILABILITY" },
      });

      const availabilityData = (
        selectedTimeSlots as {
          day: string;
          start: string;
          end: string;
        }[]
      ).map((slot) => ({
        user_id: user.id,
        type: "STUDENT_AVAILABILITY" as const,
        day_of_week: dayNameToNumber(slot.day),
        start_minute: timeStringToMinutes(slot.start),
        end_minute: timeStringToMinutes(slot.end),
        timezone: selectedTimezone,
      }));

      if (availabilityData.length > 0) {
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
