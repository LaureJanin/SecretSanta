# 🎄 Loterie de Noël

Application web pour organiser et gérer des tirages au sort de cadeaux de Noël en famille ou entre amis.

## 📋 Description

Loterie de Noël est une application complète qui permet de :
- Créer et gérer des loteries de cadeaux
- Ajouter des participants avec leurs informations
- Définir des règles d'exclusion (ex: un parent ne peut pas tirer son enfant)
- Effectuer un tirage au sort intelligent qui respecte les exclusions
- Gérer les idées cadeaux de chaque participant
- Envoyer les résultats du tirage par email

## 🛠️ Technologies

### Frontend
- **Nuxt 3** - Framework Vue.js avec SSR
- **Vue 3** - Framework JavaScript réactif
- **TypeScript** - Typage statique
- **Apollo Client** - Client GraphQL
- **CSS Variables** - Système de design tokens

### Backend
- **Apollo Server** - Serveur GraphQL
- **Express** - Framework Node.js
- **Prisma ORM** - Gestion de base de données
- **PostgreSQL** - Base de données
- **JWT** - Authentification par tokens
- **bcrypt** - Hashage des mots de passe
- **Nodemailer** - Envoi d'emails via Gmail SMTP

## 📁 Structure du projet

```
nuxt-loterie-noel/
├── assets/
│   └── css/
│       └── variables.css      # Variables CSS globales (design tokens)
├── components/
│   ├── ExclusionRule.vue       # Composant pour les règles d'exclusion
│   ├── ModaleConfirmation.vue # Modale de confirmation
│   ├── ParticipantForm.vue    # Formulaire de participant
│   └── Toast.vue              # Système de notifications toast
├── composables/
│   └── useToast.ts            # Composable pour les notifications
├── graphql/
│   └── queries.ts             # Toutes les requêtes et mutations GraphQL
├── pages/
│   ├── index.vue              # Page d'accueil
│   ├── login.vue              # Connexion
│   ├── signup.vue             # Inscription
│   ├── form.vue               # Création de loterie
│   ├── my-loteries.vue        # Liste des loteries de l'utilisateur
│   ├── admin.vue              # Administration d'une loterie
│   └── gift-ideas.vue         # Gestion des idées cadeaux
├── plugins/
│   └── apollo-composable.client.ts  # Configuration Apollo Client
├── prisma/
│   └── schema.prisma          # Schéma de base de données
├── server/
│   ├── index.ts               # Point d'entrée Apollo Server
│   ├── schema.ts              # Schéma GraphQL
│   ├── resolvers.ts           # Résolveurs GraphQL
│   ├── database.ts            # Service de base de données
│   ├── authService.ts         # Service d'authentification
│   ├── drawService.ts         # Service de tirage au sort
│   ├── emailService.ts        # Service d'envoi d'emails
│   └── types.ts               # Types TypeScript
├── main.css                   # Styles globaux
├── nuxt.config.ts             # Configuration Nuxt
└── package.json               # Dépendances et scripts
```

## 🚀 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository** (si applicable)
```bash
git clone <url-du-repo>
cd nuxt-loterie-noel
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la base de données**

Créer un fichier `.env` à la racine du projet :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/loterie_noel?schema=public"
JWT_SECRET="votre-secret-jwt-tres-securise"
ADMIN_EMAIL="votre-email@gmail.com"
GMAIL_APP_PASSWORD="votre-mot-de-passe-application-gmail"
SITE_URL="http://localhost:3000"
```

4. **Initialiser la base de données**
```bash
npm run db:push
```

## 🎮 Scripts disponibles

```bash
# Développement
npm run dev          # Démarrer Nuxt en mode développement (port 3000)
npm run apollo       # Démarrer le serveur Apollo GraphQL (port 4000)

# Base de données
npm run db:studio    # Ouvrir Prisma Studio (interface graphique)
npm run db:push      # Synchroniser le schéma avec la base de données
npm run db:reset     # Réinitialiser la base de données

# Production
npm run generate     # Générer le site statique (déployé par Nginx)
npm run preview      # Prévisualiser le build
```

## 🏃 Démarrage rapide

1. **Démarrer le serveur Apollo** (dans un terminal)
```bash
npm run apollo
```

2. **Démarrer Nuxt** (dans un autre terminal)
```bash
npm run dev
```

3. **Accéder à l'application**
- Frontend : http://localhost:3000
- GraphQL Playground : http://localhost:4000/graphql

## 🎨 Design System

Le projet utilise un système de design tokens centralisé dans `assets/css/variables.css` :

- **Couleurs** : primaire, secondaire, accent, états (success, error, warning)
- **Espacements** : xs, sm, md, lg, xl, 2xl
- **Bordures** : rayons et largeurs standardisés
- **Ombres** : niveaux d'ombres cohérents
- **Typographie** : tailles et poids de police
- **Transitions** : durées standardisées
- **Breakpoints** : 768px pour le responsive

