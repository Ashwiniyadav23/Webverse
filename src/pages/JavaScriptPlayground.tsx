
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Code2,
  Play,
  RotateCcw,
  Terminal,
  Trash2,
} from "lucide-react";

const starterCode = `const name = "WebVerse";
const age = 15;

console.log("Welcome to " + name);
console.log("Your age is:", age);

for (let i = 1; i <= 5; i++) {
  console.log("Practice number:", i);
}`;

type OutputLine = {
  type: "log" | "error";
  text: string;
};

export default function JavaScriptPlayground() {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [hasRun, setHasRun] = useState(false);

  function runCode() {
    setHasRun(true);
    setOutput([]);

    const lines: OutputLine[] = [];
    const iframe = document.createElement("iframe");

    iframe.sandbox.add("allow-scripts");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;

      const data = event.data as {
        type?: string;
        values?: string[];
        message?: string;
      };

      if (data.type === "log") {
        lines.push({
          type: "log",
          text: (data.values ?? []).join(" "),
        });
        setOutput([...lines]);
      } else if (data.type === "error") {
        lines.push({
          type: "error",
          text: data.message ?? "An error occurred.",
        });
        setOutput([...lines]);
      } else if (data.type === "done") {
        window.removeEventListener("message", handleMessage);
        iframe.remove();
      }
    };

    window.addEventListener("message", handleMessage);

    iframe.srcdoc = `
      <script>
        const send = (data) => parent.postMessage(data, "*");

        const format = (value) => {
          if (typeof value === "string") return value;
          try { return JSON.stringify(value) ?? String(value); }
          catch { return String(value); }
        };

        console.log = (...args) =>
          send({ type: "log", values: args.map(format) });

        window.onerror = (message, source, line, column) => {
          send({
            type: "error",
            message: String(message) + " (line " + line + ")"
          });
        };

        window.addEventListener("load", () => {
          try {
            const userCode = ${JSON.stringify(code).replace(/<\/script/gi, "<\\/script")};
            new Function(userCode)();
          } catch (error) {
            send({
              type: "error",
              message: error instanceof Error
                ? error.message
                : String(error)
            });
          } finally {
            send({ type: "done" });
          }
        });
      </script>
    `;
  }

  function resetCode() {
    setCode(starterCode);
    setOutput([]);
    setHasRun(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-300 hover:text-cyan-400"
        >
          <ArrowLeft size={18} />
          Home
        </Link>

        <h1 className="flex items-center gap-2 text-xl font-bold">
          <Code2 className="text-cyan-400" />
          JavaScript Playground
        </h1>

        <button
          onClick={resetCode}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 hover:bg-white/10"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="mb-8 leading-7 text-slate-400">
          Write JavaScript, run your code, and inspect the console output.
          Start experimenting with variables, loops, functions, and conditions.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-3">
              <span className="font-semibold">Code Editor</span>
              <span className="text-xs text-yellow-300">JavaScript</span>
            </div>

            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
              aria-label="JavaScript code editor"
              className="min-h-[450px] w-full resize-y bg-slate-900 p-5 font-mono text-sm leading-7 text-cyan-100 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-slate-900 p-4">
              <span className="text-xs text-slate-500">
                JavaScript · Run manually
              </span>
              <button
                onClick={runCode}
                className="flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-2.5 font-bold text-slate-950 hover:bg-cyan-300"
              >
                <Play size={17} />
                Run Code
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-4 py-3">
              <div className="flex items-center gap-2 font-semibold">
                <Terminal size={18} className="text-cyan-400" />
                Console Output
              </div>

              <button
                onClick={() => {
                  setOutput([]);
                  setHasRun(false);
                }}
                aria-label="Clear console"
                className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="min-h-[450px] space-y-2 bg-slate-950 p-5 font-mono text-sm">
              {!hasRun && output.length === 0 && (
                <p className="text-slate-500">
                  Click Run Code to see your output here.
                </p>
              )}

              {output.map((item, index) => (
                <div
                  key={`${index}-${item.text}`}
                  className={
                    item.type === "error"
                      ? "whitespace-pre-wrap text-red-400"
                      : "whitespace-pre-wrap text-emerald-300"
                  }
                >
                  <span className="mr-2 text-slate-600">
                    {item.type === "error" ? "!" : "›"}
                  </span>
                  {item.text}
                </div>
              ))}

              {hasRun && output.length === 0 && (
                <p className="text-slate-500">
                  Code executed. No console output.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
          <h2 className="font-bold text-cyan-300">Try these challenges</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-sm leading-6 text-slate-300">
            <li>Print your name using console.log().</li>
            <li>Write a loop that prints numbers from 1 to 10.</li>
            <li>Create a function that adds two numbers.</li>
            <li>Use an if/else condition to check whether a number is even.</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
