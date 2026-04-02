"use client";

import { useParams, notFound } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTrade } from "@/lib/trades";
import { getExamQuestions, calculateScore } from "@/lib/quiz-engine";
import type { Question } from "@/lib/quiz-engine";
import { PurchaseGate } from "@/components/purchase-gate";
import { ExamInterface } from "@/components/exam-interface";
import { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle, XCircle, Award, RotateCcw } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";

export default function ExamPage() {
  const params = useParams();
  const tradeSlug = params.trade as string;
  const trade = getTrade(tradeSlug);
  const { user } = useUser();

  const recordExam = useMutation(api.exams.record);
  const createCertificate = useMutation(api.certificates.create);

  const [examQuestions, setExamQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    correct: number;
    total: number;
    passed: boolean;
    chapterBreakdown: { chapter: string; correct: number; total: number }[];
    certificateCreated: boolean;
  } | null>(null);

  useEffect(() => {
    if (!trade) return;

    async function loadQuestions() {
      try {
        const mod = await import(`@/lib/questions/${trade!.id}.json`);
        const questions: Question[] = mod.default;
        setExamQuestions(getExamQuestions(questions, 50));
      } catch {
        setError(true);
      }
    }

    loadQuestions();
  }, [trade]);

  const handleComplete = useCallback(
    async (
      answers: { questionId: string; selectedIndex: number }[],
      timeSpent: number
    ) => {
      if (!user || !trade || !examQuestions) return;

      const quizResult = calculateScore(answers, examQuestions);

      // Chapter breakdown
      const chapterMap = new Map<
        string,
        { correct: number; total: number }
      >();
      for (const answer of quizResult.answers) {
        const q = examQuestions.find((eq) => eq.id === answer.questionId);
        if (!q) continue;
        const entry = chapterMap.get(q.chapter) || { correct: 0, total: 0 };
        entry.total += 1;
        if (answer.correct) entry.correct += 1;
        chapterMap.set(q.chapter, entry);
      }

      const chapterBreakdown = Array.from(chapterMap.entries()).map(
        ([chapter, data]) => ({
          chapter,
          correct: data.correct,
          total: data.total,
        })
      );

      let certificateCreated = false;

      try {
        // Record exam attempt
        const examId = await recordExam({
          clerkUserId: user.id,
          trade: trade.id,
          score: quizResult.score,
          totalQuestions: quizResult.total,
          correctAnswers: quizResult.correct,
          passed: quizResult.passed,
          timeSpent,
          chapterScores: chapterBreakdown,
        });

        // Create certificate if passed
        if (quizResult.passed) {
          const fullName =
            user.fullName || user.firstName || user.username || "Student";
          await createCertificate({
            clerkUserId: user.id,
            trade: trade.id,
            userName: fullName,
            score: quizResult.score,
            examAttemptId: examId as Id<"examAttempts">,
          });
          certificateCreated = true;
        }
      } catch {
        // Recording failed silently
      }

      setResult({
        score: quizResult.score,
        correct: quizResult.correct,
        total: quizResult.total,
        passed: quizResult.passed,
        chapterBreakdown,
        certificateCreated,
      });
    },
    [user, trade, examQuestions, recordExam, createCertificate]
  );

  if (!trade) return notFound();

  // Results screen
  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div
          className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            result.passed ? "bg-green-50" : "bg-red-50"
          }`}
        >
          {result.passed ? (
            <CheckCircle className="w-10 h-10 text-trade-success" />
          ) : (
            <XCircle className="w-10 h-10 text-trade-error" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-trade-dark mb-2">
          {result.passed ? "Congratulations!" : "Not Quite"}
        </h1>
        <p className="text-trade-muted mb-6">
          {result.passed
            ? `You passed the ${trade.name} certification exam!`
            : `You need 80% to pass. Keep studying and try again.`}
        </p>

        <div
          className={`text-5xl font-bold mb-8 ${
            result.passed ? "text-trade-success" : "text-trade-error"
          }`}
        >
          {result.score}%
        </div>

        <p className="text-trade-muted mb-8">
          {result.correct} correct out of {result.total} questions
        </p>

        {/* Chapter Breakdown */}
        <div className="bg-trade-card rounded-xl p-5 card-shadow border border-trade-border mb-8 text-left">
          <h3 className="font-bold text-trade-dark mb-3">
            Chapter Breakdown
          </h3>
          <div className="space-y-2">
            {result.chapterBreakdown.map((ch) => {
              const chapterInfo = trade.chapters.find(
                (c) => c.id === ch.chapter
              );
              const pct =
                ch.total > 0 ? Math.round((ch.correct / ch.total) * 100) : 0;
              return (
                <div
                  key={ch.chapter}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-sm text-trade-dark">
                    {chapterInfo?.name || ch.chapter}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      pct >= 80 ? "text-trade-success" : "text-trade-error"
                    }`}
                  >
                    {ch.correct}/{ch.total} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {result.passed && result.certificateCreated && (
            <Link
              href={`/${trade.slug}/certificate`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-trade-blue text-white rounded-lg font-medium hover:bg-trade-blue-light transition-colors"
            >
              <Award className="w-4 h-4" /> View Certificate
            </Link>
          )}
          {!result.passed && (
            <Link
              href={`/${trade.slug}/study`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-trade-blue text-white rounded-lg font-medium hover:bg-trade-blue-light transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Back to Study
            </Link>
          )}
          <Link
            href={`/${trade.slug}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-trade-border text-trade-dark rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Trade Overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PurchaseGate
      storeSlug={trade.storeSlug}
      storeUrl={trade.storeUrl}
      tradeName={trade.name}
    >
      <div className="py-8">
        {/* Header */}
        <div className="text-center mb-6 px-4">
          <h1 className="text-2xl font-bold text-trade-dark">
            {trade.name} - Final Exam
          </h1>
          <p className="text-sm text-trade-muted">
            50 questions - 60 minutes - 80% to pass
          </p>
        </div>

        {error && (
          <div className="text-center py-12 px-4">
            <p className="text-trade-muted mb-4">
              Could not load exam questions.
            </p>
            <Link
              href={`/${trade.slug}/study`}
              className="text-trade-blue hover:underline"
            >
              Back to Study
            </Link>
          </div>
        )}

        {!examQuestions && !error && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-trade-blue animate-spin" />
          </div>
        )}

        {examQuestions && (
          <ExamInterface
            questions={examQuestions}
            onComplete={handleComplete}
          />
        )}
      </div>
    </PurchaseGate>
  );
}
