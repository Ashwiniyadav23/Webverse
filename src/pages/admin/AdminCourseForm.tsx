import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Loader2, AlertCircle, ChevronRight, CheckCircle } from "lucide-react";
import {
  fetchAdminCourseDetails,
  createCourse,
  updateCourse,
  type CourseInput,
  type AdminCourse,
} from "../../services/adminService";

const CATEGORY_SUGGESTIONS = [
  "Web Development",
  "Frontend Development",
  "Full-Stack Engineering",
  "Backend Development",
  "Computer Science",
  "Data Science",
];

const CLASS_LEVELS = [6, 7, 8, 9, 10, 11, 12];

interface FormErrors {
  title?: string;
  description?: string;
  classLevel?: string;
  subject?: string;
  category?: string;
}

function validate(data: CourseInput): FormErrors {
  const errors: FormErrors = {};
  if (!data.title || data.title.trim().length < 3)
    errors.title = "Title must be at least 3 characters";
  if (!data.description || data.description.trim().length < 10)
    errors.description = "Description must be at least 10 characters";
  if (!data.subject || data.subject.trim() === "")
    errors.subject = "Subject is required";
  if (!data.category || data.category.trim() === "")
    errors.category = "Category is required";
  return errors;
}

export default function AdminCourseForm() {
  const { courseId } = useParams<{ courseId: string }>();
  const isEdit = Boolean(courseId);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<CourseInput>({
    title: "",
    description: "",
    classLevel: 9,
    subject: "",
    category: "",
    thumbnail: "",
    published: false,
  });

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isEdit || !courseId) return;
    fetchAdminCourseDetails(courseId)
      .then((res) => {
        const c: AdminCourse = res.course;
        setForm({
          title: c.title,
          description: c.description,
          classLevel: c.classLevel,
          subject: c.subject,
          category: c.category,
          thumbnail: c.thumbnail ?? "",
          published: c.published,
        });
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseId, isEdit]);

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "classLevel" ? Number(value) : value,
    }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      if (isEdit && courseId) {
        await updateCourse(courseId, form);
        setSuccess(true);
        successTimer.current = setTimeout(() => setSuccess(false), 3000);
      } else {
        const res = await createCourse(form);
        navigate(`/admin/courses/${res.course._id}/lessons`);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save course");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link to="/admin/courses" className="hover:text-cyan-400 transition-colors">
          Courses
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{isEdit ? "Edit Course" : "New Course"}</span>
      </nav>

      <h1 className="text-2xl font-bold text-white mb-8">
        {isEdit ? "Edit Course" : "Create New Course"}
      </h1>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Success Toast */}
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <p className="text-sm">Course saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Introduction to HTML & CSS"
            className={`w-full rounded-xl bg-slate-900 border px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
              formErrors.title
                ? "border-red-500/60 focus:border-red-400"
                : "border-white/10 focus:border-cyan-400"
            }`}
          />
          {formErrors.title && (
            <p className="mt-1 text-xs text-red-400">{formErrors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe what students will learn in this course..."
            className={`w-full rounded-xl bg-slate-900 border px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none ${
              formErrors.description
                ? "border-red-500/60 focus:border-red-400"
                : "border-white/10 focus:border-cyan-400"
            }`}
          />
          {formErrors.description && (
            <p className="mt-1 text-xs text-red-400">{formErrors.description}</p>
          )}
        </div>

        {/* Class Level + Subject */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Class Level <span className="text-red-400">*</span>
            </label>
            <select
              name="classLevel"
              value={form.classLevel}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
            >
              {CLASS_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  Class {lvl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className={`w-full rounded-xl bg-slate-900 border px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                formErrors.subject
                  ? "border-red-500/60 focus:border-red-400"
                  : "border-white/10 focus:border-cyan-400"
              }`}
            />
            {formErrors.subject && (
              <p className="mt-1 text-xs text-red-400">{formErrors.subject}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Category <span className="text-red-400">*</span>
          </label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            list="category-suggestions"
            placeholder="e.g. Web Development"
            className={`w-full rounded-xl bg-slate-900 border px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
              formErrors.category
                ? "border-red-500/60 focus:border-red-400"
                : "border-white/10 focus:border-cyan-400"
            }`}
          />
          <datalist id="category-suggestions">
            {CATEGORY_SUGGESTIONS.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          {formErrors.category && (
            <p className="mt-1 text-xs text-red-400">{formErrors.category}</p>
          )}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Thumbnail URL{" "}
            <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            name="thumbnail"
            value={form.thumbnail ?? ""}
            onChange={handleChange}
            placeholder="https://example.com/thumbnail.jpg"
            className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Published */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-10 h-6 rounded-full bg-slate-700 peer-checked:bg-cyan-400 transition-colors after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
          </label>
          <span className="text-sm font-medium text-slate-300">
            Published{" "}
            <span className="text-slate-500 font-normal">
              (visible to students)
            </span>
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="rounded-xl px-6 py-2.5 text-sm font-medium bg-slate-700 text-white hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
