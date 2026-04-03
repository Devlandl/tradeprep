export interface LessonPoint {
  term: string;
  definition: string;
}

export interface Lesson {
  chapter: string;
  difficulty: string;
  title: string;
  subtitle: string;
  points: LessonPoint[];
}

export async function loadLesson(
  tradeId: string,
  chapter: string,
  difficulty: string
): Promise<Lesson | null> {
  try {
    const mod = await import(`@/lib/lessons/${tradeId}.json`);
    const lessons: Lesson[] = mod.default;
    return (
      lessons.find(
        (l) => l.chapter === chapter && l.difficulty === difficulty
      ) ?? null
    );
  } catch {
    return null;
  }
}
