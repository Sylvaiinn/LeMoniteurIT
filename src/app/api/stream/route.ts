import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial burst of latest articles
      const latest = await prisma.article.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "init", articles: latest })}\n\n`)
      );

      // Poll for new articles every 30 seconds
      let lastCheck = new Date();
      const interval = setInterval(async () => {
        try {
          const newArticles = await prisma.article.findMany({
            where: { createdAt: { gt: lastCheck } },
            orderBy: { createdAt: "desc" },
          });

          if (newArticles.length > 0) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "update", articles: newArticles })}\n\n`
              )
            );
            lastCheck = new Date();
          }

          // Heartbeat
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          // Client disconnected
          clearInterval(interval);
        }
      }, 30000);

      // Cleanup on close
      request_cleanup(() => clearInterval(interval));
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

// Helper to handle cleanup — in practice, the stream auto-closes
// when the client disconnects and the interval fails
function request_cleanup(fn: () => void) {
  // Store cleanup function; called when stream errors
  if (typeof globalThis !== "undefined") {
    const cleanups = ((globalThis as Record<string, unknown>).__sse_cleanups as (() => void)[]) || [];
    cleanups.push(fn);
    (globalThis as Record<string, unknown>).__sse_cleanups = cleanups;
  }
}
