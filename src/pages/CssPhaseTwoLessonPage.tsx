import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Eye, Play, RotateCcw } from "lucide-react";
import { apiUrl } from "../utils/api";
import { clearAuth, getAuth } from "../utils/auth";

type Topic = { tag: string; what: string; why: string; how: string; example: string; output: string; mistakes?: string[] };
type Task = { title: string; instructions: string; starterCode: string; validation: { requiredText?: string[] } };
type Question = { type: string; prompt: string; options: string[]; answerIndex: number; explanation: string; snippet?: string };
type Assessment = { title: string; prompt: string; starterCode: string; validation: { requiredText?: string[] }; testCases: string[]; criteria: string[] };
type Lesson = { _id: string; title: string; description: string; order: number; module: string; curriculum?: { language?: string; topics: Topic[]; tasks: Task[]; quiz: Question[]; assessment: Assessment } };
type Result = { passed: boolean; score: number; feedback: string[] };
const pageNames = ["Home", "Profile", "Courses", "Feedback", "Grades", "Contact"];
const htmlPages = [
  `<header class="site-header"><h1>Student Portal</h1><nav><ul><li><a href="#home">Home</a></li><li><a href="#profile">Profile</a></li><li><a href="#courses">Courses</a></li><li><a href="#feedback">Feedback</a></li><li><a href="#grades">Grades</a></li><li><a href="#contact">Contact</a></li></ul></nav></header><main id="home"><h2>Welcome to your learning hub</h2><p>Explore your profile, courses, feedback, grades, and contact information.</p></main><footer>Student Portal · 2026</footer>`,
  `<header class="site-header"><h1>My Profile</h1></header><nav><ul><li><a href="#home">Home</a></li><li><a href="#profile">Profile</a></li></ul></nav><main id="profile"><article class="profile-card"><div class="profile-photo" role="img" aria-label="Profile portrait"></div><h2>About Me</h2><p>I am learning to build useful websites and enjoy reading and gardening.</p><h3>Hobbies</h3><ul><li>Reading</li><li>Gardening</li></ul></article></main><footer>Student Portal</footer>`,
  `<header class="site-header"><h1>My Courses</h1></header><nav><ul><li><a href="#home">Home</a></li><li><a href="#courses">Courses</a></li></ul></nav><main id="courses"><section class="course-grid"><article class="course-card"><h2>Web Foundations</h2><p>Learn how the web is structured.</p><a href="#">View course</a></article><article class="course-card"><h2>Creative Coding</h2><p>Practice problem solving through projects.</p><a href="#">View course</a></article><article class="course-card"><h2>Digital Design</h2><p>Build clear, useful interfaces.</p><a href="#">View course</a></article></section></main><footer>Student Portal</footer>`,
  `<header class="site-header"><h1>Send Feedback</h1></header><nav><ul><li><a href="#home">Home</a></li><li><a href="#feedback">Feedback</a></li></ul></nav><main id="feedback"><form class="feedback-form"><label for="name">Name</label><input id="name" type="text"><label for="email">Email</label><input id="email" type="email"><label for="message">Message</label><textarea id="message"></textarea><label for="topic">Topic</label><select id="topic"><option>Choose a topic</option><option>Courses</option></select><button type="button">Send feedback</button></form></main><footer>Student Portal</footer>`,
  `<header class="site-header"><h1>My Grades</h1></header><nav><ul><li><a href="#home">Home</a></li><li><a href="#grades">Grades</a></li></ul></nav><main id="grades"><div class="table-wrap"><table><caption>Term results</caption><thead><tr><th>Course</th><th>Grade</th><th>Credits</th></tr></thead><tbody><tr><td>Web Foundations</td><td>A</td><td>3</td></tr><tr><td>Creative Coding</td><td>B+</td><td>4</td></tr><tr><td>Digital Design</td><td>A-</td><td>2</td></tr></tbody></table></div></main><footer>Student Portal</footer>`,
  `<header class="site-header"><h1>Contact Us</h1></header><nav><ul><li><a href="#home">Home</a></li><li><a href="#contact">Contact</a></li></ul></nav><main id="contact"><article class="contact-card"><h2>Get in touch</h2><p>Email: <a href="mailto:hello@example.test">hello@example.test</a></p><p>Phone: <a href="tel:+910000000000">+91 00000 00000</a></p><p>Learning Street, Bengaluru</p></article></main><footer>Student Portal</footer>`,
];

