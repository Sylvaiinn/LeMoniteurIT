export interface RssSource {
  name: string;
  url: string;
  category: "IT" | "IA";
  lang: "en" | "fr";
}

export const RSS_SOURCES: RssSource[] = [
  // ── Tech général (EN) ──
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    category: "IT",
    lang: "en",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "IT",
    lang: "en",
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "IT",
    lang: "en",
  },
  {
    name: "Hacker News (Best)",
    url: "https://hnrss.org/best",
    category: "IT",
    lang: "en",
  },
  {
    name: "Wired",
    url: "https://www.wired.com/feed/rss",
    category: "IT",
    lang: "en",
  },

  // ── IA & Machine Learning ──
  {
    name: "MIT Tech Review - AI",
    url: "https://www.technologyreview.com/feed/",
    category: "IA",
    lang: "en",
  },
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    category: "IA",
    lang: "en",
  },
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    category: "IA",
    lang: "en",
  },
  {
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    category: "IA",
    lang: "en",
  },

  // ── Cybersécurité ──
  {
    name: "Bleeping Computer",
    url: "https://www.bleepingcomputer.com/feed/",
    category: "IT",
    lang: "en",
  },
  {
    name: "Krebs on Security",
    url: "https://krebsonsecurity.com/feed/",
    category: "IT",
    lang: "en",
  },
  {
    name: "The Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
    category: "IT",
    lang: "en",
  },

  // ── Tech français ──
  {
    name: "Le Monde Informatique",
    url: "https://www.lemondeinformatique.fr/flux-rss/thematique/toutes-les-actualites/rss.xml",
    category: "IT",
    lang: "fr",
  },
  {
    name: "Next (INpact)",
    url: "https://next.ink/feed/",
    category: "IT",
    lang: "fr",
  },
  {
    name: "Numerama",
    url: "https://www.numerama.com/feed/",
    category: "IT",
    lang: "fr",
  },
];
