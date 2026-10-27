
import { useState } from 'react'
import HomePage from './pages/HomePage'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
import DashboardPage from './pages/DashboardPage'
import PlaygroundPage from "./pages/PlaygroundPage";
import JavaScriptPlayground from "./pages/JavaScriptPlayground";
import RoleRoute from "./pages/RoleRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyCourses from "./pages/MyCourses";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCourseForm from "./pages/admin/AdminCourseForm";
import AdminCourseLessons from "./pages/admin/AdminCourseLessons";
import AdminLessonForm from "./pages/admin/AdminLessonForm";
import AdminStudents from "./pages/admin/AdminStudents";
import CssPhaseTwoCoursePage from "./pages/CssPhaseTwoCoursePage";
import CssPhaseTwoLessonPage from "./pages/CssPhaseTwoLessonPage";
import CombinedPortfolioAssessmentPage from "./pages/CombinedPortfolioAssessmentPage";

import {
  BookOpen,
  Code2,
  Trophy,
  Menu,
  X,
  Globe,
} from 'lucide-react'
import {
  Routes,
  Route,
  Link,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'
import { getAuth } from "./utils/auth";

const courses = [
  {
    level: 'Classes 6–8',
    title: 'Web Explorers',
    description: 'Discover how websites work and build your first webpage.',
    topics: 'Internet · HTML · CSS · JavaScript',
    icon: Globe,
  },
  {
    level: 'Classes 9–10',
    title: 'Web Builders',
    description: 'Create responsive websites and make them interactive.',
    topics: 'Frontend · DOM · APIs · Deployment',
    icon: Code2,
  },
  {
    level: 'Classes 11–12',
    title: 'Web Engineers',
    description: 'Build full-stack applications and understand databases.',
    topics: 'React · Node.js · Databases · Cloud',
    icon: BookOpen,
  },
]

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<WebVerseLanding />} />
      <Route element={<StudentAccessRoute />}>
        <Route path="/final-assessment/portfolio" element={<CombinedPortfolioAssessmentPage />} />
        <Route path="/courses/css-phase-two" element={<CssPhaseTwoCoursePage />} />
        <Route path="/css-lessons/:lessonId" element={<CssPhaseTwoLessonPage />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/lessons/:lessonId" element={<LessonPage />} />
      </Route>
      <Route path="/dashboard" element={<RoleRoute allowedRole="student" />}>
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path="/playground" element={<PlaygroundPage />} />
      <Route path="/js-playground" element={<JavaScriptPlayground />} />
      <Route path="/javascript-playground" element={<JavaScriptPlayground />} />
      <Route path="/admin" element={<RoleRoute allowedRole={["super_admin", "school_admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/new" element={<AdminCourseForm />} />
          <Route path="courses/:courseId/edit" element={<AdminCourseForm />} />
          <Route path="courses/:courseId/lessons" element={<AdminCourseLessons />} />
          <Route path="courses/:courseId/lessons/new" element={<AdminLessonForm />} />
          <Route path="courses/:courseId/lessons/:lessonId/edit" element={<AdminLessonForm />} />
          <Route path="students" element={<AdminStudents />} />
        </Route>
      </Route>
      <Route path="/school-admin" element={<RoleRoute allowedRole="school_admin" />}>
        <Route index element={<RoleDashboardPage role="school_admin" />} />
      </Route>
      <Route path="/super-admin" element={<RoleRoute allowedRole="super_admin" />}>
        <Route index element={<RoleDashboardPage role="super_admin" />} />
      </Route>
      <Route path="/teacher" element={<RoleRoute allowedRole="teacher" />}>
        <Route index element={<RoleDashboardPage role="teacher" />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/my-courses" element={<RoleRoute allowedRole="student" />}>
        <Route index element={<MyCourses />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

function RoleDashboardPage({ role }: { role: "teacher" | "school_admin" | "super_admin" }) {
  const labels = {
    teacher: ["Teacher Dashboard", "Manage assigned classes, lessons, assessments, and student progress."],
    school_admin: ["School Admin Dashboard", "Manage teachers, students, classes, and curriculum for your school."],
    super_admin: ["Super Admin Dashboard", "Manage users, roles, curriculum, classes, and platform settings."],
  } as const;
  const [title, description] = labels[role];

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-3 max-w-2xl text-slate-300">{description}</p>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {["Users and permissions", "Curriculum and classes", "Progress and submissions"].map((item) => (
          <article key={item} className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <h2 className="font-semibold">{item}</h2>
            <p className="mt-2 text-sm text-slate-400">Available according to your role permissions.</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function StudentAccessRoute() {
  const location = useLocation();
  const auth = getAuth();

  if (!auth?.token || !auth.user) {
    return (
      <Navigate
        to="/register"
        replace
        state={{
          from: `${location.pathname}${location.search}`,
          message: "Create a student account before starting a course.",
        }}
      />
    );
  }

  return <Outlet />;
}

function WebVerseLanding() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/home" className="flex items-center gap-2 text-2xl font-bold">
            <Code2 className="text-cyan-400" />
            WebVerse
          </Link>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <div
            className={`${
              menuOpen ? 'flex' : 'hidden'
            } absolute left-0 top-16 z-10 w-full flex-col gap-5
            border-b border-white/10 bg-slate-950 p-6
            md:static md:flex md:w-auto md:flex-row md:border-0 md:p-0`}
          >
            <a
              href="#courses"
              onClick={() => setMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400"
            >
              Courses
            </a>

            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400"
            >
              Features
            </a>

            <a
              href="#courses"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-cyan-400 px-4 py-2 text-center font-semibold text-slate-950"
            >
              Start Learning
            </a>
          </div>
        </nav>
      </header>

      <main>
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
              className="mt-8 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
            >
              Explore Courses →
            </a>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 text-sm text-slate-400">
                your-first-page.html
              </span>
            </div>

            <pre className="overflow-x-auto text-sm leading-8">
              <code>
                <span className="text-pink-400">&lt;h1&gt;</span>
                {'Hello, World!'}
                <span className="text-pink-400">&lt;/h1&gt;{'\n'}</span>
                <span className="text-pink-400">&lt;p&gt;</span>
                {'I am learning to code.'}
                <span className="text-pink-400">&lt;/p&gt;{'\n'}</span>
                <span className="text-green-400">
                  {'<!-- Your journey starts now! -->'}
                </span>
              </code>
            </pre>

            <div className="mt-6 rounded-xl bg-white p-5 text-slate-900">
              <h2 className="text-2xl font-bold">Hello, World!</h2>
              <p className="mt-2">I am learning to code.</p>
            </div>
          </div>
        </section>

        <section id="courses" className="bg-slate-900/60 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <p className="font-semibold text-cyan-400">
                YOUR LEARNING PATH
              </p>

              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                One course. Three levels.
              </h2>

              <p className="mt-3 text-slate-400">
                Progress from your first webpage to full-stack development.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {courses.map((course, index) => {
                const Icon = course.icon

                return (
                  <article
                    key={course.title}
                    className="rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-400/50"
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

                    <p className="mt-3 min-h-14 leading-6 text-slate-400">
                      {course.description}
                    </p>

                    <p className="mt-5 text-sm text-slate-300">
                      {course.topics}
                    </p>

                    <a
                      href="#features"
                      className="mt-6 inline-block font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      Explore level {index + 1} →
                    </a>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-bold">Learn by doing</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Feature
              icon={<Code2 />}
              title="Code Playground"
              description="Write code and experiment as you learn."
            />

            <Feature
              icon={<BookOpen />}
              title="Interactive Lessons"
              description="Learn concepts through examples and practice."
            />

            <Feature
              icon={<Trophy />}
              title="Track Progress"
              description="Work through challenges and celebrate milestones."
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
        © 2026 WebVerse · Learn to build the web.
      </footer>
    </div>
  )
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <article className="rounded-2xl border border-white/10 p-6">
      <div className="mb-4 text-cyan-400">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 leading-6 text-slate-400">{description}</p>
    </article>
  )
}

export default App
