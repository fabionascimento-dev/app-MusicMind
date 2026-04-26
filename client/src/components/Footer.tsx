/**
 * Rodapé: links reais (GitHub, LinkedIn) — substitua # pelos URLs do repositório e perfis.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="container footer-content">
        <div className="footer-section">
          <div className="logo">
            <span className="logo-icon" aria-hidden>
              🎵
            </span>{" "}
            musicMind
          </div>
          <p>Educação musical através da tecnologia</p>
        </div>
        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li>
              <a href="#inicio">Início</a>
            </li>
            <li>
              <a href="#como-funciona">Como Funciona</a>
            </li>
            <li>
              <a href="#player">Player</a>
            </li>
            <li>
              <a href="#recomendacoes">Recomendações</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Recursos Educacionais</h4>
          <ul>
            <li>
              <a href="#recomendacoes">Teoria e recomendações</a>
            </li>
            <li>
              <a href="#educacao">Jornada de aprendizagem</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Conecte-se</h4>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer noopener" aria-label="GitHub">
              📱
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
              💼
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {year} musicMind — plataforma de educação musical. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
