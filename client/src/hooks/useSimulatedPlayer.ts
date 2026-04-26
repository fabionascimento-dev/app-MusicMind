import { useCallback, useEffect, useRef, useState } from "react";

const TOTAL_SEC = 260; // 4:20
const MAX_WIDTH = 100;
const STEP = 0.5;
const INTERVAL_MS = 100;
const TAG_MS = 2000;

function formatWidth(w: number) {
  const s = Math.floor((w / MAX_WIDTH) * TOTAL_SEC);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

/**
 * Reprodução e barra de progresso simuladas (sem ficheiro de áudio).
 */
export function useSimulatedPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [currentTimeLabel, setCurrentTimeLabel] = useState("0:00");
  const playbackRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tagIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tagIndexRef = useRef(0);

  const clearPlayback = () => {
    if (playbackRef.current) {
      clearInterval(playbackRef.current);
      playbackRef.current = null;
    }
  };

  const clearTagLoop = (tags: HTMLElement[]) => {
    if (tagIntervalRef.current) {
      clearInterval(tagIntervalRef.current);
      tagIntervalRef.current = null;
    }
    tags.forEach((t) => t.classList.remove("highlight"));
    tagIndexRef.current = 0;
  };

  useEffect(() => {
    if (!isPlaying) {
      clearPlayback();
      return;
    }
    playbackRef.current = setInterval(() => {
      setProgressWidth((w) => {
        if (w >= MAX_WIDTH) {
          return MAX_WIDTH;
        }
        const next = Math.min(w + STEP, MAX_WIDTH);
        setCurrentTimeLabel(formatWidth(next));
        if (next >= MAX_WIDTH) {
          setIsPlaying(false);
        }
        return next;
      });
    }, INTERVAL_MS);
    return () => {
      clearPlayback();
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    const tagEls = () => Array.from(document.querySelectorAll<HTMLElement>(".element-tag"));
    const tags = tagEls();
    if (tags.length === 0) {
      return;
    }
    const tick = () => {
      const list = tagEls();
      list.forEach((t) => t.classList.remove("highlight"));
      if (list.length) {
        tagIndexRef.current = (tagIndexRef.current + 1) % list.length;
        list[tagIndexRef.current]?.classList.add("highlight");
      }
    };
    tagIntervalRef.current = setInterval(tick, TAG_MS);
    return () => {
      clearTagLoop(tagEls());
    };
  }, [isPlaying]);

  const seek = useCallback((ratio: number) => {
    const w = Math.max(0, Math.min(100, ratio * 100));
    setProgressWidth(w);
    setCurrentTimeLabel(formatWidth(w));
  }, []);

  const playPause = useCallback(
    (tags: HTMLElement[]) => {
      setIsPlaying((prev) => {
        if (prev) {
          clearTagLoop(tags);
          return false;
        }
        if (progressWidth >= MAX_WIDTH) {
          setProgressWidth(0);
          setCurrentTimeLabel("0:00");
        }
        return true;
      });
    },
    [progressWidth],
  );

  return { isPlaying, progressWidth, currentTimeLabel, seek, playPause } as const;
}
