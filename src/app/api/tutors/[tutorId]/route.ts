import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { AvailabilityType } from "@prisma/client";

export async function GET(
  _req: Request,
  { params }: { params: { tutorId: string } },
) {
  try {
    const tutorId = params.tutorId;
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { user_id: tutorId },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_image_url: true,
            country: true,
            availability: {
              where: {
                is_active: true,
                type: AvailabilityType.TUTOR_AVAILABILITY,
              },
              select: {
                day_of_week: true,
                start_minute: true,
                end_minute: true,
                timezone: true,
              },
            },
          },
        },
        tutorLanguages: {
          where: { is_teaching: true },
          select: {
            proficiency: true,
            language: { select: { id: true, code: true, name: true } },
          },
        },
      },
    });

    if (!tutorProfile) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    // Average rating
    const ratingAgg = await prisma.tutorRating.aggregate({
      where: { tutor_id: tutorId },
      _avg: { overall_rating: true },
      _count: { overall_rating: true },
    });

    // Next available slot
    let nextAvailable: string | null = null;
    if (tutorProfile.user.availability.length) {
      const now = DateTime.utc();
      const next = tutorProfile.user.availability
        .map((a) => {
          const today = now.set({ weekday: a.day_of_week + 1 });
          const start = today.startOf("day").plus({ minutes: a.start_minute });
          if (start < now) return start.plus({ weeks: 1 });
          return start;
        })
        .sort((a, b) => a.toMillis() - b.toMillis())[0];
      nextAvailable = next?.toISO() ?? null;
    }

    return NextResponse.json({
      id: tutorProfile.user.id,
      firstName: tutorProfile.user.first_name,
      lastName: tutorProfile.user.last_name,
      profileImageUrl: tutorProfile.user.profile_image_url,
      country: tutorProfile.user.country,
      intro: tutorProfile.intro,
      teachingExperience: tutorProfile.teaching_experience,
      languages: tutorProfile.tutorLanguages.map((tl) => ({
        proficiency: tl.proficiency,
        ...tl.language,
      })),
      rating: ratingAgg._avg.overall_rating ?? null,
      ratingCount: ratingAgg._count.overall_rating,
      nextAvailableSlot: nextAvailable,
      availability: tutorProfile.user.availability,
    });
  } catch (err) {
    console.error("Error fetching tutor detail", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}



