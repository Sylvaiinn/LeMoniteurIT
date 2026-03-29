import Image from "next/image";

interface Article {
  id: string;
  titreEditorial: string | null;
  title: string;
  url: string;
  source: string;
  summary: { points_cles?: string[] } | null;
  scoreImportance: number;
  categorie: string;
  publishedAt: string;
  imageUrl: string | null;
}

export default function ArticleCard({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: "default" | "hero" | "compact";
}) {
  const titre = article.titreEditorial || article.title;
  const points = (article.summary as { points_cles?: string[] })?.points_cles || [];
  const timeAgo = getTimeAgo(new Date(article.publishedAt));

  if (variant === "hero") {
    return (
      <article className="group">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
          {article.imageUrl && (
            <div className="aspect-[16/9] overflow-hidden mb-4 bg-paper-dark">
              <Image
                src={article.imageUrl}
                alt=""
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-block text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm ${
                article.categorie === "IA" ? "badge-ia" : "badge-it"
              }`}
            >
              {article.categorie}
            </span>
            <span className="text-xs text-ink-muted">{article.source}</span>
            <span className="text-xs text-ink-muted">·</span>
            <span className="text-xs text-ink-muted">{timeAgo}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink leading-tight group-hover:text-navy transition-colors duration-200 mb-3">
            {titre}
          </h2>

          <div className="space-y-1.5">
            {points.map((point, i) => (
              <p
                key={i}
                className="text-sm text-ink-light pl-3 border-l-2 border-gold leading-relaxed"
              >
                {point}
              </p>
            ))}
          </div>

          <ScoreBadge score={article.scoreImportance} className="mt-3" />
        </a>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group py-3 border-b border-divider last:border-b-0">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-px rounded-sm ${
                article.categorie === "IA" ? "badge-ia" : "badge-it"
              }`}
            >
              {article.categorie}
            </span>
            <span className="text-[11px] text-ink-muted">{timeAgo}</span>
          </div>
          <h3 className="font-serif text-sm font-semibold text-ink leading-snug group-hover:text-navy transition-colors duration-200">
            {titre}
          </h3>
          <p className="text-[11px] text-ink-muted mt-1">{article.source}</p>
        </a>
      </article>
    );
  }

  // Default variant
  return (
    <article className="group animate-fade-in">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5 rounded border border-divider bg-paper hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm ${
                article.categorie === "IA" ? "badge-ia" : "badge-it"
              }`}
            >
              {article.categorie}
            </span>
            <span className="text-xs text-ink-muted">{article.source}</span>
          </div>
          <ScoreBadge score={article.scoreImportance} />
        </div>

        <h3 className="font-serif text-lg font-bold text-ink leading-snug group-hover:text-navy transition-colors duration-200 mb-3">
          {titre}
        </h3>

        <div className="space-y-1.5 mb-3">
          {points.map((point, i) => (
            <p
              key={i}
              className="text-xs text-ink-light pl-3 border-l-2 border-gold/50 leading-relaxed"
            >
              {point}
            </p>
          ))}
        </div>

        <p className="text-xs text-ink-muted">{timeAgo}</p>
      </a>
    </article>
  );
}

function ScoreBadge({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  const color =
    score >= 7
      ? "bg-gold text-ink"
      : score >= 4
        ? "bg-ink-muted/20 text-ink-light"
        : "bg-paper-dark text-ink-muted";

  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${color} ${className}`}
      title={`Score d'importance : ${score}/10`}
    >
      {score}
    </span>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffD < 7) return `Il y a ${diffD}j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
