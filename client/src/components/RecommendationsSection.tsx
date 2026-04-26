import { useMemo, useState } from "react";
import type { TrackCategory, TrackDto } from "../types/api";
import { difficultyLabel } from "../lib/difficultyLabel";
import { tabLabel } from "../lib/categoryLabel";

type CategoryTab = "theory" | "genres" | "instruments";

type Props = {
  tracks: TrackDto[];
  isLoading: boolean;
  error: string | null;
  onSelect: (t: TrackDto) => void;
  selectedId: string | null;
};

/**
 * Filtro por categoria (cliente) a partir do dataset da API, com destaque de seleção.
 */
export function RecommendationsSection({ tracks, isLoading, error, onSelect, selectedId }: Props) {
  const [active, setActive] = useState<CategoryTab>("theory");
  const filtered = useMemo(() => {
    return tracks.filter((t) => t.category === active);
  }, [tracks, active]);
  return (
    <section id="recomendacoes" className="recommendations" aria-labelledby="rec-title">
      <div className="container">
        <h2 className="section-title" id="rec-title">
          Recomendações para Aprendizado
        </h2>
        <div className="tabs" role="tablist" aria-label="Categorias">
          {(["theory", "genres", "instruments"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              className={active === key ? "tab-btn active" : "tab-btn"}
              aria-selected={active === key}
              onClick={() => {
                setActive(key);
              }}
            >
              {tabLabel(key)}
            </button>
          ))}
        </div>
        {isLoading && <p className="api-hint" aria-live="polite">A carregar conteúdos…</p>}
        {error && <p className="api-error" role="alert">{error}</p>}
        <div className="tracks-grid">
          {filtered.map((card) => (
            <div
              key={card.id}
              className={`track-card${card.id === selectedId ? " selected" : ""}`}
              onClick={() => {
                onSelect(card);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(card);
                }
              }}
              role="button"
              tabIndex={0}
              data-category={card.category as TrackCategory}
            >
              <img
                src={card.imageUrl}
                alt={card.title}
                className="track-img"
                width={300}
                height={180}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="track-details">
                <h4>{card.title}</h4>
                <p>{card.description}</p>
                <div className="difficulty" aria-label="Dificuldade">
                  <span className="difficulty-label">{difficultyLabel(card.difficulty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
