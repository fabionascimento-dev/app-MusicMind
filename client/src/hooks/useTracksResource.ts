import { useCallback, useEffect, useState } from "react";
import { fetchTracks } from "../api/tracksApi";
import type { TrackDto } from "../types/api";

type Status = "idle" | "loading" | "success" | "error";

export function useTracksResource() {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<TrackDto[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetchTracks();
      if (!res.ok) {
        throw new Error("Resposta inesperada do servidor");
      }
      setData(res.data);
      setStatus("success");
    } catch (e) {
      setData(null);
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Falha ao carregar conteúdos");
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { status, data, message, refetch } as const;
}
