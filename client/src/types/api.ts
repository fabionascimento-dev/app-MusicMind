/** Alinhado ao Prisma/JSON do servidor. */
export type TrackCategory = "theory" | "genres" | "instruments";

export type TrackDifficulty = "beginner" | "intermediate" | "advanced";

export interface TrackDto {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningPathStepDto {
  id: string;
  order: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiListResponse<T> {
  ok: boolean;
  data: T;
  error?: string;
}