Tous les composants utilisent ces variables pour garantir une cohérence visuelle.

## 📱 Responsive Design

L'application est entièrement responsive avec :
- **Desktop** : Navigation horizontale classique
- **Mobile (≤768px)** : 
  - Menu burger avec overlay
  - Logo et titre centrés
  - Layout adaptatif pour tous les contenus
  - Marges latérales harmonisées

## 🔐 Authentification

- **Inscription** : Email + mot de passe (hashé avec bcrypt)
- **Connexion** : Génération d'un token JWT (expiration 7 jours)
- **Sécurité** : Isolation complète des données par utilisateur
- **Stockage** : Token JWT dans `localStorage`

## 📊 Base de données

Voir `SCHEMA_BDD.md` pour le schéma complet.

### Tables principales
- **User** : Utilisateurs de l'application
- **Lottery** : Loteries créées
- **Participant** : Participants à une loterie
- **GiftIdea** : Idées cadeaux des participants
- **Exclusion** : Règles d'exclusion entre participants
- **Draw** : Résultats du tirage au sort
- **ParticipantManager** : Gestion des profils enfants

## 🎯 Fonctionnalités principales

### Pour les utilisateurs
- ✅ Création de compte et connexion
- ✅ Création de loteries
- ✅ Gestion des participants
- ✅ Définition de règles d'exclusion
- ✅ Tirage au sort intelligent
- ✅ Gestion des idées cadeaux
- ✅ Visualisation des résultats du tirage
- ✅ Notifications toast (remplace les alertes)

### Pour les participants
- ✅ Accès via code de connexion
- ✅ Ajout d'idées cadeaux
- ✅ Visualisation de leur destinataire après tirage

## 📧 Service Email

L'application envoie des emails via Gmail SMTP :
- **Codes de connexion** : Pour que les participants accèdent à la plateforme
- **Résultats du tirage** : Révèle à chaque donneur son receveur et ses idées cadeaux

Configuration requise dans `.env` :
```env
ADMIN_EMAIL="votre-email@gmail.com"
GMAIL_APP_PASSWORD="mot-de-passe-application-gmail"
SITE_URL="http://localhost:3000"
```

