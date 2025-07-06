import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Return the list of approved roles for the authenticated user
export async function GET(request: Request) {
  try {
    // Validate bearer token
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Create a Supabase client with the service role to verify the token
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch roles that have been approved for this user
    const roles = await prisma.userRole.findMany({
      where: { user_id: user.id, status: "APPROVED" },
      select: { role: true },
    });

    // Return role strings in lowercase so the client can simply compare e.g. "tutor", "student".
    return NextResponse.json({
      roles: roles.map((r: { role: string }) => r.role.toLowerCase()),
    });
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
