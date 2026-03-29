import { NextRequest, NextResponse } from "next/server";
import { runMoodWorker } from "@/lib/mood-worker";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runMoodWorker();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[Cron/Mood] Error:", err);
    return NextResponse.json(
      { error: "Mood worker failed" },
      { status: 500 }
    );
  }
}
