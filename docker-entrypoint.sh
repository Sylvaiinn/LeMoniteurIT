#!/bin/sh
set -e

echo "🔄 Applying Prisma schema to database..."
node node_modules/prisma/build/index.js db push --accept-data-loss

echo "🚀 Starting Le Moniteur IT..."
exec node server.js