export default function CssPhaseTwoLessonPage() {
  const { lessonId = "" } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<{ completedTopics: string[]; completedTasks: string[]; quizAttempts: { score: number }[]; assessment?: { passed: boolean; score: number; feedback: string[] } }>({ completedTopics: [], completedTasks: [], quizAttempts: [] });
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [previewCss, setPreviewCss] = useState("");
  const [results, setResults] = useState<Record<number, Result>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizReport, setQuizReport] = useState<{ score: number; explanations: string[] } | null>(null);
  const [assessmentCode, setAssessmentCode] = useState("");
  const [assessmentReport, setAssessmentReport] = useState<Result | null>(null);
  const [previewPage, setPreviewPage] = useState(0);
  const [viewport, setViewport] = useState(1200);
  const [message, setMessage] = useState("");
  const auth = getAuth();
  const curriculum = lesson?.curriculum;

  useEffect(() => {
    let active = true;
    (async () => {
      const response = await fetch(apiUrl(`lessons/${lessonId}`));
      const data = await response.json();
      if (!active || !data.lesson) return;
      setLesson(data.lesson);
      const progressResponse = auth?.token ? await fetch(apiUrl("progress/me"), { headers: { Authorization: `Bearer ${auth.token}` } }) : null;
      if (progressResponse?.status === 401) {
        clearAuth();
        setMessage("Your sign-in session has expired. Sign in again to save course progress.");
      } else if (progressResponse?.ok) {
        const row = (await progressResponse.json()).progress?.find((item: { lesson?: { _id?: string } }) => item.lesson?._id === lessonId);
        if (row?.curriculumProgress) {
          setProgress(row.curriculumProgress);
          if (row.curriculumProgress.assessment) setAssessmentReport({ score: row.curriculumProgress.assessment.score, passed: row.curriculumProgress.assessment.passed, feedback: row.curriculumProgress.assessment.feedback });
        }
      }
    })().catch(() => setMessage("Unable to load this lesson. Return to the course page and try again."));
    return () => { active = false; };
  }, [lessonId]);

  const css = previewCss;
  const preview = useMemo(() => {
    const safeCss = (css || "").replace(/<\s*\/\s*style/gi, "<\\/style").replace(/@import[^;]*;?/gi, "").replace(/url\(\s*(['"]?)(?:https?:|javascript:)[^)]*\)/gi, "none");
    const policy = "default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; form-action 'none'; script-src 'none'; connect-src 'none'; object-src 'none'; base-uri 'none'";
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${safeCss}</style></head><body>${htmlPages[previewPage]}</body></html>`;
  }, [css, previewPage]);

  async function apiPost(path: string, payload: unknown) {
    if (!auth?.token) throw new Error("Sign in to save your course progress.");
    const response = await fetch(apiUrl(path), { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (response.status === 401) { clearAuth(); throw new Error("Your sign-in session has expired. Sign in again to save progress."); }
    if (!response.ok) throw new Error(data.message || "Unable to save this activity.");
    return data;
  }
  async function completeTopic(index: number) {
    if (progress.completedTopics.includes(`topic-${index}`)) return;
    if (!auth?.token) { setMessage("Sign in to save your topic progress."); return; }
    const next = [...progress.completedTopics, `topic-${index}`];
    const response = await fetch(apiUrl(`progress/lessons/${lessonId}`), { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` }, body: JSON.stringify({ completedTopics: next }) });
    if (response.ok) { setProgress(p => ({ ...p, completedTopics: next })); setMessage("Topic marked learned · +5 points"); }
    else if (response.status === 401) { clearAuth(); setMessage("Your sign-in session has expired. Sign in again to save progress."); }
    else setMessage("Unable to save this topic. Please try again.");
  }
  async function runTask(index: number) {
    try { const data = await apiPost(`progress/lessons/${lessonId}/tasks/${index}`, { code: drafts[index] ?? curriculum?.tasks[index].starterCode ?? "" }); setResults(p => ({ ...p, [index]: data.result })); setProgress(p => ({ ...p, completedTasks: data.completedTasks || p.completedTasks })); setMessage(data.result.passed ? "Task passed · +10 points" : "Review the hints below and edit your CSS."); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Unable to run the task."); }
  }
  async function submitQuiz() {
    try { const data = await apiPost(`progress/lessons/${lessonId}/quiz`, { answers: curriculum?.quiz.map((_, i) => answers[i] ?? -1) }); setQuizReport(data); setProgress(data.curriculumProgress); setMessage(data.passed ? `Quiz passed · ${data.score}% · +20 points` : `Quiz score ${data.score}%. Review the explanations and try again.`); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Unable to submit quiz."); }
  }
  async function submitAssessment() {
    try { const data = await apiPost(`progress/lessons/${lessonId}/assessment`, { code: assessmentCode }); setAssessmentReport(data.result); setProgress(data.curriculumProgress); setMessage(data.result.passed ? "Practical assessment passed · +40 points" : "Use the feedback to revise your stylesheet and submit again."); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Unable to submit assessment."); }
  }
  function resetCss() { setPreviewCss(""); if (lesson?.order === 10) { setDrafts({}); setAssessmentCode(""); } }
  function downloadStylesheet() {
    const url = URL.createObjectURL(new Blob([previewCss], { type: "text/css" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "style.css";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!lesson || !curriculum) return <main className="min-h-screen bg-slate-950 p-8 text-white"><p>{message || "Loading CSS lesson…"}</p></main>;
  const allTopics = progress.completedTopics.length >= curriculum.topics.length;
  const allTasks = progress.completedTasks.length >= curriculum.tasks.length;
  const quizPassed = (progress.quizAttempts || []).slice(-1)[0]?.score >= 67;
  const taskDraft = (index: number) => drafts[index] ?? curriculum.tasks[index].starterCode;

  return <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6">
    <div className="mx-auto max-w-7xl"><Link to="/courses/css-phase-two" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-300"><ArrowLeft size={16} /> Course progress</Link>
      <header className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-cyan-300/20 bg-slate-900 p-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{lesson.module}</p><h1 className="mt-2 text-2xl font-black sm:text-3xl">{lesson.title}</h1><p className="mt-2 text-sm text-slate-300">{lesson.description}</p></div><div className="rounded-xl bg-slate-950 px-4 py-3 text-sm"><span className="text-slate-400">Points in this section </span><strong>{progress.completedTopics.length * 5 + progress.completedTasks.length * 10 + ((progress.quizAttempts || []).some(q => q.score >= 67) ? 20 : 0) + (progress.assessment?.passed ? 40 : 0)}</strong></div></header>

      <section className="mt-7"><h2 className="text-xl font-bold">Learn · Understand · See</h2><p className="mt-1 text-sm text-slate-400">Read how the property works, then mark the topic learned to earn points.</p><div className="mt-4 space-y-4">{curriculum.topics.map((topic, index) => <article key={topic.tag} className="rounded-2xl border border-white/10 bg-slate-900 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-bold">{index + 1}. {topic.tag}</h3><button onClick={() => completeTopic(index)} disabled={progress.completedTopics.includes(`topic-${index}`)} className="rounded-lg border border-cyan-300/30 px-3 py-2 text-sm font-semibold text-cyan-100 disabled:border-emerald-300/30 disabled:text-emerald-200">{progress.completedTopics.includes(`topic-${index}`) ? "Learned ✓" : "Mark learned · +5"}</button></div><p className="mt-3 text-slate-300">{topic.what}</p><p className="mt-2 text-sm text-slate-400"><strong className="text-slate-200">Why it helps: </strong>{topic.why}</p><p className="mt-2 text-sm text-slate-400"><strong className="text-slate-200">How it works: </strong>{topic.how}</p><div className="mt-4 grid gap-3 lg:grid-cols-3"><div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-300">HTML example · supporting structure</p><pre className="min-h-16 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-amber-100"><code>{`<header><h1>Student Portal</h1></header>\n<main><p>Welcome to your learning hub.</p></main>`}</code></pre></div><div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-cyan-300">CSS example · style.css</p><pre className="min-h-16 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-purple-200"><code>{topic.example}</code></pre></div><div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-300">Expected output</p><p className="min-h-16 rounded-xl bg-slate-950 p-4 text-sm text-slate-300">{topic.output}</p></div></div><p className="mt-3 text-xs text-slate-500"><strong className="text-slate-400">Common fixes:</strong> {(topic.mistakes || []).join(" · ") || "Review the example and compare the selector, property, and value."}</p></article>)}</div></section>

      <section className="mt-8"><h2 className="text-xl font-bold">Try · Run · Debug · Practice</h2><p className="mt-1 text-sm text-slate-400">The editor changes the shared stylesheet in the live preview. HTML is provided as the page structure.</p><div className="mt-4 grid gap-4 xl:grid-cols-2">{curriculum.tasks.map((task, index) => <article key={task.title} className="rounded-2xl border border-white/10 bg-slate-900 p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-bold">{task.title}</h3>{progress.completedTasks.includes(`task-${index}`) && <span className="text-xs text-emerald-200"><Check size={14} className="inline" /> Complete</span>}</div><p className="mt-2 text-sm text-slate-300">{task.instructions}</p><label className="mt-4 block text-xs font-bold uppercase tracking-wider text-purple-200" htmlFor={`task-css-${index}`}>CSS editor · shared style.css</label><textarea id={`task-css-${index}`} value={taskDraft(index)} onChange={e => { const value = e.target.value; setDrafts(p => ({ ...p, [index]: value })); setPreviewCss(value); }} spellCheck={false} className="mt-2 min-h-48 w-full rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-sm leading-6 text-purple-100 outline-none focus:border-cyan-300"/><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => setPreviewCss(taskDraft(index))} className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950"><Play size={15}/> Run preview</button><button onClick={() => runTask(index)} className="rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold">Check task</button><button onClick={() => { setDrafts(p => ({ ...p, [index]: task.starterCode })); setPreviewCss(task.starterCode); }} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm"><RotateCcw size={14}/> Reset</button></div>{results[index] && <div className={`mt-3 rounded-xl p-3 text-sm ${results[index].passed ? "bg-emerald-400/10 text-emerald-200" : "bg-amber-400/10 text-amber-100"}`}><strong>{results[index].passed ? "Passed" : `Try again · ${results[index].score}%`}</strong><ul className="mt-1 list-disc pl-5">{results[index].feedback.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}</article>)}</div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="inline-flex items-center gap-2 font-bold"><Eye size={18} className="text-cyan-300"/> Live preview · existing HTML pages</h3><div className="flex flex-wrap gap-2"><select aria-label="Preview page" value={previewPage} onChange={e => setPreviewPage(Number(e.target.value))} className="rounded-lg bg-slate-950 px-3 py-2 text-sm">{pageNames.map((name, i) => <option key={name} value={i}>{name}</option>)}</select><select aria-label="Preview screen size" value={viewport} onChange={e => setViewport(Number(e.target.value))} className="rounded-lg bg-slate-950 px-3 py-2 text-sm"><option value={1200}>Desktop · 1200px</option><option value={768}>Tablet · 768px</option><option value={390}>Mobile · 390px</option></select><button onClick={downloadStylesheet} className="rounded-lg border border-cyan-300/30 px-3 py-2 text-sm text-cyan-100">Download style.css</button><button onClick={resetCss} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm"><RotateCcw size={14}/> Reset CSS</button></div></div><div className="mt-4 overflow-auto rounded-xl bg-slate-800 p-3"><iframe title={`${pageNames[previewPage]} page CSS preview`} sandbox="" srcDoc={preview} style={{ width: `${viewport}px`, maxWidth: "100%", height: 470, margin: "0 auto", display: "block" }} className="rounded-lg bg-white"/></div><p className="mt-2 text-xs text-slate-500">HTML page example and CSS stylesheet are shown separately. Preview content is a practice fixture based on the six-page HTML project.</p></div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5"><h2 className="text-xl font-bold">Quiz · check your understanding</h2><p className="mt-1 text-sm text-slate-400">Answer all three questions. Earn points for a score of 67% or higher.</p><div className="mt-4 space-y-4">{curriculum.quiz.map((q, i) => <fieldset key={q.prompt} className="rounded-xl bg-slate-950 p-4"><legend className="font-semibold">{i + 1}. {q.prompt}</legend>{q.snippet && <pre className="mt-2 rounded-lg bg-slate-900 p-3 text-sm text-purple-200">{q.snippet}</pre>}<div className="mt-2 grid gap-2 sm:grid-cols-2">{q.options.map((option, oi) => <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/5 p-2 text-sm hover:border-cyan-300/30"><input type="radio" name={`quiz-${i}`} checked={answers[i] === oi} onChange={() => setAnswers(p => ({ ...p, [i]: oi }))}/>{option}</label>)}</div></fieldset>)}</div><button onClick={submitQuiz} className="mt-4 rounded-xl bg-cyan-300 px-4 py-2.5 font-bold text-slate-950">Submit quiz</button>{quizReport && <div className="mt-4 rounded-xl bg-slate-950 p-4"><p className="font-bold">Score: {quizReport.score}%</p><ul className="mt-2 space-y-1 text-sm text-slate-300">{quizReport.explanations.map((ex, i) => <li key={i}>{i + 1}. {ex}</li>)}</ul></div>}</section>

      <section className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-5"><h2 className="text-xl font-bold">Independent practical assessment</h2><p className="mt-2 text-sm text-slate-300">{curriculum.assessment.prompt}</p><p className="mt-2 text-xs text-slate-400">Plan your own CSS rules. This task differs from the examples and practice tasks above.</p><label htmlFor="assessment-css" className="mt-4 block text-xs font-bold uppercase tracking-wider text-purple-200">Assessment CSS · shared style.css</label><textarea id="assessment-css" value={assessmentCode || curriculum.assessment.starterCode} onChange={e => { setAssessmentCode(e.target.value); setPreviewCss(e.target.value); }} spellCheck={false} className="mt-2 min-h-56 w-full rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-sm leading-6 text-purple-100 outline-none focus:border-cyan-300"/><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => setPreviewCss(assessmentCode || curriculum.assessment.starterCode)} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm"><Play size={14}/> Run preview</button><button onClick={submitAssessment} className="rounded-lg bg-emerald-300 px-4 py-2 font-bold text-slate-950">Submit assessment</button></div><ul className="mt-3 list-disc pl-5 text-xs text-slate-400">{curriculum.assessment.criteria.map(item => <li key={item}>{item}</li>)}</ul>{assessmentReport && <div className={`mt-3 rounded-xl p-3 text-sm ${assessmentReport.passed ? "bg-emerald-400/10 text-emerald-100" : "bg-amber-400/10 text-amber-100"}`}><strong>{assessmentReport.passed ? `Passed · ${assessmentReport.score}%` : `Needs revision · ${assessmentReport.score}%`}</strong><ul className="mt-1 list-disc pl-5">{assessmentReport.feedback.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}</section>
      {message && <p role="status" className="mt-4 rounded-xl bg-slate-900 p-3 text-sm text-cyan-100">{message} {message.includes("sign-in session") && <Link className="ml-2 underline" to="/login">Sign in</Link>}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400"><p>{allTopics ? "All topics learned" : `${progress.completedTopics.length}/${curriculum.topics.length} topics`} · {allTasks ? "All tasks passed" : `${progress.completedTasks.length}/${curriculum.tasks.length} tasks`} · {quizPassed ? "Quiz passed" : "Quiz not passed yet"} · {progress.assessment?.passed ? "Assessment passed" : "Assessment remaining"}</p><Link to="/courses/css-phase-two" className="font-semibold text-cyan-300 hover:text-cyan-100">Return to milestones →</Link></div>
    </div>
  </main>;
}
