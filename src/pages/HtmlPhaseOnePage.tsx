import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Code2, Eye, Play, RotateCcw, Send } from "lucide-react";
import { phaseOneSections } from "../data/htmlPhaseOne";
import { apiUrl } from "../utils/api";
import { getAuth } from "../utils/auth";
import { getProgress, saveLessonProgress } from "../utils/progress";

type Validation = { requiredTags?: string[]; requiredText?: string[] };
type Topic = { tag: string; what: string; why: string; how: string; example: string; output: string; mistakes: string[] };
type PracticeTask = { title: string; instructions: string; starterCode: string; validation: Validation };
type QuizQuestion = { type: "mcq" | "output" | "error"; prompt: string; options: string[]; answerIndex: number; explanation: string; snippet?: string };
type Assessment = { title: string; prompt: string; starterCode: string; validation: Validation; testCases: string[]; criteria: string[] };
type Curriculum = { topics: Topic[]; tasks: PracticeTask[]; quiz: QuizQuestion[]; assessment: Assessment };
type Lesson = { _id: string; title: string; description: string; order: number; content: string; curriculum?: Curriculum };
type CheckResult = { passed: boolean; score: number; feedback: string[] };

function checkHtml(code: string, validation: Validation = {}): CheckResult {
  const feedback: string[] = [];
  const forbidden = /<\s*(script|style)\b|<\s*link\b[^>]*stylesheet|\sstyle\s*=|\son[a-z]+\s*=|javascript\s*:/i;
  const usesForbidden = forbidden.test(code);
  if (usesForbidden) feedback.push("Remove CSS and JavaScript. Use HTML elements and attributes only.");
  const required = [...(validation.requiredTags || []), ...(validation.requiredText || [])];
  const knownTags = new Set(["a", "address", "article", "body", "button", "caption", "checkbox", "dd", "div", "dl", "dt", "em", "fieldset", "footer", "form", "h1", "h2", "h3", "head", "header", "html", "img", "input", "label", "li", "main", "nav", "ol", "option", "p", "section", "select", "strong", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "title", "tr", "ul"]);
  const missing = required.filter(value => {
    const tag = value.match(/^([a-z][a-z0-9-]*)$/i)?.[1];
    return tag && knownTags.has(tag.toLowerCase()) ? !new RegExp(`<\\s*${tag}\\b`, "i").test(code) : !code.toLowerCase().includes(value.toLowerCase());
  });
  feedback.push(...missing.map(value => `Missing required content: ${value}`));
  if (!feedback.length) feedback.push("All automatic checks passed. Review the task requirements and rendered page.");
  const score = usesForbidden ? 0 : required.length ? Math.round(((required.length - missing.length) / required.length) * 100) : 100;
  return { passed: score === 100 && !usesForbidden, score, feedback };
}

