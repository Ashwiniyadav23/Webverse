import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, Code2, Eye, Lightbulb, RotateCcw, Trophy } from "lucide-react";
import type { HtmlTopicContent } from "../data/htmlFundamentals";
import { getProgress, saveLessonProgress } from "../utils/progress";

const PASS_SCORE = 75;
type MilestoneAssignment = {
  title: string;
  requirements: string[];
  criteria: string[];
  problemStatement?: string;
  expectedBehavior?: string[];
  hints?: string[];
  submissionChecklist?: string[];
};
type InterviewQuestion = [string, string];

export type InteractiveHtmlMilestoneProps = {
  lessonId: string;
  milestoneNumber: number;
  milestoneTitle: string;
  topics: HtmlTopicContent[];
  assignments: MilestoneAssignment[];
  interviewQuestions: InterviewQuestion[];
  referenceTitle: string;
  referenceUrl: string;
};

const BLANK_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My HTML project</title>
</head>
<body>
  <!-- Build your project here -->
</body>
</html>`;

export default function HtmlFundamentalsMilestone({
  lessonId,
  milestoneNumber,
  milestoneTitle,
  topics,
  assignments,
  interviewQuestions,
  referenceTitle,
  referenceUrl,
}: InteractiveHtmlMilestoneProps) {
  const progress = getProgress()[lessonId];
  const savedTopicScores = progress?.topicScores ?? {};
  const savedTopicAttempts = progress?.topicAttempts ?? {};
  const savedChecks = progress?.assignmentChecks ?? {};
  const [activeTopic, setActiveTopic] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Record<number, number>>>({});
  const [submitted, setSubmitted] = useState<Set<number>>(
    () => new Set(Object.keys(savedTopicScores).map(Number))
  );
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [activeAssignment, setActiveAssignment] = useState(0);
  const [draft, setDraft] = useState(BLANK_HTML);
  const [assignmentChecks, setAssignmentChecks] = useState(savedChecks);
  const [topicScores, setTopicScores] = useState(savedTopicScores);
  const [topicAttempts, setTopicAttempts] = useState(savedTopicAttempts);

  const allTopicsPassed = useMemo(
    () => topics.every((_, index) => (topicScores[String(index)] ?? 0) >= PASS_SCORE),
    [topicScores, topics]
  );
  const allAssignmentsDone = useMemo(
    () => assignments.every((assignment, assignmentIndex) =>
      assignment.criteria.every((_, criterionIndex) => assignmentChecks[`${assignmentIndex}:${criterionIndex}`])
      && (assignment.submissionChecklist ?? []).every((_, checklistIndex) => assignmentChecks[`submission:${assignmentIndex}:${checklistIndex}`])
    ),
    [assignmentChecks, assignments]
  );
  const milestoneComplete = allTopicsPassed && allAssignmentsDone;
  const topic = topics[activeTopic];
  const topicAnswers = answers[activeTopic] ?? {};
  const isSubmitted = submitted.has(activeTopic);
  const rightAnswers = topic.quiz.reduce((total, question, index) =>
    total + (topicAnswers[index] === question.answerIndex ? 1 : 0), 0
  );
  const score = Math.round((rightAnswers / topic.quiz.length) * 100);
  const allAnswered = topic.quiz.every((_, index) => topicAnswers[index] !== undefined);
  const previewDocument = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Preview</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#1e293b;line-height:1.5}h1{color:#0891b2}</style></head><body>${draft.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")}</body></html>`;

  function selectAnswer(questionIndex: number, answerIndex: number) {
    setAnswers((current) => ({
      ...current,
      [activeTopic]: { ...(current[activeTopic] ?? {}), [questionIndex]: answerIndex },
    }));
  }

  function submitQuiz() {
    if (!allAnswered) return;
    const latest = getProgress()[lessonId];
    const nextScores = { ...(latest?.topicScores ?? {}), [String(activeTopic)]: score };
    const nextAttempts = { ...(latest?.topicAttempts ?? topicAttempts), [String(activeTopic)]: (latest?.topicAttempts?.[String(activeTopic)] ?? topicAttempts[String(activeTopic)] ?? 0) + 1 };
    setTopicScores(nextScores);
    setTopicAttempts(nextAttempts);
    setSubmitted((current) => new Set(current).add(activeTopic));
    saveLessonProgress(lessonId, {
      completed: false,
      topicScores: nextScores,
      topicAttempts: nextAttempts,
      quizScore: Math.round(Object.values(nextScores).reduce((sum, value) => sum + value, 0) / Object.keys(nextScores).length),
    });
  }

  function retakeQuiz() {
    setAnswers((current) => ({ ...current, [activeTopic]: {} }));
    setSubmitted((current) => {
      const next = new Set(current);
      next.delete(activeTopic);
      return next;
    });
  }

  function setCriterion(assignmentIndex: number, criterionIndex: number, checked: boolean) {
    const key = `${assignmentIndex}:${criterionIndex}`;
    const nextChecks = { ...assignmentChecks, [key]: checked };
    setAssignmentChecks(nextChecks);
    const current = getProgress()[lessonId];
    const complete = topics.every((_, index) => (current?.topicScores?.[String(index)] ?? topicScores[String(index)] ?? 0) >= PASS_SCORE)
      && assignments.every((assignment, taskIndex) => assignment.criteria.every((_, itemIndex) => nextChecks[`${taskIndex}:${itemIndex}`])
        && (assignment.submissionChecklist ?? []).every((_, itemIndex) => nextChecks[`submission:${taskIndex}:${itemIndex}`]));
    saveLessonProgress(lessonId, { assignmentChecks: nextChecks, completed: complete });
  }

  function setSubmissionCheck(assignmentIndex: number, itemIndex: number, checked: boolean) {
    const key = `submission:${assignmentIndex}:${itemIndex}`;
    const nextChecks = { ...assignmentChecks, [key]: checked };
    setAssignmentChecks(nextChecks);
    const current = getProgress()[lessonId];
    const complete = topics.every((_, index) => (current?.topicScores?.[String(index)] ?? topicScores[String(index)] ?? 0) >= PASS_SCORE)
      && assignments.every((assignment, taskIndex) => assignment.criteria.every((_, criterionIndex) => nextChecks[`${taskIndex}:${criterionIndex}`])
        && (assignment.submissionChecklist ?? []).every((_, checklistIndex) => nextChecks[`submission:${taskIndex}:${checklistIndex}`]));
    saveLessonProgress(lessonId, { assignmentChecks: nextChecks, completed: complete });
  }

  function selectAssignment(index: number) {
    setActiveAssignment(index);
    setDraft(BLANK_HTML);
  }

  function assignmentIsComplete(index: number) {
    const assignment = assignments[index];
    return assignment.criteria.every((_, criterionIndex) => assignmentChecks[`${index}:${criterionIndex}`])
      && (assignment.submissionChecklist ?? []).every((_, checklistIndex) => assignmentChecks[`submission:${index}:${checklistIndex}`]);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-2"><Code2 className="text-cyan-400" size={25} /><span className="text-xl font-black">Web<span className="text-cyan-400">Verse</span></span></Link>
          <Link to="/courses/html-fundamentals" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-400"><ArrowLeft size={16} /> Course milestones</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">HTML Fundamentals · Milestone {milestoneNumber} of 4</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">{milestoneTitle}</h1>
            <p className="mt-3 max-w-3xl text-slate-400">Follow the path: learn one topic, study its example, practice, pass its quiz, complete the three assignments, then review interview questions.</p>
          </div>
          <div className="min-w-48 rounded-2xl border border-white/10 bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300"><Trophy size={17} className="text-yellow-400" />Milestone status</div>
            <p className={`mt-2 font-bold ${milestoneComplete ? "text-emerald-300" : "text-cyan-200"}`}>{milestoneComplete ? "Completed" : `${Object.values(topicScores).filter((value) => value >= PASS_SCORE).length}/${topics.length} topics passed`}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${Math.round(((Object.values(topicScores).filter((value) => value >= PASS_SCORE).length + (allAssignmentsDone ? 1 : 0)) / (topics.length + 1)) * 100)}%` }} /></div>
          </div>
        </div>

        <nav aria-label={`Milestone ${milestoneNumber} topics`} className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((item, index) => {
            const passed = (topicScores[String(index)] ?? 0) >= PASS_SCORE;
            return <button key={item.title} type="button" onClick={() => setActiveTopic(index)} aria-current={activeTopic === index ? "step" : undefined} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${activeTopic === index ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-slate-900 hover:border-white/25"}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${passed ? "bg-emerald-400/15 text-emerald-300" : "bg-slate-800 text-slate-300"}`}>{passed ? <CheckCircle2 size={18} /> : index + 1}</span><span className="text-sm font-semibold">{item.title.replace(/^\d+\. /, "")}</span></button>;
          })}
        </nav>

        <section className="mt-6 grid items-start gap-6">
          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
            <div className="flex items-center gap-3"><BookOpen className="text-cyan-400" size={23} /><h2 className="text-2xl font-black">{topic.title}</h2></div>
            <h3 className="mt-6 font-bold text-white">Learn the concept</h3>
            <p className="mt-2 leading-7 text-slate-300">{topic.explanation}</p>
            <h3 className="mt-6 font-bold text-white">Syntax</h3>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-cyan-100"><code>{topic.syntax}</code></pre>
            {topic.syntaxNotes && <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">{topic.syntaxNotes.map((note) => <li key={note}>{note}</li>)}</ul>}
            <h3 className="mt-6 font-bold text-white">Practical example</h3>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-cyan-100"><code>{topic.example}</code></pre>
            <h4 className="mt-4 flex items-center gap-2 font-semibold text-slate-200"><Eye size={17} className="text-cyan-400" />Expected browser output</h4>
            <p className="mt-2 rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4 text-sm leading-6 text-slate-300">{topic.expectedOutput}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div><h3 className="font-bold text-white">Real-world use</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">{topic.useCases.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div><h3 className="font-bold text-white">Common mistakes</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">{topic.commonMistakes.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
            <div className="mt-6 rounded-xl border border-violet-400/20 bg-violet-400/5 p-4"><h3 className="font-bold text-violet-200">Practice before the quiz</h3><ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">{topic.practice.map((item) => <li key={item}>{item}</li>)}</ol></div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-900 p-5 sm:p-7">
            <div className="flex items-center gap-3"><Trophy className="text-yellow-400" size={23} /><h2 className="text-xl font-black">Topic quiz</h2></div>
            <p className="mt-2 text-sm text-slate-400">Answer all four questions. Score at least {PASS_SCORE}% to pass. Hints are optional; answers and explanations appear after submission. Attempts: {topicAttempts[String(activeTopic)] ?? 0}</p>
            <div className="mt-5 space-y-5">
              {topic.quiz.map((question, questionIndex) => (
                <fieldset key={`${activeTopic}-${questionIndex}`} className="border-b border-white/10 pb-5 last:border-0">
                  <legend className="w-full"><span className="flex flex-wrap items-center gap-2 font-semibold">{questionIndex + 1}. {question.kind === "multiple-choice" ? "Choose an answer" : question.kind === "predict-output" ? "Predict the output" : question.kind === "find-and-fix" ? "Find and fix the error" : "Code challenge"}<span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{question.difficulty}</span></span><span className="mt-2 block text-sm leading-6 text-slate-300">{question.prompt}</span></legend>
                  {question.snippet && <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-cyan-100"><code>{question.snippet}</code></pre>}
                  <button type="button" onClick={() => setShowHints((current) => ({ ...current, [`${activeTopic}:${questionIndex}`]: !current[`${activeTopic}:${questionIndex}`] }))} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-yellow-300"><Lightbulb size={14} />{showHints[`${activeTopic}:${questionIndex}`] ? "Hide hint" : "Show hint"}</button>
                  {showHints[`${activeTopic}:${questionIndex}`] && <p className="mt-2 text-xs leading-5 text-yellow-100/80">{question.hint}</p>}
                  <div className="mt-3 space-y-2">{question.options.map((option, optionIndex) => {
                    const selected = topicAnswers[questionIndex] === optionIndex;
                    const correct = question.answerIndex === optionIndex;
                    const feedbackStyle = isSubmitted && correct ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200" : isSubmitted && selected ? "border-red-400/60 bg-red-400/10 text-red-200" : selected ? "border-cyan-400 bg-cyan-400/10 text-cyan-100" : "border-white/10 bg-slate-950 text-slate-300 hover:border-white/25";
                    return <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-5 ${feedbackStyle} ${isSubmitted ? "cursor-default" : ""}`}><input className="mt-1 accent-cyan-400" type="radio" name={`topic-${activeTopic}-question-${questionIndex}`} checked={selected} disabled={isSubmitted} onChange={() => selectAnswer(questionIndex, optionIndex)} />{option}</label>;
                  })}</div>
                  {isSubmitted && <p className="mt-3 text-sm leading-6 text-slate-300">{topicAnswers[questionIndex] === question.answerIndex ? "Correct. " : `Not quite. The correct answer is “${question.options[question.answerIndex]}”. `}{question.explanation}</p>}
                </fieldset>
              ))}
            </div>
            {isSubmitted && <div className="mt-4 rounded-xl bg-slate-950 p-4"><p className="text-xl font-black text-cyan-300">Quiz score: {topicScores[String(activeTopic)] ?? score}%</p><p className="mt-1 text-sm text-slate-400">{(topicScores[String(activeTopic)] ?? score) >= PASS_SCORE ? "Topic passed. You can move to another topic." : `You need ${PASS_SCORE}% to pass. Review the explanations and try again.`}</p></div>}
            <div className="mt-5 flex flex-wrap gap-3">{!isSubmitted ? <button type="button" onClick={submitQuiz} disabled={!allAnswered} className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40">Submit answers</button> : <button type="button" onClick={retakeQuiz} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold hover:border-cyan-400/50"><RotateCcw size={15} />Retake quiz</button>}</div>
          </article>
        </section>

        <section className={`mt-10 rounded-2xl border p-5 sm:p-7 ${allTopicsPassed ? "border-cyan-400/25 bg-cyan-400/5" : "border-white/10 bg-slate-900/70"}`}>
          <h2 className="text-2xl font-black">Practical assignments</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{allTopicsPassed ? "Use what you learned to build each project independently. No finished solution is provided." : `Pass all ${topics.length} topic quizzes to unlock the milestone assignments.`}</p>
          {allTopicsPassed && <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3">{assignments.map((assignment, index) => <button type="button" key={assignment.title} onClick={() => selectAssignment(index)} className={`w-full rounded-xl border p-4 text-left ${activeAssignment === index ? "border-cyan-400/60 bg-cyan-400/10" : "border-white/10 bg-slate-950 hover:border-white/25"}`}><span className="flex items-center justify-between gap-2 font-bold">{index + 1}. {assignment.title}<CheckCircle2 size={17} className={assignmentIsComplete(index) ? "text-emerald-300" : "text-slate-600"} /></span><span className="mt-2 block text-xs text-slate-400">Review requirements and self-check each criterion after you build the project.</span></button>)}</div>
            <article className="rounded-xl border border-white/10 bg-slate-950 p-4 sm:p-5">
              <h3 className="text-lg font-bold">{assignments[activeAssignment].title}</h3>
              {assignments[activeAssignment].problemStatement && <><h4 className="mt-4 text-sm font-bold text-cyan-200">Problem statement</h4><p className="mt-2 text-sm leading-6 text-slate-300">{assignments[activeAssignment].problemStatement}</p></>}
              <h4 className="mt-4 text-sm font-bold text-cyan-200">Requirements</h4><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">{assignments[activeAssignment].requirements.map((item) => <li key={item}>{item}</li>)}</ul>
              {assignments[activeAssignment].expectedBehavior && <><h4 className="mt-4 text-sm font-bold text-cyan-200">Expected behavior</h4><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{assignments[activeAssignment].expectedBehavior.map((item) => <li key={item}>{item}</li>)}</ul></>}
              {assignments[activeAssignment].hints && <details className="mt-4 rounded-lg border border-yellow-400/20 p-3"><summary className="cursor-pointer text-sm font-semibold text-yellow-200">Hints</summary><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">{assignments[activeAssignment].hints.map((item) => <li key={item}>{item}</li>)}</ul></details>}
              <h4 className="mt-5 text-sm font-bold text-cyan-200">Evaluation criteria</h4><p className="mt-1 text-xs text-slate-500">After you have built the project, check each item you completed.</p><ul className="mt-2 space-y-2">{assignments[activeAssignment].criteria.map((criterion, criterionIndex) => { const key = `${activeAssignment}:${criterionIndex}`; return <li key={criterion}><label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-sm leading-5 text-slate-300"><input type="checkbox" checked={Boolean(assignmentChecks[key])} onChange={(event) => setCriterion(activeAssignment, criterionIndex, event.target.checked)} className="mt-0.5 accent-cyan-400" />{criterion}</label></li>; })}</ul>
              {assignments[activeAssignment].submissionChecklist && <><h4 className="mt-5 text-sm font-bold text-cyan-200">Submission checklist</h4><ul className="mt-2 space-y-2">{assignments[activeAssignment].submissionChecklist.map((item, itemIndex) => { const key = `submission:${activeAssignment}:${itemIndex}`; return <li key={item}><label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-sm leading-5 text-slate-300"><input type="checkbox" checked={Boolean(assignmentChecks[key])} onChange={(event) => setSubmissionCheck(activeAssignment, itemIndex, event.target.checked)} className="mt-0.5 accent-cyan-400" />{item}</label></li>; })}</ul></>}
            </article>
          </div>}
          {allTopicsPassed && <div className="mt-6 grid gap-5 lg:grid-cols-2"><div><label htmlFor="assignment-code" className="text-sm font-bold text-slate-200">Optional HTML work area</label><p className="mt-1 text-xs text-slate-500">Start from a blank document shell. Your code is yours to write; no assignment solution is loaded.</p><textarea id="assignment-code" value={draft} onChange={(event) => setDraft(event.target.value)} spellCheck={false} className="mt-3 min-h-72 w-full rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-xs leading-5 text-cyan-100 outline-none focus:border-cyan-400" /></div><div><h3 className="flex items-center gap-2 text-sm font-bold text-slate-200"><Eye size={17} className="text-cyan-400" />Preview</h3><iframe title="Assignment HTML preview" srcDoc={previewDocument} sandbox="allow-forms" className="mt-3 h-72 w-full rounded-xl border border-white/10 bg-white" /></div></div>}
        </section>

        <section className={`mt-10 rounded-2xl border p-5 sm:p-7 ${allAssignmentsDone ? "border-yellow-400/20 bg-yellow-400/5" : "border-white/10 bg-slate-900/60"}`}>
          <div className="flex items-center gap-3"><Trophy className="text-yellow-400" size={22} /><h2 className="text-2xl font-black">Review interview questions</h2></div>
          <p className="mt-2 text-sm text-slate-400">{allAssignmentsDone ? "Use these questions to review the milestone." : "Complete the assignment self-checks to unlock the review section."}</p>
          {allAssignmentsDone && <dl className="mt-5 grid gap-4 md:grid-cols-2">{interviewQuestions.map(([question, answer]) => <div key={question} className="rounded-xl border border-white/10 bg-slate-950 p-4"><dt className="font-semibold text-slate-200">{question}</dt><dd className="mt-2 text-sm leading-6 text-slate-400">{answer}</dd></div>)}</dl>}
          {milestoneComplete && <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300"><CheckCircle2 size={17} />Milestone {milestoneNumber} completed and saved</p>}
        </section>

        <p className="mt-8 text-center text-sm text-slate-500">Reference: <a className="text-cyan-300 underline" href={referenceUrl} target="_blank" rel="noreferrer">{referenceTitle}</a></p>
      </main>
    </div>
  );
}
