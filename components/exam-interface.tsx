"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Flag,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { Question } from "@/lib/quiz-engine";

interface ExamInterfaceProps {
  questions: Question[];
  onComplete: (
    answers: { questionId: string; selectedIndex: number }[],
    timeSpent: number
  ) => void;
}

const labels = ["A", "B", "C", "D"];

export function ExamInterface({ questions, onComplete }: ExamInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const startTime = useRef(Date.now());

  // Timer
  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  // Auto-submit when timer runs out
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted]);

  const handleSelect = useCallback(
    (index: number) => {
      if (submitted) return;
      const q = questions[currentIndex];
      setAnswers((prev) => {
        const next = new Map(prev);
        next.set(q.id, index);
        return next;
      });
    },
    [currentIndex, questions, submitted]
  );

  const toggleFlag = useCallback(() => {
    const q = questions[currentIndex];
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(q.id)) {
        next.delete(q.id);
      } else {
        next.add(q.id);
      }
      return next;
    });
  }, [currentIndex, questions]);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);

    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    const answerList = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: answers.get(q.id) ?? -1,
    }));

    onComplete(answerList, timeSpent);
  }, [submitted, questions, answers, onComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const current = questions[currentIndex];
  const selectedAnswer = answers.get(current.id);
  const isFlagged = flagged.has(current.id);
  const answeredCount = answers.size;
  const isLowTime = timeLeft < 300; // under 5 minutes

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Clock className="w-12 h-12 text-trade-blue mx-auto mb-4 animate-spin" />
          <p className="text-trade-muted">Calculating your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Timer bar */}
      <div
        className={`sticky top-14 z-40 bg-white border-b border-trade-border py-3 px-4 flex items-center justify-between ${
          isLowTime ? "bg-red-50" : ""
        }`}
      >
        <span className="text-sm text-trade-muted">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div
          className={`flex items-center gap-2 font-mono font-bold ${
            isLowTime ? "text-trade-error" : "text-trade-dark"
          }`}
        >
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
        <span className="text-sm text-trade-muted">
          {answeredCount}/{questions.length} answered
        </span>
      </div>

      {/* Question */}
      <div className="mt-6 mb-6">
        <div className="bg-trade-card rounded-xl p-6 card-shadow border border-trade-border">
          <h2 className="text-lg font-semibold text-trade-dark mb-6">
            {current.question}
          </h2>

          <div className="space-y-3">
            {current.options.map((option, index) => {
              const isSelected = selectedAnswer === index;

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? "border-trade-blue bg-blue-50"
                      : "border-trade-border hover:border-trade-blue/50 hover:bg-blue-50/50"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isSelected
                        ? "bg-trade-blue text-white"
                        : "bg-gray-100 text-trade-dark"
                    }`}
                  >
                    {labels[index]}
                  </span>
                  <span className="text-trade-dark">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-trade-dark border border-trade-border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={toggleFlag}
          className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            isFlagged
              ? "border-trade-warning bg-yellow-50 text-trade-warning"
              : "border-trade-border text-trade-muted hover:bg-gray-50"
          }`}
        >
          <Flag className="w-4 h-4" />
          {isFlagged ? "Flagged" : "Flag"}
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
            }
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-trade-dark border border-trade-border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-trade-blue text-white rounded-lg hover:bg-trade-blue-light transition-colors"
          >
            Submit Exam
          </button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="bg-trade-card rounded-xl p-5 card-shadow border border-trade-border mb-8">
        <h3 className="text-sm font-medium text-trade-dark mb-3">
          Question Navigator
        </h3>
        <div className="grid grid-cols-10 gap-2">
          {questions.map((q, i) => {
            const isAnswered = answers.has(q.id);
            const isFlag = flagged.has(q.id);
            const isCurrent = i === currentIndex;

            let bgClass = "bg-gray-100 text-trade-muted";
            if (isCurrent) bgClass = "bg-trade-blue text-white";
            else if (isFlag) bgClass = "bg-yellow-100 text-trade-warning";
            else if (isAnswered) bgClass = "bg-green-100 text-trade-success";

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${bgClass}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-trade-muted">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-100 rounded" /> Unanswered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-100 rounded" /> Answered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-100 rounded" /> Flagged
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-trade-blue rounded" /> Current
          </span>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-trade-warning" />
              <h3 className="font-bold text-lg text-trade-dark">
                Submit Exam?
              </h3>
            </div>
            <p className="text-trade-muted text-sm mb-2">
              You have answered {answeredCount} of {questions.length} questions.
            </p>
            {answeredCount < questions.length && (
              <p className="text-trade-error text-sm mb-4">
                {questions.length - answeredCount} questions are unanswered and
                will be marked wrong.
              </p>
            )}
            {flagged.size > 0 && (
              <p className="text-trade-warning text-sm mb-4">
                You have {flagged.size} flagged questions to review.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-trade-border rounded-lg text-sm font-medium text-trade-dark hover:bg-gray-50 transition-colors"
              >
                Review Questions
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  handleSubmit();
                }}
                className="flex-1 px-4 py-2 bg-trade-blue text-white rounded-lg text-sm font-medium hover:bg-trade-blue-light transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
