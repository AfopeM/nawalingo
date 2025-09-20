import Image from "next/image";
import { notFound } from "next/navigation";
import { DateTime } from "luxon";
import { AvailabilityType } from "@prisma/client";

async function fetchTutor(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tutors/${id}`,
    {
      cache: "no-store",
    },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch tutor");
  return res.json();
}

export default async function TutorProfilePage({
  params,
}: {
  params: { tutorId: string };
}) {
  const tutor = await fetchTutor(params.tutorId);
  if (!tutor) return notFound();

  const fullName = `${tutor.firstName ?? ""} ${tutor.lastName ?? ""}`.trim();

  function formatAvailability() {
    return tutor.availability.map((a: any) => {
      const day = DateTime.utc()
        .set({ weekday: a.day_of_week + 1 })
        .toFormat("cccc");
      const start = DateTime.utc()
        .startOf("day")
        .plus({ minutes: a.start_minute })
        .toFormat("HH:mm");
      const end = DateTime.utc()
        .startOf("day")
        .plus({ minutes: a.end_minute })
        .toFormat("HH:mm");
      return `${day}: ${start} - ${end} (${a.timezone || "UTC"})`;
    });
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        {tutor.profileImageUrl ? (
          <Image
            src={tutor.profileImageUrl}
            alt={fullName}
            width={128}
            height={128}
            className="h-32 w-32 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-300/50 text-4xl">
            {fullName.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold capitalize">{fullName}</h1>
          {tutor.country && <p className="text-gray-600">{tutor.country}</p>}
          {tutor.rating && (
            <p className="mt-2 font-medium text-yellow-500">
              Rating: {tutor.rating.toFixed(1)} ({tutor.ratingCount})
            </p>
          )}
        </div>
      </div>

      {tutor.intro && (
        <section>
          <h2 className="mb-2 text-2xl font-semibold">Introduction</h2>
          <p>{tutor.intro}</p>
        </section>
      )}

      {tutor.teachingExperience && (
        <section>
          <h2 className="mb-2 text-2xl font-semibold">Teaching experience</h2>
          <p>{tutor.teachingExperience}</p>
        </section>
      )}

      {tutor.languages.length > 0 && (
        <section>
          <h2 className="mb-2 text-2xl font-semibold">Languages taught</h2>
          <ul className="flex flex-wrap gap-2">
            {tutor.languages.map((l: any) => (
              <li
                key={l.id}
                className="rounded bg-gray-200 px-2 py-0.5 text-sm dark:bg-gray-700/40"
              >
                {l.name} ({l.proficiency})
              </li>
            ))}
          </ul>
        </section>
      )}

      {tutor.availability.length > 0 && (
        <section>
          <h2 className="mb-2 text-2xl font-semibold">Weekly availability</h2>
          <ul className="space-y-1 text-sm">
            {formatAvailability().map((txt: string) => (
              <li key={txt}>{txt}</li>
            ))}
          </ul>
        </section>
      )}

      {tutor.nextAvailableSlot && (
        <p className="text-green-600 dark:text-green-400">
          Next available slot:{" "}
          {DateTime.fromISO(tutor.nextAvailableSlot, { zone: "utc" })
            .toLocal()
            .toFormat("cccc, dd LLL yyyy • HH:mm")}
        </p>
      )}
    </main>
  );
}



