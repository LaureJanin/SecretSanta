#!/bin/bash
# Sauvegarde de la base (format pg_dump, restaurable avec pg_restore).
# Usage : npm run db:backup   (utilise DATABASE_URL du .env, donc la base de prod si c'est celle du .env)
set -e
cd "$(dirname "$0")/.."

if [ -f .env ]; then set -a; . ./.env; set +a; fi
if [ -z "$DATABASE_URL" ]; then echo "❌ DATABASE_URL manquant"; exit 1; fi
if ! command -v pg_dump &> /dev/null; then echo "❌ pg_dump introuvable (brew install libpq)"; exit 1; fi

mkdir -p backups
FILE="backups/loterie-$(date +%Y%m%d-%H%M%S).dump"
# On retire ?schema=... : pg_dump n'accepte pas ce paramètre Prisma
pg_dump "${DATABASE_URL%%\?*}" --format=custom --no-owner --no-acl --file="$FILE"
echo "✅ Sauvegarde créée : $FILE ($(du -h "$FILE" | cut -f1))"
echo "   Restauration : pg_restore --clean --if-exists --no-owner -d <URL_DE_LA_BASE> $FILE"
