export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-divider bg-paper-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-lg font-bold text-ink">
              Le Moniteur IT
            </h3>
            <p className="text-xs text-ink-muted mt-1 italic">
              L&apos;essentiel du flux, la clarté du journal.
            </p>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-ink-light mb-3">
              À propos
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Veille technologique automatisée, propulsée par intelligence
              artificielle. Les articles sont agrégés depuis des sources
              reconnues et synthétisés par IA.
            </p>
          </div>

          {/* Credits */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-ink-light mb-3">
              Technologies
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Next.js · Groq AI · PostgreSQL
              <br />
              Hébergé sur infrastructure privée
            </p>
          </div>
        </div>

        <hr className="divider-thin my-6" />

        <p className="text-center text-[11px] text-ink-muted">
          © {year} SL Information — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
