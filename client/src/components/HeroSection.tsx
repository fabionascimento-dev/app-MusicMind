/**
 * Seção de destaque com CTA para o player educacional.
 */
export function HeroSection() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="container">
        <h1 id="hero-title">Educação Musical Inteligente</h1>
        <p>
          O musicMind combina recomendações musicais com aprendizado, ajudando você a entender a teoria
          por trás das músicas que ama.
        </p>
        <a href="#player" className="btn">
          Comece a aprender
        </a>
      </div>
    </section>
  );
}
