"use client";

import { useEffect, useState } from "react";

interface MoodData {
  editorial: string;
  weatherLevel: string;
  createdAt: string;
}

export default function MoodBanner() {
  const [mood, setMood] = useState<MoodData | null>(null);

  useEffect(() => {
    fetch("/api/mood")
      .then((r) => r.json())
      .then(setMood)
      .catch(() => {});
  }, []);

  const editorial =
    mood?.editorial ||
    "Le Moniteur IT analyse les flux technologiques. Les premières tendances se dessinent.";

  return (
    <section className="bg-navy text-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <span className="text-gold text-lg">❝</span>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold/80 mb-2">
              Humeur du réseau
            </p>
            <p className="font-serif text-base sm:text-lg leading-relaxed text-paper/95 italic">
              {editorial}
            </p>
            {mood?.createdAt && (
              <p className="mt-2 text-xs text-paper/40">
                Mis à jour le{" "}
                {new Date(mood.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 mt-0.5">
            <span className="text-gold text-lg">❞</span>
          </div>
        </div>
      </div>
    </section>
  );
}
