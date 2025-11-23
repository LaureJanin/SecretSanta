# Guide de migration SQLite → PostgreSQL

Ce guide explique comment migrer la base de données de SQLite vers PostgreSQL pour la production.

## Quand migrer vers PostgreSQL ?

### Rester sur SQLite si :
- Vous avez peu d'utilisateurs simultanés (< 10)
- Vous n'avez qu'une seule instance de l'application
- Vous voulez une configuration simple
- Vous n'avez pas besoin de sauvegardes automatiques avancées

### Migrer vers PostgreSQL si :
- Vous avez plusieurs utilisateurs simultanés
- Vous prévoyez de scaler l'application
- Vous voulez une base de données plus robuste
- Vous avez besoin de transactions complexes
- Vous voulez des sauvegardes automatiques

## Installation de PostgreSQL

### Sur Ubuntu/Debian :
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Sur macOS (avec Homebrew) :
```bash
brew install postgresql@14
brew services start postgresql@14
```

## Configuration PostgreSQL

### 1. Créer un utilisateur et une base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans le shell PostgreSQL :
CREATE USER loterie_user WITH PASSWORD 'votre_mot_de_passe_securise';
CREATE DATABASE loterie_noel OWNER loterie_user;
GRANT ALL PRIVILEGES ON DATABASE loterie_noel TO loterie_user;
\q
```

### 2. Modifier le schéma Prisma

Éditez `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"  // Changé de "sqlite"
  url      = env("DATABASE_URL")
}
```

### 3. Configurer DATABASE_URL

Dans votre fichier `.env` :

```env
DATABASE_URL="postgresql://loterie_user:votre_mot_de_passe_securise@localhost:5432/loterie_noel?schema=public"
```

### 4. Générer le client Prisma et créer les migrations

```bash
# Générer le client Prisma pour PostgreSQL
npx prisma generate

# Créer les migrations
npx prisma migrate dev --name init_postgresql

# Ou si vous voulez juste appliquer le schéma sans migration
npx prisma db push
```

## Migration des données (optionnel)

Si vous avez déjà des données dans SQLite et que vous voulez les migrer :

### Option 1 : Export/Import manuel

1. Exporter les données SQLite :
```bash
sqlite3 prisma/dev.db .dump > dump.sql
```

2. Adapter le dump pour PostgreSQL (changer les types, syntaxe, etc.)

3. Importer dans PostgreSQL :
```bash
psql -U loterie_user -d loterie_noel < dump_adapted.sql
```

### Option 2 : Utiliser un outil de migration

Des outils comme `pgloader` peuvent faciliter la migration :

```bash
# Installer pgloader
sudo apt install pgloader  # Ubuntu/Debian
brew install pgloader      # macOS

# Migrer les données
pgloader sqlite://prisma/dev.db postgresql://loterie_user:password@localhost/loterie_noel
```

## Vérification

Après la migration, vérifiez que tout fonctionne :

```bash
# Ouvrir Prisma Studio
npm run db:studio

# Vérifier les tables
psql -U loterie_user -d loterie_noel -c "\dt"
```

## Retour en arrière

Si vous voulez revenir à SQLite :

1. Modifier `prisma/schema.prisma` : `provider = "sqlite"`
2. Modifier `.env` : `DATABASE_URL="file:./prisma/dev.db"`
3. Exécuter : `npx prisma generate`
4. Exécuter : `npx prisma db push`

## Scripts utiles

Voir `deployment/postgres-setup.sh` pour un script automatisé de configuration PostgreSQL.

## Ressources

- [Documentation Prisma - PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)

