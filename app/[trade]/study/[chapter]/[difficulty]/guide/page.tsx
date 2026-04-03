"use client";

import { useParams, notFound } from "next/navigation";
import { getTrade, getChapter, difficulties } from "@/lib/trades";
import type { Difficulty } from "@/lib/trades";
import { loadLesson } from "@/lib/lessons/types";
import type { Lesson } from "@/lib/lessons/types";
import { PurchaseGate } from "@/components/purchase-gate";
import { StudyGuide } from "@/components/study-guide";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function GuidePage() {
  const params = useParams();
  const tradeSlug = params.trade as string;
  const chapterId = params.chapter as string;
  const difficulty = params.difficulty as string;

  const trade = getTrade(tradeSlug);
  const chapter = trade ? getChapter(trade, chapterId) : undefined;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trade) return;

    loadLesson(trade.id, chapterId, difficulty).then((data) => {
      setLesson(data);
      setLoading(false);
    });
  }, [trade, chapterId, difficulty]);

  if (!trade || !chapter) return notFound();
  if (!difficulties.includes(difficulty as Difficulty)) return notFound();

  const quizUrl = `/${trade.slug}/study/${chapterId}/${difficulty}`;

  return (
    <PurchaseGate
      storeSlug={trade.storeSlug}
      storeUrl={trade.storeUrl}
      tradeName={trade.name}
    >
      <div className="max-w-5xl mx-auto py-12">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-trade-blue animate-spin" />
          </div>
        )}

        {!loading && !lesson && (
          <div className="text-center py-12 px-4">
            <p className="text-trade-muted mb-4">
              No study guide available for this section yet.
            </p>
            <a href={quizUrl} className="text-trade-blue hover:underline">
              Go to Quiz
            </a>
          </div>
        )}

        {lesson && (
          <StudyGuide
            lesson={lesson}
            tradeName={trade.name}
            quizUrl={quizUrl}
          />
        )}
      </div>
    </PurchaseGate>
  );
}
