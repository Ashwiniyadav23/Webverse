import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  ChevronRight,
  CheckCircle,
  Plus,
  X,
} from "lucide-react";
import {
  fetchAdminCourseDetails,
  fetchCourseLessons,
  createLesson,
  updateLesson,
  type LessonInput,
  type AdminLesson,
  type ResourceItem,
} from "../../services/adminService";

interface FormErrors {
  title?: string;
  content?: string;
  module?: string;
}

const RESOURCE_TYPES: ResourceItem["type"][] = [
  "document",
  "video",
  "link",
  "code",
  "other",
];

function validate(data: LessonInput): FormErrors {
  const errors: FormErrors = {};
  if (!data.title || data.title.trim() === "") errors.title = "Title is required";
  if (!data.content || data.content.trim() === "")
    errors.content = "Content is required";
  return errors;
}

export default function AdminLessonForm() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(lessonId);
  const navigate = useNavigate();

  const [courseTitle, setCourseTitle] = useState<string>("");
  const [existingModules, setExistingModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [curriculumJson, setCurriculumJson] = useState("");
  const [curriculumError, setCurriculumError] = useState<string | null>(null);

  const defaultModule = searchParams.get("module") ?? "";

  const [form, setForm] = useState<LessonInput>({
    title: "",
    module: defaultModule,
    description: "",
    content: "",
    videoUrl: "",
    documentUrl: "",
    resources: [],
    order: 1,
    duration: "",
    published: false,
  });

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!courseId) return;
    // Load course modules for datalist
    fetchCourseLessons(courseId)
      .then((res) => {
        setCourseTitle(res.course.title);
        const modNames = res.modules.map((m) => m.name);
        setExistingModules(modNames);
        if (!isEdit && !defaultModule && modNames.length > 0) {
          // default to last module
        }
      })
      .catch(() => {});
  }, [courseId, isEdit, defaultModule]);

  useEffect(() => {
    if (!isEdit || !courseId) {
      // For new lesson, also try to get course title
      if (!isEdit && courseId) {
        fetchAdminCourseDetails(courseId)
          .then((res) => setCourseTitle(res.course.title))
          .catch(() => {});
      }
      return;
    }

    // Fetch course details to find the lesson
    fetchAdminCourseDetails(courseId)
      .then((res) => {
        setCourseTitle(res.course.title);
        const lesson: AdminLesson | undefined = res.lessons.find(
          (l) => l._id === lessonId
        );
        if (lesson) {
          setForm({
            title: lesson.title,
            module: lesson.module,
            description: lesson.description,
            content: lesson.content,
            curriculum: lesson.curriculum,
            videoUrl: lesson.videoUrl ?? "",
            documentUrl: lesson.documentUrl ?? "",
            resources: lesson.resources ?? [],
            order: lesson.order,
            duration: lesson.duration,
            published: lesson.published,
          });
          setCurriculumJson(lesson.curriculum ? JSON.stringify(lesson.curriculum, null, 2) : "");
        }
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [courseId, lessonId, isEdit]);

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "order"
          ? Number(value)
          : value,
    }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function addResource() {
    setForm((prev) => ({
      ...prev,
      resources: [
        ...prev.resources,
        { title: "", url: "", type: "link" as ResourceItem["type"] },
      ],
    }));
  }

  function removeResource(idx: number) {
    setForm((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== idx),
    }));
  }

  function updateResource(
    idx: number,
    field: keyof ResourceItem,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      resources: prev.resources.map((r, i) =>
        i === idx ? { ...r, [field]: value } : r
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCurriculumError(null);

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    let curriculum: Record<string, unknown> | undefined;
    if (curriculumJson.trim()) {
      try {
        const parsed: unknown = JSON.parse(curriculumJson);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Curriculum must be a JSON object.");
        curriculum = parsed as Record<string, unknown>;
      } catch (reason) {
        setCurriculumError(reason instanceof Error ? reason.message : "Invalid curriculum JSON");
        return;
      }
    }

    setSaving(true);
    try {
      const payload: LessonInput = {
        ...form,
        curriculum,
        videoUrl: form.videoUrl || undefined,
        documentUrl: form.documentUrl || undefined,
      };

      if (isEdit && lessonId) {
        await updateLesson(lessonId, payload);
        setSuccess(true);
        successTimer.current = setTimeout(() => setSuccess(false), 3000);
      } else if (courseId) {
        await createLesson(courseId, payload);
        navigate(`/admin/courses/${courseId}/lessons`);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save lesson");
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
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
        <Link to="/admin/courses" className="hover:text-cyan-400 transition-colors">
          Courses
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          to={`/admin/courses/${courseId}/lessons`}
          className="hover:text-cyan-400 transition-colors truncate max-w-[150px]"
        >
          {courseTitle || "Course"}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{isEdit ? "Edit Lesson" : "New Lesson"}</span>
      </nav>

      <h1 className="text-2xl font-bold text-white mb-8">
        {isEdit ? "Edit Lesson" : "Create New Lesson"}
      </h1>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <p className="text-sm">Lesson saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="text-base font-semibold text-white mb-5">Basic Info</h2>
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to HTML Tags"
                className={`w-full rounded-xl bg-slate-800 border px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  formErrors.title
                    ? "border-red-500/60"
                    : "border-white/10 focus:border-cyan-400"
                }`}
              />
              {formErrors.title && (
                <p className="mt-1 text-xs text-red-400">{formErrors.title}</p>
              )}
            </div>

            {/* Module */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Module
              </label>
              <input
                name="module"
                value={form.module}
                onChange={handleChange}
                list="module-suggestions"
                placeholder="e.g. HTML Basics"
                className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <datalist id="module-suggestions">
                {existingModules.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                placeholder="Brief overview of this lesson..."
                className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
              />
            </div>

            {/* Duration + Order + Published */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Duration
                </label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 15 min"
                  className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  min={1}
                  className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div className="flex flex-col justify-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="published"
                      checked={form.published}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 rounded-full bg-slate-700 peer-checked:bg-cyan-400 transition-colors after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
                  </div>
                  <span className="text-sm text-slate-300">Published</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="text-base font-semibold text-white mb-1">Content</h2>
          <p className="text-xs text-slate-500 mb-4">
            Write the lesson theory/content here. You can use Markdown-style
            formatting.
          </p>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={12}
            placeholder="# Lesson Content&#10;&#10;Write your lesson content here using Markdown..."
            className={`w-full rounded-xl bg-slate-800 border px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-y min-h-48 font-mono ${
              formErrors.content
                ? "border-red-500/60"
                : "border-white/10 focus:border-cyan-400"
            }`}
          />
          {formErrors.content && (
            <p className="mt-1 text-xs text-red-400">{formErrors.content}</p>
          )}
        </section>

        <section className="rounded-2xl border border-cyan-400/20 bg-slate-900/60 p-6">
          <h2 className="mb-1 text-base font-semibold text-white">Structured learning content (JSON)</h2>
          <p className="mb-4 text-xs leading-5 text-slate-400">For Phase 1 lessons, edit topics, editor tasks, quiz questions, and the separate assessment here. Each topic supports tag, what, why, how, example, output, and mistakes. Tasks use title, instructions, starterCode, and validation.requiredTags/requiredText. Quiz items use type (mcq, output, error), prompt, options, answerIndex, explanation, and optional snippet. Assessment uses title, prompt, starterCode, validation, testCases, and criteria. On the final project lesson, manage projectPages, submissionChecklist, and evaluationCriteria here. Leave blank for a standard lesson.</p>
          <textarea value={curriculumJson} onChange={event => setCurriculumJson(event.target.value)} rows={18} spellCheck={false} aria-label="Structured lesson curriculum JSON" className="w-full resize-y rounded-xl border border-white/10 bg-slate-800 px-4 py-3 font-mono text-xs leading-5 text-cyan-100 focus:border-cyan-400 focus:outline-none" placeholder={'{\n  "topics": [],\n  "tasks": [],\n  "quiz": [],\n  "assessment": {}\n}'} />
          {curriculumError && <p role="alert" className="mt-2 text-xs text-red-400">{curriculumError}</p>}
        </section>

        {/* Media */}
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="text-base font-semibold text-white mb-5">
            Media &amp; Resources
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Video URL{" "}
                <span className="text-slate-500 font-normal">
                  (YouTube/Vimeo)
                </span>
              </label>
              <input
                name="videoUrl"
                value={form.videoUrl ?? ""}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Document URL{" "}
                <span className="text-slate-500 font-normal">(PDF/Slides)</span>
              </label>
              <input
                name="documentUrl"
                value={form.documentUrl ?? ""}
                onChange={handleChange}
                placeholder="https://docs.google.com/..."
                className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">
              Additional Resources
            </h2>
            <button
              type="button"
              onClick={addResource}
              className="flex items-center gap-1.5 rounded-xl bg-slate-700 px-3 py-2 text-xs font-medium text-white hover:bg-slate-600 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Resource
            </button>
          </div>

          {form.resources.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              No additional resources. Click "Add Resource" to add links,
              documents, or code references.
            </p>
          ) : (
            <div className="space-y-3">
              {form.resources.map((resource, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-white/5"
                >
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <input
                      value={resource.title}
                      onChange={(e) =>
                        updateResource(idx, "title", e.target.value)
                      }
                      placeholder="Resource title"
                      className="rounded-lg bg-slate-800 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <input
                      value={resource.url}
                      onChange={(e) =>
                        updateResource(idx, "url", e.target.value)
                      }
                      placeholder="https://..."
                      className="rounded-lg bg-slate-800 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <select
                      value={resource.type}
                      onChange={(e) =>
                        updateResource(idx, "type", e.target.value)
                      }
                      className="rounded-lg bg-slate-800 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    >
                      {RESOURCE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeResource(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-0.5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Lesson"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/courses/${courseId}/lessons`)}
            className="rounded-xl px-6 py-2.5 text-sm font-medium bg-slate-700 text-white hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
