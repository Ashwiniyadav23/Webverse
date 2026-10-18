
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Eye,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

const defaultHTML = `<div class="card">
  <h1>Hello, WebVerse!</h1>
  <p>I am learning CSS.</p>
  <button>Click me</button>
</div>`;

const defaultCSS = `body {
  font-family: Arial, sans-serif;
  background: #f1f5f9;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  max-width: 350px;
  margin: 40px auto;
  box-shadow: 0 8px 25px #00000015;
}

h1 {
  color: #0891b2;
}

button {
  background: #0891b2;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
}`;

export default function PlaygroundPage() {
  const [html, setHtml] = useState(defaultHTML);
  const [css, setCss] = useState(defaultCSS);

  function resetCode() {
    setHtml(defaultHTML);
    setCss(defaultCSS);
  }

  const previewDocument = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>${css}</style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

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
          CSS Playground
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
        <p className="mb-8 text-slate-400">
          Edit your HTML and CSS. Your preview updates automatically.
          Experiment, break things, and learn by doing!
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="border-b border-white/10 bg-slate-900 px-4 py-3 font-semibold">
                HTML Editor
              </div>

              <textarea
                value={html}
                onChange={(event) => setHtml(event.target.value)}
                spellCheck={false}
                aria-label="HTML code editor"
                className="min-h-64 w-full resize-y bg-slate-900 p-4 font-mono text-sm leading-6 text-cyan-200 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="border-b border-white/10 bg-slate-900 px-4 py-3 font-semibold">
                CSS Editor
              </div>

              <textarea
                value={css}
                onChange={(event) => setCss(event.target.value)}
                spellCheck={false}
                aria-label="CSS code editor"
                className="min-h-80 w-full resize-y bg-slate-900 p-4 font-mono text-sm leading-6 text-purple-200 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 border-b border-white/10 bg-slate-900 px-4 py-3 font-semibold">
              <Eye size={18} className="text-cyan-400" />
              Live Preview
            </div>

            <iframe
              title="HTML and CSS live preview"
              srcDoc={previewDocument}
              sandbox=""
              className="min-h-[700px] w-full bg-white"
            />
          </section>
        </div>
      </main>
    </div>
  );
}
