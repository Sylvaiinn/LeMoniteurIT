"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function LiveFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const connectSSE = useCallback(() => {
    const eventSource = new EventSource("/api/stream");

    eventSource.onopen = () => setIsConnected(true);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "init") {
          setArticles(data.articles || []);
        } else if (data.type === "update") {
          setArticles((prev) => {
            const newItems = (data.articles || []).filter(
              (a: Article) => !prev.some((p) => p.id === a.id)
            );
            return [...newItems, ...prev].slice(0, 20);
          });
        }
      } catch {
        // Ignore heartbeats and malformed messages
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
      // Reconnect after 5 seconds
      setTimeout(connectSSE, 5000);
    };

    return eventSource;
  }, []);

  useEffect(() => {
    const es = connectSSE();
    return () => es.close();
  }, [connectSSE]);

  return (
    <aside className="lg:sticky lg:top-36">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
          <span className="text-gold">║</span> Le Fil
        </h2>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-[10px] text-ink-muted">
            {isConnected ? "Connecté" : "Reconnexion..."}
          </span>
        </div>
      </div>

      <div className="border border-divider rounded bg-paper">
        {articles.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-ink-muted italic">
              En attente du flux...
            </p>
          </div>
        ) : (
          <div className="divide-y divide-divider px-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
