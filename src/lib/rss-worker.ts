import RssParser from "rss-parser";
import { stringSimilarity } from "string-similarity-js";
import { prisma } from "./prisma";
import { RSS_SOURCES } from "./rss-sources";
import { summarizeArticle } from "./groq-client";

const parser = new RssParser({
  timeout: 10000,
  headers: {
    "User-Agent": "Le Moniteur IT/1.0 (RSS Aggregator)",
  },
});

interface RawArticle {
  guid: string;
  title: string;
  url: string;
  content: string;
  source: string;
  category: "IT" | "IA";
  publishedAt: Date;
  imageUrl?: string;
}

async function fetchFeed(source: (typeof RSS_SOURCES)[number]): Promise<RawArticle[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items || []).slice(0, 10).map((item) => ({
      guid: item.guid || item.link || `${source.name}-${item.title}`,
      title: item.title || "Sans titre",
      url: item.link || source.url,
      content: item.contentSnippet || item.content || item.title || "",
      source: source.name,
      category: source.category,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      imageUrl: item.enclosure?.url || undefined,
    }));
  } catch (err) {
    console.error(`[RSS] Failed to fetch ${source.name}:`, err);
    return [];
  }
}

function deduplicateArticles(articles: RawArticle[]): RawArticle[] {
  const unique: RawArticle[] = [];
  const clusters: Map<string, string> = new Map(); // guid → clusterId
  let clusterCounter = 0;

  for (const article of articles) {
    let isDuplicate = false;
    let matchedClusterId: string | undefined;

    for (const existing of unique) {
      const similarity = stringSimilarity(
        article.title.toLowerCase(),
        existing.title.toLowerCase()
      );

      if (similarity > 0.6) {
        isDuplicate = true;
        matchedClusterId = clusters.get(existing.guid);
        break;
      }
    }

    if (!isDuplicate) {
      const clusterId = `cluster-${++clusterCounter}`;
      clusters.set(article.guid, clusterId);
      (article as RawArticle & { clusterId?: string }).clusterId = clusterId;
      unique.push(article);
    } else if (matchedClusterId) {
      (article as RawArticle & { clusterId?: string }).clusterId = matchedClusterId;
    }
  }

  return unique;
}

export async function runRSSWorker(): Promise<{
  fetched: number;
  newArticles: number;
  processed: number;
}> {
  console.log("[RSS Worker] Starting RSS fetch cycle...");

  // 1. Fetch all feeds in parallel
  const feedResults = await Promise.allSettled(
    RSS_SOURCES.map((source) => fetchFeed(source))
  );

  const allArticles: RawArticle[] = feedResults
    .filter(
      (r): r is PromiseFulfilledResult<RawArticle[]> => r.status === "fulfilled"
    )
    .flatMap((r) => r.value);

  console.log(`[RSS Worker] Fetched ${allArticles.length} articles from feeds`);

  // 2. Filter out articles already in DB
  const existingGuids = new Set(
    (
      await prisma.article.findMany({
        select: { guid: true },
        where: {
          guid: { in: allArticles.map((a) => a.guid) },
        },
      })
    ).map((a) => a.guid)
  );

  const newArticles = allArticles.filter((a) => !existingGuids.has(a.guid));
  console.log(`[RSS Worker] ${newArticles.length} new articles to process`);

  // 3. Deduplicate
  const uniqueArticles = deduplicateArticles(newArticles);
  console.log(`[RSS Worker] ${uniqueArticles.length} unique articles after dedup`);

  // 4. Process through Groq (with rate limiting)
  let processed = 0;
  for (const article of uniqueArticles) {
    try {
      const summary = await summarizeArticle(
        article.title,
        article.content,
        article.source
      );

      await prisma.article.create({
        data: {
          guid: article.guid,
          title: article.title,
          titreEditorial: summary.titre_editorial,
          url: article.url,
          source: article.source,
          summary: { points_cles: summary.points_cles },
          scoreImportance: summary.score_importance,
          categorie: summary.categorie,
          imageUrl: article.imageUrl,
          publishedAt: article.publishedAt,
          clusterId: (article as RawArticle & { clusterId?: string }).clusterId,
        },
      });

      processed++;
      console.log(
        `[RSS Worker] Processed ${processed}/${uniqueArticles.length}: ${summary.titre_editorial}`
      );

      // Rate limit: 500ms between Groq calls
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`[RSS Worker] Failed to process article ${article.guid}:`, err);
    }
  }

  console.log(`[RSS Worker] Cycle complete. Processed ${processed} articles.`);
  return {
    fetched: allArticles.length,
    newArticles: newArticles.length,
    processed,
  };
}
