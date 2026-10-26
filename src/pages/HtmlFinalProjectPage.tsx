import { useEffect, useState, type InputHTMLAttributes } from "react";
import { ArrowLeft, CheckCircle2, Circle, Code2, FileUp, LoaderCircle, Save, Send, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { apiUrl } from "../utils/api";
import { getAuth } from "../utils/auth";
import { saveLessonProgress } from "../utils/progress";
import { portalPages } from "../data/htmlPhaseOne";

const stages = [
  { id: "plan", title: "1. Plan the six pages", details: "Create separate files for Home, Profile, Courses, Feedback, Grades Table, and Contact Us. Sketch the shared navigation and plan dummy student/contact details.", checkpoint: "My folder contains a clear plan for all six HTML pages." },
  { id: "document", title: "2. Build Home", details: "Use a valid HTML document, header and h1 title, nav list of links, main welcome message, and footer.", checkpoint: "Home has all required landmarks and navigation." },
  { id: "about", title: "3. Build Profile and Courses", details: "Add profile information, picture with alt text, hobbies and goals. Add course headings, descriptions, and a course/module list.", checkpoint: "Profile and Courses meet their listed content requirements." },
  { id: "projects", title: "4. Build Feedback", details: "Create a labeled form with text and email inputs, radio buttons, checkboxes, textarea, dropdown, and submit button.", checkpoint: "The form is structurally complete and labels match controls." },
  { id: "education-media", title: "5. Build Grades Table", details: "Create a grades table with caption, thead, tbody, tfoot, rows, headers, and data cells for course, grade, and credits.", checkpoint: "The table structure and columns are correct." },
  { id: "contact-review", title: "6. Build Contact Us and review", details: "Use dummy details and mailto links. Check links, relative paths, required tags, and open all six pages in a browser.", checkpoint: "Every page and navigation link has been reviewed." },
];

const checks = [
  ["structure", "All six required HTML pages exist"],
  ["about", "Navigation works between the pages"],
  ["navigation", "Each page contains its required HTML elements"],
  ["projects", "Images include appropriate alt attributes"],
  ["education", "Links and relative paths work"],
  ["multimedia", "Feedback form has required fields and associated labels"],
  ["contact", "Grades table uses the required structural tags"],
  ["readme-assets", "Semantic HTML is used appropriately"],
  ["html-only", "No CSS or JavaScript has been used"],
  ["browser-review", "All pages have been tested in a browser"],
] as const;
const directoryPickerProps = { webkitdirectory: "", directory: "" } as InputHTMLAttributes<HTMLInputElement>;

type Category = { name: string; marks: number; maxMarks: number; completedRequirements: string[]; missingRequirements: string[]; errors: string[]; suggestions: string[] };
type ProjectPageSpec = { name: string; time: string; requirements: string };
type ProjectCurriculum = { projectPages?: ProjectPageSpec[]; submissionChecklist?: { id: string; label: string }[]; evaluationCriteria?: string[] };
type Submission = { status: string; attempt: number; score: number | null; categories: Category[]; completedRequirements: string[]; missingRequirements: string[]; errors: string[]; suggestions: string[]; submittedAt: string; history: { attempt: number; score: number; status: string; submittedAt: string; summary: string }[]; files: { path: string; mimeType: string; size: number }[] };
type ProjectState = { stages: string[]; checklist: string[]; submission: Submission | null; ready: boolean };

async function responseJson(response: Response) {
  const body = await response.json();
  if (!response.ok) throw new Error(body.message || "The request did not succeed.");
  return body;
}

export default function HtmlFinalProjectPage({ lessonId }: { lessonId?: string }) {
  const auth = getAuth();
  const [state, setState] = useState<ProjectState>({ stages: [], checklist: [], submission: null, ready: !lessonId });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(Boolean(auth?.token));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(auth?.token ? "" : "Sign in as a student to save your project progress and submit files.");
  const [notice, setNotice] = useState("");
  const [curriculumText, setCurriculumText] = useState("");
  const [projectCurriculum, setProjectCurriculum] = useState<ProjectCurriculum | null>(null);
  const projectPages = projectCurriculum?.projectPages || portalPages;
  const checkItems = projectCurriculum?.submissionChecklist || checks.map(([id, label]) => ({ id, label }));
  const percent = Math.round((state.stages.length / stages.length) * 100);

  useEffect(() => {
    if (lessonId) fetch(apiUrl(`lessons/${lessonId}`)).then(response => response.json()).then(data => { setCurriculumText(data.lesson?.content || ""); setProjectCurriculum(data.lesson?.curriculum || null); }).catch(() => undefined);
  }, [lessonId]);

  useEffect(() => {
    if (!auth?.token) return;
    fetch(apiUrl("progress/final-project/me"), { headers: { Authorization: `Bearer ${auth.token}` } })
      .then(responseJson).then((data) => setState({ stages: data.stages || [], checklist: data.checklist || [], submission: data.submission || null, ready: Boolean(data.ready) }))
      .catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false));
  }, [auth?.token]);

  async function saveProgress(next: ProjectState) {
    if (!auth?.token) return;
    setSaving(true); setError("");
    try {
      const data = await responseJson(await fetch(apiUrl("progress/final-project/me"), {
        method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ stages: next.stages, checklist: next.checklist }),
      }));
      setState((current) => ({ ...current, stages: data.stages || [], checklist: data.checklist || [] }));
      setNotice("Project checkpoints saved to your account.");
    } catch (reason) { setError((reason as Error).message); }
    finally { setSaving(false); }
  }

  if (lessonId && auth?.token && !loading && !state.ready) return <main className="min-h-screen bg-slate-950 px-5 py-16 text-white"><div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-7"><h1 className="text-2xl font-black">Final project is locked</h1><p className="mt-3 text-slate-300">Complete each section's learning, editor tasks, quiz, and independent assessment before starting the six-page portal.</p><Link to="/courses/html-fundamentals" className="mt-5 inline-block rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950">Return to course</Link></div></main>;

  function toggle(setName: "stages" | "checklist", id: string) {
    const values = state[setName];
    const next = { ...state, [setName]: values.includes(id) ? values.filter((value) => value !== id) : [...values, id] };
    setState(next);
    setNotice("");
  }

  async function filePayload(file: File) {
    const path = (file.webkitRelativePath || file.name).replace(/^[^/]+\//, "");
    const isText = /\.(html?|md|svg)$/i.test(path);
    if (isText) return { path, content: await file.text(), encoding: "utf8", mimeType: file.type || "text/plain" };
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error(`Unable to read ${file.name}`)); reader.readAsDataURL(file);
    });
    return { path, content: dataUrl.split(",")[1] || "", encoding: "base64", mimeType: file.type || "application/octet-stream" };
  }

  async function submit() {
    if (!auth?.token) { setError("Sign in as a student before submitting."); return; }
    if (!selectedFiles.length) { setError("Choose your HTML files, README, and any assets before submitting."); return; }
    setSaving(true); setError(""); setNotice("");
    try {
      const files = await Promise.all(selectedFiles.map(filePayload));
      const data = await responseJson(await fetch(apiUrl("progress/final-project/submissions"), {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` }, body: JSON.stringify({ files }),
      }));
      const submission = data.submission as Submission;
      setState((current) => ({ ...current, submission }));
      saveLessonProgress(lessonId ? `html-final-project-${lessonId}` : "html-final-project", { completed: submission.status === "complete", quizScore: submission.score ?? 0 });
      setSelectedFiles([]);
      setNotice(submission.status === "complete" ? "Portfolio complete! Your final project is marked complete." : "Submission evaluated. Review the feedback below, revise your project, and submit again.");
    } catch (reason) { setError((reason as Error).message); }
    finally { setSaving(false); }
  }

  return <div className="min-h-screen bg-slate-950 text-white">
    <header className="border-b border-white/10"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
      <Link to="/" className="flex items-center gap-2"><Code2 className="text-cyan-400"/><span className="text-xl font-black">Web<span className="text-cyan-400">Verse</span></span></Link>
      <Link to="/courses/html-fundamentals" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-300"><ArrowLeft size={16}/> Phase 1 course</Link>
    </div></header>
    <main className="mx-auto max-w-6xl px-5 py-8">
      <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">Phase 1 · Final Project</p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">Student Profile &amp; Course Portal</h1>
      <p className="mt-3 max-w-3xl leading-7 text-slate-300">After completing the six learning sections and their tasks, build six connected pages using HTML only. Do not use CSS or JavaScript. Submit your pages, receive feedback on missing requirements and incorrect structure, then revise and resubmit.</p>
      {curriculumText && <details className="mt-5 rounded-2xl border border-white/10 bg-slate-900 p-5"><summary className="cursor-pointer font-bold text-cyan-200">Project instructions from the course</summary><pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-slate-300">{curriculumText}</pre></details>}

      <section className="mt-7 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5" aria-labelledby="progress-title">
        <div className="flex items-center justify-between"><h2 id="progress-title" className="font-bold">Project checkpoints</h2><span className="text-sm text-cyan-200">{state.stages.length} / {stages.length} · {percent}%</span></div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${percent}%` }}/></div>
      </section>

      {error && <p role="alert" className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-rose-200">{error}</p>}
      {notice && <p role="status" className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-200">{notice}</p>}

      <section className="mt-8 space-y-4" aria-labelledby="stages-title"><h2 id="stages-title" className="text-2xl font-black">Build in small stages</h2>
        {stages.map((stage) => <article key={stage.id} className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <div className="flex items-start gap-3"><button type="button" aria-pressed={state.stages.includes(stage.id)} onClick={() => toggle("stages", stage.id)} className="mt-1 text-cyan-300" aria-label={`${state.stages.includes(stage.id) ? "Unmark" : "Mark"} ${stage.title} checkpoint`}>{state.stages.includes(stage.id) ? <CheckCircle2/> : <Circle/>}</button>
            <div><h3 className="font-bold">{stage.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{stage.details}</p><p className="mt-2 text-sm text-cyan-100"><strong>Checkpoint:</strong> {stage.checkpoint}</p></div></div>
        </article>)}
        <button type="button" onClick={() => saveProgress(state)} disabled={saving || loading} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 disabled:opacity-60"><Save size={18}/>{saving ? "Saving…" : "Save checkpoints"}</button>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7" aria-labelledby="requirements-title">
        <h2 id="requirements-title" className="text-2xl font-black">Six pages to build</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{projectPages.map((page, index) => <article key={page.name} className="rounded-xl bg-slate-950 p-4"><h3 className="font-bold text-cyan-200">{index + 1}. {page.name}</h3><p className="mt-1 text-xs text-slate-400">Maximum time: {page.time}</p><p className="mt-2 text-sm leading-6 text-slate-300">{page.requirements}</p></article>)}</div>
        {projectCurriculum?.evaluationCriteria && <div className="mt-5"><h3 className="font-bold text-cyan-200">Evaluation criteria</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{projectCurriculum.evaluationCriteria.map(item => <li key={item}>{item}</li>)}</ul></div>}
        <h2 className="mt-7 text-2xl font-black">Requirements and hints</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div><h3 className="font-bold text-cyan-200">Submission requirements</h3><p className="mt-3 text-sm leading-6 text-slate-300">Create separate HTML files for all six pages. Use index.html, profile.html, courses.html, feedback.html, grades.html, and contact.html so the automated review can find each page. Link every page using working relative paths, include valid document structure, check image paths, and ensure the form and table are structurally correct. Test all pages in a browser.</p></div>
          <div><h3 className="font-bold text-cyan-200">Hints</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300"><li>Plan the page outline before writing markup.</li><li>Resolve each relative path from the HTML file that uses it.</li><li>Use alt text to describe an informative image.</li><li>Associate each form label with its control.</li><li>The feedback form practices HTML structure only; without a configured backend or form service, it will not store or deliver submissions.</li></ul><p className="mt-4 text-sm text-slate-400">This project page gives requirements and hints, not the completed project code.</p></div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7" aria-labelledby="checklist-title">
        <h2 id="checklist-title" className="text-2xl font-black">Before you submit</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{checkItems.map(({ id, label }) => <label key={id} className="flex items-start gap-3 rounded-xl bg-slate-950 p-3 text-sm text-slate-300"><input className="mt-1 accent-cyan-400" type="checkbox" checked={state.checklist.includes(id)} onChange={() => toggle("checklist", id)}/><span>{label}</span></label>)}</div>
        <button type="button" onClick={() => saveProgress(state)} disabled={saving || loading} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-bold hover:border-cyan-400"><Save size={16}/>Save self-check</button>
      </section>

      <section className="mt-10 rounded-2xl border border-cyan-400/20 bg-slate-900 p-5 sm:p-7" aria-labelledby="submission-title">
        <div className="flex items-center gap-3"><FileUp className="text-cyan-300"/><div><h2 id="submission-title" className="text-2xl font-black">Submit or revise</h2><p className="mt-1 text-sm text-slate-400">Choose the project folder’s files. Include every HTML file, README.md, and every referenced asset (up to 30 files and 5.5 MB).</p></div></div>
        <label className="mt-5 block text-sm font-semibold" htmlFor="project-files">Project files</label>
        <input {...directoryPickerProps} id="project-files" type="file" multiple accept=".html,.htm,.md,.png,.jpg,.jpeg,.gif,.webp,.svg,.mp3,.wav,.ogg,.mp4,.webm,.pdf" onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))} className="mt-2 block w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:font-bold file:text-slate-950"/>
        {selectedFiles.length > 0 && <p className="mt-2 text-sm text-slate-300">{selectedFiles.length} file(s) selected: {selectedFiles.map((file) => file.webkitRelativePath || file.name).join(", ")}</p>}
        <p className="mt-3 text-sm leading-6 text-slate-400">Automated checks provide a useful first review of submitted HTML and file paths. Review the feedback and test your site locally before resubmitting.</p>
        <button type="button" onClick={submit} disabled={saving || loading || !selectedFiles.length} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">{saving ? <LoaderCircle className="animate-spin" size={18}/> : <Send size={18}/>} {state.submission ? "Submit revision" : "Submit for evaluation"}</button>
      </section>

      {state.submission && <section className="mt-10 rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7" aria-labelledby="feedback-title">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-widest text-cyan-400">Attempt {state.submission.attempt}</p><h2 id="feedback-title" className="mt-1 text-2xl font-black">Evaluation feedback</h2></div><div className="flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2"><Trophy className="text-yellow-300" size={18}/><strong>{state.submission.score ?? 0} / 100</strong><span className="text-sm text-slate-400">{state.submission.status === "complete" ? "Complete" : "Revision needed"}</span></div></div>
        <p className="mt-3 text-sm text-slate-400">Submitted {new Date(state.submission.submittedAt).toLocaleString()} · {state.submission.files?.length || 0} files received</p>
        <div className="mt-5 space-y-3">{state.submission.categories?.map((category) => <details key={category.name} className="rounded-xl border border-white/10 bg-slate-950 p-4"><summary className="cursor-pointer font-semibold">{category.name} <span className="float-right text-cyan-200">{category.marks} / {category.maxMarks}</span></summary><div className="mt-3 grid gap-4 text-sm sm:grid-cols-2"><div><h3 className="font-bold text-emerald-300">Completed</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">{category.completedRequirements.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3 className="font-bold text-amber-200">To improve</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">{category.missingRequirements.map((item) => <li key={item}>{item}</li>)}{category.suggestions.map((item) => <li key={item}>{item}</li>)}</ul></div></div>{category.errors.length > 0 && <ul className="mt-3 list-disc pl-5 text-sm text-rose-200">{category.errors.map((item) => <li key={item}>{item}</li>)}</ul>}</details>)}</div>
        <div className="mt-5 grid gap-5 md:grid-cols-2"><div><h3 className="font-bold text-emerald-300">Requirements found</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{state.submission.completedRequirements.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h3 className="font-bold text-amber-200">Missing requirements</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{state.submission.missingRequirements.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
        {state.submission.history?.length > 1 && <details className="mt-5 rounded-xl bg-slate-950 p-4"><summary className="cursor-pointer font-bold">Previous attempts ({state.submission.history.length - 1})</summary><ol className="mt-3 space-y-2 text-sm text-slate-300">{state.submission.history.slice(0, -1).map((entry) => <li key={entry.attempt}>Attempt {entry.attempt}: {entry.score}/100 — {entry.summary}</li>)}</ol></details>}
        <p className="mt-5 text-sm text-slate-400">The automated review checks common HTML requirements and file references; use it as actionable feedback and verify browser behavior yourself.</p>
      </section>}
      {loading && <p className="mt-4 text-sm text-slate-400">Loading saved project progress…</p>}
    </main>
  </div>;
}
