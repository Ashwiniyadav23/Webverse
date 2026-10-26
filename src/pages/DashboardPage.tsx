
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  Code2,
  ArrowRight,
  Trophy,
  GraduationCap,
  Flame,
  Target,
  Clock,
  PlayCircle,
  LockKeyhole,
} from "lucide-react";
import { getProgress, type LessonProgress } from "../utils/progress";
import { clearAuth } from "../utils/auth";

const courses = [
  {
    id: "explorers",
    title: "Web Explorers",
    classes: "Classes 6–8",
    description: "Start your journey with HTML and web basics.",
    lessons: ["html-intro", "html-paragraphs"],
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "builders",
    title: "Web Builders",
    classes: "Classes 9–10",
    description: "Build beautiful websites with HTML and CSS.",
    lessons: ["css-intro", "css-colors", "css-layout"],
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "engineers",
    title: "Web Engineers",
    classes: "Classes 11–12",
    description: "Explore JavaScript and interactive websites.",
    lessons: ["js-intro", "js-variables", "js-functions"],
    gradient: "from-orange-500 to-pink-600",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const progress = getProgress();

  const completedLessons = Object.values(progress).filter(
    (item: LessonProgress) => item?.completed
  ).length;

  const quizScores = Object.values(progress)
    .map((item: LessonProgress) => item?.quizScore)
    .filter((score): score is number => typeof score === "number");

  const averageScore = quizScores.length
    ? Math.round(
        quizScores.reduce((total: number, score: number) => total + score, 0) /
          quizScores.length
      )
    : 0;

  const totalLessons = courses.reduce(
    (total, course) => total + course.lessons.length,
    0
  );

  const overallProgress = Math.min(
    100,
    Math.round((completedLessons / totalLessons) * 100)
  );

  const lastCourse = courses.find((course) =>
    course.lessons.some((lesson) => progress[lesson]?.completed !== undefined)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-400 p-2 text-slate-950">
              <Code2 size={24} />
            </div>
            <span className="text-2xl font-black">
              Web<span className="text-cyan-400">Verse</span>
            </span>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-slate-300 hover:text-cyan-400">
              Home
            </Link>
            <Link to="/my-courses" className="text-slate-300 hover:text-cyan-400">
              My Courses
            </Link>
            <Link
              to="/playground"
              className="hidden text-slate-300 hover:text-cyan-400 sm:block"
            >
              Playground
            </Link>
            <Link
              to="/courses/explorers"
              className="rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-950 hover:bg-cyan-300"
            >
              Learn Now
            </Link>
            <button
              type="button"
              onClick={() => {
                clearAuth();
                navigate("/login", { replace: true });
              }}
              className="text-slate-300 hover:text-cyan-400"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10">
        <section className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-purple-500/15 p-7 sm:p-10">
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_0.6fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300">
                <GraduationCap size={16} />
                Your learning space
              </div>

              <h1 className="text-3xl font-black leading-tight sm:text-5xl">
                Keep learning.
                <br />
                <span className="text-cyan-400">Keep building.</span>
              </h1>

              <p className="mt-4 max-w-xl leading-7 text-slate-300">
                Track your progress, practice coding, and turn your ideas into
                real projects. Every lesson brings you one step closer.
              </p>

              <Link
                to="/courses/explorers"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                <PlayCircle size={19} />
                Continue Learning
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mx-auto flex h-48 w-48 flex-col items-center justify-center rounded-full border-8 border-cyan-400/20 bg-slate-950/70 sm:h-56 sm:w-56">
              <span className="text-5xl font-black text-cyan-400">
                {overallProgress}%
              </span>
              <span className="mt-2 text-sm text-slate-400">
                Overall progress
              </span>
              <div className="mt-4 h-2 w-28 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<BookOpen />}
            label="Lessons completed"
            value={completedLessons}
            detail={`Out of ${totalLessons} listed lessons`}
            color="text-cyan-400"
          />
          <StatCard
            icon={<Trophy />}
            label="Average quiz score"
            value={`${averageScore}%`}
            detail={`${quizScores.length} quiz scores recorded`}
            color="text-yellow-400"
          />
          <StatCard
            icon={<Target />}
            label="Learning progress"
            value={`${overallProgress}%`}
            detail="Across listed lessons"
            color="text-emerald-400"
          />
          <StatCard
            icon={<Flame />}
            label="Keep your momentum"
            value="Daily"
            detail="Practice a little every day"
            color="text-orange-400"
          />
        </section>

        <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">
                Your roadmap
              </p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                My Learning Paths
              </h2>
              <p className="mt-2 text-slate-400">
                Choose a path and continue building your skills.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300"
            >
              Explore courses <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {courses.map((course) => {
              const completed = course.lessons.filter(
                (lesson) => progress[lesson]?.completed
              ).length;

              const percent = Math.round(
                (completed / course.lessons.length) * 100
              );

              return (
                <article
                  key={course.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition hover:-translate-y-1 hover:border-cyan-400/40"
                >
                  <div
                    className={`bg-gradient-to-r ${course.gradient} p-6`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-bold">
                        {course.classes}
                      </span>
                      <BookOpen size={26} />
                    </div>
                    <h3 className="mt-6 text-2xl font-black">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/85">
                      {course.description}
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-slate-400">Course progress</span>
                      <span className="font-bold text-cyan-400">
                        {percent}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-cyan-400 transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        {completed}/{course.lessons.length} lessons
                      </span>
                      <Clock size={16} />
                    </div>

                    <Link
                      to={`/courses/${course.id}`}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                    >
                      Open Course <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
              <Code2 size={25} />
            </div>
            <h3 className="mt-5 text-xl font-black">Practice coding</h3>
            <p className="mt-2 leading-7 text-slate-400">
              Experiment with HTML and CSS, preview your work, and learn by
              building.
            </p>
            <Link
              to="/playground"
              className="mt-5 inline-flex items-center gap-2 font-bold text-purple-400 hover:text-purple-300"
            >
              Open CSS Playground <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
              <LockKeyhole size={25} />
            </div>
            <h3 className="mt-5 text-xl font-black">Your learning data</h3>
            <p className="mt-2 leading-7 text-slate-400">
              Progress is currently saved in this browser. It is not synced
              between devices or accounts.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Sign-in and cloud sync can be added in a future version.
            </p>
          </div>
        </section>

        {lastCourse && (
          <p className="mt-6 text-sm text-slate-500">
            You have recorded progress in:{" "}
            <span className="font-semibold text-slate-300">
              {lastCourse.title}
            </span>
          </p>
        )}
      </main>

      <footer className="mt-16 border-t border-white/10 px-5 py-7 text-center text-sm text-slate-500">
        Keep exploring. Keep creating. Keep growing.{" "}
        <span className="text-cyan-400">© WebVerse</span>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  detail: string;
  color: string;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      <div className={`mb-4 ${color}`}>{icon}</div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </article>
  );
}
