import { useCallback, useEffect, useState } from "react";
import { fetchLearningPath } from "../api/learningPathApi";
import type { LearningPathStepDto } from "../types/api";

type Status = "idle" | "loading" | "success" | "error";

export function useLearningPathResource() {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<LearningPathStepDto[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetchLearningPath();
      if (!res.ok) {
        throw new Error("Resposta inesperada do servidor");
      }
      setData(res.data);
      setStatus("success");
    } catch (e) {
      setData(null);
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Falha ao carregar a jornada");
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { status, data, message, refetch } as const;
}
