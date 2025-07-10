import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth";
import { dayNameToNumber, timeStringToMinutes } from "@/lib/time";

// Get onboarding status
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

// Submit onboarding data
export async function POST(request: Request) {
  try {
    const authResult2 = await getAuthenticatedUser(request);
    if ("error" in authResult2) {
      return NextResponse.json(
        { error: authResult2.error },
        { status: authResult2.status },
      );
    }
    const { user: user2 } = authResult2;
    const user = user2;

    // Get request body
    const body = await request.json();
    const { userName, selectedLanguages, selectedTimeSlots, selectedTimezone } =
      body;

    // Update user profile and preferences in a transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update user profile
      await tx.user.update({
        where: { id: user.id },
        data: {
          username: userName,
          timezone: selectedTimezone,
        },
      });

      // Upsert student profile
      await tx.studentProfile.upsert({
        where: { user_id: user.id },
        create: {
          user_id: user.id,
          target_languages: selectedLanguages,
          onboarding_completed: true,
        },
        update: {
          target_languages: selectedLanguages,
          onboarding_completed: true,
        },
      });

      // Replace existing student availability slots
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

      // Ensure the user has the STUDENT role marked as APPROVED
      await tx.userRole.upsert({
        where: {
          user_id_role: {
            user_id: user.id,
            role: "STUDENT",
          },
        },
        create: {
          user_id: user.id,
          role: "STUDENT",
          status: "APPROVED",
        },
        update: {
          status: "APPROVED",
        },
      });
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
