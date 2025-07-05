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

    const preferences = await prisma.studentPreferences.findUnique({
      where: { user_id: user.id },
    });

    return NextResponse.json({
      onboardingCompleted: !!preferences?.onboarding_completed,
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
    const { fullName, selectedLanguages, availabilityJson, selectedTimezone } =
      body;

    // Update user profile and preferences in a transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update user profile
      await tx.user.update({
        where: { id: user.id },
        data: {
          full_name: fullName,
          timezone: selectedTimezone,
        },
      });

      // Upsert student preferences
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
          onboarding_completed: true,
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
