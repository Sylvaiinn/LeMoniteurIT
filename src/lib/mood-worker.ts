import { prisma } from "./prisma";
import { generateMoodEditorial } from "./groq-client";

export async function runMoodWorker(): Promise<{
  editorial: string;
  weatherLevel: string;
}> {
  console.log("[Mood Worker] Generating mood editorial...");

  // Fetch last 20 article titles
  const recentArticles = await prisma.article.findMany({
    select: { titreEditorial: true, title: true, scoreImportance: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  if (recentArticles.length === 0) {
    console.log("[Mood Worker] No articles found, skipping.");
    return {
      editorial: "Le flux technologique est silencieux. Patience.",
      weatherLevel: "CALM",
    };
  }

  const titles = recentArticles.map((a) => a.titreEditorial || a.title);

  // Also compute weather from score density
  const highScoreCount = recentArticles.filter(
    (a) => a.scoreImportance >= 7
  ).length;
  const densityWeather: "CALM" | "AGITATED" | "STORM" =
    highScoreCount >= 8 ? "STORM" : highScoreCount >= 4 ? "AGITATED" : "CALM";

  // Get Groq editorial
  const groqResult = await generateMoodEditorial(titles);

  // Merge: use the highest alert level between density and Groq
  const levels = { CALM: 0, AGITATED: 1, STORM: 2 };
  const finalWeather =
    levels[densityWeather] > levels[groqResult.weatherLevel]
      ? densityWeather
      : groqResult.weatherLevel;

  // Save to database
  const entry = await prisma.moodEntry.create({
    data: {
      editorial: groqResult.editorial,
      weatherLevel: finalWeather,
    },
  });

  console.log(`[Mood Worker] Created mood entry: ${entry.id} — ${finalWeather}`);
  return { editorial: groqResult.editorial, weatherLevel: finalWeather };
}
