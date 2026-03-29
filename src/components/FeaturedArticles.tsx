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

export default function FeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles?limit=3&minScore=5")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="a-la-une" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="font-serif text-2xl font-bold text-ink mb-6 flex items-center gap-3">
          <span className="text-gold">◆</span> À la Une
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`animate-pulse ${i === 1 ? "lg:row-span-2" : ""}`}
            >
              <div className="aspect-[16/9] bg-paper-dark rounded mb-4" />
              <div className="h-4 bg-paper-dark rounded w-1/4 mb-3" />
              <div className="h-6 bg-paper-dark rounded w-3/4 mb-2" />
              <div className="h-4 bg-paper-dark rounded w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section id="a-la-une" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="font-serif text-2xl font-bold text-ink mb-6 flex items-center gap-3">
          <span className="text-gold">◆</span> À la Une
        </h2>
        <div className="text-center py-16 border border-dashed border-divider rounded">
          <p className="font-serif text-xl text-ink-muted italic">
            Les rotatives démarrent bientôt...
          </p>
          <p className="text-sm text-ink-muted mt-2">
            Les premiers articles apparaîtront après le premier cycle de veille.
          </p>
        </div>
      </section>
    );
  }

  const [hero, ...secondary] = articles;

  return (
    <section id="a-la-une" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h2 className="font-serif text-2xl font-bold text-ink mb-6 flex items-center gap-3">
        <span className="text-gold">◆</span> À la Une
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero article */}
        <div className="lg:row-span-2">
          <ArticleCard article={hero} variant="hero" />
        </div>

        {/* Secondary articles */}
        {secondary.map((article) => (
          <div key={article.id}>
            <ArticleCard article={article} variant="default" />
          </div>
        ))}
      </div>
    </section>
  );
}
