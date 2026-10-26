
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  LockKeyhole,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { getProgress } from "../utils/progress";
import { htmlCourseId } from "../data/htmlFundamentals";
import { phaseOneSections } from "../data/htmlPhaseOne";
import { apiUrl } from "../utils/api";
import { getAuth } from "../utils/auth";

type Lesson = {
  id: string;
  title: string;
  description: string;
  duration: string;
  available: boolean;
  order?: number;
  topicCount?: number;
  taskCount?: number;
};

type Course = {
  id: string;
  title: string;
  classes: string;
  description: string;
  level: string;
  color: string;
  lessons: Lesson[];
};

const courses: Course[] = [
  {
    id: htmlCourseId,
    title: "Phase 1 — Student Profile & Course Portal (HTML Only)",
    classes: "Beginner",
    description: "Learn HTML structure, navigation, content, semantic organization, forms, and tables, then build a six-page student portal. HTML only.",
    level: "Beginner",
    color: "from-cyan-500 to-blue-600",
    lessons: [...phaseOneSections.map((section, index) => ({
      id: `html-section-${index + 1}`,
      title: `Section ${index + 1}: ${section.title}`,
      description: "Learn the concepts, complete the related task, and self-check before continuing.",
      duration: "Learn, practice, and self-check",
      available: true,
    })), {
      id: "html-final-project",
      title: "Final Project: Student Profile & Course Portal",
      description: "Build and submit six connected pages using only HTML.",
      duration: "Six-page project",
      available: true,
    }],
  },
  {
    id: "explorers",
    title: "Web Explorers",
    classes: "Classes 6–8",
    description:
      "Discover how websites work and create your first web pages using HTML.",
    level: "Beginner",
    color: "from-cyan-500 to-blue-600",
    lessons: [
      {
        id: "html-intro",
        title: "Introduction to HTML",
        description: "Understand HTML and create your first webpage.",
        duration: "15 min",
        available: true,
      },
      {
        id: "html-paragraphs",
        title: "Headings and Paragraphs",
        description: "Organize webpage content using headings and paragraphs.",
        duration: "15 min",
        available: true,
      },
      {
        id: "html-links",
        title: "Links and Images",
        description: "Connect pages and display images.",
        duration: "20 min",
        available: false,
      },
      {
        id: "html-lists",
        title: "Lists in HTML",
        description: "Create ordered and unordered lists.",
        duration: "15 min",
        available: false,
      },
    ],
  },
  {
    id: "builders",
    title: "Web Builders",
    classes: "Classes 9–10",
    description:
      "Learn CSS and transform simple HTML pages into beautiful websites.",
    level: "Intermediate",
    color: "from-violet-500 to-purple-600",
    lessons: [
      {
        id: "css-intro",
        title: "Introduction to CSS",
        description: "Understand CSS and connect styles to HTML.",
        duration: "15 min",
        available: false,
      },
      {
        id: "css-colors",
        title: "Colors and Typography",
        description: "Style text and backgrounds.",
        duration: "20 min",
        available: false,
      },
      {
        id: "css-layout",
        title: "CSS Layouts",
        description: "Arrange elements on a webpage.",
        duration: "25 min",
        available: false,
      },
    ],
  },
  {
    id: "engineers",
    title: "Web Engineers",
    classes: "Classes 11–12",
    description:
      "Explore JavaScript and learn to make websites interactive.",
    level: "Advanced",
    color: "from-orange-500 to-pink-600",
    lessons: [
      {
        id: "js-intro",
        title: "Introduction to JavaScript",
        description: "Understand what JavaScript does on a webpage.",
        duration: "15 min",
        available: false,
      },
      {
        id: "js-variables",
        title: "Variables and Data Types",
        description: "Store and work with information in JavaScript.",
        duration: "20 min",
        available: false,
      },
      {
        id: "js-functions",
        title: "Functions",
        description: "Organize reusable JavaScript instructions.",
        duration: "25 min",
        available: false,
      },
    ],
  },
];

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState(() => courses.find((item) => item.id === courseId));
  useEffect(() => {
    if (courseId !== htmlCourseId) return;
    let cancelled = false;
    fetch(apiUrl("courses")).then(response => response.json()).then(async data => {
      const record = data.courses?.find((item: { title: string }) => item.title.includes("Student Profile & Course Portal"));
      if (!record) return;
      const lessonData = await fetch(apiUrl(`courses/${record._id}/lessons`)).then(response => response.json());
      if (cancelled) return;
      const lessons: Lesson[] = (lessonData.lessons || []).map((item: { _id: string; title: string; description: string; duration: string; order: number; module: string; curriculum?: { topics?: unknown[]; tasks?: unknown[] } }) => ({
        id: item.module.startsWith("Final Project:") || item.title.startsWith("Final Project:") ? `html-final-project-${item._id}` : item._id,
        title: item.title, description: item.description, duration: item.duration, available: true, order: item.order,
        topicCount: item.curriculum?.topics?.length || 0, taskCount: item.curriculum?.tasks?.length || 0,
      }));
      lessons.sort((a, b) => Number(a.id.startsWith("html-final-project-")) - Number(b.id.startsWith("html-final-project-")) || (a.order || 0) - (b.order || 0));
      setCourse(current => current ? { ...current, title: record.title, description: record.description, lessons } : current);
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [courseId]);
  const [progress, setProgress] = useState(getProgress);
  useEffect(() => {
    const auth = getAuth();
    if (!auth?.token) return;
    fetch(apiUrl("progress/me"), { headers: { Authorization: `Bearer ${auth.token}` } }).then(response => response.json()).then(data => {
      setProgress(current => {
        const merged = { ...current };
        for (const item of data.progress || []) {
          const id = item.lesson?._id;
          if (!id) continue;
          const courseLesson = course?.lessons.find(lesson => lesson.id === id || lesson.id.endsWith(id));
          const curriculumProgress = item.curriculumProgress || {};
          const quizAttempts = curriculumProgress.quizAttempts || [];
          const lastQuizScore = quizAttempts.length ? quizAttempts[quizAttempts.length - 1].score : null;
          const sectionComplete = courseLesson && (courseLesson.order || 0) <= 6
            && (curriculumProgress.completedTopics || []).length >= (courseLesson.topicCount || Infinity)
            && (curriculumProgress.completedTasks || []).length >= (courseLesson.taskCount || Infinity)
            && lastQuizScore >= 67 && curriculumProgress.assessment?.passed;
          const isProject = courseLesson?.id.startsWith("html-final-project-") || false;
          const completed = isProject ? item.projectSubmission?.status === "complete" : Boolean(sectionComplete);
          const key = courseLesson?.id || id;
          merged[key] = { ...merged[key], completed, quizScore: lastQuizScore ?? item.quizScore ?? undefined, assignmentChecks: Object.fromEntries([...(curriculumProgress.completedTopics || []), ...(curriculumProgress.completedTasks || []), ...(item.projectProgress?.checklist || [])].map((value: string) => [value, true])) };
        }
        return merged;
      });
    }).catch(() => undefined);
  }, [course?.lessons]);

  if (!course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 text-cyan-400" size={48} />
          <h1 className="text-3xl font-black">Course not found</h1>
          <p className="mt-3 text-slate-400">
            This course does not exist or its URL is incorrect.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const completedCount = course.lessons.filter(
    (lesson) => progress[lesson.id]?.completed
  ).length;

  const isLessonAvailable = (lesson: Lesson) => {
    const sectionIndex = course?.lessons.findIndex(item => item.id === lesson.id) ?? -1;
    const isProject = lesson.id.startsWith("html-final-project");
    if (isProject) return lesson.available && course?.lessons.slice(0, 6).every(item => progress[item.id]?.completed);
    return lesson.available && (sectionIndex <= 0 || Boolean(progress[course?.lessons[sectionIndex - 1]?.id || ""]?.completed));
  };

  const availableLessons = course.lessons.filter(isLessonAvailable).length;

  const percentage = Math.round(
    (completedCount / course.lessons.length) * 100
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-400 p-2 text-slate-950">
              <Code2 size={23} />
            </div>
            <span className="text-2xl font-black">
              Web<span className="text-cyan-400">Verse</span>
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="text-sm text-slate-300 transition hover:text-cyan-400"
          >
            My Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400"
        >
          <ArrowLeft size={17} /> All Courses
        </Link>

        <section
          className={`mt-6 overflow-hidden rounded-3xl bg-gradient-to-br ${course.color} p-7 sm:p-10`}
        >
          <div className="grid gap-8 md:grid-cols-[1.5fr_0.5fr] md:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-black/20 px-3 py-1 text-sm">
                  {course.classes}
                </span>
                <span className="rounded-full bg-black/20 px-3 py-1 text-sm">
                  {course.level}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-black sm:text-5xl">
                {course.title}
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-white/85">
                {course.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-5 text-sm text-white/90">
                <span className="flex items-center gap-2">
                  <BookOpen size={18} />
                  {course.id === htmlCourseId ? "6 learning sections + final project" : `${course.lessons.length} lessons`}
                </span>
                <span className="flex items-center gap-2">
                  <PlayCircle size={18} />
                  {availableLessons} currently available
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  {completedCount} completed
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-black/15 p-6 backdrop-blur-sm">
              <Sparkles size={28} />
              <p className="mt-4 text-sm text-white/80">Your progress</p>
              <p className="mt-1 text-4xl font-black">{percentage}%</p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <p className="mt-3 text-sm text-white/80">
                {completedCount} of {course.lessons.length} {course.id === htmlCourseId ? "learning units" : "lessons"} completed
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">
              Course curriculum
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              {course.id === htmlCourseId ? "Six learning sections and final project" : "Your lessons"}
            </h2>
            <p className="mt-2 text-slate-400">
              {course.id === htmlCourseId ? "Continue through the milestones, then submit and revise your portfolio capstone." : "Open an available lesson to learn and practice."}
            </p>
          </div>

          <div className="space-y-4">
            {course.lessons.map((lesson, index) => {
              const isCompleted = Boolean(progress[lesson.id]?.completed);
              const lessonAvailable = isLessonAvailable(lesson);
              const isLocked = !lessonAvailable;

              return (
                <article
                  key={lesson.id}
                  className={`rounded-2xl border p-5 transition sm:p-6 ${
                    isCompleted
                      ? "border-emerald-400/30 bg-emerald-400/5"
                      : "border-white/10 bg-slate-900 hover:border-cyan-400/30"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        isCompleted
                          ? "bg-emerald-400/10 text-emerald-400"
                          : isLocked
                            ? "bg-slate-800 text-slate-500"
                            : "bg-cyan-400/10 text-cyan-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={23} />
                      ) : isLocked ? (
                        <LockKeyhole size={22} />
                      ) : (
                        <span className="text-lg font-black">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold">{lesson.title}</h3>
                        {isCompleted && (
                          <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-bold text-emerald-400">
                            Completed
                          </span>
                        )}
                        {isLocked && (
                          <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
                            {lesson.id.startsWith("html-final-project") ? "Complete all six sections first" : "Complete the previous section first"}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {lesson.description}
                      </p>

                      <p className="mt-2 text-xs text-slate-500">
                        {lesson.duration}
                      </p>
                    </div>

                    {lessonAvailable ? (
                      <Link
                        to={`/lessons/${lesson.id}`}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                      >
                        {isCompleted ? "Review Lesson" : "Start Lesson"}
                        <ArrowRight size={17} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex shrink-0 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-slate-500"
                      >
                        <LockKeyhole size={16} />
                        {lesson.id.startsWith("html-final-project") ? "Locked" : "Coming Soon"}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {course.id !== htmlCourseId && <section className="mt-10 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 sm:p-8">
          <h2 className="text-xl font-black">Ready to practice?</h2>
          <p className="mt-2 text-slate-400">
            Try your HTML and CSS ideas in the interactive playground.
          </p>
          <Link
            to="/playground"
            className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-400 hover:text-cyan-300"
          >
            Open CSS Playground <ArrowRight size={17} />
          </Link>
        </section>}
      </main>
    </div>
  );
}
