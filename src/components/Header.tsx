import WeatherIndicator from "./WeatherIndicator";

export default function Header() {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-divider">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
        <time className="text-xs text-ink-muted tracking-wide capitalize">
          {today}
        </time>
        <div className="flex items-center gap-4">
          <WeatherIndicator />
          <div className="flex items-center gap-1.5">
            <div className="live-dot" />
            <span className="text-xs font-medium text-ink-muted tracking-wider uppercase">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Main masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 text-center">
        {/* Sceau de Savoir */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-navy flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 sm:w-6 sm:h-6 text-gold"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-ink leading-tight">
          Le Moniteur IT
        </h1>

        <p className="mt-1 text-xs sm:text-sm text-gold font-medium tracking-[0.15em] uppercase">
          L&apos;essentiel du flux, la clarté du journal
        </p>
      </div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-divider">
        <div className="flex items-center justify-center gap-6 sm:gap-10 py-2.5">
          <NavLink href="#a-la-une" label="À la Une" />
          <NavLink href="#actualites" label="Actualités" />
          <NavLink href="#newsletter" label="Newsletter" />
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="text-xs font-semibold tracking-wider uppercase text-ink-light hover:text-gold transition-colors duration-200"
    >
      {label}
    </a>
  );
}
