import { fetchJson } from "./config";
import type { ApiListResponse, LearningPathStepDto } from "../types/api";

const prefix = "/api/v1";

export function fetchLearningPath() {
  return fetchJson<ApiListResponse<LearningPathStepDto[]>>(`${prefix}/learning-path`);
}
