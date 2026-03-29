import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const mood = await prisma.moodEntry.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!mood) {
    return NextResponse.json({
      editorial: "Le Moniteur IT démarre. Les premières analyses arrivent bientôt.",
      weatherLevel: "CALM",
      createdAt: new Date().toISOString(),
    });
  }

  return NextResponse.json(mood);
}
