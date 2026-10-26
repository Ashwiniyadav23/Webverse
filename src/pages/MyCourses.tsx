import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Code2, ArrowLeft, BookOpen, Trash2, ExternalLink } from "lucide-react";
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

  useEffect(() => {
    let ignore = false;

    getMyEnrollments()
      .then((result) => {
        if (!ignore) {
          setEnrollments(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your courses."
          );
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

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
          (enrollment) => enrollment.course?._id !== courseId
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <Code2 size={25} className="text-cyan-400" />
            </div>
            <span>
              Web<span className="text-cyan-400">Verse</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-slate-300 transition hover:text-cyan-400"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
            <Link
              to="/courses/explorers"
              className="rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore Courses
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-widest text-cyan-400 uppercase">
            Student Space
          </p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">My Enrolled Courses</h1>
          <p className="mt-2 text-slate-400">
            Continue learning and track progress in the courses you have joined.
          </p>
        </div>

        {error && (
          <p role="alert" className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {message}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <p>Loading your courses...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center">
            <BookOpen className="mx-auto text-cyan-400" size={48} />
            <h2 className="mt-4 text-2xl font-bold">No enrolled courses yet</h2>
            <p className="mt-2 text-slate-400">
              Explore available courses and enroll to start your learning journey.
            </p>
            <Link
              to="/courses/explorers"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Browse Courses
            </Link>
          </section>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => {
              const course = enrollment.course;
              if (!course) return null;

              return (
                <article
                  key={enrollment._id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 transition hover:border-cyan-400/40"
                >
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-44 w-full object-cover"
                    />
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <p className="mb-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                      Class {course.classLevel} · {course.subject}
                    </p>

                    <h2 className="mb-2 text-xl font-bold">
                      {course.title}
                    </h2>

                    <p className="mb-4 flex-1 text-sm text-slate-300 line-clamp-3">
                      {course.description}
                    </p>

                    <p className="mb-6 text-xs text-slate-400">
                      Enrolled on{" "}
                      {new Date(
                        enrollment.enrolledAt
                      ).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <Link
                        to={`/courses/${course._id}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                      >
                        Continue
                        <ExternalLink size={15} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleLeave(course._id)}
                        disabled={leavingId === course._id}
                        title="Leave course"
                        className="inline-flex items-center justify-center rounded-xl border border-red-500/30 p-2.5 text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
