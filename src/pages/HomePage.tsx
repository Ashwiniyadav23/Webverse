
import {
  BookOpen,
  Code2,
  Trophy,
  Globe,
  ArrowRight,
} from "lucide-react";

const courses = [
  {
    level: "Classes 6–8",
    title: "Web Explorers",
    description:
      "Discover how websites work and build your first webpage.",
    topics: ["Internet", "HTML", "CSS", "JavaScript"],
    icon: Globe,
  },
  {
    level: "Classes 9–10",
    title: "Web Builders",
    description:
      "Create responsive websites and make them interactive.",
    topics: ["Frontend", "DOM", "APIs", "Deployment"],
    icon: Code2,
  },
  {
    level: "Classes 11–12",
    title: "Web Engineers",
    description:
      "Build full-stack applications and understand databases.",
    topics: ["React", "Node.js", "Databases", "Cloud"],
    icon: BookOpen,
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <header className="border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-2 text-2xl font-bold">
            <Code2 className="text-cyan-400" />
            WebVerse
          </a>

          <div className="flex items-center gap-6">
            <a
              href="#courses"
              className="hidden text-slate-300 hover:text-cyan-400 sm:block"
            >
              Courses
            </a>
            <a
              href="#features"
              className="hidden text-slate-300 hover:text-cyan-400 sm:block"
            >
              Features
            </a>
            <a
              href="#courses"
              className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Start Learning
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero section */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="mb-5 inline-block rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300">
              Learn · Build · Experiment
            </p>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Your journey into
              <span className="block text-cyan-400">
                Web Development
              </span>
              starts here.
            </h1>

            <p className="mt-6 max-w-xl leading-7 text-slate-400">
              Explore the web, write your first lines of code,
              build real projects, and grow into a web engineer.
            </p>

            <a
              href="#courses"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
            >
              Explore Courses <ArrowRight size={18} />
            </a>
          </div>

          {/* Code preview */}
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 text-sm text-slate-400">
                index.html
              </span>
            </div>

            <pre className="overflow-x-auto text-sm leading-8">
              <code>
                <span className="text-pink-400">&lt;h1&gt;</span>
                Hello, World!
                <span className="text-pink-400">&lt;/h1&gt;</span>
                {"\n"}
                <span className="text-pink-400">&lt;p&gt;</span>
                I am learning to code.
                <span className="text-pink-400">&lt;/p&gt;</span>
              </code>
            </pre>

            <div className="mt-6 rounded-xl bg-white p-5 text-slate-900">
              <h2 className="text-2xl font-bold">Hello, World!</h2>
              <p className="mt-2">I am learning to code.</p>
            </div>
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="bg-slate-900/60 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <p className="font-semibold text-cyan-400">
              YOUR LEARNING PATH
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              One course. Three levels.
            </h2>

            <p className="mt-3 text-slate-400">
              Progress from your first webpage to full-stack development.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {courses.map((course, index) => {
                const Icon = course.icon;

                return (
                  <article
                    key={course.title}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                      <Icon size={26} />
                    </div>

                    <p className="text-sm text-cyan-400">
                      {course.level}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      {course.title}
                    </h3>

                    <p className="mt-3 leading-6 text-slate-400">
                      {course.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {course.topics.map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <p className="mt-6 text-sm text-cyan-400">
                      Level {index + 1} · Coming soon
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-bold">Learn by doing</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Feature
              icon={<Code2 size={26} />}
              title="Code Playground"
              description="Write code and experiment as you learn."
            />
            <Feature
              icon={<BookOpen size={26} />}
              title="Interactive Lessons"
              description="Learn concepts through examples and practice."
            />
            <Feature
              icon={<Trophy size={26} />}
              title="Track Progress"
              description="Complete challenges and celebrate milestones."
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
        © 2026 WebVerse · Learn to build the web.
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-white/10 p-6">
      <div className="mb-4 text-cyan-400">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 leading-6 text-slate-400">{description}</p>
    </article>
  );
}

export default HomePage;
