import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Eye,
  Lightbulb,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { getProgress, saveLessonProgress } from "../utils/progress";

type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

type Lesson = {
  id: string;
  title: string;
  description: string;
  theory: string[];
  starterCode: string;
  expectedText: string;
  hint: string;
  questions: Question[];
};

const lessons: Lesson[] = [
  {
    id: "html-intro",
    title: "Introduction to HTML",
    description: "Learn how to create the structure of a webpage.",
    theory: [
      "HTML stands for HyperText Markup Language. It defines the structure and content of a webpage.",
      "HTML elements use tags. Most elements have an opening tag, content, and a closing tag.",
      "The <h1> element creates a main heading, while the <p> element creates a paragraph.",
    ],
    starterCode: `<h1>Hello, WebVerse!</h1>
<p>I am learning HTML.</p>`,
    expectedText: "Hello, WebVerse!",
    hint: "Use an <h1> tag for your main heading.",
    questions: [
      {
        question: "What does HTML stand for?",
        options: [
          "HyperText Markup Language",
          "HighText Machine Language",
          "HyperTool Modern Language",
          "Home Text Markup Language",
        ],
        answer: 0,
        explanation:
          "HTML stands for HyperText Markup Language and structures webpage content.",
      },
      {
        question: "Which tag creates the largest standard heading?",
        options: ["<head>", "<h1>", "<p>", "<title>"],
        answer: 1,
        explanation: "The <h1> element represents the highest-level heading.",
      },
      {
        question: "Which tag creates a paragraph?",
        options: ["<text>", "<para>", "<p>", "<h2>"],
        answer: 2,
        explanation: "The <p> element represents a paragraph.",
      },
    ],
  },
  {
    id: "html-paragraphs",
    title: "Headings and Paragraphs",
    description: "Organize content using headings and paragraphs.",
    theory: [
      "Headings help organize information into a clear hierarchy.",
      "HTML provides six heading levels, from <h1> to <h6>.",
      "Use <p> elements to write paragraphs beneath your headings.",
    ],
    starterCode: `<h1>My Learning Journey</h1>
<h2>What I Am Learning</h2>
<p>I am learning to build websites.</p>
<p>HTML is my first step.</p>`,
    expectedText: "My Learning Journey",
    hint: "Start with <h1>, add a smaller <h2>, and place your paragraphs inside <p> tags.",
    questions: [
      {
        question: "How many HTML heading levels are available?",
        options: ["3", "4", "6", "8"],
        answer: 2,
        explanation: "HTML provides six heading levels, from <h1> to <h6>.",
      },
      {
        question: "Which element is used for a paragraph?",
        options: ["<h1>", "<p>", "<br>", "<section-title>"],
        answer: 1,
        explanation: "The <p> element is used for paragraph content.",
      },
      {
        question: "Which heading is the highest-level heading?",
        options: ["<h6>", "<h3>", "<h2>", "<h1>"],
        answer: 3,
        explanation: "<h1> is the highest-level heading in the HTML hierarchy.",
      },
    ],
  },
];

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = lessons.find((item) => item.id === lessonId);

  const [code, setCode] = useState(lesson?.starterCode ?? "");
  const [showHint, setShowHint] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!lesson) return;

    const saved = getProgress()[lesson.id];
    setCode(lesson.starterCode);
    setShowHint(false);
    setAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setCompleted(Boolean(saved?.completed));
  }, [lesson?.id]);

  if (!lesson) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-cyan-400" />
          <h1 className="text-3xl font-black">Lesson not found</h1>
          <p className="mt-3 text-slate-400">
            This lesson is not available yet.
          </p>
          <Link
            to="/courses/explorers"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
          >
            <ArrowLeft size={18} /> Back to Course
          </Link>
        </div>
      </main>
    );
  }

  const correctAnswers = lesson.questions.filter(
    (question, index) => answers[index] === question.answer
  ).length;

  const allQuestionsAnswered =
    Object.keys(answers).length === lesson.questions.length;

  function submitQuiz() {
    if (!lesson || !allQuestionsAnswered) return;

    const score = Math.round(
      (correctAnswers / lesson.questions.length) * 100
    );

    setQuizScore(score);
    setQuizSubmitted(true);
    saveLessonProgress(lesson.id, {
      completed: score >= 60,
      quizScore: score,
    });

    setCompleted(score >= 60);
  }

  function resetQuiz() {
    setAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  }

  function markComplete() {
    if (!lesson) return;

    saveLessonProgress(lesson.id, {
      completed: true,
      quizScore: quizScore ?? 0,
    });
    setCompleted(true);
  }

  const previewDocument = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body { font-family: Arial, sans-serif; padding: 24px; color: #1e293b; }
h1 { color: #0891b2; }
h2 { color: #475569; }
</style>
</head>
<body>${code}</body>
</html>`;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <Link to="/" className="flex items-center gap-2">
            <Code2 className="text-cyan-400" size={26} />
            <span className="text-xl font-black">
              Web<span className="text-cyan-400">Verse</span>
            </span>
          </Link>

          <Link
            to="/courses/explorers"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-400"
          >
            <ArrowLeft size={16} /> Back to Course
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">
            HTML Fundamentals
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-3 text-slate-400">{lesson.description}</p>

          {completed && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-400">
              <CheckCircle2 size={17} /> Lesson completed
            </div>
          )}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="space-y-6">
            <article className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="text-cyan-400" size={23} />
                <h2 className="text-xl font-black">Learn the concept</h2>
              </div>

              <div className="mt-5 space-y-4">
                {lesson.theory.map((paragraph, index) => (
                  <p
                    key={index}
                    className="leading-7 text-slate-300"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <div className="flex items-center gap-3">
                <Trophy className="text-yellow-400" size={23} />
                <h2 className="text-xl font-black">Quick quiz</h2>
              </div>

              <p className="mt-2 text-sm text-slate-400">
                Answer all {lesson.questions.length} questions. Score at least
                60% to pass.
              </p>

              <div className="mt-6 space-y-6">
                {lesson.questions.map((question, index) => (
                  <fieldset
                    key={index}
                    className="border-b border-white/10 pb-5 last:border-0"
                  >
                    <legend className="mb-3 font-bold">
                      {index + 1}. {question.question}
                    </legend>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const selected = answers[index] === optionIndex;
                        const isCorrect = question.answer === optionIndex;

                        let optionStyle =
                          "border-white/10 bg-slate-950 hover:border-cyan-400/40";

                        if (selected) {
                          optionStyle =
                            "border-cyan-400 bg-cyan-400/10 text-cyan-300";
                        }

                        if (quizSubmitted && isCorrect) {
                          optionStyle =
                            "border-emerald-400 bg-emerald-400/10 text-emerald-300";
                        } else if (quizSubmitted && selected && !isCorrect) {
                          optionStyle =
                            "border-red-400 bg-red-400/10 text-red-300";
                        }

                        return (
                          <label
                            key={optionIndex}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${optionStyle} ${
                              quizSubmitted
                                ? "cursor-default"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${index}`}
                              checked={selected}
                              disabled={quizSubmitted}
                              onChange={() =>
                                setAnswers((previous) => ({
                                  ...previous,
                                  [index]: optionIndex,
                                }))
                              }
                              className="accent-cyan-400"
                            />
                            {option}
                          </label>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {question.explanation}
                      </p>
                    )}
                  </fieldset>
                ))}
              </div>

              {quizSubmitted && quizScore !== null && (
                <div className="mt-5 rounded-xl bg-slate-950 p-4">
                  <p className="text-2xl font-black text-cyan-400">
                    Score: {quizScore}%
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {quizScore >= 60
                      ? "Great work! You passed this quiz."
                      : "Keep practicing and try again."}
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                {!quizSubmitted ? (
                  <button
                    onClick={submitQuiz}
                    disabled={!allQuestionsAnswered}
                    className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={resetQuiz}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 font-bold hover:border-cyan-400/50"
                  >
                    <RotateCcw size={17} /> Try Again
                  </button>
                )}
              </div>
            </article>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
              <div className="flex items-center gap-3">
                <Code2 className="text-cyan-400" size={23} />
                <h2 className="text-xl font-black">Code playground</h2>
              </div>

              <button
                onClick={() => setCode(lesson.starterCode)}
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
              >
                <RotateCcw size={15} /> Reset code
              </button>
            </div>

            <div className="p-5">
              <label
                htmlFor="lesson-code"
                className="mb-3 block text-sm font-bold text-slate-300"
              >
                Write your HTML
              </label>

              <textarea
                id="lesson-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                spellCheck={false}
                className="min-h-64 w-full resize-y rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-sm leading-6 text-cyan-100 outline-none focus:border-cyan-400"
              />

              <div className="mt-6 flex items-center gap-2">
                <Eye size={19} className="text-cyan-400" />
                <h3 className="font-bold">Live preview</h3>
              </div>

              <iframe
                title={`${lesson.title} preview`}
                srcDoc={previewDocument}
                sandbox=""
                className="mt-3 h-72 w-full rounded-xl border border-white/10 bg-white"
              />

              <div className="mt-5 rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-4">
                <button
                  onClick={() => setShowHint((visible) => !visible)}
                  className="flex items-center gap-2 font-bold text-yellow-300"
                >
                  <Lightbulb size={19} />
                  {showHint ? "Hide hint" : "Need a hint?"}
                </button>

                {showHint && (
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {lesson.hint}
                  </p>
                )}
              </div>

              <div className="mt-5 rounded-xl bg-slate-950 p-4">
                <p className="text-sm font-bold">Your coding task</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Edit the HTML and add your own content. Try changing the
                  heading and adding a paragraph before marking the lesson
                  complete.
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Example heading to find in the preview: {lesson.expectedText}
                </p>
              </div>

              <button
                onClick={markComplete}
                disabled={completed}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={18} />
                {completed ? "Lesson Completed" : "Mark Lesson Complete"}
              </button>

              <Link
                to="/dashboard"
                className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300"
              >
                View Dashboard <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
