
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  LockKeyhole,
} from 'lucide-react'

const courseData = {
  explorers: {
    level: 'Classes 6–8',
    title: 'Web Explorers',
    description:
      'Discover how the internet works and build your first webpage.',
    duration: '8 modules',
    modules: [
      {
        title: 'Introduction to the Internet',
        description: 'Understand the internet, websites, browsers and servers.',
        lessons: ['Internet vs Web', 'How websites work', 'Client and server'],
      },
      {
        title: 'HTML Fundamentals',
        description: 'Learn to structure a webpage using HTML.',
        lessons: ['HTML document structure', 'Headings and paragraphs', 'Links and images'],
      },
      {
        title: 'CSS Fundamentals',
        description: 'Style your webpage with colours, spacing and layouts.',
        lessons: ['Selectors and properties', 'Colours and typography', 'Box model'],
      },
      {
        title: 'JavaScript Basics',
        description: 'Make webpages interactive with JavaScript.',
        lessons: ['Variables', 'Conditions', 'Functions and events'],
      },
      {
        title: 'How Search Engines Work',
        description: 'Explore search engines and basic SEO.',
        lessons: ['Search engines', 'Keywords', 'Basic SEO'],
      },
      {
        title: 'AI as a Coding Partner',
        description: 'Learn how to ask AI for help and verify its suggestions.',
        lessons: ['Writing useful prompts', 'Reviewing AI code', 'Responsible AI use'],
      },
      {
        title: 'Debugging and Experimentation',
        description: 'Find errors and learn by fixing them.',
        lessons: ['Reading errors', 'Inspecting webpages', 'Fixing broken code'],
      },
      {
        title: 'Build Your First Website',
        description: 'Bring your HTML, CSS and JavaScript skills together.',
        lessons: ['Plan a webpage', 'Build the website', 'Present your project'],
      },
    ],
  },
  builders: {
    level: 'Classes 9–10',
    title: 'Web Builders',
    description:
      'Create responsive websites and understand how frontend and backend systems work.',
    duration: '8 modules',
    modules: [
      {
        title: 'Frontend and Backend',
        description: 'Understand the main parts of a web application.',
        lessons: ['Frontend basics', 'Backend basics', 'Request and response'],
      },
      {
        title: 'HTML and Semantic Structure',
        description: 'Build accessible and well-structured webpages.',
        lessons: ['Semantic HTML', 'Forms', 'Accessibility basics'],
      },
      {
        title: 'CSS Layouts',
        description: 'Create flexible layouts for different screens.',
        lessons: ['Flexbox', 'CSS Grid', 'Responsive design'],
      },
      {
        title: 'JavaScript and the DOM',
        description: 'Change webpage content through JavaScript.',
        lessons: ['DOM selection', 'Events', 'Dynamic content'],
      },
      {
        title: 'Debugging with DevTools',
        description: 'Inspect elements and troubleshoot errors.',
        lessons: ['Console', 'Elements panel', 'Network panel'],
      },
      {
        title: 'Domains and Hosting',
        description: 'Learn how websites are published online.',
        lessons: ['Domain names', 'Hosting', 'Deployment basics'],
      },
      {
        title: 'APIs and JSON',
        description: 'Understand how frontend and backend exchange data.',
        lessons: ['HTTP basics', 'API requests', 'JSON data'],
      },
      {
        title: 'Build and Deploy a Website',
        description: 'Create a responsive website and publish it.',
        lessons: ['Project planning', 'Website development', 'Deployment'],
      },
    ],
  },
  engineers: {
    level: 'Classes 11–12',
    title: 'Web Engineers',
    description:
      'Build full-stack applications and explore databases, authentication and cloud deployment.',
    duration: '8 modules',
    modules: [
      {
        title: 'Full-Stack Architecture',
        description: 'Understand how frontend, backend and databases connect.',
        lessons: ['Application architecture', 'Client-server flow', 'System design basics'],
      },
      {
        title: 'Modern JavaScript and React',
        description: 'Build reusable user interfaces with React.',
        lessons: ['ES modules', 'Components and props', 'State and effects'],
      },
      {
        title: 'Node.js and Express',
        description: 'Create backend APIs using JavaScript.',
        lessons: ['Node.js basics', 'Express routes', 'Middleware'],
      },
      {
        title: 'Databases',
        description: 'Store, retrieve and organise application data.',
        lessons: ['SQL fundamentals', 'NoSQL fundamentals', 'Data modelling'],
      },
      {
        title: 'Authentication and Security',
        description: 'Protect users and application resources.',
        lessons: ['Authentication', 'Authorisation', 'Secure coding basics'],
      },
      {
        title: 'Git and CI/CD',
        description: 'Track changes and understand automated delivery.',
        lessons: ['Git fundamentals', 'GitHub collaboration', 'CI/CD basics'],
      },
      {
        title: 'Docker and Cloud',
        description: 'Learn the basics of containers and cloud services.',
        lessons: ['Docker fundamentals', 'Cloud computing', 'Deployment workflow'],
      },
      {
        title: 'Full-Stack Capstone',
        description: 'Combine your skills to build a complete application.',
        lessons: ['Design the application', 'Build frontend and backend', 'Test and deploy'],
      },
    ],
  },
}

function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const course = courseId
    ? courseData[courseId as keyof typeof courseData]
    : undefined

  if (!course) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-white">
        <h1 className="text-3xl font-bold">Course not found</h1>
        <p className="mt-3 text-slate-400">
          Please choose one of our available courses.
        </p>
        <Link to="/" className="mt-6 text-cyan-400 hover:underline">
          Return to home
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-6 py-5">
        <div className="mx-auto max-w-5xl">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-cyan-400">
            <ArrowLeft size={18} />
            Back to home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="font-semibold text-cyan-400">{course.level}</p>
        <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
          {course.title}
        </h1>
        <p className="mt-5 max-w-2xl leading-7 text-slate-400">
          {course.description}
        </p>

        <div className="mt-6 flex items-center gap-2 text-sm text-slate-300">
          <BookOpen size={18} className="text-cyan-400" />
          {course.duration}
        </div>

        <h2 className="mt-12 text-2xl font-bold">Course modules</h2>
        <p className="mt-2 text-slate-400">
          Choose a module to explore its lessons.
        </p>

        <div className="mt-6 space-y-4">
          {course.modules.map((module, index) => (
            <article
              key={module.title}
              className="rounded-2xl border border-white/10 bg-slate-900 p-5 md:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 font-bold text-cyan-400">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold">{module.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {module.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {module.lessons.map((lesson) => (
                      <li
                        key={lesson}
                        className="flex items-center gap-2 text-sm text-slate-300"
                      >
                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-cyan-400"
                        />
                        {lesson}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={14} />
                    Lessons will be available in the next step
                  </p>
                </div>

                <LockKeyhole
                  size={18}
                  className="mt-1 shrink-0 text-slate-500"
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default CoursePage
