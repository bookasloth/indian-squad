import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sportLabel } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { quizFor } from "@/data/quiz";
import { Quiz } from "@/components/Quiz";

export async function generateMetadata({ params }: { params: Promise<{ sport: string }> }): Promise<Metadata> {
  const { sport } = await params;
  const label = (sportLabel(sport) ?? sport).toLowerCase();
  return pageMeta({ title: `${sportLabel(sport)} quiz`, description: `A shuffled Indian ${label} quiz. Answer, score, and play again.`, path: `/${sport}/quiz` });
}

export default async function QuizPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  const questions = quizFor(sport);
  const label = sportLabel(sport);
  if (questions.length === 0 || !label) notFound();
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{label} quiz</h1>
        <p className="text-muted-foreground">Test your Indian {label.toLowerCase()} knowledge.</p>
      </header>
      <Quiz questions={questions} sport={label} />
    </div>
  );
}
