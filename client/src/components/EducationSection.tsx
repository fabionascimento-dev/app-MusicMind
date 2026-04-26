import type { LearningPathStepDto } from "../types/api";

type Props = { steps: LearningPathStepDto[] | null; isLoading: boolean; error: string | null };

/**
 * Jornada de aprendizagem: dados persistidos e servidos pela API.
 */
export function EducationSection({ steps, isLoading, error }: Props) {
  return (
    <section id="educacao" className="education" aria-labelledby="edu-title">
      <div className="container">
        <h2 className="section-title" id="edu-title">
          Jornada de Aprendizado
        </h2>
        {isLoading && <p className="api-hint" aria-live="polite">A carregar trilha…</p>}
        {error && <p className="api-error" role="alert">{error}</p>}
        <div className="learning-path">
          {(steps ?? []).map((s) => (
            <div className="path-item" key={s.id}>
              <div className="path-number">{s.order}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
