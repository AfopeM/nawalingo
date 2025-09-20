import { TutorCard, TutorCardData } from "@/components/tutor/TutorCard";
import { TutorFilters } from "@/components/tutor/TutorFilters";
import { Pagination } from "@/components/ui/Pagination";
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
          <TutorFilters />
        </Suspense>
        <div className="space-y-6">
          {data.results.length === 0 ? (
            <p>No tutors found for selected criteria.</p>
          ) : (
            data.results.map((t: TutorCardData) => (
              <TutorCard key={t.id} data={t} />
            ))
          )}
          <Pagination
            current={data.page}
            total={data.total}
            pageSize={data.pageSize}
            linkBuilder={(p) => `/tutors?page=${p}&${search}`}
          />
        </div>
      </div>
    </main>
  );
}



