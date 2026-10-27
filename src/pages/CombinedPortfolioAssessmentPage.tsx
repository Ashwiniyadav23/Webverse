import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, RotateCcw, Send } from "lucide-react";
import { apiUrl } from "../utils/api";
import { clearAuth, getAuth } from "../utils/auth";

type Category = { name: string; marks: number; maxMarks: number; completedRequirements: string[]; missingRequirements: string[]; suggestions: string[]; errors: string[] };
type Evaluation = { score: number; htmlScore: number; cssScore: number; qualityScore: number; passed: boolean; status: string; categories: Category[]; completedRequirements: string[]; missingRequirements: string[]; errors: string[]; suggestions: string[] };
type Submission = { htmlCode: string; cssCode: string; score: number | null; htmlScore: number | null; cssScore: number | null; qualityScore: number | null; status: string; attempt: number; result: Evaluation | null };
type Gate = { eligible: boolean; htmlComplete: boolean; cssComplete: boolean; missingCourses: { name: string; path: string; reason: string }[]; submission: Submission | null };

const requirements = [
  ["Home", "Your name, a short introduction, and a welcome message."],
  ["About Me", "A profile image with meaningful alt text, a personal introduction, and learning goals."],
  ["Skills", "At least five technical or personal skills, shown in a list or cards."],
  ["Projects", "At least two projects, each with a title, description, and relevant link."],
  ["Education", "Your qualifications or current learning details."],
  ["Contact", "A simple contact section with an email link."],
];

