"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, ChevronRight } from "lucide-react";
import type { Lesson } from "@/lib/lessons/types";

const diffBadgeColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export function StudyGuide({
  lesson,
  tradeName,
  quizUrl,
}: {
  lesson: Lesson;
  tradeName: string;
  quizUrl: string;
}) {
  const diffLabel =
    lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1);

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-trade-muted mb-6">
        <span>{tradeName}</span>
        <ChevronRight className="w-3 h-3" />
        <span>{lesson.title}</span>
        <ChevronRight className="w-3 h-3" />
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffBadgeColors[lesson.difficulty] ?? ""}`}>
          {diffLabel}
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-trade-blue" />
          <h1 className="text-2xl font-bold text-trade-dark">Study Guide</h1>
        </div>
        <p className="text-trade-muted">{lesson.subtitle}</p>
      </div>

      {/* Key Terms */}
      <div className="space-y-3 mb-10">
        {lesson.points.map((point, i) => (
          <div
            key={i}
            className="bg-trade-card border border-trade-border rounded-lg p-4 card-shadow"
          >
            <span className="text-sm font-bold text-trade-blue">
              {point.term}
            </span>
            <p className="text-sm text-trade-muted mt-1">{point.definition}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 pb-12">
        <Link
          href={quizUrl}
          className="inline-flex items-center gap-2 px-8 py-3 bg-trade-blue text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
        >
          Start Quiz
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={quizUrl}
          className="text-sm text-trade-muted hover:text-trade-blue transition-colors"
        >
          Skip to Quiz →
        </Link>
      </div>
    </div>
  );
}
