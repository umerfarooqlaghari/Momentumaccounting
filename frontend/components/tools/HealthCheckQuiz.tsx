"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { ContactGate } from "@/components/forms/ContactGate";
import { track } from "@/lib/analytics";
import type { Quiz } from "@/lib/types";

// Rebuild of the "right accountant" ScoreApp quiz: scores the visitor and captures their details (§5.2).
export function HealthCheckQuiz({ quiz }: { quiz: Quiz }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const total = quiz.questions.length;
  const done = answers.length === total;

  const max = quiz.questions.reduce((s, q) => s + Math.max(...q.answers.map((a) => a.score)), 0);
  const score = answers.reduce((s, a, i) => s + quiz.questions[i].answers[a].score, 0);
  const percent = max ? Math.round((score / max) * 100) : 0;
  const band = quiz.bands.find((b) => percent >= b.min && percent <= b.max) ?? quiz.bands[0];

  const categories = [...new Set(quiz.questions.map((q) => q.category ?? "General"))].map((cat) => {
    const idx = quiz.questions.map((q, i) => ((q.category ?? "General") === cat ? i : -1)).filter((i) => i >= 0);
    const got = idx.reduce((s, i) => s + (answers[i] !== undefined ? quiz.questions[i].answers[answers[i]].score : 0), 0);
    const possible = idx.reduce((s, i) => s + Math.max(...quiz.questions[i].answers.map((a) => a.score)), 0);
    return { cat, percent: possible ? Math.round((got / possible) * 100) : 0 };
  });

  const choose = (i: number) => {
    const next = [...answers.slice(0, step), i];
    setAnswers(next);
    if (step < total - 1) setStep(step + 1);
  };

  const restart = () => {
    setAnswers([]);
    setStep(0);
  };

  if (!done) {
    const q = quiz.questions[step];
    return (
      <div className="rounded-[28px] border border-charcoal/10 bg-white p-6 shadow-[0_40px_80px_-40px_rgb(34_32_30/0.35)] sm:p-10">
        <div className="flex items-center justify-between text-sm font-semibold text-muted">
          <span>
            Question {step + 1} of {total}
          </span>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 hover:bg-stone-100">
              <ArrowLeft aria-hidden className="size-4" /> Back
            </button>
          )}
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step} aria-label="Quiz progress">
          <div className="h-full rounded-full bg-teal transition-all duration-500" style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <fieldset key={step} className="mt-8 animate-[fade-in_0.4s_ease]">
          <legend className="text-2xl font-extrabold text-charcoal-900 sm:text-3xl">{q.question}</legend>
          <div className="mt-6 grid gap-3">
            {q.answers.map((a, i) => (
              <button
                key={a.label}
                type="button"
                onClick={() => choose(i)}
                aria-pressed={answers[step] === i}
                className={`min-h-14 rounded-2xl border px-5 py-4 text-left text-lg font-medium transition-all hover:-translate-y-0.5 hover:border-teal ${
                  answers[step] === i ? "border-teal bg-teal-50" : "border-charcoal/15"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="rounded-[28px] border border-charcoal/10 bg-white p-6 shadow-[0_40px_80px_-40px_rgb(34_32_30/0.35)] sm:p-10">
        <p className="text-sm font-semibold tracking-wide text-teal-ink uppercase">All done</p>
        <h2 className="mt-2 text-3xl font-extrabold text-charcoal-900">Where should we send your results?</h2>
        <p className="mt-3 text-lg text-muted">See your score, what it means and practical next steps.</p>
        <div className="mt-8">
          <ContactGate
            type="quiz"
            submitLabel="Show my results"
            answers={{
              quizScore: `${percent}%`,
              result: band?.title,
              ...Object.fromEntries(quiz.questions.map((q, i) => [q.question, q.answers[answers[i]].label])),
            }}
            onDone={() => {
              track("quiz_complete", { score: percent });
              setUnlocked(true);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-[fade-in_0.5s_ease] overflow-hidden rounded-[28px] bg-charcoal-900 p-6 text-white sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="relative mx-auto size-48">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#33CBCC"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - percent / 100)}
              className="transition-[stroke-dashoffset] duration-1000"
            />
          </svg>
          <p className="absolute inset-0 grid place-items-center text-center">
            <span>
              <span className="block text-5xl font-extrabold">{percent}%</span>
              <span className="text-sm text-white/60">your score</span>
            </span>
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-extrabold">{band?.title}</h2>
          <p className="mt-3 text-lg text-white/75">{band?.text}</p>
          <ul className="mt-6 space-y-3">
            {categories.map((c) => (
              <li key={c.cat}>
                <div className="flex justify-between text-sm">
                  <span>{c.cat}</span>
                  <span className="font-semibold tabular-nums">{c.percent}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-teal" style={{ width: `${c.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/book-a-call" className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-6 font-semibold text-charcoal-900 hover:bg-[#2ab8b9]">
              Talk to us about your results
            </Link>
            <button onClick={restart} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 font-semibold hover:bg-white/10">
              <RotateCcw aria-hidden className="size-4" /> Retake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
