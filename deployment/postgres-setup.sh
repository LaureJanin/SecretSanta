#!/bin/bash

# Script de configuration PostgreSQL pour Loterie de Noël
# Usage: ./deployment/postgres-setup.sh [DB_NAME] [DB_USER] [DB_PASSWORD]

set -e

DB_NAME=${1:-loterie_noel}
DB_USER=${2:-loterie_user}
DB_PASSWORD=${3:-}

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ Erreur: Vous devez fournir un mot de passe pour l'utilisateur PostgreSQL"
    echo "Usage: $0 [DB_NAME] [DB_USER] [DB_PASSWORD]"
    echo "Exemple: $0 loterie_noel loterie_user mon_mot_de_passe_securise"
    exit 1
fi

echo "🔧 Configuration de PostgreSQL pour Loterie de Noël"
echo "📊 Base de données: $DB_NAME"
echo "👤 Utilisateur: $DB_USER"
echo ""

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé"
    echo "Sur Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "Sur macOS: brew install postgresql@14"
    exit 1
fi

# Vérifier si le service PostgreSQL est en cours d'exécution
if ! sudo systemctl is-active --quiet postgresql 2>/dev/null && ! pg_isready -q 2>/dev/null; then
    echo "⚠️  PostgreSQL ne semble pas être en cours d'exécution"
    echo "Démarrez-le avec: sudo systemctl start postgresql (Linux) ou brew services start postgresql@14 (macOS)"
    exit 1
fi

echo "✅ PostgreSQL est installé et en cours d'exécution"
echo ""

# Créer l'utilisateur et la base de données
echo "📝 Création de l'utilisateur et de la base de données..."

sudo -u postgres psql <<EOF
-- Supprimer l'utilisateur et la base s'ils existent déjà (pour réinstallation)
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Créer l'utilisateur
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Créer la base de données
CREATE DATABASE $DB_NAME OWNER $DB_USER;

-- Donner tous les privilèges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Se connecter à la base et donner les privilèges sur le schéma
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Utilisateur et base de données créés avec succès"
else
    echo "❌ Erreur lors de la création"
    exit 1
fi

echo ""
echo "📋 Configuration terminée !"
echo ""
echo "Ajoutez cette ligne à votre fichier .env :"
echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public\""
echo ""
echo "Ensuite, modifiez prisma/schema.prisma :"
echo "  provider = \"postgresql\""
echo ""
echo "Et exécutez :"
echo "  npx prisma generate"
echo "  npx prisma migrate dev --name init_postgresql"
echo ""

