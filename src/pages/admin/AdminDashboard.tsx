import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  FileText,
  Globe,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  fetchAdminDashboardStats,
  fetchAdminCourses,
  type AdminStats,
  type AdminCourse,
} from "../../services/adminService";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
}

function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-slate-900/60 p-6 flex items-start gap-4`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="mt-1 text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 flex items-start gap-4 animate-pulse">
      <div className="h-12 w-12 rounded-xl bg-slate-800" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-7 w-16 rounded bg-slate-800" />
        <div className="h-4 w-28 rounded bg-slate-800" />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-slate-800" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminDashboardStats()
      .then((res) => setStats(res.stats))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoadingStats(false));

    fetchAdminCourses()
      .then((res) => setCourses(res.courses.slice(0, 6)))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoadingCourses(false));
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-slate-400 text-sm">{today}</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        {loadingStats ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              label="Total Courses"
              value={stats?.totalCourses ?? 0}
              icon={<BookOpen className="h-6 w-6 text-cyan-400" />}
              accent="bg-cyan-400/10"
            />
            <StatCard
              label="Published Courses"
              value={stats?.publishedCourses ?? 0}
              icon={<Globe className="h-6 w-6 text-green-400" />}
              accent="bg-green-400/10"
            />
            <StatCard
              label="Total Students"
              value={stats?.totalStudents ?? 0}
              icon={<Users className="h-6 w-6 text-purple-400" />}
              accent="bg-purple-400/10"
            />
            <StatCard
              label="Total Lessons"
              value={stats?.totalLessons ?? 0}
              icon={<FileText className="h-6 w-6 text-orange-400" />}
              accent="bg-orange-400/10"
            />
          </>
        )}
      </div>

      {/* Recent Courses Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Recent Courses</h2>
          <Link
            to="/admin/courses"
            className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-3 font-medium text-slate-400">Title</th>
                <th className="px-4 py-3 font-medium text-slate-400">Category</th>
                <th className="px-4 py-3 font-medium text-slate-400">Class</th>
                <th className="px-4 py-3 font-medium text-slate-400">Lessons</th>
                <th className="px-4 py-3 font-medium text-slate-400">Students</th>
                <th className="px-4 py-3 font-medium text-slate-400">Status</th>
                <th className="px-4 py-3 font-medium text-slate-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loadingCourses ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    No courses yet.{" "}
                    <Link to="/admin/courses/new" className="text-cyan-400 hover:underline">
                      Create one
                    </Link>
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-white max-w-[200px] truncate">
                      {course.title}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{course.category}</td>
                    <td className="px-4 py-3 text-slate-400">Class {course.classLevel}</td>
                    <td className="px-4 py-3 text-slate-400">{course.totalLessons ?? 0}</td>
                    <td className="px-4 py-3 text-slate-400">{course.studentCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          course.published
                            ? "bg-green-500/15 text-green-400"
                            : "bg-slate-700/60 text-slate-400"
                        }`}
                      >
                        {course.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/courses/${course._id}/lessons`}
                        className="text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-colors"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
