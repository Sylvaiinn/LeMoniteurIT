interface NewsletterArticle {
  titreEditorial: string;
  url: string;
  source: string;
  categorie: string;
  pointsCles: string[];
  scoreImportance: number;
}

interface NewsletterData {
  intro: string;
  articles: NewsletterArticle[];
  siteUrl: string;
  date: string;
  unsubscribeUrl: string;
}

export function renderNewsletterHtml(data: NewsletterData): string {
  const articleRows = data.articles
    .map(
      (a) => `
    <tr>
      <td style="padding: 20px 0; border-bottom: 1px solid #E5E2DB;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <span style="display: inline-block; background: ${a.categorie === "IA" ? "#1B2A4A" : "#C9A84C"}; color: #F9F7F2; font-family: Inter, Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px; border-radius: 2px; margin-bottom: 8px;">
                ${a.categorie}
              </span>
              <span style="font-family: Inter, Arial, sans-serif; font-size: 10px; color: #888; margin-left: 8px;">
                ${a.source} · Score ${a.scoreImportance}/10
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 8px;">
              <a href="${a.url}" style="font-family: 'Playfair Display', Georgia, serif; font-size: 18px; color: #1A1A1A; text-decoration: none; line-height: 1.3; font-weight: 700;">
                ${a.titreEditorial}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 10px;">
              ${a.pointsCles
                .map(
                  (p) => `
                <p style="font-family: Inter, Arial, sans-serif; font-size: 13px; color: #444; margin: 4px 0; padding-left: 12px; border-left: 2px solid #C9A84C; line-height: 1.5;">
                  ${p}
                </p>
              `
                )
                .join("")}
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Le Moniteur IT</title>
</head>
<body style="margin: 0; padding: 0; background-color: #EDEBE6; font-family: Inter, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #EDEBE6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #F9F7F2; border: 1px solid #E5E2DB;">

          <!-- HEADER -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-bottom: 3px double #1A1A1A;">
              <p style="font-family: Inter, Arial, sans-serif; font-size: 10px; color: #888; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px 0;">
                Veille Technologique
              </p>
              <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: #1A1A1A; margin: 0; font-weight: 900; letter-spacing: -0.5px;">
                Le Moniteur IT
              </h1>
              <p style="font-family: Inter, Arial, sans-serif; font-size: 11px; color: #C9A84C; margin: 8px 0 0 0; letter-spacing: 1px;">
                L'essentiel du flux, la clarté du journal
              </p>
              <p style="font-family: Inter, Arial, sans-serif; font-size: 12px; color: #888; margin: 12px 0 0 0;">
                ${data.date}
              </p>
            </td>
          </tr>

          <!-- INTRO EDITORIAL -->
          <tr>
            <td style="padding: 30px 40px; border-bottom: 1px solid #E5E2DB;">
              <p style="font-family: 'Playfair Display', Georgia, serif; font-size: 15px; color: #1A1A1A; line-height: 1.6; margin: 0; font-style: italic;">
                ${data.intro}
              </p>
            </td>
          </tr>

          <!-- ARTICLES -->
          <tr>
            <td style="padding: 10px 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${articleRows}
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 20px 40px; background-color: #1A1A1A; text-align: center;">
              <p style="font-family: Inter, Arial, sans-serif; font-size: 11px; color: #888; margin: 0;">
                <a href="${data.siteUrl}" style="color: #C9A84C; text-decoration: none;">veilles.sl-information.fr</a>
              </p>
              <p style="font-family: Inter, Arial, sans-serif; font-size: 10px; color: #666; margin: 8px 0 0 0;">
                Vous recevez cet email car vous êtes inscrit à la newsletter du Moniteur IT.
              </p>
              <p style="font-family: Inter, Arial, sans-serif; font-size: 10px; color: #555; margin: 8px 0 0 0;">
                <a href="${data.unsubscribeUrl}" style="color: #777; text-decoration: underline;">Se désabonner</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
