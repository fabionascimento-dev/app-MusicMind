/**
 * Resumo de funcionalidades: estático (conteúdo de marketing/UX).
 */
export function FeaturesSection() {
  return (
    <section id="como-funciona" className="features" aria-labelledby="features-title">
      <div className="container">
        <h2 className="section-title" id="features-title">
          Como funciona
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" aria-hidden>
              🎼
            </div>
            <h3>Teoria Musical</h3>
            <p>Aprenda conceitos teóricos enquanto ouve suas músicas favoritas.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden>
              📊
            </div>
            <h3>Análise Detalhada</h3>
            <p>Visualize a estrutura musical e os elementos de cada faixa.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden>
              🎹
            </div>
            <h3>Prática Inteligente</h3>
            <p>Exercícios interativos baseados no seu nível de conhecimento.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
