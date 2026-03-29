import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { message: "Vous êtes déjà inscrit à la newsletter." },
          { status: 200 }
        );
      }
      // Reactivate
      await prisma.subscriber.update({
        where: { email },
        data: { active: true, unsubscribedAt: null },
      });
      return NextResponse.json({
        message: "Votre inscription a été réactivée.",
      });
    }

    await prisma.subscriber.create({
      data: { email },
    });

    return NextResponse.json(
      { message: "Inscription confirmée. Bienvenue au Moniteur IT." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