function safePreview(code: string) {
  const cleaned = code
    .replace(/<\s*(script|style|iframe|object|embed|link|base)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|base)\b[^>]*\/?\s*>/gi, "")
    .replace(/\s(on[a-z]+|style)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(src|href|action|formaction)\s*=\s*(["'])\s*(?:https?:|javascript:|data:text\/html)[\s\S]*?\2/gi, "")
    .replace(/<meta\b[^>]*http-equiv\s*=\s*["']?refresh[^>]*>/gi, "");
  const policy = "default-src 'none'; img-src data: blob:; style-src 'none'; script-src 'none'; form-action 'none'; navigate-to 'none'; font-src 'none'; connect-src 'none'; media-src 'none'; object-src 'none'; base-uri 'none'";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><title>HTML preview</title></head><body>${cleaned}</body></html>`;
}

export default function HtmlPhaseOnePage({ lessonId }: { lessonId: string }) {
  const staticIndex = Number(lessonId.replace("html-section-", "")) - 1;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [learnedTopics, setLearnedTopics] = useState<string[]>(() => Object.entries(getProgress()[lessonId]?.assignmentChecks || {}).filter(([key, value]) => key.startsWith("topic-") && value).map(([key]) => key));
  const [completedTasks, setCompletedTasks] = useState<string[]>(() => Object.entries(getProgress()[lessonId]?.assignmentChecks || {}).filter(([key, value]) => key.startsWith("task-") && value).map(([key]) => key));
  const [taskDrafts, setTaskDrafts] = useState<Record<number, string>>({});
  const [taskResults, setTaskResults] = useState<Record<number, CheckResult>>({});
  const [taskPreviews, setTaskPreviews] = useState<Record<number, string>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(getProgress()[lessonId]?.quizScore ?? null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [assessmentCode, setAssessmentCode] = useState("");
  const [assessmentPreview, setAssessmentPreview] = useState("");
  const [assessmentResult, setAssessmentResult] = useState<CheckResult | null>(() => getProgress()[lessonId]?.assignmentChecks?.["assessment-passed"] === true ? { score: 100, passed: true, feedback: ["Assessment passed."] } : null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!/^[a-f\d]{24}$/i.test(lessonId)) return;
    let active = true;
    fetch(apiUrl(`lessons/${lessonId}`)).then(response => response.json()).then(async data => {
      if (!active || !data.lesson) return;
      const row = data.lesson as Lesson;
      setLesson(row);
      const curriculum = row.curriculum;
      setTaskDrafts(Object.fromEntries((curriculum?.tasks || []).map((task, i) => [i, task.starterCode])));
      setAssessmentCode(curriculum?.assessment?.starterCode || "");
      const auth = getAuth();
      if (auth?.token) {
        const progressData = await fetch(apiUrl("progress/me"), { headers: { Authorization: `Bearer ${auth.token}` } }).then(response => response.json()).catch(() => null);
        const record = progressData?.progress?.find((item: { lesson?: { _id?: string }; curriculumProgress?: Record<string, unknown> }) => item.lesson?._id === lessonId);
        if (record?.curriculumProgress) {
          const cp = record.curriculumProgress;
          setLearnedTopics(Array.isArray(cp.completedTopics) ? cp.completedTopics : []);
          setCompletedTasks(Array.isArray(cp.completedTasks) ? cp.completedTasks : []);
          const attempts = Array.isArray(cp.quizAttempts) ? cp.quizAttempts as { score: number }[] : [];
          if (attempts.length) setQuizScore(attempts[attempts.length - 1].score);
          if (cp.assessment && typeof cp.assessment === "object") setAssessmentResult({ score: (cp.assessment as { score: number }).score, passed: (cp.assessment as { passed: boolean }).passed, feedback: (cp.assessment as { feedback: string[] }).feedback || [] });
        }
      }
    }).catch(() => undefined);
    return () => { active = false; };
  }, [lessonId]);

  const fallback = phaseOneSections[staticIndex];
  const index = lesson?.order ? lesson.order - 1 : staticIndex;
  const title = lesson?.title || fallback?.title || "HTML lesson";
  const curriculum = lesson?.curriculum;
  const topics = curriculum?.topics || [];
  const tasks = curriculum?.tasks || [];
  const quiz = curriculum?.quiz || [];
  const assessment = curriculum?.assessment;
  const topicsLearned = topics.length > 0 && topics.every((_, i) => learnedTopics.includes(`topic-${i}`));
  const tasksPassed = tasks.length > 0 && tasks.every((_, i) => completedTasks.includes(`task-${i}`));
  const quizPassed = quizScore !== null && quizScore >= 67;
  const assessmentPassed = Boolean(assessmentResult?.passed);
  const sectionPassed = topicsLearned && tasksPassed && quizPassed && assessmentPassed;
  const quizTotal = useMemo(() => Object.keys(quizAnswers).length, [quizAnswers]);

  async function persistProgress(update: { completedTopics?: string[]; completedTasks?: string[]; quizScore?: number; completed?: boolean; assessmentPassed?: boolean }) {
    const nextTopics = update.completedTopics ?? learnedTopics;
    const nextTasks = update.completedTasks ?? completedTasks;
    const nextQuizScore = update.quizScore ?? quizScore;
    const nextAssessmentPassed = update.assessmentPassed ?? assessmentPassed;
    const nextCompleted = update.completed ?? (topics.length > 0 && topics.every((_, i) => nextTopics.includes(`topic-${i}`)) && tasks.length > 0 && tasks.every((_, i) => nextTasks.includes(`task-${i}`)) && nextQuizScore !== null && nextQuizScore >= 67 && nextAssessmentPassed);
    saveLessonProgress(lessonId, { completed: nextCompleted, quizScore: nextQuizScore ?? undefined, assignmentChecks: { ...Object.fromEntries([...nextTopics, ...nextTasks].map(key => [key, true])), "assessment-passed": nextAssessmentPassed } });
    const auth = getAuth();
    if (!auth?.token || !/^[a-f\d]{24}$/i.test(lessonId)) return;
    await fetch(apiUrl(`progress/lessons/${lessonId}`), { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` }, body: JSON.stringify({ completedTopics: nextTopics, completed: nextCompleted, ...(update.quizScore !== undefined ? { quizScore: update.quizScore } : {}) }) });
  }

  async function toggleTopic(key: string) {
    const next = learnedTopics.includes(key) ? learnedTopics.filter(item => item !== key) : [...learnedTopics, key];
    setLearnedTopics(next);
    await persistProgress({ completedTopics: next });
  }

  async function checkTask(taskIndex: number) {
    const task = tasks[taskIndex];
    const code = taskDrafts[taskIndex] ?? task.starterCode;
    let result = checkHtml(code, task.validation);
    const auth = getAuth();
    if (auth?.token && /^[a-f\d]{24}$/i.test(lessonId)) {
      try {
        const response = await fetch(apiUrl(`progress/lessons/${lessonId}/tasks/${taskIndex}`), { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` }, body: JSON.stringify({ code }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Task could not be checked.");
        result = data.result;
      } catch (error) {
        result = { passed: false, score: 0, feedback: [error instanceof Error ? error.message : "Task could not be checked."] };
      }
    }
    setTaskResults(previous => ({ ...previous, [taskIndex]: result }));
    const next = result.passed ? [...new Set([...completedTasks, `task-${taskIndex}`])] : completedTasks.filter(value => value !== `task-${taskIndex}`);
    setCompletedTasks(next);
    await persistProgress({ completedTasks: next });
  }

  async function submitQuiz() {
    if (quizTotal !== quiz.length) return;
    const answers = quiz.map((_, i) => quizAnswers[i]);
    let score: number;
    const auth = getAuth();
    if (auth?.token && /^[a-f\d]{24}$/i.test(lessonId)) {
      const response = await fetch(apiUrl(`progress/lessons/${lessonId}/quiz`), { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` }, body: JSON.stringify({ answers }) });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message || "Quiz could not be submitted."); return; }
      score = data.score;
    } else {
      const correct = quiz.filter((question, i) => quizAnswers[i] === question.answerIndex).length;
      score = Math.round(correct / quiz.length * 100);
      setMessage("Sign in to save this quiz score and unlock the assessment.");
    }
    setQuizScore(score);
    setQuizSubmitted(true);
    saveLessonProgress(lessonId, { quizScore: score });
  }

  async function submitAssessment() {
    if (!assessment || !getAuth()?.token) {
      setMessage("Sign in as a student to save your section assessment.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(apiUrl(`progress/lessons/${lessonId}/assessment`), { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${getAuth()!.token}` }, body: JSON.stringify({ code: assessmentCode }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Assessment could not be submitted.");
      setAssessmentResult(data.result);
      await persistProgress({ completed: topicsLearned && tasksPassed && quizPassed && data.result.passed, assessmentPassed: data.result.passed });
      setMessage(data.result.passed ? "Assessment passed. You can continue to the next section." : "Assessment needs revision. Review the feedback and submit again.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Assessment could not be submitted.");
    } finally { setSaving(false); }
  }

  if (!curriculum) return <main className="min-h-screen bg-slate-950 p-8 text-white"><Link to="/courses/html-fundamentals" className="text-cyan-300">← Back to course</Link><p className="mt-6">This lesson is still loading or needs its structured curriculum published by an admin.</p></main>;

  return <div className="min-h-screen bg-slate-950 text-white"><header className="border-b border-white/10"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><Link to="/" className="flex items-center gap-2"><Code2 className="text-cyan-400"/><strong>WebVerse</strong></Link><Link to="/courses/html-fundamentals" className="text-sm text-slate-300"><ArrowLeft className="mr-2 inline" size={16}/>Course sections</Link></div></header>
    <main className="mx-auto max-w-6xl space-y-7 px-5 py-8"><p className="text-sm font-bold uppercase tracking-widest text-cyan-400">HTML only · Section {index + 1} of 6</p><h1 className="text-3xl font-black">{title}</h1><p className="text-slate-300">Learn every topic, practise each task in the editor, pass the quiz, then pass the independent assessment.</p>
      <section className="space-y-4" aria-labelledby="learn-title"><h2 id="learn-title" className="text-2xl font-black">1. Learn and understand</h2>{topics.map((item, i) => <article key={`${item.tag}-${i}`} className="rounded-2xl border border-white/10 bg-slate-900 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-bold"><code className="text-cyan-200">{item.tag}</code></h3><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={learnedTopics.includes(`topic-${i}`)} onChange={() => void toggleTopic(`topic-${i}`)} className="accent-cyan-400"/>Mark learned</label></div><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="font-bold text-cyan-100">What it is</dt><dd className="mt-1 text-slate-300">{item.what}</dd></div><div><dt className="font-bold text-cyan-100">Why it is used</dt><dd className="mt-1 text-slate-300">{item.why}</dd></div><div><dt className="font-bold text-cyan-100">How to use it</dt><dd className="mt-1 text-slate-300">{item.how}</dd></div><div><dt className="font-bold text-cyan-100">Expected output</dt><dd className="mt-1 text-slate-300">{item.output}</dd></div></dl><pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-cyan-100"><code>{item.example}</code></pre><div className="mt-3"><h4 className="font-semibold text-amber-100">Common mistakes</h4><ul className="mt-1 list-disc pl-5 text-sm text-slate-300">{item.mistakes.map(mistake => <li key={mistake}>{mistake}</li>)}</ul></div></article>)}</section>
      <section className="space-y-4" aria-labelledby="practice-title"><div><h2 id="practice-title" className="text-2xl font-black">2. Practise in the HTML editor</h2><p className="mt-1 text-sm text-slate-400">Finish the learning topics first. Run shows a sandboxed HTML preview. CSS and JavaScript are rejected and removed from the preview.</p></div>{tasks.map((task, i) => { const code = taskDrafts[i] ?? task.starterCode; const result = taskResults[i]; return <article key={`${task.title}-${i}`} className="rounded-2xl border border-white/10 bg-slate-900 p-5"><h3 className="text-lg font-bold">{task.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{task.instructions}</p><div className="mt-4 grid gap-4 lg:grid-cols-2"><div><label htmlFor={`task-editor-${i}`} className="text-sm font-semibold">HTML code</label><textarea id={`task-editor-${i}`} value={code} onChange={event => setTaskDrafts(previous => ({ ...previous, [i]: event.target.value }))} spellCheck={false} rows={12} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-sm leading-6 text-cyan-100 focus:border-cyan-400 focus:outline-none"/><div className="mt-3 flex gap-2"><button type="button" onClick={() => setTaskPreviews(previous => ({ ...previous, [i]: safePreview(code) }))} className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-bold text-slate-950"><Play size={15}/>Run</button><button type="button" onClick={() => { setTaskDrafts(previous => ({ ...previous, [i]: task.starterCode })); setTaskResults(previous => ({ ...previous, [i]: undefined as never })); }} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm"><RotateCcw size={15}/>Reset</button><button type="button" onClick={() => void checkTask(i)} disabled={!topicsLearned} className="rounded-lg bg-emerald-400 px-3 py-2 text-sm font-bold text-slate-950 disabled:opacity-40">Check task</button></div>{result && <div role="status" className={`mt-3 rounded-xl p-3 text-sm ${result.passed ? "bg-emerald-400/10 text-emerald-200" : "bg-amber-400/10 text-amber-100"}`}><strong>{result.passed ? "Passed" : `${result.score}% — revise`}</strong><ul className="mt-1 list-disc pl-5">{result.feedback.map(line => <li key={line}>{line}</li>)}</ul></div>}</div><div><h4 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Eye size={15}/>Live preview</h4>{taskPreviews[i] ? <iframe title={`${task.title} HTML preview`} sandbox="" referrerPolicy="no-referrer" srcDoc={taskPreviews[i]} className="h-80 w-full rounded-xl bg-white"/> : <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-white/15 text-sm text-slate-500">Select Run to preview your HTML</div>}</div></div></article>; })}</section>
      <section className="rounded-2xl border border-white/10 bg-slate-900 p-5" aria-labelledby="quiz-title"><h2 id="quiz-title" className="text-2xl font-black">3. Section quiz</h2><p className="mt-1 text-sm text-slate-400">Answer the MCQ, output prediction, and error identification. Score at least 67% to unlock the assessment.</p><div className="mt-5 space-y-5">{quiz.map((item, i) => <fieldset key={i} className="rounded-xl bg-slate-950 p-4"><legend className="font-bold">{item.type === "mcq" ? "Multiple choice" : item.type === "output" ? "Predict the output" : "Identify the error"}: {item.prompt}</legend>{item.snippet && <pre className="my-3 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-cyan-100"><code>{item.snippet}</code></pre>}<div className="mt-3 space-y-2">{item.options.map((option, j) => <label key={option} className="flex items-center gap-2 rounded-lg border border-white/10 p-3 text-sm"><input type="radio" name={`quiz-${i}`} disabled={quizSubmitted || !tasksPassed} checked={quizAnswers[i] === j} onChange={() => setQuizAnswers(previous => ({ ...previous, [i]: j }))} className="accent-cyan-400"/>{option}</label>)}</div>{quizSubmitted && <p className="mt-3 text-sm text-cyan-100">{item.explanation}</p>}</fieldset>)}</div><button type="button" onClick={() => void submitQuiz()} disabled={!tasksPassed || quizSubmitted || quizTotal !== quiz.length} className="mt-5 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 disabled:opacity-40">Submit quiz</button>{quizScore !== null && <p className={`mt-3 font-bold ${quizPassed ? "text-emerald-300" : "text-amber-200"}`}>Score: {quizScore}% · {quizPassed ? "Passed" : "Revise and retry"}</p>}{quizSubmitted && !quizPassed && <button type="button" onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} className="mt-2 block text-sm text-cyan-200 underline">Try quiz again</button>}</section>
      {assessment && topicsLearned && tasksPassed && quizPassed && <section className="rounded-2xl border border-cyan-400/25 bg-slate-900 p-5" aria-labelledby="assessment-title"><h2 id="assessment-title" className="text-2xl font-black">4. Independent section assessment: {assessment.title}</h2><p className="mt-2 whitespace-pre-wrap leading-6 text-slate-300">{assessment.prompt}</p><h3 className="mt-4 font-bold">Requirements</h3><ul className="mt-2 list-disc pl-5 text-sm text-slate-300">{assessment.criteria.map(item => <li key={item}>{item}</li>)}</ul><h3 className="mt-4 font-bold">Test cases</h3><ul className="mt-2 list-disc pl-5 text-sm text-slate-300">{assessment.testCases.map(item => <li key={item}>{item}</li>)}</ul><div className="mt-4 grid gap-4 lg:grid-cols-2"><div><label htmlFor="assessment-editor" className="text-sm font-semibold">Write your assessment HTML independently</label><textarea id="assessment-editor" value={assessmentCode} onChange={event => setAssessmentCode(event.target.value)} spellCheck={false} rows={15} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-sm leading-6 text-cyan-100"/><div className="mt-3 flex gap-2"><button type="button" disabled={!topicsLearned || !tasksPassed || !quizPassed} onClick={() => setAssessmentPreview(safePreview(assessmentCode))} className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-bold text-slate-950 disabled:opacity-40"><Play size={15}/>Run</button><button type="button" disabled={!topicsLearned || !tasksPassed || !quizPassed || saving} onClick={() => void submitAssessment()} className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-3 py-2 text-sm font-bold text-slate-950 disabled:opacity-40"><Send size={15}/>{saving ? "Checking…" : "Submit assessment"}</button></div></div><div><h3 className="mb-2 text-sm font-semibold">Assessment preview</h3>{assessmentPreview ? <iframe title="Section assessment HTML preview" sandbox="" referrerPolicy="no-referrer" srcDoc={assessmentPreview} className="h-80 w-full rounded-xl bg-white"/> : <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-white/15 text-sm text-slate-500">Run to preview your independent solution</div>}</div></div>{assessmentResult && <div className={`mt-4 rounded-xl p-4 ${assessmentPassed ? "bg-emerald-400/10 text-emerald-200" : "bg-amber-400/10 text-amber-100"}`}><strong>{assessmentPassed ? "Assessment passed" : `Assessment score: ${assessmentResult.score}% — revision needed`}</strong><ul className="mt-2 list-disc pl-5 text-sm">{assessmentResult.feedback.map(item => <li key={item}>{item}</li>)}</ul></div>}{message && <p role="status" className="mt-3 text-sm text-cyan-100">{message}</p>}</section>}
      <section className="rounded-2xl border border-white/10 bg-slate-900 p-5"><h2 className="text-xl font-bold">Feedback and continue</h2><p className="mt-2 text-sm text-slate-300">{sectionPassed ? "All topics, practical tasks, quiz, and the independent assessment are passed. The next section is unlocked." : "To continue, mark every topic learned, pass every editor task, score at least 67% on the quiz, and pass the separate assessment."}</p><Link to="/courses/html-fundamentals" className="mt-4 inline-block rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950">Back to course sections</Link></section>
    </main></div>;
}
