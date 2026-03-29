import { NextRequest, NextResponse } from "next/server";
import { runNewsletterWorker } from "@/lib/newsletter-worker";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runNewsletterWorker();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[Cron/Newsletter] Error:", err);
    return NextResponse.json(
      { error: "Newsletter worker failed" },
      { status: 500 }
    );
  }
}
