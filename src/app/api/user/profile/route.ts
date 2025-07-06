import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Prisma } from "@prisma/client";

// Helper to get authenticated user from Bearer token
async function getAuthenticatedUser(request: Request) {
  // Get the authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 } as const;
  }

  const token = authHeader.split(" ")[1];

  // Create Supabase client with service role (server side)
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

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return { error: "Unauthorized", status: 401 } as const;
  }

  return { user } as const;
}

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
      where: { user_id: user.id, type: "STUDENT_PREFERRED" },
    });

    const dayMap = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const formatTime = (mins: number) => {
      const h = Math.floor(mins / 60)
        .toString()
        .padStart(2, "0");
      const m = (mins % 60).toString().padStart(2, "0");
      return `${h}:${m}`;
    };

    const selectedTimeSlots = availabilities.map((a) => ({
      day: dayMap[a.day_of_week],
      start: formatTime(a.start_minute),
      end: formatTime(a.end_minute),
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
