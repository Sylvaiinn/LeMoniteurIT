import { prisma } from "./prisma";
import { generateNewsletterIntro } from "./groq-client";
import { Resend } from "resend";
import { renderNewsletterHtml } from "./newsletter-template";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function runNewsletterWorker(): Promise<{
  articleCount: number;
  subscriberCount: number;
  subject: string;
}> {
  console.log("[Newsletter Worker] Starting newsletter generation...");

  // 1. Get top 12 articles from last 48h
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const topArticles = await prisma.article.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { scoreImportance: "desc" },
    take: 12,
  });

  if (topArticles.length === 0) {
    console.log("[Newsletter Worker] No articles in last 48h, skipping.");
    return { articleCount: 0, subscriberCount: 0, subject: "N/A" };
  }

  // 2. Generate intro synthesis via Groq
  const intro = await generateNewsletterIntro(
    topArticles.map((a) => ({
      titreEditorial: a.titreEditorial || a.title,
      categorie: a.categorie,
    }))
  );

  // 3. Build subject line
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const subject = `Le Moniteur IT — Veille du ${today}`;

  // 4. Render HTML email
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://veilles.sl-information.fr";
  const html = renderNewsletterHtml({
    intro,
    articles: topArticles.map((a) => ({
      titreEditorial: a.titreEditorial || a.title,
      url: a.url,
      source: a.source,
      categorie: a.categorie,
      pointsCles: (a.summary as { points_cles?: string[] })?.points_cles || [],
      scoreImportance: a.scoreImportance,
    })),
    siteUrl,
    date: today,
  });

  // 5. Get active subscribers
  const subscribers = await prisma.subscriber.findMany({
    where: { active: true },
    select: { email: true },
  });

  if (subscribers.length === 0) {
    console.log("[Newsletter Worker] No active subscribers.");
  }

  // 6. Send emails in batches of 50
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Le Moniteur IT <noreply@sl-information.fr>";
  const batchSize = 50;

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    try {
      await getResend().emails.send({
        from: fromEmail,
        to: batch.map((s) => s.email),
        subject,
        html,
      });
      console.log(
        `[Newsletter Worker] Sent batch ${Math.floor(i / batchSize) + 1}`
      );
    } catch (err) {
      console.error("[Newsletter Worker] Failed to send batch:", err);
    }
  }

  // 7. Save newsletter record
  await prisma.newsletter.create({
    data: {
      subject,
      introSynthesis: intro,
      articleCount: topArticles.length,
    },
  });

  console.log(`[Newsletter Worker] Done. Sent to ${subscribers.length} subscribers.`);
  return {
    articleCount: topArticles.length,
    subscriberCount: subscribers.length,
    subject,
  };
}
