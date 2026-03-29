import Groq from "groq-sdk";

let _groq: Groq | null = null;

function getGroq(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}

const MODEL = "llama-3.3-70b-versatile";

export interface ArticleSummary {
  titre_editorial: string;
  points_cles: string[];
  score_importance: number;
  categorie: "IT" | "IA";
}

export interface MoodResult {
  editorial: string;
  weatherLevel: "CALM" | "AGITATED" | "STORM";
}

export async function summarizeArticle(
  title: string,
  content: string,
  source: string
): Promise<ArticleSummary> {
  const prompt = `Tu es un rédacteur en chef d'un journal IT de prestige. Analyse cet article et produis un résumé éditorial.

ARTICLE:
Titre: ${title}
Source: ${source}
Contenu: ${content.slice(0, 2000)}

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "titre_editorial": "Un titre impactant et sobre, style journal de prestige (max 80 caractères)",
  "points_cles": ["Fait principal", "Enjeu stratégique", "Limite ou nuance"],
  "score_importance": 5,
  "categorie": "IT"
}

Règles:
- titre_editorial: Reformule de manière éditoriale, impactant, sobre. En français.
- points_cles: Exactement 3 bullet points: le fait, l'enjeu, la limite. En français.
- score_importance: De 1 à 10 (10 = révolution majeure dans le secteur IT/IA).
- categorie: "IT" (infrastructure, cyber, dev, cloud) ou "IA" (intelligence artificielle, ML, LLM).`;

  const response = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(text) as ArticleSummary;

  // Validate and enforce defaults
  return {
    titre_editorial: parsed.titre_editorial || title,
    points_cles: Array.isArray(parsed.points_cles)
      ? parsed.points_cles.slice(0, 3)
      : ["Information non disponible"],
    score_importance: Math.min(
      10,
      Math.max(1, parsed.score_importance || 5)
    ),
    categorie: parsed.categorie === "IA" ? "IA" : "IT",
  };
}

export async function generateMoodEditorial(
  titles: string[]
): Promise<MoodResult> {
  const prompt = `Tu es l'éditorialiste d'un grand journal tech. Analyse ces ${titles.length} titres récents du monde IT/IA et génère:

TITRES:
${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Réponds UNIQUEMENT en JSON valide:
{
  "editorial": "Un édito de 2 lignes maximum résumant la tendance actuelle du secteur. Style sobre et percutant, comme un éditorial du Monde.",
  "weatherLevel": "CALM"
}

Règles pour weatherLevel:
- "CALM": Peu de nouvelles marquantes, période d'accalmie.
- "AGITATED": Plusieurs nouvelles importantes, le secteur bouge.
- "STORM": Annonces majeures, disruptions, le secteur est en ébullition.`;

  const response = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 300,
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(text) as MoodResult;

  return {
    editorial:
      parsed.editorial || "Le flux technologique poursuit son cours régulier.",
    weatherLevel: ["CALM", "AGITATED", "STORM"].includes(parsed.weatherLevel)
      ? parsed.weatherLevel
      : "CALM",
  };
}

export async function generateNewsletterIntro(
  articles: { titreEditorial: string; categorie: string }[]
): Promise<string> {
  const prompt = `Tu es le rédacteur en chef du "Moniteur IT", un journal de veille technologique de prestige.

Voici les ${articles.length} articles les plus importants des 48 dernières heures:
${articles.map((a, i) => `${i + 1}. [${a.categorie}] ${a.titreEditorial}`).join("\n")}

Rédige une introduction de newsletter de 3-4 phrases maximum. Style: sobre, analytique, comme l'introduction d'un éditorial du Financial Times. En français.

Réponds UNIQUEMENT avec le texte de l'introduction, sans JSON, sans guillemets.`;

  const response = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    max_tokens: 300,
  });

  return (
    response.choices[0]?.message?.content ||
    "Voici les faits marquants de la veille technologique."
  );
}
