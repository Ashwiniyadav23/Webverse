import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { apiUrl } from "../utils/api";
import { clearAuth, getAuth } from "../utils/auth";

type Lesson = { _id: string; title: string; description: string; order: number; module: string; curriculum?: { topics?: unknown[]; tasks?: unknown[] } };
type Progress = { lesson?: { _id: string }; curriculumProgress?: { completedTopics?: string[]; completedTasks?: string[]; quizAttempts?: { score: number }[]; assessment?: { passed?: boolean } } };
const title = "Phase 2: Dressing Up Your Websites with CSS";
const milestones = [
  { name: "Style the basic website", through: 1 }, { name: "Typography, colors, and navigation", through: 2 },
  { name: "Design the profile page", through: 3 }, { name: "Build course cards with Flexbox", through: 4 },
  { name: "Create a responsive course layout with Grid", through: 5 }, { name: "Style the form and grades table", through: 7 },
  { name: "Make the entire website responsive", through: 9 },
];

export default function CssPhaseTwoCoursePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [serverProgress, setServerProgress] = useState<Progress[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const courseData = await fetch(apiUrl("courses")).then(r => r.json());
        const course = (courseData.courses || []).find((item: { title: string }) => item.title === title);
        if (!course) throw new Error("The CSS course is not available yet.");
        const rows = await fetch(apiUrl(`courses/${course._id}/lessons`)).then(r => r.json());
        const auth = getAuth();
        const progressResponse = auth?.token ? await fetch(apiUrl("progress/me"), { headers: { Authorization: `Bearer ${auth.token}` } }) : null;
        if (progressResponse?.status === 401) {
          clearAuth();
          if (active) setError("Your sign-in session has expired. Sign in again to view and save your progress.");
        }
        const progressData = progressResponse?.ok ? await progressResponse.json() : { progress: [] };
        if (active) { setLessons(rows.lessons || []); setServerProgress(progressData.progress || []); }
      } catch (e) { if (active) setError(e instanceof Error ? e.message : "Unable to load the CSS course."); }
    })();
    return () => { active = false; };
  }, []);
  const byLesson = useMemo(() => new Map(serverProgress.map(p => [p.lesson?._id || "", p.curriculumProgress || {}])), [serverProgress]);
  const completed = lessons.filter(lesson => {
    const p = byLesson.get(lesson._id);
    if (lesson.order === 10) return Boolean(p?.assessment?.passed);
    return (p?.completedTopics || []).length >= (lesson.curriculum?.topics?.length || 999)
      && (p?.completedTasks || []).length >= (lesson.curriculum?.tasks?.length || 999)
      && (p?.quizAttempts || []).slice(-1)[0]?.score >= 67 && Boolean(p?.assessment?.passed);
  });
  const completedIds = new Set(completed.map(l => l._id));
  const activityPoints = lessons.reduce((sum, lesson) => {
    const p = byLesson.get(lesson._id);
    const topics = p?.completedTopics?.length || 0;
    const tasks = p?.completedTasks?.length || 0;
    const quizPoints = (p?.quizAttempts || []).some(a => a.score >= 67) ? 20 : 0;
    const assessmentPoints = p?.assessment?.passed ? 40 : 0;
    return sum + topics * 5 + tasks * 10 + quizPoints + assessmentPoints;
  }, 0);
  const earnedMilestones = milestones.filter(milestone => lessons.filter(l => l.order <= milestone.through).every(l => completedIds.has(l._id))).length;
  const earned = activityPoints + earnedMilestones * 100;
  const unlockedIndex = lessons.findIndex((_, index) => index > 0 && !completedIds.has(lessons[index - 1]._id));
  const unlockedThrough = unlockedIndex === -1 ? lessons.length : Math.max(1, unlockedIndex);

  return <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
    <div className="mx-auto max-w-5xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-300"><ArrowLeft size={16} /> Home</Link>
      <header className="mt-6 rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-6 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Phase 2 · CSS · 9 sections + final challenge</p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Learn CSS on the existing six-page Student Profile &amp; Course Portal. Write a shared stylesheet, preview it at different screen widths, and earn points as you go.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Progress" value={`${completed.length} / ${lessons.length} units`} />
          <Stat label="Points earned" value={`${earned} pts`} />
          <Stat label="Next milestone" value={milestones.find(m => !completed.some(l => l.order <= m.through))?.name || "All milestones earned"} />
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300 transition-all" style={{ width: `${lessons.length ? completed.length / lessons.length * 100 : 0}%` }} /></div>
      </header>
      {error && <p role="alert" className="mt-5 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-rose-200">{error} {error.includes("sign-in session") && <Link className="ml-2 underline" to="/login">Sign in</Link>}</p>}
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Learning path</h2>
        <p className="mt-1 text-sm text-slate-400">Complete the topics, editor tasks, quiz, and practical assessment to unlock the next section.</p>
        <div className="mt-4 space-y-3">
          {lessons.map((lesson, index) => {
            const isCompleted = completedIds.has(lesson._id);
            const locked = index + 1 > unlockedThrough;
            return <article key={lesson._id} className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${isCompleted ? "border-emerald-400/30 bg-emerald-400/5" : locked ? "border-white/5 bg-white/[.02] opacity-60" : "border-white/10 bg-slate-900"}`}>
              <div className="flex gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 font-black text-cyan-200">{isCompleted ? <CheckCircle2 size={21} /> : locked ? <LockKeyhole size={19} /> : String(index + 1).padStart(2, "0")}</div><div><p className="text-xs font-bold uppercase tracking-wide text-cyan-300">{lesson.module}</p><h3 className="mt-1 text-lg font-bold">{lesson.title}</h3><p className="mt-1 max-w-2xl text-sm text-slate-400">{lesson.description}</p><p className="mt-2 text-xs text-slate-500">+5 per topic · +10 per task · +20 quiz · +40 assessment</p></div></div>
              {locked ? <span className="inline-flex items-center gap-2 text-sm text-slate-400"><LockKeyhole size={15} /> Locked</span> : <Link to={`/css-lessons/${lesson._id}`} className="shrink-0 rounded-xl bg-cyan-300 px-4 py-2.5 text-center font-bold text-slate-950 hover:bg-cyan-200">{isCompleted ? "Review" : lesson.order === 10 ? "Start final challenge" : "Continue"}</Link>}
            </article>;
          })}
        </div>
      </section>
      <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-5">
        <h2 className="flex items-center gap-2 text-xl font-bold"><Sparkles className="text-amber-300" size={20} /> Milestones</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">{milestones.map((milestone, i) => { const done = lessons.filter(l => l.order <= milestone.through).every(l => completedIds.has(l._id)); return <div key={milestone.name} className={`rounded-xl border p-4 ${done ? "border-amber-300/30 bg-amber-300/5" : "border-white/5 bg-slate-950/50"}`}><p className="text-xs font-bold uppercase tracking-wider text-amber-200">Milestone {i + 1} {done ? "· Earned" : "· In progress"}</p><p className="mt-1 font-semibold">{milestone.name}</p></div>; })}</div>
        <p className="mt-4 text-sm text-slate-400">Each completed milestone earns 100 points. Remaining challenges: {Math.max(0, lessons.length - completed.length)} learning units.</p>
      </section>
      <p className="mt-6 text-xs text-slate-500">Supplementary practice: <a className="text-cyan-300 underline" href="https://flexboxfroggy.com/" target="_blank" rel="noreferrer">Flexbox Froggy</a> and <a className="text-cyan-300 underline" href="https://cssgridgarden.com/" target="_blank" rel="noreferrer">Grid Garden</a>.</p>
    </div>
  </main>;
}
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 font-bold text-white">{value}</p></div>; }
