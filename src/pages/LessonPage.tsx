
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen, CheckCircle, Code2 } from 'lucide-react'

const lessons = {
  'html-intro': {
    title: 'Introduction to HTML',
    subject: 'HTML',
    explanation:
      'HTML stands for HyperText Markup Language. It provides the structure of a webpage using elements called tags.',
    example: '<h1>Hello, WebVerse!</h1>\n<p>My first webpage.</p>',
    question: 'Which HTML tag is used for the largest heading?',
    options: ['<p>', '<h1>', '<head>', '<img>'],
    answer: '<h1>',
  },
  'html-paragraphs': {
    title: 'HTML Headings and Paragraphs',
    subject: 'HTML',
    explanation:
      'Use heading tags from h1 to h6 for headings. Use the p tag to write paragraphs of text.',
    example: '<h1>My Website</h1>\n<p>Welcome to my website!</p>',
    question: 'Which tag creates a paragraph?',
    options: ['<h1>', '<div>', '<p>', '<title>'],
    answer: '<p>',
  },
}

export default function LessonPage() {
  const { lessonId } = useParams()
  const lesson = lessons[lessonId as keyof typeof lessons]

  const [selected, setSelected] = useState('')
  const [checked, setChecked] = useState(false)
  const [code, setCode] = useState(lesson?.example ?? '')

  if (!lesson) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <Link to="/" className="mt-4 inline-block text-cyan-400">
          Back to Home
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Home
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <BookOpen className="text-cyan-400" size={32} />
          <div>
            <p className="text-sm text-cyan-400">{lesson.subject}</p>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-3 text-xl font-semibold">Learn the concept</h2>
          <p className="leading-7 text-slate-300">{lesson.explanation}</p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Code2 className="text-cyan-400" />
            Practice your code
          </h2>

          <label className="mb-2 block text-sm text-slate-400">
            Edit the HTML code
          </label>

          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            rows={5}
            spellCheck={false}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-green-300 outline-none focus:border-cyan-400"
          />

          <h3 className="mb-3 mt-5 font-semibold">Preview</h3>
          <iframe
            title="HTML preview"
            sandbox=""
            srcDoc={code}
            className="h-48 w-full rounded-xl bg-white"
          />
        </section>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Quick quiz</h2>
          <p className="mb-4 text-slate-300">{lesson.question}</p>

          <div className="space-y-3">
            {lesson.options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 p-3 hover:border-cyan-400"
              >
                <input
                  type="radio"
                  name="quiz"
                  value={option}
                  checked={selected === option}
                  onChange={() => {
                    setSelected(option)
                    setChecked(false)
                  }}
                />
                {option}
              </label>
            ))}
          </div>

          <button
            onClick={() => setChecked(true)}
            disabled={!selected}
            className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check Answer
          </button>

          {checked && (
            <p className="mt-4 flex items-center gap-2">
              {selected === lesson.answer ? (
                <>
                  <CheckCircle className="text-green-400" />
                  Correct! Great work.
                </>
              ) : (
                <span className="text-red-400">
                  Not quite. Try again!
                </span>
              )}
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
