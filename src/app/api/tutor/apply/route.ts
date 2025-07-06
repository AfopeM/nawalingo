import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Role, RoleStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
          status: RoleStatus.PENDING,
        },
        update: {
          status: RoleStatus.PENDING,
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
