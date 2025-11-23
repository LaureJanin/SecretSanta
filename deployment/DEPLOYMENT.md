# Guide de déploiement sur serveur maison

Guide étape par étape pour déployer l'application Loterie de Noël sur votre serveur.

## Prérequis sur le serveur

- **Node.js 18+** et npm
- **PostgreSQL** (ou SQLite si vous préférez)
- **Nginx** (pour servir le frontend et reverse proxy)
- **PM2** (optionnel, pour gérer le backend)
- **Git** (pour cloner le projet)

## Étape 1 : Préparer le serveur

### Installer Node.js

```bash
# Sur Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

### Installer PostgreSQL

```bash
# Sur Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier
sudo systemctl status postgresql
```

### Installer Nginx

```bash
# Sur Ubuntu/Debian
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérifier
sudo systemctl status nginx
```

### Installer PM2 (optionnel mais recommandé)

```bash
sudo npm install -g pm2 dotenv-cli
```

## Étape 2 : Transférer le code sur le serveur

### Option A : Via Git (recommandé)

```bash
# Sur votre serveur
cd /var/www  # ou un autre répertoire de votre choix
git clone <votre-repo-url> loterie-noel
cd loterie-noel
```

### Option B : Via rsync/scp

```bash
# Depuis votre machine locale
rsync -avz --exclude 'node_modules' --exclude '.nuxt' --exclude 'dist' \
  ./ user@votre-serveur:/var/www/loterie-noel/
```

## Étape 3 : Configuration sur le serveur

### Installer les dépendances

```bash
cd /var/www/loterie-noel
npm install
```

### Configurer PostgreSQL

```bash
# Créer la base de données et l'utilisateur
sudo -u postgres psql

# Dans le shell PostgreSQL :
CREATE USER loterie_user WITH PASSWORD 'votre_mot_de_passe_securise';
CREATE DATABASE loterie_noel OWNER loterie_user;
GRANT ALL PRIVILEGES ON DATABASE loterie_noel TO loterie_user;
\c loterie_noel
GRANT ALL ON SCHEMA public TO loterie_user;
\q
```

### Configurer les variables d'environnement

```bash
# Créer le fichier .env
nano .env
```

Contenu du fichier `.env` :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://loterie_user:votre_mot_de_passe_securise@localhost:5432/loterie_noel?schema=public"

# Authentification
JWT_SECRET="votre-secret-jwt-tres-long-et-securise-changez-moi"

# Email
ADMIN_EMAIL="votre-email@gmail.com"
GMAIL_APP_PASSWORD="votre-mot-de-passe-application-gmail"

# URLs (adapter à votre domaine)
SITE_URL="https://votre-domaine.com"
GRAPHQL_URL="https://votre-domaine.com/graphql"

# Environnement
NODE_ENV="production"
```

**Important** : Remplacez tous les exemples par vos vraies valeurs !

## Étape 4 : Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer le schéma
npx prisma db push

# Ou créer les migrations
npx prisma migrate deploy
```

## Étape 5 : Build de l'application

```bash
# Build avec vérifications automatiques
./scripts/build-production.sh

# Ou manuellement
npm run build
```

Vérifier que le dossier `.output/` a été créé.

## Étape 6 : Démarrer le backend Apollo

### Avec PM2 (recommandé)

```bash
# Démarrer le backend
npm run start:backend:pm2

# Vérifier le statut
pm2 status
pm2 logs loterie-backend

# Configurer PM2 pour démarrer au boot
pm2 startup
pm2 save
```

### Sans PM2

```bash
# Démarrer en arrière-plan
nohup npm run start:backend > backend.log 2>&1 &
```

## Étape 7 : Configurer Nginx

### Copier la configuration

```bash
sudo cp deployment/nginx.conf.example /etc/nginx/sites-available/loterie-noel
sudo nano /etc/nginx/sites-available/loterie-noel
```

### Adapter la configuration

Modifier les lignes suivantes :

```nginx
server_name votre-domaine.com www.votre-domaine.com;  # Votre domaine
root /var/www/loterie-noel/.output/public;            # Chemin vers les fichiers Nuxt
```

### Activer le site

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/loterie-noel /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

## Étape 8 : Configurer HTTPS (recommandé)

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir un certificat SSL
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Certbot configurera automatiquement HTTPS
```

## Étape 9 : Vérifications finales

### Vérifier le backend

```bash
# Tester l'endpoint GraphQL
curl http://localhost:4000/graphql -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

### Vérifier le frontend

```bash
# Tester que Nginx sert les fichiers
curl http://localhost/
```

### Vérifier les logs

```bash
# Logs backend (PM2)
pm2 logs loterie-backend

# Logs Nginx
sudo tail -f /var/log/nginx/loterie-noel-error.log
sudo tail -f /var/log/nginx/loterie-noel-access.log
```

## Étape 10 : Tester l'application

1. Ouvrir `https://votre-domaine.com` dans votre navigateur
2. Tester la création de compte
3. Tester la connexion
4. Vérifier que les requêtes GraphQL fonctionnent

## Maintenance

### Mettre à jour l'application

```bash
cd /var/www/loterie-noel

# Récupérer les dernières modifications
git pull

# Installer les nouvelles dépendances
npm install

# Rebuild
./scripts/build-production.sh

# Redémarrer le backend
pm2 restart loterie-backend

# Recharger Nginx
sudo systemctl reload nginx
```

### Sauvegarder la base de données

```bash
# Sauvegarde PostgreSQL
pg_dump -U loterie_user loterie_noel > backup_$(date +%Y%m%d).sql

# Restaurer
psql -U loterie_user loterie_noel < backup_20250123.sql
```

### Vérifier les processus

```bash
# Statut PM2
pm2 status

# Processus Node.js
ps aux | grep node

# Statut Nginx
sudo systemctl status nginx

# Statut PostgreSQL
sudo systemctl status postgresql
```

## Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
pm2 logs loterie-backend

# Vérifier les variables d'environnement
cat .env

# Vérifier la connexion PostgreSQL
psql -U loterie_user -d loterie_noel -c "SELECT 1;"
```

### Nginx ne sert pas les fichiers

```bash
# Vérifier les permissions
sudo chown -R www-data:www-data .output/public

# Vérifier le chemin dans la config
sudo nginx -t

# Vérifier les logs
sudo tail -f /var/log/nginx/loterie-noel-error.log
```

### Erreurs de connexion GraphQL

```bash
# Vérifier que le backend est démarré
pm2 status

# Vérifier que le port 4000 est accessible
netstat -tlnp | grep 4000

# Tester manuellement
curl http://localhost:4000/graphql -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

## Checklist de déploiement

- [ ] Node.js 18+ installé
- [ ] PostgreSQL installé et configuré
- [ ] Nginx installé
- [ ] Code transféré sur le serveur
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` configuré avec toutes les variables
- [ ] Base de données créée et initialisée
- [ ] Build de production effectué
- [ ] Backend Apollo démarré (PM2 ou autre)
- [ ] Nginx configuré et actif
- [ ] HTTPS configuré (optionnel mais recommandé)
- [ ] Application testée et fonctionnelle

## Support

En cas de problème, vérifier :
1. Les logs PM2 : `pm2 logs loterie-backend`
2. Les logs Nginx : `sudo tail -f /var/log/nginx/loterie-noel-error.log`
3. Les logs PostgreSQL : `sudo tail -f /var/log/postgresql/postgresql-*.log`
4. La configuration `.env`
5. Les permissions des fichiers

