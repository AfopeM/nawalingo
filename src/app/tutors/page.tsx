// TODO: These components need to be created
// import { TutorCard, TutorCardData } from "@/components/tutor/TutorCard";
// import { TutorFilters } from "@/components/tutor/TutorFilters";
// import { Pagination } from "@/components/ui/Pagination";
import { Suspense } from "react";

async function fetchTutors(search: string): Promise<any> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tutors?${search}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch tutors");
  return res.json();
}

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  const search = new URLSearchParams(
    searchParams as Record<string, string>,
  ).toString();
  const data = await fetchTutors(search);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <h1 className="text-3xl font-bold">Find your tutor</h1>
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <Suspense fallback={<p>Loading filters…</p>}>
          {/* TODO: TutorFilters component needs to be created */}
          <div>Filters coming soon...</div>
        </Suspense>
        <div className="space-y-6">
          {data.results.length === 0 ? (
            <p>No tutors found for selected criteria.</p>
          ) : (
            <div>
              <p>Found {data.results.length} tutors</p>
              {/* TODO: TutorCard component needs to be created */}
              {data.results.map((t: any) => (
                <div key={t.id} className="mb-4 rounded border p-4">
                  <h3>{t.name || "Tutor"}</h3>
                  <p>Tutor details coming soon...</p>
                </div>
              ))}
            </div>
          )}
          {/* TODO: Pagination component needs to be created */}
          <div>
            <p>
              Page {data.page} of {Math.ceil(data.total / data.pageSize)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
