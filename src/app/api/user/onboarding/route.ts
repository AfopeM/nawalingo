import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Prisma } from "@prisma/client";

// Get onboarding status
export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Create a Supabase client with service role for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Get user from the token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    // Create a Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Get user from the token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { fullName, selectedLanguages, selectedTimeSlots, selectedTimezone } =
      body;

    // Update user profile and preferences in a transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update user profile
      await tx.user.update({
        where: { id: user.id },
        data: {
          username: fullName,
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

      // Replace existing student preferred availability slots
      await tx.availability.deleteMany({
        where: { user_id: user.id, type: "STUDENT_PREFERRED" },
      });

      const dayMap: Record<string, number> = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };

      const toMinutes = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const availabilityData = (
        selectedTimeSlots as {
          day: string;
          start: string;
          end: string;
        }[]
      ).map((slot) => ({
        user_id: user.id,
        type: "STUDENT_PREFERRED" as const,
        day_of_week: dayMap[slot.day],
        start_minute: toMinutes(slot.start),
        end_minute: toMinutes(slot.end),
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
