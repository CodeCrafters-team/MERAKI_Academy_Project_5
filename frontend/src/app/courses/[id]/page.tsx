import CourseDetailsClient from "./CourseDetailsClient";

const API_BASE = "http://localhost:5000";
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const [courseRes, modulesRes, reviewsRes] = await Promise.all([
    fetch(`${API_BASE}/courses/${id}`, { cache: "no-store" }),
    fetch(`${API_BASE}/modules/${id}`, { cache: "no-store" }),
    fetch(`${API_BASE}/reviews/course/${id}`, { cache: "no-store" }),
  ]);

  const [courseJson, modulesJson, reviewsJson] = await Promise.all([
    courseRes.json(),
    modulesRes.json(),
    reviewsRes.json(),
  ]);

  return (
    <CourseDetailsClient
      courseId={id}
      initialCourse={courseJson?.data}
      initialModules={modulesJson?.modules ?? modulesJson?.data ?? []}
      initialReviews={reviewsJson?.data ?? []}
    />
  );
}
