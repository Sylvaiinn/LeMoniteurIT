"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Inscription confirmée.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur de connexion. Réessayez.");
    }

    // Reset after 5 seconds
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <section id="newsletter" className="bg-navy text-paper">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <span className="text-gold text-2xl">✉</span>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-4 mb-2">
          La Newsletter du Moniteur
        </h2>

        <p className="text-paper/70 text-sm sm:text-base mb-8 max-w-lg mx-auto">
          Toutes les 48 heures, recevez une synthèse éditoriale des faits
          technologiques marquants, rédigée par intelligence artificielle.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.fr"
            required
            className="flex-1 px-4 py-3 bg-paper/10 border border-paper/20 rounded text-paper placeholder:text-paper/40 text-sm focus:outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 bg-gold text-ink font-semibold text-sm tracking-wider uppercase rounded hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "..." : "S'inscrire"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-[11px] text-paper/30">
          Pas de spam. Désinscription en un clic. Données non partagées.
        </p>
      </div>
    </section>
  );
}
