
import { useCallback, useEffect, useState } from "react";
import {
  getMyEnrollments,
  leaveCourse,
  type Enrollment,
} from "../services/enrollmentService";

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [leavingId, setLeavingId] = useState("");

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMyEnrollments();
      setEnrollments(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your courses."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  async function handleLeave(courseId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to leave this course?"
    );

    if (!confirmed) return;

    try {
      setLeavingId(courseId);
      setError("");
      setMessage("");

      await leaveCourse(courseId);

      setEnrollments((current) =>
        current.filter(
          (enrollment) => enrollment.course._id !== courseId
        )
      );

      setMessage("You have left the course.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to leave this course."
      );
    } finally {
      setLeavingId("");
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <p>Loading your courses...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-2 text-3xl font-bold">My Courses</h1>
      <p className="mb-6 text-gray-600">
        Continue learning from the courses you have joined.
      </p>

      {error && (
        <p role="alert" className="mb-4 text-red-600">
          {error}
        </p>
      )}

      {message && (
        <p role="status" className="mb-4 text-green-700">
          {message}
        </p>
      )}

      {enrollments.length === 0 ? (
        <section className="rounded-xl border p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">
            No enrolled courses yet
          </h2>
          <p className="text-gray-600">
            Explore available courses and enroll to start learning.
          </p>
        </section>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => {
            const course = enrollment.course;

            return (
              <article
                key={enrollment._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-44 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <p className="mb-2 text-sm text-indigo-600">
                    Class {course.classLevel} · {course.subject}
                  </p>

                  <h2 className="mb-2 text-xl font-semibold">
                    {course.title}
                  </h2>

                  <p className="mb-4 text-sm text-gray-600">
                    {course.description}
                  </p>

                  <p className="mb-4 text-xs text-gray-500">
                    Enrolled on{" "}
                    {new Date(
                      enrollment.enrolledAt
                    ).toLocaleDateString()}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleLeave(course._id)
                    }
                    disabled={leavingId === course._id}
                    className="rounded-lg border border-red-300 px-4 py-2
                      text-sm text-red-700 hover:bg-red-50
                      disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {leavingId === course._id
                      ? "Leaving..."
                      : "Leave Course"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
