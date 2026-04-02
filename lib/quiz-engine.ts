export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  chapter: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface QuizResult {
  total: number;
  correct: number;
  score: number;
  passed: boolean;
  answers: {
    questionId: string;
    selectedIndex: number;
    correct: boolean;
  }[];
}

export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getQuestionsForSection(
  allQuestions: Question[],
  chapter: string,
  difficulty: string
): Question[] {
  return allQuestions.filter(
    (q) => q.chapter === chapter && q.difficulty === difficulty
  );
}

export function getExamQuestions(
  allQuestions: Question[],
  count: number = 50
): Question[] {
  return shuffleQuestions(allQuestions).slice(
    0,
    Math.min(count, allQuestions.length)
  );
}

export function calculateScore(
  answers: { questionId: string; selectedIndex: number }[],
  questions: Question[]
): QuizResult {
  const results = answers.map((a) => {
    const question = questions.find((q) => q.id === a.questionId);
    const correct = question
      ? a.selectedIndex === question.correctIndex
      : false;
    return {
      questionId: a.questionId,
      selectedIndex: a.selectedIndex,
      correct,
    };
  });
  const correctCount = results.filter((r) => r.correct).length;
  const score = Math.round((correctCount / results.length) * 100);
  return {
    total: results.length,
    correct: correctCount,
    score,
    passed: score >= 80,
    answers: results,
  };
}

export function isExamUnlocked(
  totalChapters: number,
  progressMap: Map<string, { passed: boolean }>
): boolean {
  const diffs = ["beginner", "intermediate", "advanced"];
  for (let i = 0; i < totalChapters; i++) {
    for (const d of diffs) {
      if (progressMap.get(`${i}-${d}`)?.passed !== true) return false;
    }
  }
  return true;
}
