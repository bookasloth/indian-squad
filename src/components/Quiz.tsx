"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/data/quiz";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "intro" | "playing" | "done";

export function Quiz({ questions, sport }: { questions: QuizQuestion[]; sport: string }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [order, setOrder] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});

  function start() {
    setOrder(shuffle(questions));
    setIdx(0);
    setPicks({});
    setPhase("playing");
  }

  if (phase === "intro") {
    return (
      <Panel>
        <p className="text-muted-foreground">
          {questions.length} questions on Indian {sport.toLowerCase()}, shuffled every round. Pick an answer to
          see if you got it right.
        </p>
        <PrimaryButton onClick={start}>Start quiz</PrimaryButton>
      </Panel>
    );
  }

  if (phase === "done") {
    const score = order.reduce(
      (n, q) => n + (picks[q.id] === q.correctIndex ? 1 : 0),
      0,
    );
    return (
      <Panel>
        <div className="font-display text-5xl font-bold">
          {score}/{order.length}
        </div>
        <p className="text-muted-foreground">{verdict(score, order.length, sport)}</p>
        <PrimaryButton onClick={start}>Play again</PrimaryButton>
      </Panel>
    );
  }

  const q = order[idx];
  const picked = picks[q.id];
  const answered = picked !== undefined;
  const isLast = idx === order.length - 1;

  function pick(optionIndex: number) {
    if (answered) return;
    setPicks((p) => ({ ...p, [q.id]: optionIndex }));
  }

  function next() {
    if (isLast) setPhase("done");
    else setIdx((i) => i + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {idx + 1} of {order.length}
        </span>
        <span>{q.category}</span>
      </div>

      <h2 className="text-2xl font-semibold">{q.question}</h2>

      <div className="flex flex-col gap-3">
        {q.options.map((option, i) => {
          const isCorrect = i === q.correctIndex;
          const isPicked = i === picked;
          let cls = "border-border hover:bg-muted";
          if (answered) {
            if (isCorrect) cls = "border-foreground bg-foreground text-background";
            else if (isPicked) cls = "border-foreground line-through opacity-60";
            else cls = "border-border opacity-60";
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              disabled={answered}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${cls} ${
                answered ? "cursor-default" : ""
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {picked === q.correctIndex ? "Correct." : "Not quite."}
          </span>
          <PrimaryButton onClick={next}>{isLast ? "See score" : "Next"}</PrimaryButton>
        </div>
      )}
    </div>
  );
}

function verdict(score: number, total: number, sport: string) {
  const pct = score / total;
  if (pct === 1) return `Flawless. You know your ${sport.toLowerCase()}.`;
  if (pct >= 0.7) return "Strong round.";
  if (pct >= 0.4) return "Not bad — go again.";
  return "Room to improve. Try again.";
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-5 rounded-lg border border-border p-8">
      {children}
    </div>
  );
}

function PrimaryButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-foreground bg-foreground px-5 py-2.5 text-sm text-background transition-colors hover:opacity-90"
    >
      {children}
    </button>
  );
}
