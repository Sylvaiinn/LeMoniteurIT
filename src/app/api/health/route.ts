import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const articleCount = await prisma.article.count();
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      articles: articleCount,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Database connection failed" },
      { status: 500 }
    );
  }
}
