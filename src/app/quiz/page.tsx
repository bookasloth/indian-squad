import type { Metadata } from "next";
import { Quiz } from "@/components/Quiz";

export const metadata: Metadata = {
  title: "Quiz — Indian Squad",
  description: "A shuffled Indian cricket quiz. Answer, score, and play again.",
};

export default function QuizPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quiz</h1>
        <p className="text-muted">Test your Indian cricket knowledge.</p>
      </header>
      <Quiz />
    </div>
  );
}
