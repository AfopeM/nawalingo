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

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        studentPreferences: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const preferences = userProfile.studentPreferences;
    // Build response payload
    const responsePayload = {
      fullName: userProfile.full_name || "",
      selectedTimezone: userProfile.timezone || "",
      selectedLanguages: preferences?.target_languages ?? [],
      selectedTimeSlots:
        (preferences?.preferred_availability as unknown as { slots: unknown })
          ?.slots ?? [],
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
    const {
      fullName,
      selectedLanguages,
      availabilityJson, // expected structure like { slots: [...] }
      selectedTimezone,
    } = body;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          full_name: fullName,
          timezone: selectedTimezone,
        },
      });

      await tx.studentPreferences.upsert({
        where: { user_id: user.id },
        create: {
          user_id: user.id,
          target_languages: selectedLanguages,
          preferred_availability: availabilityJson,
          timezone: selectedTimezone,
          onboarding_completed: true,
        },
        update: {
          target_languages: selectedLanguages,
          preferred_availability: availabilityJson,
          timezone: selectedTimezone,
        },
      });
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