export default function CombinedPortfolioAssessmentPage() {
  const auth = getAuth();
  const [gate, setGate] = useState<Gate | null>(null);
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [result, setResult] = useState<Evaluation | null>(null);
  const [resultSaved, setResultSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [previewDocument, setPreviewDocument] = useState("");

  useEffect(() => {
    if (!auth?.token) { setLoading(false); setError("Sign in as a student to check access and submit this assessment."); return; }
    let active = true;
    fetch(apiUrl("combined-assessment/portfolio/status"), { headers: { Authorization: `Bearer ${auth.token}` } })
      .then(async response => {
        const data = await response.json();
        if (response.status === 401) { clearAuth(); throw new Error("Your sign-in session has expired. Sign in again to continue."); }
        if (!response.ok) throw new Error(data.message || "Unable to check assessment access.");
        if (!active) return;
        setGate(data);
        if (data.submission) {
          setHtmlCode(data.submission.htmlCode || "");
          setCssCode(data.submission.cssCode || "");
          setResult(data.submission.result || null);
          setResultSaved(Boolean(data.submission.attempt));
        }
      })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Unable to check assessment access."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const preview = useMemo(() => previewDocument, [previewDocument]);
  function makePreview() {
    const cleanHtml = htmlCode
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<\s*(script|style|iframe|object|embed|base|link)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
      .replace(/<\s*(script|style|iframe|object|embed|base|link)\b[^>]*\/?\s*>/gi, "")
      .replace(/<meta\b[^>]*http-equiv\s*=\s*["']?refresh[^>]*>/gi, "")
      .replace(/\s(on[a-z]+|style)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/<\s*\/?(?:html|head|body)\b[^>]*>/gi, "");
    const safeCss = cssCode.replace(/<\s*\/\s*style/gi, "<\\/style").replace(/@import[^;]*;?/gi, "").replace(/url\(\s*(['"]?)(?:https?:|javascript:)[^)]*\)/gi, "none");
    const policy = "default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; form-action 'none'; script-src 'none'; connect-src 'none'; object-src 'none'; base-uri 'none'";
    setPreviewDocument(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Portfolio preview</title><style>${safeCss}</style></head><body>${cleanHtml}</body></html>`);
  }

  async function evaluate(save: boolean) {
    if (!auth?.token) { setError("Sign in again to evaluate or submit your portfolio."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(apiUrl(`combined-assessment/portfolio/${save ? "submit" : "evaluate"}`), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ htmlCode, cssCode }),
      });
      const data = await response.json();
      if (response.status === 401) { clearAuth(); throw new Error("Your sign-in session has expired. Sign in again to continue."); }
      if (!response.ok) {
        if (data.missingCourses) setGate(current => current ? { ...current, ...data } : data);
        throw new Error(data.message || "Unable to evaluate this portfolio.");
      }
      setResult(data.result);
      if (save) {
        setResultSaved(true);
        setGate(current => current ? { ...current, submission: data.submission } : current);
        setNotice(data.result.passed ? `Submission ${data.submission.attempt} passed with ${data.result.score}/100.` : `Submission ${data.submission.attempt} saved. Review the feedback, make changes, and submit again.`);
      } else { setResultSaved(false); setNotice("Preview updated and feedback checked. Run does not save an attempt."); }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to evaluate this portfolio."); }
    finally { setBusy(false); }
  }

  function resetEditors() {
    setHtmlCode(""); setCssCode(""); setResult(null); setResultSaved(false); setPreviewDocument(""); setError(""); setNotice("Both editors and the preview were reset. Your saved submissions remain available until you submit new work.");
  }

  if (loading) return <main className="min-h-screen bg-slate-950 p-8 text-white">Checking assessment access…</main>;

  return <main className="min-h-screen bg-slate-950 px-4 py-7 text-white sm:px-6">
    <div className="mx-auto max-w-7xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-300"><ArrowLeft size={16}/> Home</Link>
      <header className="mt-5 rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 p-6 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Combined HTML + CSS Final Assessment</p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Build Your Own Portfolio</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Build a personal portfolio website from scratch using HTML and CSS only. Write both files yourself. No completed portfolio template is supplied.</p>
        {gate?.eligible && <p className="mt-4 inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100">Unlocked · HTML and CSS courses complete</p>}
      </header>

      {error && <p role="alert" className="mt-5 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-rose-100">{error} {error.includes("Sign in") && <Link className="ml-2 underline" to="/login">Sign in</Link>}</p>}
      {notice && <p role="status" className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-cyan-100">{notice}</p>}

      {gate && !gate.eligible && <section className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-300/5 p-5"><h2 className="text-xl font-bold">Assessment locked</h2><p className="mt-2 text-sm text-slate-300">Finish both courses and all required assessments to unlock this project automatically.</p><div className="mt-4 grid gap-3 md:grid-cols-2">{gate.missingCourses.map(course => <article key={course.name} className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><h3 className="font-bold">{course.name}</h3><p className="mt-1 text-sm text-slate-400">{course.reason}</p><Link to={course.path} className="mt-3 inline-block text-sm font-semibold text-cyan-300 underline">Continue this course</Link></article>)}</div></section>}

      <section className="mt-7 rounded-2xl border border-white/10 bg-slate-900 p-5">
        <h2 className="text-xl font-bold">Project requirements</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{requirements.map(([name, description], i) => <article key={name} className="rounded-xl bg-slate-950 p-4"><p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{String(i + 1).padStart(2, "0")} · {name}</p><p className="mt-2 text-sm text-slate-300">{description}</p></article>)}</div>
        <div className="mt-5 grid gap-5 md:grid-cols-2"><Rubric title="HTML · 35 marks" items={["Structure and semantic HTML · 10", "Required sections and content · 15", "Navigation, images, and links · 10"]}/><Rubric title="CSS · 45 marks" items={["Typography, colors, and visual design · 10", "Box model and spacing · 10", "Flexbox or Grid · 10", "Hover effects and details · 5", "Mobile responsiveness · 10"]}/><Rubric title="Code quality and completion · 20 marks" items={["Readable and organized code · 5", "Consistent design · 5", "HTML and CSS work together · 5", "Requirements completed independently · 5"]}/></div>
      </section>

      {gate?.eligible && <>
        <section className="mt-7 grid gap-5 xl:grid-cols-2">
          <CodeEditor title="HTML document · write from scratch" value={htmlCode} onChange={setHtmlCode} placeholder="Write your complete HTML document here…"/>
          <CodeEditor title="External stylesheet · style.css" value={cssCode} onChange={setCssCode} placeholder="Write your CSS rules here…"/>
        </section>
        <div className="mt-4 flex flex-wrap gap-3"><button disabled={busy} onClick={() => { makePreview(); void evaluate(false); }} className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-bold text-slate-950 disabled:opacity-50"><Eye size={17}/> {busy ? "Checking…" : "Run preview and checks"}</button><button disabled={busy} onClick={resetEditors} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 font-semibold disabled:opacity-50"><RotateCcw size={16}/> Reset</button><button disabled={busy} onClick={() => void evaluate(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 font-bold text-slate-950 disabled:opacity-50"><Send size={16}/> {busy ? "Submitting…" : "Submit assessment"}</button></div>
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-900"><div className="border-b border-white/10 px-4 py-3 font-bold">Live portfolio preview</div><iframe title="Your personal portfolio preview" sandbox="" srcDoc={preview} className="h-[600px] w-full bg-white"/></section>
      </>}

      {result && <EvaluationPanel result={result} attempt={gate?.submission?.attempt} submitted={resultSaved}/>}
    </div>
  </main>;
}

function CodeEditor({ title, value, onChange, placeholder }: { title: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block overflow-hidden rounded-2xl border border-white/10 bg-slate-900"><span className="block border-b border-white/10 px-4 py-3 text-sm font-bold">{title}</span><textarea value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} spellCheck={false} className="min-h-[480px] w-full resize-y bg-slate-950 p-4 font-mono text-sm leading-6 text-cyan-100 outline-none placeholder:text-slate-600 focus:ring-2 focus:ring-cyan-400"/></label>;
}
function Rubric({ title, items }: { title: string; items: string[] }) { return <div className="rounded-xl border border-white/10 bg-slate-950 p-4"><h3 className="font-bold text-cyan-100">{title}</h3><ul className="mt-2 space-y-1 text-sm text-slate-400">{items.map(item => <li key={item}>• {item}</li>)}</ul></div>; }
function EvaluationPanel({ result, attempt, submitted }: { result: Evaluation; attempt?: number; submitted: boolean }) {
  return <section className="mt-7 rounded-2xl border border-cyan-300/20 bg-slate-900 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black">{submitted ? `Submission ${attempt} feedback` : "Run feedback"}</h2><p className="mt-1 text-sm text-slate-400">{result.status === "complete" ? "Assessment passed" : "Keep improving and resubmit when ready."}</p></div><div className="rounded-xl bg-slate-950 px-5 py-3 text-center"><p className="text-3xl font-black text-cyan-200">{result.score}<span className="text-base text-slate-400">/100</span></p><p className="text-xs text-slate-500">HTML {result.htmlScore}/35 · CSS {result.cssScore}/45 · Quality {result.qualityScore}/20</p></div></div><div className="mt-5 grid gap-3 md:grid-cols-2">{result.categories.map(category => <details key={category.name} className="rounded-xl border border-white/10 bg-slate-950 p-4"><summary className="cursor-pointer font-semibold">{category.name}<span className="float-right text-cyan-200">{category.marks}/{category.maxMarks}</span></summary><div className="mt-3 grid gap-4 sm:grid-cols-2"><div><h3 className="text-sm font-bold text-emerald-300">Completed</h3><ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-300">{category.completedRequirements.map(item => <li key={item}>{item}</li>)}</ul></div><div><h3 className="text-sm font-bold text-amber-200">To improve</h3><ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-300">{category.missingRequirements.map(item => <li key={item}>{item}</li>)}{category.suggestions.map((item, i) => <li key={`${item}-${i}`}>{item}</li>)}</ul></div></div>{category.errors.length > 0 && <ul className="mt-3 list-disc pl-5 text-xs text-rose-200">{category.errors.map(item => <li key={item}>{item}</li>)}</ul>}</details>)}</div>{result.errors.length > 0 && <div className="mt-4 rounded-xl bg-rose-400/10 p-4 text-sm text-rose-100"><h3 className="font-bold">Fix these errors</h3><ul className="mt-1 list-disc pl-5">{result.errors.map(item => <li key={item}>{item}</li>)}</ul></div>}<p className="mt-4 text-xs text-slate-500">Completed requirements: {result.completedRequirements.length} · Areas to improve: {result.missingRequirements.length}. Use the hints above and submit again; each submission is saved as an attempt.</p></section>;
}
