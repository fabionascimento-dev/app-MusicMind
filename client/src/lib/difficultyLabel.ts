const map: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

export function difficultyLabel(code: string): string {
  return map[code] ?? code;
}
