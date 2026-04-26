import { useCallback, useRef, type MouseEventHandler } from "react";
import { useSimulatedPlayer } from "../hooks/useSimulatedPlayer";

export interface NowPlaying {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

const tags = ["Introdução", "Verso", "Refrão", "Ponte"] as const;

type Props = {
  current: NowPlaying;
};

/**
 * Player educacional com barra e tempo simulados. Os metadados vêm de props (API / seleção).
 */
export function PlayerSection({ current }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { isPlaying, progressWidth, currentTimeLabel, seek, playPause } = useSimulatedPlayer();

  const getTagEls = useCallback(
    () => Array.from(rootRef.current?.querySelectorAll<HTMLElement>(".element-tag") ?? []),
    [],
  );

  const onBarClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    const x = e.clientX - r.left;
    if (r.width > 0) {
      seek(x / r.width);
    }
  };

  return (
    <section id="player" className="player-section" aria-labelledby="player-title" ref={rootRef}>
      <div className="container">
        <h2 className="section-title" id="player-title">
          Player Educacional
        </h2>
        <div className="player-container">
          <div className="now-playing">
            <div className="album-cover">
              <img src={current.imageUrl} alt="Capa da faixa" width={300} height={300} loading="lazy" />
            </div>
            <div className="track-info">
              <h3>{current.title}</h3>
              <p>{current.subtitle}</p>
              <div className="music-details" aria-label="Análise rápida (demonstração)">
                <span>Tom: C maior</span>
                <span>Compasso: 4/4</span>
                <span>BPM: 120</span>
              </div>
            </div>
          </div>
          <div className="player-controls" role="group" aria-label="Controlo de reprodução (demonstração)">
            <button type="button" className="control-btn repeat-btn" title="Repetir">
              🔁
            </button>
            <button type="button" className="control-btn prev-btn" title="Anterior">
              ⏮
            </button>
            <button
              type="button"
              className="control-btn play-btn"
              title={isPlaying ? "Pausar" : "Reproduzir"}
              aria-pressed={isPlaying}
              onClick={() => {
                playPause(getTagEls());
              }}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button type="button" className="control-btn next-btn" title="Próxima">
              ⏭
            </button>
            <button type="button" className="control-btn shuffle-btn" title="Embaralhar">
              🔀
            </button>
          </div>
          <div
            className="progress-container"
            onClick={onBarClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
              }
            }}
            role="slider"
            aria-label="Posição (simulada)"
            tabIndex={0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressWidth)}
            aria-valuetext={`${Math.round(progressWidth)} por cento`}
          >
            <div className="progress" style={{ width: `${progressWidth}%` }} />
          </div>
          <div className="time-info">
            <span className="current-time">{currentTimeLabel}</span>
            <span className="total-time">4:20</span>
          </div>
          <div className="education-panel" id="education-panel">
            <h4>Elementos Musicais Destacados</h4>
            <div className="music-elements" role="list">
              {tags.map((t) => (
                <span className="element-tag" key={t} role="listitem">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
