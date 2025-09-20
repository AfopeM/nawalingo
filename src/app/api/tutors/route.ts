import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { AvailabilityType, LanguageProficiency, Prisma } from "@prisma/client";

/**
 * /api/tutors
 * Supported query parameters:
 *  - page (default 1)
 *  - pageSize (default 10)
 *  - languages: comma-separated ISO codes or language IDs
 *  - minRating / maxRating: 1-5
 *  - native: "true" | "false" (native speaker)
 *  - country: ISO country code (matches User.country)
 *  - dayOfWeek: 0-6 (Sunday-Saturday)
 *  - startMinute / endMinute: minutes since midnight (filter availability range)
 */
export async function GET(request: Request) {
  try {
    const { searchParams: params } = new URL(request.url);

    const page = parseInt(params.get("page") ?? "1", 10) || 1;
    const pageSize = Math.min(
      parseInt(params.get("pageSize") ?? "10", 10) || 10,
      50,
    ); // max 50 per page

    // -------------------------------
    // Build dynamic Prisma filters
    // -------------------------------
    const whereTutorProfile: Prisma.TutorProfileWhereInput = {
      is_active: true,
      user: {
        is_active: true,
      },
    };

    // Country / location filter
    const country = params.get("country");
    if (country) {
      whereTutorProfile.user.country = country;
    }

    // Languages filter (teacher must teach at least one of the requested languages)
    const languagesRaw = params.get("languages");
    if (languagesRaw) {
      const languagesList = languagesRaw
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);

      if (languagesList.length) {
        whereTutorProfile.tutorLanguages = {
          some: {
            language: {
              OR: [
                { code: { in: languagesList } },
                { id: { in: languagesList } },
                { name: { in: languagesList } },
              ],
            },
            is_teaching: true,
          },
        };
      }
    }

    // Native speaker filter
    const native = params.get("native");
    if (native === "true") {
      whereTutorProfile.tutorLanguages = {
        ...whereTutorProfile.tutorLanguages,
        some: {
          ...whereTutorProfile.tutorLanguages?.some,
          proficiency: LanguageProficiency.NATIVE,
        },
      };
    }

    // Availability filter (basic): dayOfWeek + time overlap
    const dayOfWeek = params.get("dayOfWeek");
    if (dayOfWeek !== null) {
      const day = parseInt(dayOfWeek, 10);
      if (!isNaN(day) && day >= 0 && day <= 6) {
        const startMinute = parseInt(params.get("startMinute") ?? "0", 10);
        const endMinute = parseInt(params.get("endMinute") ?? "1439", 10);

        whereTutorProfile.user.availability = {
          some: {
            type: AvailabilityType.TUTOR_AVAILABILITY,
            is_active: true,
            day_of_week: day,
            AND: [
              { start_minute: { lte: endMinute } },
              { end_minute: { gte: startMinute } },
            ],
          },
        };
      }
    }

    // ----------------------------------
    // Retrieve tutors with filters
    // ----------------------------------
    const [totalCount, tutors] = await prisma.$transaction([
      prisma.tutorProfile.count({ where: whereTutorProfile }),
      prisma.tutorProfile.findMany({
        where: whereTutorProfile,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              profile_image_url: true,
              country: true,
              availability: {
                select: {
                  type: true,
                  is_active: true,
                  day_of_week: true,
                  start_minute: true,
                  end_minute: true,
                },
              },
            },
          },
          tutorLanguages: {
            where: { is_teaching: true },
            select: {
              proficiency: true,
              language: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // ----------------------------------
    // Rating aggregation
    // ----------------------------------
    const tutorIds = tutors.map((t) => t.user_id);
    const ratingsMap: Record<string, number> = {};
    const minRating = parseInt(params.get("minRating") ?? "0", 10);
    const maxRating = parseInt(params.get("maxRating") ?? "5", 10);

    if (tutorIds.length) {
      const ratingAgg = await prisma.tutorRating.groupBy({
        by: ["tutor_id"],
        where: {
          tutor_id: { in: tutorIds },
        },
        _avg: {
          overall_rating: true,
        },
      });
      ratingAgg.forEach((r) => {
        ratingsMap[r.tutor_id] = r._avg.overall_rating ?? 0;
      });
    }

    // Filter tutors by rating after aggregation
    const tutorsFilteredByRating = tutors.filter((t) => {
      const rating = ratingsMap[t.user_id] ?? 0;
      return rating >= minRating && rating <= maxRating;
    });

    // ----------------------------------
    // Compute next available slot (simple)
    // ----------------------------------
    const now = DateTime.utc();
    const result = tutorsFilteredByRating.map((tutor) => {
      const nextSlot = tutor.user.availability
        ? // minimal logic: find first availability window after now (ignoring timezone)
          tutor.user.availability
            .filter(
              (a) =>
                a.is_active && a.type === AvailabilityType.TUTOR_AVAILABILITY,
            )
            .map((a) => {
              const today = now.set({ weekday: a.day_of_week + 1 });
              const start = today
                .startOf("day")
                .plus({ minutes: a.start_minute });
              if (start < now) {
                return start.plus({ weeks: 1 });
              }
              return start;
            })
            .sort((a, b) => a.toMillis() - b.toMillis())[0]
        : null;

      return {
        id: tutor.user.id,
        firstName: tutor.user.first_name,
        lastName: tutor.user.last_name,
        profileImageUrl: tutor.user.profile_image_url,
        country: tutor.user.country,
        intro: tutor.intro,
        teachingExperience: tutor.teaching_experience,
        languages: tutor.tutorLanguages.map((tl) => ({
          proficiency: tl.proficiency,
          ...tl.language,
        })),
        rating: ratingsMap[tutor.user_id] ?? null,
        nextAvailableSlot: nextSlot ? nextSlot.toISO() : null,
      };
    });

    return NextResponse.json({
      page,
      pageSize,
      total: totalCount,
      results: result,
    });
  } catch (err) {
    console.error("Error fetching tutors:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