**Note importante** : Pour `GMAIL_APP_PASSWORD`, vous devez utiliser un [mot de passe d'application Gmail](https://support.google.com/accounts/answer/185833), pas votre mot de passe de compte Gmail classique.

## 🚢 Déploiement sur serveur maison

L'application est conçue pour être déployée sur votre propre serveur avec une architecture séparée :
- **Frontend** : Nuxt 3 (fichiers statiques servis par Nginx)
- **Backend** : Apollo Server GraphQL (processus Node.js séparé)

### 📚 Documentation complète

Pour un guide de déploiement détaillé étape par étape, consultez :
- **Guide complet** : [`deployment/DEPLOYMENT.md`](deployment/DEPLOYMENT.md)
- **Script de déploiement rapide** : `./deployment/quick-deploy.sh`

### Déploiement rapide

```bash
# Sur votre serveur, après avoir cloné le projet
./deployment/quick-deploy.sh
```

Ce script automatise :
- Vérification des prérequis
- Installation des dépendances
- Génération du client Prisma
- Initialisation de la base de données
- Génération du site statique

### Prérequis

- Node.js 18+ et npm
- Nginx (pour servir le frontend et reverse proxy)
- PostgreSQL
- PM2 (optionnel mais recommandé pour gérer le backend)

### Étapes de déploiement (résumé)

#### 1. Préparer l'environnement

```bash
# Cloner le projet
git clone <votre-repo>
cd nuxt-loterie-noel

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs
```

#### 2. Configurer les variables d'environnement

Éditez le fichier `.env` avec vos valeurs :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/loterie_noel?schema=public"

# Authentification
JWT_SECRET="votre-secret-jwt-tres-securise"

# Email
ADMIN_EMAIL="votre-email@gmail.com"
GMAIL_APP_PASSWORD="votre-mot-de-passe-application-gmail"

# URLs
SITE_URL="https://votre-domaine.com"
GRAPHQL_URL="https://votre-domaine.com/graphql"
```

#### 3. Base de données

**PostgreSQL**
```bash
# Voir deployment/database-migration.md pour le guide complet
./deployment/postgres-setup.sh loterie_noel loterie_user votre_mot_de_passe
# Modifier prisma/schema.prisma: provider = "postgresql"
npx prisma generate
npx prisma migrate deploy
```

#### 4. Génération du site statique

```bash
# Avec vérifications
./scripts/build-production.sh

# Ou manuellement:
npm run generate
```

#### 5. Démarrer le backend Apollo

**Avec PM2 (recommandé) :**
```bash
# Installer PM2 et dotenv-cli globalement
npm install -g pm2 dotenv-cli

# Démarrer le backend (le script npm charge automatiquement .env)
npm run start:backend:pm2

# Note: Le dossier logs/ sera créé automatiquement par PM2 pour les logs

# Vérifier le statut
pm2 status
pm2 logs loterie-backend
```

**Sans PM2 :**
```bash
npm run start:backend
```

#### 6. Configurer Nginx

```bash
# Copier la configuration exemple
sudo cp deployment/nginx.conf.example /etc/nginx/sites-available/loterie-noel

# Éditer la configuration
sudo nano /etc/nginx/sites-available/loterie-noel
# Adapter: server_name, root, et autres paramètres

# Activer le site
sudo ln -s /etc/nginx/sites-available/loterie-noel /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

#### 7. HTTPS (recommandé)

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx  # Ubuntu/Debian

# Obtenir un certificat SSL
sudo certbot --nginx -d votre-domaine.com

# Certbot configurera automatiquement HTTPS
```

### Checklist de déploiement

- [ ] Variables d'environnement configurées dans `.env`
- [ ] Base de données PostgreSQL initialisée
- [ ] Site statique généré (`.output/public/` créé)
- [ ] Backend Apollo démarré et accessible
- [ ] Nginx configuré et actif
- [ ] HTTPS configuré (optionnel mais recommandé)
- [ ] Test de l'application complète

### Scripts disponibles

```bash
# Build
./scripts/build-production.sh        # Build complet avec vérifications

# Backend
npm run start:backend               # Démarrer le backend (script bash)
npm run start:backend:pm2           # Démarrer avec PM2
npm run stop:backend:pm2             # Arrêter avec PM2
npm run restart:backend:pm2          # Redémarrer avec PM2

# Base de données
npm run db:studio                    # Interface graphique Prisma
npm run db:push                      # Synchroniser le schéma
```

### Architecture de déploiement

```
Internet
   ↓
Nginx (port 80/443)
   ├── / → Fichiers statiques Nuxt (.output/public/)
   └── /graphql → Reverse proxy → Backend Apollo (port 4000)
```

### Dépannage

**Le backend ne démarre pas :**
- Vérifier que le port 4000 est libre
- Vérifier les variables d'environnement dans `.env`
- Vérifier les logs : `pm2 logs loterie-backend` ou dans la console

**Nginx ne sert pas les fichiers :**
- Vérifier que le chemin `root` pointe vers `.output/public/`
- Vérifier les permissions : `sudo chown -R www-data:www-data .output/`
- Vérifier les logs : `sudo tail -f /var/log/nginx/loterie-noel-error.log`

**Erreurs de connexion GraphQL :**
- Vérifier que le backend Apollo est démarré
- Vérifier que `GRAPHQL_URL` dans `.env` correspond à votre configuration
- Vérifier la configuration Nginx pour `/graphql`

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` à partir de `.env.example` :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/loterie_noel?schema=public"
JWT_SECRET="votre-secret-jwt"
ADMIN_EMAIL="votre-email@gmail.com"
GMAIL_APP_PASSWORD="votre-mot-de-passe-application-gmail"
SITE_URL="http://localhost:3000"
GRAPHQL_URL="http://localhost:4000/graphql"
```

Voir `.env.example` pour tous les détails et exemples (PostgreSQL).

### Base de données

Le schéma Prisma est dans `prisma/schema.prisma`. Pour modifier :
1. Modifier le schéma
2. Exécuter `npm run db:push`
3. Les types TypeScript seront régénérés automatiquement

## 🎨 Personnalisation

### Modifier les couleurs

Éditer `assets/css/variables.css` :
```css
:root {
  --color-primary: #1ca463;
  --color-secondary: #ff9f1a;
  /* ... */
}
```

### Modifier les espacements

Tous les espacements sont définis dans `variables.css` et utilisés via `var(--spacing-*)`.

## 📝 Notes de développement

- **Apollo Server** doit tourner sur le port 4000
- **Nuxt** tourne sur le port 3000
- Les deux serveurs doivent être démarrés simultanément
- La base de données est PostgreSQL (voir `DATABASE_URL`)

## 🐛 Dépannage

### Le serveur Apollo ne démarre pas
- Vérifier que le port 4000 est libre
- Vérifier la configuration de la base de données dans `.env`

### Nuxt ne se connecte pas à Apollo
- Vérifier que le serveur Apollo est démarré
- Vérifier que `GRAPHQL_URL` est correctement configuré dans `.env`
- Vérifier la configuration dans `plugins/apollo-composable.client.ts`
- En production, vérifier que Nginx proxy correctement `/graphql`

### Erreurs de base de données
- Exécuter `npm run db:push` pour synchroniser le schéma
- Vérifier que `DATABASE_URL` dans `.env` est correct

## 📄 Licence

Projet privé - Tous droits réservés

## 👤 Auteur

Développé pour organiser les loteries de Noël en famille.
