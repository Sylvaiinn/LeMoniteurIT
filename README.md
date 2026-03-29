# Le Moniteur IT

**L'essentiel du flux, la clarté du journal.**

Plateforme de veille technologique automatisée avec synthèse par intelligence artificielle.

## Architecture

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS v4
- **Backend**: API Routes + Workers (RSS, Mood, Newsletter)
- **IA**: Groq API (Llama 3.3 70B)
- **Base de données**: PostgreSQL 16
- **Cache**: Redis 7
- **Emails**: Resend

## Déploiement rapide

### 1. Configurer les variables d'environnement

```bash
cp .env.docker .env
# Éditez .env avec vos valeurs
```

### 2. Construire et lancer

```bash
docker compose up -d --build
```

### 3. Configurer le cron (sur l'hôte Debian)

```bash
# Éditez le fichier cron avec votre CRON_SECRET
sudo cp cron/moniteur-it /etc/cron.d/moniteur-it
sudo chmod 644 /etc/cron.d/moniteur-it
```

### 4. Premier fetch RSS

```bash
curl -X POST -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/fetch-rss
```

## Configuration pfSense / HAProxy

### HAProxy Backend
1. **Backend**: `moniteur-it-backend`
   - Mode: HTTP
   - Server: `VM_IP:3000` (check: inter 10s)
   - Health check: `GET /api/health` → expect 200

2. **Frontend**: `moniteur-it-frontend`
   - Bind: `:443` (SSL offloading avec cert ACME)
   - ACL: `hdr(host) -i veilles.sl-information.fr`
   - Default backend: `moniteur-it-backend`

### Headers à configurer (HAProxy Actions)
```
http-request set-header X-Forwarded-For %[src]
http-request set-header X-Forwarded-Proto https
http-request set-header X-Real-IP %[src]
http-request set-header Host veilles.sl-information.fr
```

### pfSense NAT
- **WAN Rule**: TCP 443 → HAProxy (127.0.0.1:443)

## Endpoints API

| Route | Méthode | Description |
|---|---|---|
| `/api/articles` | GET | Articles paginés (params: `page`, `limit`, `categorie`, `minScore`) |
| `/api/mood` | GET | Dernière humeur du réseau |
| `/api/subscribe` | POST | Inscription newsletter |
| `/api/health` | GET | Health check |
| `/api/stream` | GET | SSE temps réel |
| `/api/cron/fetch-rss` | POST | Déclenche le worker RSS (auth Bearer) |
| `/api/cron/mood` | POST | Déclenche le mood (auth Bearer) |
| `/api/cron/newsletter` | POST | Déclenche la newsletter (auth Bearer) |
