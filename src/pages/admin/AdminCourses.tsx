import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import {
  fetchAdminCourses,
  deleteCourse,
  toggleCoursePublish,
  type AdminCourse,
} from "../../services/adminService";
import ConfirmDialog from "./ConfirmDialog";

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-slate-800" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminCourse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminCourses({
        q: search || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        published: publishedFilter !== "all" ? publishedFilter : undefined,
      });
      setCourses(res.courses);
      setCategories(res.categories);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, publishedFilter]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  async function handleTogglePublish(course: AdminCourse) {
    setTogglingId(course._id);
    try {
      const res = await toggleCoursePublish(course._id, !course.published);
      setCourses((prev) =>
        prev.map((c) =>
          c._id === course._id ? { ...c, published: res.published } : c
        )
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to toggle publish");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteCourse(confirmDelete._id);
      setCourses((prev) => prev.filter((c) => c._id !== confirmDelete._id));
      setConfirmDelete(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete course");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Courses</h1>
          <p className="mt-1 text-slate-400 text-sm">
            {courses.length} course{courses.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link
          to="/admin/courses/new"
          className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Course
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-white/10 pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl bg-slate-900 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value)}
          className="rounded-xl bg-slate-900 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
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
                <th className="px-4 py-3 font-medium text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-16 text-center"
                  >
                    <BookOpen className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-400 mb-2">No courses found</p>
                    <Link
                      to="/admin/courses/new"
                      className="text-cyan-400 hover:underline text-sm"
                    >
                      Create your first course
                    </Link>
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course._id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-white max-w-[200px] truncate">
                        {course.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">
                        {course.subject}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{course.category}</td>
                    <td className="px-4 py-3 text-slate-400">Class {course.classLevel}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {course.publishedLessons ?? 0}/{course.totalLessons ?? 0}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {course.studentCount ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        disabled={togglingId === course._id}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 ${
                          course.published
                            ? "bg-green-500/15 text-green-400 hover:bg-red-500/15 hover:text-red-400"
                            : "bg-slate-700/60 text-slate-400 hover:bg-green-500/15 hover:text-green-400"
                        }`}
                      >
                        {togglingId === course._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : null}
                        {course.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/courses/${course._id}/edit`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(course)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Course"
          message={`Are you sure you want to delete "${confirmDelete.title}"? This will also remove all its lessons and student enrollments.`}
          confirmLabel="Delete"
          danger
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
