// Configuration PM2 pour le backend Apollo Server
// Installation: npm install -g pm2
//
// IMPORTANT: PM2 ne charge pas automatiquement le fichier .env
// Pour charger les variables d'environnement, utilisez dotenv-cli:
//   1. Installer: npm install -g dotenv-cli
//   2. Démarrer: dotenv -e .env -- pm2 start ecosystem.config.cjs
//
// Ou utilisez le script npm qui gère cela automatiquement:
//   npm run start:backend:pm2
//
// Démarrage direct: pm2 start ecosystem.config.cjs
// Arrêt: pm2 stop loterie-backend
// Logs: pm2 logs loterie-backend
// Redémarrage: pm2 restart loterie-backend

export default {
  apps: [
    {
      name: 'loterie-backend',
      script: 'server/index.ts',
      interpreter: 'node',
      interpreter_args: '--loader ts-node/esm',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        // Les variables d'environnement sont chargées depuis .env via dotenv-cli
        // (voir le script npm start:backend:pm2)
        // Assurez-vous d'avoir un fichier .env à la racine du projet
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      // Redémarrage automatique en cas d'erreur
      autorestart: true,
      // Attendre 10 secondes avant de redémarrer
      restart_delay: 10000,
      // Redémarrer si le processus utilise plus de 500MB de RAM
      max_memory_restart: '500M',
      // Surveiller les changements de fichiers (désactivé en production)
      watch: false,
      // Ignorer certains dossiers
      ignore_watch: ['node_modules', 'logs', 'dist', '.git'],
    },
  ],
};

