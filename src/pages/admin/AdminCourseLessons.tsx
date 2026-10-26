import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GripVertical,
  UserMinus,
  UserPlus,
  Users,
  BookOpen,
} from "lucide-react";
import {
  fetchCourseLessons,
  toggleLessonPublish,
  deleteLesson,
  reorderLessons,
  fetchCourseStudents,
  enrollStudentInCourse,
  removeStudentFromCourse,
  type AdminCourse,
  type AdminLesson,
  type EnrolledStudentItem,
} from "../../services/adminService";
import ConfirmDialog from "./ConfirmDialog";

interface ModuleGroup {
  name: string;
  lessons: AdminLesson[];
}

export default function AdminCourseLessons() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<AdminCourse | null>(null);
  const [modules, setModules] = useState<ModuleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirmDeleteLesson, setConfirmDeleteLesson] = useState<AdminLesson | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [collapsedModules, setCollapsedModules] = useState<Set<string>>(new Set());
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  // Students
  const [students, setStudents] = useState<EnrolledStudentItem[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [enrollEmail, setEnrollEmail] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null);
  const [removingStudentId, setRemovingStudentId] = useState<string | null>(null);
  const [confirmRemoveStudent, setConfirmRemoveStudent] =
    useState<EnrolledStudentItem | null>(null);

  useEffect(() => {
    if (!courseId) return;
    loadLessons();
    loadStudents();
  }, [courseId]);

  async function loadLessons() {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCourseLessons(courseId);
      setCourse(res.course);
      setModules(res.modules);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }

  async function loadStudents() {
    if (!courseId) return;
    try {
      const res = await fetchCourseStudents(courseId);
      setStudents(res.students);
    } catch {
      // non-critical
    } finally {
      setStudentsLoading(false);
    }
  }

  function toggleModule(name: string) {
    setCollapsedModules((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  async function handleToggleLesson(lesson: AdminLesson) {
    setTogglingId(lesson._id);
    try {
      const res = await toggleLessonPublish(lesson._id, !lesson.published);
      setModules((prev) =>
        prev.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) =>
            l._id === lesson._id ? { ...l, published: res.published } : l
          ),
        }))
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to toggle lesson");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDeleteLesson() {
    if (!confirmDeleteLesson) return;
    setDeleting(true);
    try {
      await deleteLesson(confirmDeleteLesson._id);
      setModules((prev) =>
        prev
          .map((m) => ({
            ...m,
            lessons: m.lessons.filter((l) => l._id !== confirmDeleteLesson._id),
          }))
          .filter((m) => m.lessons.length > 0)
      );
      setConfirmDeleteLesson(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete lesson");
    } finally {
      setDeleting(false);
    }
  }

  async function handleMove(
    moduleName: string,
    lessonId: string,
    direction: "up" | "down"
  ) {
    if (!courseId) return;
    const moduleGroup = modules.find((m) => m.name === moduleName);
    if (!moduleGroup) return;

    const idx = moduleGroup.lessons.findIndex((l) => l._id === lessonId);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === moduleGroup.lessons.length - 1) return;

    const newLessons = [...moduleGroup.lessons];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newLessons[idx], newLessons[swapIdx]] = [newLessons[swapIdx], newLessons[idx]];

    const reordered = newLessons.map((l, i) => ({
      id: l._id,
      order: i + 1,
      module: l.module,
    }));

    setModules((prev) =>
      prev.map((m) =>
        m.name === moduleName
          ? { ...m, lessons: newLessons.map((l, i) => ({ ...l, order: i + 1 })) }
          : m
      )
    );

    setReorderingId(lessonId);
    try {
      await reorderLessons(courseId, reordered);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to reorder lessons");
      loadLessons();
    } finally {
      setReorderingId(null);
    }
  }

  async function handleEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId || !enrollEmail.trim()) return;
    setEnrolling(true);
    setEnrollError(null);
    setEnrollSuccess(null);
    try {
      const res = await enrollStudentInCourse(courseId, {
        email: enrollEmail.trim(),
      });
      setStudents((prev) => [...prev, res.enrollment]);
      setEnrollEmail("");
      setEnrollSuccess(`${res.enrollment.student.name} enrolled successfully!`);
      setTimeout(() => setEnrollSuccess(null), 3000);
    } catch (e: unknown) {
      setEnrollError(e instanceof Error ? e.message : "Failed to enroll student");
    } finally {
      setEnrolling(false);
    }
  }

  async function handleRemoveStudent() {
    if (!confirmRemoveStudent || !courseId) return;
    setRemovingStudentId(confirmRemoveStudent.student._id);
    try {
      await removeStudentFromCourse(courseId, confirmRemoveStudent.student._id);
      setStudents((prev) =>
        prev.filter((s) => s.enrollmentId !== confirmRemoveStudent.enrollmentId)
      );
      setConfirmRemoveStudent(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to remove student");
    } finally {
      setRemovingStudentId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const publishedLessons = modules.reduce(
    (s, m) => s + m.lessons.filter((l) => l.published).length,
    0
  );

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link to="/admin/courses" className="hover:text-cyan-400 transition-colors">
          Courses
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white truncate max-w-xs">{course?.title}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">Lessons</span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {course?.title ?? "Course Lessons"}
          </h1>
          {/* Stats bar */}
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {totalLessons} lessons total
            </span>
            <span className="text-green-400">{publishedLessons} published</span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {students.length} students
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/courses/${courseId}/edit`}
            className="rounded-xl px-4 py-2 text-sm font-medium bg-slate-700 text-white hover:bg-slate-600 transition-colors"
          >
            Edit Course
          </Link>
          <Link
            to={`/admin/courses/${courseId}/lessons/new`}
            className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Lesson
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Module groups */}
      {modules.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 py-16 text-center">
          <BookOpen className="h-12 w-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 mb-2">No lessons yet</p>
          <Link
            to={`/admin/courses/${courseId}/lessons/new`}
            className="text-cyan-400 hover:underline text-sm"
          >
            Add your first lesson
          </Link>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {modules.map((mod) => {
            const collapsed = collapsedModules.has(mod.name);
            return (
              <div
                key={mod.name}
                className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden"
              >
                {/* Module header */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleModule(mod.name)}
                >
                  <div className="flex items-center gap-2">
                    {collapsed ? (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                    <span className="font-semibold text-white">{mod.name}</span>
                    <span className="text-xs text-slate-500">
                      ({mod.lessons.length} lesson{mod.lessons.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <Link
                    to={`/admin/courses/${courseId}/lessons/new?module=${encodeURIComponent(mod.name)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add to module
                  </Link>
                </div>

                {/* Lessons */}
                {!collapsed && (
                  <div className="divide-y divide-white/5">
                    {mod.lessons.map((lesson, idx) => (
                      <div
                        key={lesson._id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                      >
                        <GripVertical className="h-4 w-4 text-slate-600 shrink-0" />
                        <span className="text-xs text-slate-500 w-6 shrink-0 text-center">
                          {lesson.order}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {lesson.duration}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            lesson.published
                              ? "bg-green-500/15 text-green-400"
                              : "bg-slate-700/60 text-slate-400"
                          }`}
                        >
                          {lesson.published ? "Published" : "Draft"}
                        </span>

                        {/* Move arrows */}
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <button
                            onClick={() => handleMove(mod.name, lesson._id, "up")}
                            disabled={idx === 0 || reorderingId === lesson._id}
                            className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              handleMove(mod.name, lesson._id, "down")
                            }
                            disabled={
                              idx === mod.lessons.length - 1 ||
                              reorderingId === lesson._id
                            }
                            className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleToggleLesson(lesson)}
                            disabled={togglingId === lesson._id}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-cyan-400/10 hover:text-cyan-400 transition-colors disabled:opacity-50"
                            title={lesson.published ? "Unpublish" : "Publish"}
                          >
                            {togglingId === lesson._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <span className="text-xs font-medium">
                                {lesson.published ? "↓" : "↑"}
                              </span>
                            )}
                          </button>
                          <Link
                            to={`/admin/courses/${courseId}/lessons/${lesson._id}/edit`}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setConfirmDeleteLesson(lesson)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Student Access Section */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10">
          <Users className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Student Access</h2>
          <span className="text-sm text-slate-400">({students.length} enrolled)</span>
        </div>

        {/* Enroll by email */}
        <div className="px-6 py-4 border-b border-white/5">
          <form onSubmit={handleEnroll} className="flex gap-3">
            <input
              type="email"
              value={enrollEmail}
              onChange={(e) => setEnrollEmail(e.target.value)}
              placeholder="Student email address"
              className="flex-1 rounded-xl bg-slate-800 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              disabled={enrolling || !enrollEmail.trim()}
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors disabled:opacity-50"
            >
              {enrolling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Enroll
            </button>
          </form>
          {enrollError && (
            <p className="mt-2 text-xs text-red-400">{enrollError}</p>
          )}
          {enrollSuccess && (
            <p className="mt-2 text-xs text-green-400">{enrollSuccess}</p>
          )}
        </div>

        {/* Students table */}
        {studentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          </div>
        ) : students.length === 0 ? (
          <div className="py-10 text-center text-slate-500 text-sm">
            No students enrolled yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {students.map((item) => (
              <div
                key={item.enrollmentId}
                className="flex items-center justify-between px-6 py-3 hover:bg-white/5 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {item.student.name}
                  </p>
                  <p className="text-xs text-slate-500">{item.student.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">
                    {new Date(item.enrolledAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setConfirmRemoveStudent(item)}
                    disabled={removingStudentId === item.student._id}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    {removingStudentId === item.student._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserMinus className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm delete lesson */}
      {confirmDeleteLesson && (
        <ConfirmDialog
          title="Delete Lesson"
          message={`Are you sure you want to delete "${confirmDeleteLesson.title}"?`}
          confirmLabel="Delete"
          danger
          loading={deleting}
          onConfirm={handleDeleteLesson}
          onCancel={() => setConfirmDeleteLesson(null)}
        />
      )}

      {/* Confirm remove student */}
      {confirmRemoveStudent && (
        <ConfirmDialog
          title="Remove Student"
          message={`Remove ${confirmRemoveStudent.student.name} from this course?`}
          confirmLabel="Remove"
          danger
          onConfirm={handleRemoveStudent}
          onCancel={() => setConfirmRemoveStudent(null)}
        />
      )}
    </div>
  );
}
