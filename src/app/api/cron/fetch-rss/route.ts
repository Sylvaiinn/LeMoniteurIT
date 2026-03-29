import { NextRequest, NextResponse } from "next/server";
import { runRSSWorker } from "@/lib/rss-worker";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runRSSWorker();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[Cron/RSS] Error:", err);
    return NextResponse.json(
      { error: "RSS worker failed" },
      { status: 500 }
    );
  }
}
