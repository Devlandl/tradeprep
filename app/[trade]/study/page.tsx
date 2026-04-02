"use client";

import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTrade } from "@/lib/trades";
import { difficulties } from "@/lib/trades";
import { PurchaseGate } from "@/components/purchase-gate";
import { ChapterCard } from "@/components/chapter-card";
import { Lock, Award, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function StudyPage() {
  const params = useParams();
  const trade = getTrade(params.trade as string);
  const { user } = useUser();

  const progress = useQuery(
    api.progress.getByTrade,
    user ? { clerkUserId: user.id, trade: params.trade as string } : "skip"
  );

  if (!trade) return notFound();

  // Build progress map
  const progressMap = new Map<
    string,
    { chapter: string; difficulty: string; passed: boolean; score: number }
  >();
  if (progress) {
    for (const p of progress) {
      progressMap.set(`${p.chapter}-${p.difficulty}`, {
        chapter: p.chapter,
        difficulty: p.difficulty,
        passed: p.passed,
        score: p.score,
      });
    }
  }

  // Calculate overall progress
  const totalSections = trade.chapters.length * difficulties.length;
  const passedSections = progress
    ? progress.filter((p) => p.passed).length
    : 0;
  const progressPercent =
    totalSections > 0 ? Math.round((passedSections / totalSections) * 100) : 0;

  // Check if exam is unlocked (all chapters all difficulties passed)
  const examUnlocked = passedSections === totalSections && totalSections > 0;

  return (
    <PurchaseGate
      storeSlug={trade.storeSlug}
      storeUrl={trade.storeUrl}
      tradeName={trade.name}
    >
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-trade-dark mb-2">
            {trade.name} - Study Mode
          </h1>
          <p className="text-trade-muted">
            Work through each chapter and difficulty level. Pass all sections to
            unlock the final exam.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-trade-card rounded-xl p-5 card-shadow border border-trade-border mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-trade-dark">
              Overall Progress
            </span>
            <span className="text-sm font-bold text-trade-blue">
              {passedSections}/{totalSections} sections ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-trade-blue rounded-full h-3 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Loading state */}
        {!progress && user && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-trade-blue animate-spin" />
          </div>
        )}

        {/* Chapters */}
        {(progress || !user) && (
          <div className="space-y-4 mb-10">
            {trade.chapters.map((chapter, index) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                chapterIndex={index}
                trade={trade}
                progressMap={progressMap}
              />
            ))}
          </div>
        )}

        {/* Final Exam Section */}
        <div className="bg-trade-card rounded-xl p-6 card-shadow border border-trade-border">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-6 h-6 text-trade-warning" />
            <h2 className="font-bold text-lg text-trade-dark">Final Exam</h2>
          </div>
          {examUnlocked ? (
            <div>
              <p className="text-trade-muted text-sm mb-4">
                You have completed all study sections. You are ready for the
                final exam - 50 questions, 60-minute timer, 80% to pass.
              </p>
              <Link
                href={`/${trade.slug}/exam`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-trade-blue text-white rounded-lg font-semibold hover:bg-trade-blue-light transition-colors"
              >
                Take Final Exam
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-trade-muted">
              <Lock className="w-4 h-4" />
              <p className="text-sm">
                Complete all chapters and difficulty levels to unlock the final
                exam.
              </p>
            </div>
          )}
        </div>
      </div>
    </PurchaseGate>
  );
}
