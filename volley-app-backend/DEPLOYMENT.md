# Guide de Déploiement Railway

Ce guide explique comment déployer le backend NestJS de l'application Volley App sur Railway avec PostgreSQL.

## Table des Matières
1. [Prérequis](#prérequis)
2. [Configuration initiale de Railway](#configuration-initiale-de-railway)
3. [Configuration de la base de données PostgreSQL](#configuration-de-la-base-de-données-postgresql)
4. [Configuration des variables d'environnement](#configuration-des-variables-denvironnement)
5. [Déploiement du backend](#déploiement-du-backend)
6. [Visualisation de la base de données avec Prisma Studio](#visualisation-de-la-base-de-données-avec-prisma-studio)
7. [Maintenance et dépannage](#maintenance-et-dépannage)

---

## Prérequis

- Compte Railway (gratuit pour commencer) : https://railway.app/
- Node.js 22+ installé localement
- Git installé
- Railway CLI installé

### Installation de Railway CLI

```bash
# Via npm (recommandé)
npm install -g @railway/cli

# Via Homebrew (macOS)
brew install railway

# Vérifier l'installation
railway --version
```

---

## Configuration initiale de Railway

### 1. Connexion à Railway

```bash
# Se connecter à Railway
railway login
```

Cela ouvrira votre navigateur pour l'authentification.

### 2. Créer un nouveau projet (si nécessaire)

```bash
# Option 1 : Via la CLI
railway init

# Option 2 : Via le dashboard web
# Aller sur https://railway.app/new
```

### 3. Lier le projet au répertoire local

```bash
# Si le projet existe déjà
railway link

# Sélectionner votre projet dans la liste
```

---

## Configuration de la base de données PostgreSQL

### 1. Ajouter PostgreSQL au projet

Via le dashboard Railway :
1. Ouvrir votre projet sur https://railway.app/
2. Cliquer sur "New Service"
3. Sélectionner "Database" → "PostgreSQL"
4. Railway créera automatiquement l'instance PostgreSQL

Via la CLI :
```bash
railway add postgresql
```

### 2. Récupérer les variables de connexion

Railway génère automatiquement les variables de connexion. Pour les voir :

```bash
# Via CLI
railway variables

# Ou via le dashboard web
# Projet → PostgreSQL → Variables
```

Les variables importantes :
- `DATABASE_URL` : URL de connexion avec pooling
- `POSTGRES_URL_NON_POOLING` : URL directe (utilisée pour `DIRECT_DATABASE_URL`)

---

## Configuration des variables d'environnement

### Variables à configurer sur Railway

Aller dans votre projet Railway → Service Backend → Variables :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL PostgreSQL fournie par Railway | Automatique |
| `DIRECT_DATABASE_URL` | URL non-poolée pour migrations | Copier `POSTGRES_URL_NON_POOLING` |
| `JWT_SECRET` | Secret pour les tokens JWT | Générer avec `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth | Depuis Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Secret Google OAuth | Depuis Google Cloud Console |
| `NODE_ENV` | Environnement | `production` |

### Configurer via la CLI

```bash
# Ajouter une variable
railway variables set JWT_SECRET="votre-secret-securise"

# Définir plusieurs variables à la fois
railway variables set GOOGLE_CLIENT_ID="..." GOOGLE_CLIENT_SECRET="..." NODE_ENV="production"
```

### Générer un JWT_SECRET sécurisé

```bash
# Générer une clé aléatoire de 32 bytes en base64
openssl rand -base64 32
```

⚠️ **Important** : Ne jamais utiliser la clé de développement en production !

---

## Déploiement du backend

### Option 1 : Déploiement automatique via GitHub (recommandé)

1. Pousser votre code sur GitHub
2. Dans Railway :
   - Cliquer sur "New Service"
   - Sélectionner "GitHub Repo"
   - Autoriser Railway à accéder à votre repo
   - Sélectionner le repo `volley_app`
   - Railway détectera automatiquement le Dockerfile

3. Configuration du service :
   - Root Directory : `/volley-app-backend`
   - Builder : Dockerfile
   - Watch Path : `/volley-app-backend/**`

Railway déploiera automatiquement à chaque push sur la branche principale.

### Option 2 : Déploiement manuel via CLI

```bash
# Se placer dans le dossier backend
cd volley-app-backend

# Déployer
railway up
```

### Vérification du déploiement

```bash
# Voir les logs en temps réel
railway logs

# Vérifier le statut
railway status
```

---

## Visualisation de la base de données avec Prisma Studio

### Option 1 : Prisma Studio local connecté à Railway

1. **Configurer les variables localement** (temporairement) :
   ```bash
   # Récupérer les variables Railway
   railway variables

   # Copier DATABASE_URL et l'ajouter à votre .env local
   # ATTENTION : Ne pas committer ce .env !
   ```

2. **Lancer Prisma Studio** :
   ```bash
   npx prisma studio
   ```

   Prisma Studio s'ouvrira sur http://localhost:5555

### Option 2 : Via Railway CLI

```bash
# Lancer Prisma Studio connecté à Railway
railway run npx prisma studio
```

Cette commande :
- Charge automatiquement les variables d'environnement de Railway
- Lance Prisma Studio sur votre machine
- Vous n'avez pas besoin de configurer le `.env` local

### Option 3 : Script npm (recommandé)

Ajouter dans `package.json` :
```json
{
  "scripts": {
    "studio": "prisma studio",
    "studio:prod": "railway run npx prisma studio"
  }
}
```

Utilisation :
```bash
# Studio local (dev)
yarn studio

# Studio production (via Railway)
yarn studio:prod
```

---

## Maintenance et dépannage

### Migrations de base de données

Les migrations sont automatiquement exécutées au démarrage via le Dockerfile :
```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && yarn start:prod"]
```

Pour exécuter manuellement :
```bash
railway run npx prisma migrate deploy
```

### Seed de la base de données

```bash
# Exécuter le seed sur la DB production
railway run yarn db:seed
```

### Consulter les logs

```bash
# Logs en temps réel
railway logs --follow

# Derniers logs
railway logs
```

### Redémarrer le service

```bash
railway restart
```

### Accès direct à PostgreSQL

```bash
# Ouvrir une session psql
railway connect postgresql

# Vous êtes maintenant dans psql et pouvez exécuter des requêtes SQL
```

### Problèmes courants

#### 1. Migrations échouent au démarrage

**Symptôme** : Le service ne démarre pas, logs montrent une erreur Prisma

**Solution** :
```bash
# Vérifier l'état des migrations
railway run npx prisma migrate status

# Réinitialiser si nécessaire (⚠️ ATTENTION : efface les données)
railway run npx prisma migrate reset
```

#### 2. Variables d'environnement manquantes

**Symptôme** : Erreur "Environment variable not found"

**Solution** :
```bash
# Vérifier toutes les variables
railway variables

# Ajouter la variable manquante
railway variables set VARIABLE_NAME="value"

# Redémarrer
railway restart
```

#### 3. Connexion à la DB échoue

**Symptôme** : "Can't reach database server"

**Solution** :
- Vérifier que PostgreSQL est bien démarré dans Railway
- Vérifier que `DATABASE_URL` est bien configurée
- Tester la connexion : `railway run npx prisma db pull`

---

## URLs et ressources

### Accès aux services

Une fois déployé, Railway fournira une URL publique :
- Format : `https://your-service.railway.app`
- Visible dans : Projet → Service → Settings → Domains

### Ressources utiles

- Dashboard Railway : https://railway.app/dashboard
- Documentation Railway : https://docs.railway.app/
- Documentation Prisma : https://www.prisma.io/docs
- Support Railway : https://help.railway.app/

---

## Checklist de déploiement

Avant de mettre en production :

- [ ] Base PostgreSQL créée sur Railway
- [ ] Toutes les variables d'environnement configurées
- [ ] `JWT_SECRET` généré de manière sécurisée (pas celui du dev !)
- [ ] Google OAuth configuré avec les bons redirect URIs
- [ ] Migrations testées avec `railway run npx prisma migrate deploy`
- [ ] Backend déployé et accessible via l'URL Railway
- [ ] Logs vérifiés : aucune erreur critique
- [ ] Test de connexion avec Prisma Studio
- [ ] Documentation mise à jour

---

## Migration depuis Supabase

Si vous migrez depuis Supabase :

### Exporter les données de Supabase

```bash
# Se connecter à Supabase
pg_dump -h db.oboumttpkwvlzbtfryqo.supabase.co -U postgres -d postgres > supabase_backup.sql

# Ou via Supabase dashboard : Database → Backups
```

### Importer dans Railway

```bash
# Méthode 1 : Via psql
railway connect postgresql < supabase_backup.sql

# Méthode 2 : Via Prisma (recommandé si schéma identique)
# 1. Pointer DATABASE_URL vers Railway dans .env local
# 2. Exécuter les migrations
npx prisma migrate deploy

# 3. Réimporter juste les données (si nécessaire)
railway run yarn db:seed
```

---

## Support

Pour toute question ou problème :
1. Consulter les logs : `railway logs`
2. Vérifier la documentation Railway
3. Contacter le support Railway : https://help.railway.app/
