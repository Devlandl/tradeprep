"use client";

import { useParams, notFound } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTrade, getChapter, difficulties } from "@/lib/trades";
import type { Difficulty } from "@/lib/trades";
import { getQuestionsForSection } from "@/lib/quiz-engine";
import type { Question } from "@/lib/quiz-engine";
import { PurchaseGate } from "@/components/purchase-gate";
import { QuizInterface } from "@/components/quiz-interface";
import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function QuizPage() {
  const params = useParams();
  const tradeSlug = params.trade as string;
  const chapterId = params.chapter as string;
  const difficulty = params.difficulty as string;

  const trade = getTrade(tradeSlug);
  const chapter = trade ? getChapter(trade, chapterId) : undefined;

  const { user } = useUser();
  const recordScore = useMutation(api.progress.recordScore);

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState(false);
  const startTime = useRef(Date.now());
  const completedRef = useRef(false);

  useEffect(() => {
    if (!trade) return;

    async function loadQuestions() {
      try {
        const mod = await import(`@/lib/questions/${trade!.id}.json`);
        const allQuestions: Question[] = mod.default;
        const filtered = getQuestionsForSection(
          allQuestions,
          chapterId,
          difficulty
        );
        if (filtered.length === 0) {
          setError(true);
        } else {
          setQuestions(filtered);
        }
      } catch {
        setError(true);
      }
    }

    loadQuestions();
  }, [trade, chapterId, difficulty]);

  if (!trade || !chapter) return notFound();
  if (!difficulties.includes(difficulty as Difficulty)) return notFound();

  const diffLabel =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  const handleComplete = async (
    correct: number,
    total: number,
    score: number
  ) => {
    if (completedRef.current || !user) return;
    completedRef.current = true;

    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);

    try {
      await recordScore({
        clerkUserId: user.id,
        trade: trade.id,
        chapter: chapterId,
        difficulty,
        score,
        timeSpent,
      });
    } catch {
      // Score recording failed silently - user still sees results
    }
  };

  return (
    <PurchaseGate
      storeSlug={trade.storeSlug}
      storeUrl={trade.storeUrl}
      tradeName={trade.name}
    >
      <div className="max-w-5xl mx-auto py-12">
        {/* Header */}
        <div className="px-4 mb-8 text-center">
          <p className="text-sm text-trade-muted mb-1">
            {trade.name} - {chapter.name}
          </p>
          <h1 className="text-2xl font-bold text-trade-dark">
            {diffLabel} Quiz
          </h1>
        </div>

        {error && (
          <div className="text-center py-12 px-4">
            <p className="text-trade-muted mb-4">
              No questions available for this section yet.
            </p>
            <a
              href={`/${trade.slug}/study`}
              className="text-trade-blue hover:underline"
            >
              Back to Chapters
            </a>
          </div>
        )}

        {!questions && !error && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-trade-blue animate-spin" />
          </div>
        )}

        {questions && (
          <QuizInterface
            questions={questions}
            onComplete={handleComplete}
            backUrl={`/${trade.slug}/study`}
            backLabel="Back to Chapters"
          />
        )}
      </div>
    </PurchaseGate>
  );
}
