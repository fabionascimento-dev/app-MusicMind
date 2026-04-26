import type { TrackCategory } from "../types/api";

const map: Record<TrackCategory, string> = {
  theory: "Teoria Musical",
  genres: "Gêneros Musicais",
  instruments: "Instrumentos",
};

export function tabCategoryToApi(key: string): "theory" | "genres" | "instruments" {
  if (key === "theory" || key === "genres" || key === "instruments") return key;
  return "theory";
}

export function tabLabel(key: string): string {
  return map[tabCategoryToApi(key) as TrackCategory] ?? key;
}
