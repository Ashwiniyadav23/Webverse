
export type LessonProgress = {
  completed: boolean
  quizScore?: number
}

export type StudentProgress = Record<string, LessonProgress>

const STORAGE_KEY = 'webverse-progress'

export function getProgress(): StudentProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return {}

    return JSON.parse(saved) as StudentProgress
  } catch {
    return {}
  }
}

export function saveLessonProgress(
  lessonId: string,
  updates: Partial<LessonProgress>,
): StudentProgress {
  const current = getProgress()

  const updated: StudentProgress = {
    ...current,
    [lessonId]: {
      completed: false,
      ...current[lessonId],
      ...updates,
    },
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

  return updated
}
