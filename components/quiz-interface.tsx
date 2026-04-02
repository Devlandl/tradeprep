"use client";

import { useState, useCallback } from "react";
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import type { Question } from "@/lib/quiz-engine";
import { shuffleQuestions } from "@/lib/quiz-engine";

interface QuizInterfaceProps {
  questions: Question[];
  onComplete: (correct: number, total: number, score: number) => void;
  backUrl: string;
  backLabel?: string;
}

const labels = ["A", "B", "C", "D"];

export function QuizInterface({
  questions: rawQuestions,
  onComplete,
  backUrl,
  backLabel = "Back to Chapters",
}: QuizInterfaceProps) {
  const [questions] = useState(() => shuffleQuestions(rawQuestions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];
  const isCorrect =
    selectedIndex !== null && selectedIndex === current?.correctIndex;
  const totalQuestions = questions.length;

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedIndex !== null) return;
      setSelectedIndex(index);
      setShowResult(true);
      if (index === current.correctIndex) {
        setCorrectCount((c) => c + 1);
      }
    },
    [selectedIndex, current]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
      setShowResult(false);
    }
  }, [currentIndex, totalQuestions]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setShowResult(false);
    setCorrectCount(0);
    setFinished(false);
  }, []);

  // Score screen
  if (finished) {
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 80;

    // Notify parent
    onComplete(correctCount, totalQuestions, score);

    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <div
          className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            passed ? "bg-green-50" : "bg-red-50"
          }`}
        >
          {passed ? (
            <CheckCircle className="w-10 h-10 text-trade-success" />
          ) : (
            <XCircle className="w-10 h-10 text-trade-error" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-trade-dark mb-2">
          {passed ? "Great Job!" : "Keep Practicing"}
        </h2>
        <p className="text-trade-muted mb-6">
          You scored {correctCount} out of {totalQuestions} ({score}%). You need
          80% to pass.
        </p>
        <div
          className={`text-4xl font-bold mb-8 ${
            passed ? "text-trade-success" : "text-trade-error"
          }`}
        >
          {score}%
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!passed && (
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-trade-blue text-white rounded-lg font-medium hover:bg-trade-blue-light transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
          )}
          <a
            href={backUrl}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-trade-border text-trade-dark rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            {backLabel}
          </a>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-trade-muted">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <span className="text-sm font-medium text-trade-blue">
          {correctCount} correct
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
        <div
          className="bg-trade-blue rounded-full h-2 transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div className="bg-trade-card rounded-xl p-6 card-shadow border border-trade-border mb-6">
        <h2 className="text-lg font-semibold text-trade-dark mb-6">
          {current.question}
        </h2>

        <div className="space-y-3">
          {current.options.map((option, index) => {
            let buttonClass =
              "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3";

            if (!showResult) {
              buttonClass +=
                " border-trade-border hover:border-trade-blue hover:bg-blue-50 cursor-pointer";
            } else if (index === current.correctIndex) {
              buttonClass += " border-trade-success bg-green-50";
            } else if (index === selectedIndex && !isCorrect) {
              buttonClass += " border-trade-error bg-red-50";
            } else {
              buttonClass += " border-trade-border opacity-60";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showResult}
                className={buttonClass}
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    showResult && index === current.correctIndex
                      ? "bg-trade-success text-white"
                      : showResult && index === selectedIndex && !isCorrect
                        ? "bg-trade-error text-white"
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

        {/* Explanation */}
        {showResult && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              isCorrect ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <p className="text-sm font-medium text-trade-dark mb-1">
              {isCorrect ? "Correct!" : "Incorrect"}
            </p>
            <p className="text-sm text-trade-muted">{current.explanation}</p>
          </div>
        )}
      </div>

      {/* Next Button */}
      {showResult && (
        <div className="text-center">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 bg-trade-blue text-white rounded-lg font-medium hover:bg-trade-blue-light transition-colors"
          >
            {currentIndex + 1 >= totalQuestions
              ? "See Results"
              : "Next Question"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
