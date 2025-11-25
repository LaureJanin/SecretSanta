#!/bin/bash

# Script de déploiement pour serveur de production
# Usage: ./scripts/deploy.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Déploiement de la Loterie de Noël${NC}"
echo ""

cd /home/laure/projects/sites/loterie-noel

echo -e "${BLUE}📥 Récupération des dernières modifications...${NC}"
git pull
echo ""

echo -e "${BLUE}📦 Installation des dépendances...${NC}"
npm install
echo ""

echo -e "${BLUE}🏗️  Génération du frontend...${NC}"
npm run generate
echo ""

echo -e "${BLUE}🔐 Configuration des permissions...${NC}"
sudo chown -R laure:laure .output
sudo chmod -R 755 .output
sudo chown -R www-data:www-data .output
echo ""

echo -e "${BLUE}🔄 Redémarrage du backend...${NC}"
pm2 restart loterie-backend
echo ""

echo -e "${BLUE}🔄 Rechargement de Nginx...${NC}"
sudo systemctl reload nginx
echo ""

echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
echo ""
echo -e "${BLUE}📊 Vérification du statut:${NC}"
pm2 status loterie-backend

