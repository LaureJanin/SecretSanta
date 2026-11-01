#!/bin/bash

# Script de démarrage du backend Apollo Server
# Usage: ./scripts/start-backend.sh

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Démarrage du backend Apollo Server${NC}"
echo ""

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé${NC}"
    echo "Création d'un fichier .env à partir de .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Veuillez configurer les variables dans .env avant de continuer${NC}"
        exit 1
    else
        echo -e "${RED}❌ Fichier .env.example non trouvé${NC}"
        exit 1
    fi
fi

# Vérifier les variables d'environnement essentielles
source .env 2>/dev/null || true

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL n'est pas défini dans .env${NC}"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo -e "${RED}❌ JWT_SECRET n'est pas défini dans .env (obligatoire)${NC}"
    exit 1
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
    npm install
fi

# Vérifier si Prisma Client est généré
if [ ! -f "node_modules/.prisma/client/index.js" ]; then
    echo -e "${YELLOW}🔧 Génération du client Prisma...${NC}"
    npx prisma generate
fi

echo -e "${GREEN}✅ Vérifications terminées${NC}"
echo ""
echo -e "${GREEN}🎯 Démarrage du serveur Apollo sur le port 4000...${NC}"
echo ""

# Démarrer le serveur
exec node --loader ts-node/esm server/index.ts

