"use client";

import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";

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

export default function ArticleGrid() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<"all" | "IT" | "IA">("all");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "12",
    });
    if (filter !== "all") params.set("categorie", filter);

    fetch(`/api/articles?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, filter]);

  return (
    <section id="actualites">
      {/* Section header with filters */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-ink flex items-center gap-3">
          <span className="text-gold">◆</span> Actualités
        </h2>

        <div className="flex items-center gap-1 bg-paper-dark rounded p-0.5">
          {(["all", "IT", "IA"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded transition-all ${
                filter === f
                  ? "bg-paper text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {f === "all" ? "Tout" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse p-5 border border-divider rounded">
              <div className="flex gap-2 mb-3">
                <div className="h-4 w-8 bg-paper-dark rounded" />
                <div className="h-4 w-20 bg-paper-dark rounded" />
              </div>
              <div className="h-5 bg-paper-dark rounded w-3/4 mb-3" />
              <div className="h-4 bg-paper-dark rounded w-full mb-1" />
              <div className="h-4 bg-paper-dark rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-divider rounded">
          <p className="text-sm text-ink-muted">Aucun article pour ce filtre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="default" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-xs font-semibold border border-divider rounded hover:bg-paper-dark transition-colors disabled:opacity-30"
          >
            ← Précédent
          </button>
          <span className="text-xs text-ink-muted">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-xs font-semibold border border-divider rounded hover:bg-paper-dark transition-colors disabled:opacity-30"
          >
            Suivant →
          </button>
        </div>
      )}
    </section>
  );
}
