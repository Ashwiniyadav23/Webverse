
import {
  BookOpen,
  Code2,
  Trophy,
  Globe,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  GraduationCap,
  Play,
  Palette,
  Terminal,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "../utils/auth";

const courses = [
  {
    id: "explorers",
    level: "Classes 6–8",
    title: "Web Explorers",
    description:
      "Discover how websites work and build your first webpage.",
    topics: ["Internet", "HTML", "CSS", "JavaScript"],
    icon: Globe,
    gradient: "from-cyan-400/15 to-blue-500/5",
  },
  {
    id: "builders",
    level: "Classes 9–10",
    title: "Web Builders",
    description:
      "Create responsive websites and make them interactive.",
    topics: ["Frontend", "DOM", "APIs", "Deployment"],
    icon: Code2,
    gradient: "from-purple-400/15 to-pink-500/5",
  },
  {
    id: "engineers",
    level: "Classes 11–12",
    title: "Web Engineers",
    description:
      "Build full-stack applications and understand databases.",
    topics: ["React", "Node.js", "Databases", "Cloud"],
    icon: BookOpen,
    gradient: "from-emerald-400/15 to-cyan-500/5",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const auth = getAuth();

  function logout() {
    clearAuth();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-2xl font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <Code2 size={25} className="text-cyan-400" />
            </div>
            <span>
              Web<span className="text-cyan-400">Verse</span>
            </span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href="#courses"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              Courses
            </a>
            <a
              href="#features"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              Features
            </a>
            <Link
              to="/playground"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              CSS Playground
            </Link>
            <Link
              to="/javascript-playground"
              className="text-sm text-slate-300 transition hover:text-cyan-400"
            >
              JavaScript
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-cyan-400"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {!auth ? (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-cyan-400"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl border border-cyan-400/50 px-3 py-2.5 text-sm font-bold text-cyan-300 hover:bg-cyan-400/10"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={logout}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-cyan-400"
              >
                Sign out
              </button>
            )}
            <Link
              to="/courses/explorers"
              className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Start Learning
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative">
          <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
                <Sparkles size={16} />
                Learn · Build · Experiment
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Your journey into
                <span className="mt-2 block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Web Development
                </span>
                starts here.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 md:text-lg">
                Explore the web, write your first lines of code, build real
                projects, and grow into a web engineer — one lesson at a time.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/courses/explorers"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  <Play size={18} />
                  Start Learning
                </Link>

                <Link
                  to="/playground"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:border-cyan-400/50 hover:bg-white/5"
                >
                  Try Playground
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-cyan-400" />
                  Interactive lessons
                </div>
                <div className="flex items-center gap-2">
                  <Code2 size={18} className="text-cyan-400" />
                  Hands-on coding
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={18} className="text-cyan-400" />
                  Track progress
                </div>
              </div>
            </div>

            {/* Code Preview */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-950/20 sm:p-7">
              <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-4">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-sm text-slate-400">
                  index.html
                </span>
                <span className="ml-auto rounded-md bg-cyan-400/10 px-2 py-1 text-xs text-cyan-300">
                  HTML
                </span>
              </div>

              <pre className="overflow-x-auto text-sm leading-8 sm:text-base">
                <code>
                  <span className="text-pink-400">&lt;h1&gt;</span>
                  <span className="text-white">Hello, World!</span>
                  <span className="text-pink-400">&lt;/h1&gt;</span>
                  {"\n"}
                  <span className="text-pink-400">&lt;p&gt;</span>
                  <span className="text-white">I am learning to code.</span>
                  <span className="text-pink-400">&lt;/p&gt;</span>
                  {"\n"}
                  <span className="text-pink-400">&lt;button&gt;</span>
                  <span className="text-white">Explore</span>
                  <span className="text-pink-400">&lt;/button&gt;</span>
                </code>
              </pre>

              <div className="mt-6 rounded-2xl bg-white p-6 text-slate-900">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  <Globe size={15} />
                  Example preview
                </div>
                <h2 className="text-2xl font-extrabold">Hello, World!</h2>
                <p className="mt-2 text-slate-600">
                  I am learning to code.
                </p>
                <Link
                  to="/playground"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 font-semibold text-white transition hover:bg-cyan-700"
                >
                  Try it yourself
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Courses */}
        <section
          id="courses"
          className="scroll-mt-24 border-y border-white/5 bg-slate-900/50 px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <p className="font-semibold tracking-widest text-cyan-400">
              YOUR LEARNING PATH
            </p>

            <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-bold md:text-4xl">
                  One platform. Three levels.
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                  Start with the basics, practice your skills, and progress
                  toward building full-stack applications.
                </p>
              </div>
              <GraduationCap
                size={52}
                className="hidden text-cyan-400/70 md:block"
              />
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {courses.map((course, index) => {
                const Icon = course.icon;

                return (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className={`group rounded-2xl border border-white/10 bg-gradient-to-br ${course.gradient} p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50`}
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950/70 text-cyan-400 transition group-hover:scale-110">
                      <Icon size={26} />
                    </div>

                    <p className="text-sm font-medium text-cyan-300">
                      {course.level}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">
                      {course.title}
                    </h3>
                    <p className="mt-3 min-h-12 leading-6 text-slate-300/80">
                      {course.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {course.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-xs text-slate-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                      <span className="text-sm font-semibold text-cyan-300">
                        Explore Level {index + 1}
                      </span>
                      <ArrowRight
                        size={18}
                        className="text-cyan-300 transition group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 md:py-24"
        >
          <div className="text-center">
            <p className="font-semibold tracking-widest text-cyan-400">
              LEARN BY DOING
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              More than just watching tutorials
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
              Learn concepts, practice in your browser, and monitor your
              progress as you develop your skills.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Feature
              icon={<Code2 size={26} />}
              title="Interactive Lessons"
              description="Learn concepts through guided explanations, examples, quizzes, and practice."
              link="/courses/explorers"
              linkText="Explore Lessons"
            />

            <Feature
              icon={<Palette size={26} />}
              title="CSS Playground"
              description="Experiment with HTML and CSS and see your changes in a live preview."
              link="/playground"
              linkText="Open CSS Playground"
            />

            <Feature
              icon={<Terminal size={26} />}
              title="JavaScript Playground"
              description="Write JavaScript, run code, inspect output, and practice programming challenges."
              link="/javascript-playground"
              linkText="Practice JavaScript"
            />

            <Feature
              icon={<Trophy size={26} />}
              title="Student Dashboard"
              description="Review completed lessons, quiz scores, and your learning progress."
              link="/dashboard"
              linkText="View Dashboard"
            />
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-7xl rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 via-slate-900 to-blue-500/10 px-6 py-12 text-center sm:px-12 md:py-16">
            <Sparkles className="mx-auto text-cyan-400" size={32} />
            <h2 className="mt-5 text-3xl font-bold md:text-4xl">
              Ready to build something amazing?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
              Every expert started as a beginner. Take your first step into
              web development today.
            </p>
            <Link
              to="/courses/explorers"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Start Your Journey
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-sm text-slate-400 sm:flex-row sm:text-left">
          <Link to="/" className="flex items-center gap-2 font-bold text-white">
            <Code2 size={20} className="text-cyan-400" />
            WebVerse
          </Link>

          <p>© 2026 WebVerse · Learn to build the web.</p>

          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/playground" className="transition hover:text-cyan-400">
              CSS Playground
            </Link>
            <Link
              to="/javascript-playground"
              className="transition hover:text-cyan-400"
            >
              JavaScript
            </Link>
            <Link to="/dashboard" className="transition hover:text-cyan-400">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
  link,
  linkText,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
}) {
  return (
    <article className="group rounded-2xl border border-white/10 bg-slate-900/40 p-6 transition hover:-translate-y-1 hover:border-cyan-400/40">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
        {icon}
      </div>

      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 leading-7 text-slate-400">{description}</p>

      <Link
        to={link}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
      >
        {linkText}
        <ArrowRight size={16} className="transition group-hover:translate-x-1" />
      </Link>
    </article>
  );
}

export default HomePage;
