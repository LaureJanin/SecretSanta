#!/bin/bash

# Script de build pour la production
# Usage: ./scripts/build-production.sh

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏗️  Build de production pour Loterie de Noël${NC}"
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js et npm sont installés${NC}"
echo ""

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé${NC}"
    if [ -f .env.example ]; then
        echo "Création d'un fichier .env à partir de .env.example..."
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Veuillez configurer les variables dans .env avant de continuer${NC}"
        echo -e "${YELLOW}⚠️  Notamment: DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, GMAIL_APP_PASSWORD, SITE_URL, GRAPHQL_URL${NC}"
        exit 1
    else
        echo -e "${RED}❌ Fichier .env.example non trouvé${NC}"
        exit 1
    fi
fi

# Charger les variables d'environnement
source .env 2>/dev/null || true

# Vérifier les variables essentielles
echo -e "${BLUE}🔍 Vérification des variables d'environnement...${NC}"

MISSING_VARS=()

if [ -z "$DATABASE_URL" ]; then
    MISSING_VARS+=("DATABASE_URL")
fi

if [ -z "$JWT_SECRET" ]; then
    MISSING_VARS+=("JWT_SECRET")
fi

if [ -z "$ADMIN_EMAIL" ]; then
    MISSING_VARS+=("ADMIN_EMAIL")
fi

if [ -z "$GMAIL_APP_PASSWORD" ]; then
    MISSING_VARS+=("GMAIL_APP_PASSWORD")
fi

if [ -z "$SITE_URL" ]; then
    MISSING_VARS+=("SITE_URL")
fi

if [ -z "$GRAPHQL_URL" ]; then
    MISSING_VARS+=("GRAPHQL_URL")
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Variables d'environnement manquantes:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "   ${RED}- $var${NC}"
    done
    echo ""
    echo -e "${YELLOW}Configurez ces variables dans votre fichier .env${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Toutes les variables d'environnement sont configurées${NC}"
echo ""

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installation des dépendances...${NC}"
    npm install
    echo ""
fi

# Générer le client Prisma
echo -e "${BLUE}🔧 Génération du client Prisma...${NC}"
npx prisma generate
echo ""

# Appliquer les migrations de base de données
echo -e "${BLUE}🗄️  Application des migrations de base de données...${NC}"
npx prisma migrate deploy || npx prisma db push
echo ""

# Build Nuxt
echo -e "${BLUE}🏗️  Build de l'application Nuxt...${NC}"
NODE_ENV=production npm run build
echo ""

# Vérifier que le dossier dist existe
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Le dossier dist/ n'a pas été créé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build terminé avec succès !${NC}"
echo ""
echo -e "${BLUE}📋 Prochaines étapes:${NC}"
echo ""
echo "1. Vérifier que le dossier dist/ contient les fichiers"
echo "2. Configurer Nginx (voir deployment/nginx.conf.example)"
echo "3. Démarrer le backend Apollo:"
echo "   - Avec PM2: npm run start:backend:pm2"
echo "   - Ou manuellement: npm run start:backend"
echo "4. Configurer Nginx pour servir les fichiers depuis dist/"
echo "5. Redémarrer Nginx: sudo systemctl restart nginx"
echo ""
echo -e "${GREEN}🎉 Votre application est prête pour la production !${NC}"

