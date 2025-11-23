#!/bin/bash

# Script de déploiement rapide pour serveur maison
# Usage: ./deployment/quick-deploy.sh

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Déploiement rapide - Loterie de Noël${NC}"
echo ""

# Vérifications préalables
echo -e "${YELLOW}📋 Vérifications préalables...${NC}"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "Installez Node.js 18+ : https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version)${NC}"

# Vérifier PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL n'est pas installé (optionnel si vous utilisez SQLite)${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL installé${NC}"
fi

# Vérifier Nginx
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}⚠️  Nginx n'est pas installé${NC}"
    echo "Installez Nginx : sudo apt install nginx"
else
    echo -e "${GREEN}✅ Nginx installé${NC}"
fi

# Vérifier PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 n'est pas installé (optionnel)${NC}"
    echo "Installez PM2 : sudo npm install -g pm2 dotenv-cli"
else
    echo -e "${GREEN}✅ PM2 installé${NC}"
fi

echo ""

# Vérifier le fichier .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Fichier .env non trouvé${NC}"
    if [ -f .env.example ]; then
        echo "Création de .env à partir de .env.example..."
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Veuillez configurer .env avant de continuer${NC}"
        echo "Éditez .env avec vos valeurs, puis relancez ce script."
        exit 1
    else
        echo -e "${RED}❌ Fichier .env.example non trouvé${NC}"
        exit 1
    fi
fi

# Charger les variables d'environnement
source .env 2>/dev/null || true

# Vérifier les variables essentielles
echo -e "${YELLOW}🔍 Vérification des variables d'environnement...${NC}"

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL n'est pas défini dans .env${NC}"
    exit 1
fi
echo -e "${GREEN}✅ DATABASE_URL configuré${NC}"

if [ -z "$JWT_SECRET" ]; then
    echo -e "${YELLOW}⚠️  JWT_SECRET n'est pas défini (utilisera la valeur par défaut)${NC}"
fi

if [ -z "$ADMIN_EMAIL" ]; then
    echo -e "${YELLOW}⚠️  ADMIN_EMAIL n'est pas défini${NC}"
fi

echo ""

# Installation des dépendances
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${GREEN}✅ Dépendances déjà installées${NC}"
fi
echo ""

# Génération du client Prisma
echo -e "${BLUE}🔧 Génération du client Prisma...${NC}"
npx prisma generate
echo ""

# Initialisation de la base de données
echo -e "${BLUE}🗄️  Initialisation de la base de données...${NC}"
if [[ "$DATABASE_URL" == *"postgresql"* ]]; then
    echo "Détection de PostgreSQL..."
    npx prisma db push || npx prisma migrate deploy
else
    echo "Détection de SQLite..."
    npx prisma db push
fi
echo -e "${GREEN}✅ Base de données initialisée${NC}"
echo ""

# Build de production
echo -e "${BLUE}🏗️  Build de production...${NC}"
npm run build
echo -e "${GREEN}✅ Build terminé${NC}"
echo ""

# Résumé
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo ""
echo -e "${BLUE}📝 Prochaines étapes :${NC}"
echo ""
echo "1. Démarrer le backend Apollo :"
echo "   ${YELLOW}npm run start:backend:pm2${NC}  (avec PM2)"
echo "   ${YELLOW}npm run start:backend${NC}       (sans PM2)"
echo ""
echo "2. Configurer Nginx :"
echo "   ${YELLOW}sudo cp deployment/nginx.conf.example /etc/nginx/sites-available/loterie-noel${NC}"
echo "   ${YELLOW}sudo nano /etc/nginx/sites-available/loterie-noel${NC}"
echo "   ${YELLOW}sudo ln -s /etc/nginx/sites-available/loterie-noel /etc/nginx/sites-enabled/${NC}"
echo "   ${YELLOW}sudo nginx -t${NC}"
echo "   ${YELLOW}sudo systemctl reload nginx${NC}"
echo ""
echo "3. Configurer HTTPS (optionnel mais recommandé) :"
echo "   ${YELLOW}sudo apt install certbot python3-certbot-nginx${NC}"
echo "   ${YELLOW}sudo certbot --nginx -d votre-domaine.com${NC}"
echo ""
echo "4. Vérifier que tout fonctionne :"
echo "   ${YELLOW}pm2 status${NC}                    (statut backend)"
echo "   ${YELLOW}pm2 logs loterie-backend${NC}      (logs backend)"
echo "   ${YELLOW}curl http://localhost:4000/graphql${NC}  (test GraphQL)"
echo ""
echo -e "${BLUE}📚 Documentation complète : deployment/DEPLOYMENT.md${NC}"

