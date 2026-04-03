"use client";

import Link from "next/link";
import { Lock, Check, Circle, Clock } from "lucide-react";
import type { Trade, Chapter, Difficulty } from "@/lib/trades";
import { difficulties } from "@/lib/trades";

interface ProgressEntry {
  chapter: string;
  difficulty: string;
  passed: boolean;
  score: number;
}

function getDifficultyStatus(
  chapterIndex: number,
  diffIndex: number,
  chapter: Chapter,
  chapters: Chapter[],
  progressMap: Map<string, ProgressEntry>
): "locked" | "available" | "passed" {
  const key = `${chapter.id}-${difficulties[diffIndex]}`;
  const entry = progressMap.get(key);

  if (entry?.passed) return "passed";

  // First chapter, first difficulty is always unlocked
  if (chapterIndex === 0 && diffIndex === 0) return "available";

  // Same chapter, previous difficulty must be passed
  if (diffIndex > 0) {
    const prevKey = `${chapter.id}-${difficulties[diffIndex - 1]}`;
    const prevEntry = progressMap.get(prevKey);
    return prevEntry?.passed ? "available" : "locked";
  }

  // First difficulty of a chapter - all diffs of previous chapter must be passed
  if (chapterIndex > 0) {
    const prevChapter = chapters[chapterIndex - 1];
    for (const diff of difficulties) {
      const prevKey = `${prevChapter.id}-${diff}`;
      const prevEntry = progressMap.get(prevKey);
      if (!prevEntry?.passed) return "locked";
    }
    return "available";
  }

  return "locked";
}

const diffLabels: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const diffColors: Record<Difficulty, string> = {
  beginner: "text-trade-success",
  intermediate: "text-trade-warning",
  advanced: "text-trade-error",
};

export function ChapterCard({
  chapter,
  chapterIndex,
  trade,
  progressMap,
}: {
  chapter: Chapter;
  chapterIndex: number;
  trade: Trade;
  progressMap: Map<string, ProgressEntry>;
}) {
  return (
    <div className="bg-trade-card rounded-xl p-5 card-shadow border border-trade-border">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 bg-trade-blue/10 text-trade-blue rounded-full flex items-center justify-center text-sm font-bold">
          {chapterIndex + 1}
        </span>
        <div>
          <h3 className="font-bold text-trade-dark">{chapter.name}</h3>
          <p className="text-sm text-trade-muted">{chapter.description}</p>
        </div>
      </div>

      {chapter.comingSoon ? (
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-50 text-amber-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
          <span className="text-xs font-medium">Upgrade</span>
        </div>
      ) : (
        <div className="space-y-2">
          {difficulties.map((diff, diffIndex) => {
            const status = getDifficultyStatus(
              chapterIndex,
              diffIndex,
              chapter,
              trade.chapters,
              progressMap
            );
            const entry = progressMap.get(`${chapter.id}-${diff}`);

            if (status === "locked") {
              return (
                <div
                  key={diff}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 text-trade-muted"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">{diffLabels[diff]}</span>
                  </div>
                  <span className="text-xs">Locked</span>
                </div>
              );
            }

            if (status === "passed") {
              return (
                <Link
                  key={diff}
                  href={`/${trade.slug}/study/${chapter.id}/${diff}/guide`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-trade-success" />
                    <span className={`text-sm font-medium ${diffColors[diff]}`}>
                      {diffLabels[diff]}
                    </span>
                  </div>
                  <span className="text-xs text-trade-success font-medium">
                    {entry?.score}%
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={diff}
                href={`/${trade.slug}/study/${chapter.id}/${diff}/guide`}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-trade-blue" />
                  <span className={`text-sm font-medium ${diffColors[diff]}`}>
                    {diffLabels[diff]}
                  </span>
                </div>
                <span className="text-xs text-trade-blue font-medium">Start</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
