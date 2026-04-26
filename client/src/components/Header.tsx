import { useState } from "react";

const nav = [
  { href: "#inicio", label: "Início" },
  { href: "#como-funciona", label: "Como Funciona" },
  { href: "#player", label: "Player" },
  { href: "#recomendacoes", label: "Recomendações" },
  { href: "#educacao", label: "Educação" },
] as const;

/**
 * Navegação fixa: em ecrãs pequenos o menu colapsa e usa estado local.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="container header-content">
        <div className="logo" tabIndex={-1}>
          <span className="logo-icon" aria-hidden>
            🎵
          </span>{" "}
          musicMind
        </div>
        <nav className={open ? "active" : ""} id="main-nav" aria-label="Principal">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="mobile-menu-btn"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => {
            setOpen((v) => !v);
          }}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
