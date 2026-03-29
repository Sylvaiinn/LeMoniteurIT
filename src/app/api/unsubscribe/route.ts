import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return new NextResponse("Lien invalide.", { status: 400, headers: { "Content-Type": "text/html" } });
  }

  await prisma.subscriber.updateMany({
    where: { email },
    data: { active: false },
  });

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Désabonnement — Le Moniteur IT</title>
</head>
<body style="margin:0;padding:0;background:#EDEBE6;font-family:Inter,Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="background:#F9F7F2;border:1px solid #E5E2DB;padding:40px;max-width:480px;text-align:center;">
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:22px;color:#1A1A1A;margin:0 0 16px;">Le Moniteur IT</h1>
    <p style="font-size:15px;color:#444;line-height:1.6;margin:0 0 24px;">
      Vous avez été désabonné avec succès.<br>Vous ne recevrez plus nos newsletters.
    </p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://veilles.sl-information.fr"}" style="font-size:13px;color:#C9A84C;text-decoration:none;">
      ← Retour au site
    </a>
  </div>
</body>
</html>`;

  return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html" } });
}
