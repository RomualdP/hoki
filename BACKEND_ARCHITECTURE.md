# 🏐 **ARCHITECTURE BACKEND - VOLLEY APP**

## **📋 STRUCTURE GÉNÉRALE**

Le backend est construit avec **NestJS** et **Prisma** avec une base de données **PostgreSQL**.

### **🗂️ ORGANISATION DES MODULES**

```
src/
├── auth/                 # Authentification (Google OAuth, JWT, Local)
├── users/               # Gestion des utilisateurs et profils
├── teams/               # Gestion des équipes
├── matches/             # Gestion des matchs
├── skills/              # Gestion des compétences
├── news/                # Gestion des actualités
├── activities/          # Flux d'activités
├── notifications/       # Système de notifications
├── tournaments/         # Gestion des tournois
└── prisma/             # Service Prisma
```

## **🛠️ MODULES ET FONCTIONNALITÉS**

### **👤 USERS MODULE**
**Endpoints :**
- `GET /users` - Liste des utilisateurs avec pagination et filtres
- `GET /users/:id` - Détails d'un utilisateur
- `GET /users/:id/profile` - Profil complet d'un utilisateur
- `PUT /users/:id/profile` - Mise à jour du profil
- `GET /users/:id/statistics` - Statistiques de l'utilisateur
- `GET /users/:id/achievements` - Achievements de l'utilisateur
- `GET /users/:id/skills` - Compétences de l'utilisateur
- `POST /users/:id/skills` - Ajouter une compétence
- `PUT /users/:id/skills/:skillId` - Modifier une compétence
- `DELETE /users/:id/skills/:skillId` - Supprimer une compétence

**Fonctionnalités :**
- Profils utilisateurs complets avec biographie, position, stats physiques
- Système de compétences avec niveaux et évaluations
- Statistiques de performance
- Système d'achievements

### **🏐 TEAMS MODULE**
**Endpoints :**
- `GET /teams` - Liste des équipes
- `GET /teams/:id` - Détails d'une équipe
- `GET /teams/:id/members` - Membres d'une équipe
- `POST /teams/:id/members` - Ajouter un membre
- `DELETE /teams/:id/members/:userId` - Retirer un membre

**Fonctionnalités :**
- Gestion des équipes avec rôles (CAPTAIN, COACH, PLAYER, SUBSTITUTE)
- Historique des matchs par équipe
- Statistiques d'équipe

### **⚡ MATCHES MODULE**
**Endpoints :**
- `GET /matches` - Liste des matchs avec filtres
- `GET /matches/:id` - Détails complets d'un match
- `GET /matches/:id/statistics` - Statistiques du match
- `GET /matches/:id/events` - Événements du match
- `POST /matches/:id/events` - Ajouter un événement
- `GET /matches/:id/comments` - Commentaires du match
- `POST /matches/:id/comments` - Ajouter un commentaire
- `POST /matches/:id/join` - Rejoindre un match
- `DELETE /matches/:id/leave` - Quitter un match
- `POST /matches/:id/start` - Démarrer un match
- `POST /matches/:id/end` - Terminer un match

**Fonctionnalités :**
- Gestion complète des matchs avec scores, sets
- Système de participation
- Événements en temps réel (points, aces, blocks, etc.)
- Commentaires et discussions
- Statistiques détaillées par joueur
- Conditions météo et terrains

### **🎯 SKILLS MODULE**
**Endpoints :**
- `GET /skills` - Liste des compétences disponibles
- `POST /skills` - Créer une nouvelle compétence (admin)

**Fonctionnalités :**
- Compétences par catégorie (ATTACK, DEFENSE, SERVING, etc.)
- Niveaux de maîtrise (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- Système d'évaluation

### **📰 NEWS MODULE**
**Endpoints :**
- `GET /news` - Liste des actualités
- `GET /news/:id` - Détails d'une actualité
- `GET /news/:id/comments` - Commentaires
- `POST /news/:id/comments` - Ajouter un commentaire
- `POST /news/:id/like` - Liker une actualité
- `POST /news/:id/view` - Enregistrer une vue

**Fonctionnalités :**
- Système de publication avec catégories
- Commentaires avec réponses
- Système de likes et vues
- Galerie de médias
- Temps de lecture estimé

### **📊 ACTIVITIES MODULE**
**Endpoints :**
- `GET /activities` - Flux d'activités général
- `GET /activities/user/:userId` - Activités d'un utilisateur
- `GET /activities/team/:teamId` - Activités d'une équipe

**Fonctionnalités :**
- Flux d'activités en temps réel
- Agrégation des événements
- Filtrage par type et visibilité

### **🔔 NOTIFICATIONS MODULE**
**Endpoints :**
- `GET /notifications/user/:userId` - Notifications d'un utilisateur
- `PUT /notifications/:id/read` - Marquer comme lu
- `PUT /notifications/user/:userId/read-all` - Tout marquer comme lu

**Fonctionnalités :**
- Notifications push et email
- Types : rappels de match, invitations équipe, etc.
- Système de lecture/non-lu

### **🏆 TOURNAMENTS MODULE**
**Endpoints :**
- `GET /tournaments` - Liste des tournois
- `GET /tournaments/:id` - Détails d'un tournoi
- `POST /tournaments/:id/teams` - Inscrire une équipe
- `DELETE /tournaments/:id/teams/:teamId` - Désinscrire une équipe

## **🗄️ MODÈLES DE DONNÉES PRINCIPAUX**

### **User & Profile**
```typescript
User {
  id, email, firstName, lastName, avatar, role, isActive
  profile: UserProfile
  statistics: UserStatistics
  skills: UserSkill[]
  achievements: Achievement[]
}

UserProfile {
  biography, birthDate, position, height, weight
  phoneNumber, city, country, preferredHand
}
```

### **Match & Statistics**
```typescript
Match {
  homeTeam, awayTeam, scheduledAt, location, status
  homeScore, awayScore, sets: Set[]
  participants: MatchParticipant[]
  statistics: MatchStatistics
  events: MatchEvent[]
  comments: MatchComment[]
}

MatchStatistics {
  totalPoints, longestRally, aces, blocks, errors
  playerStats: PlayerMatchStats[]
}
```

### **News & Interactions**
```typescript
News {
  title, content, excerpt, author, category
  featuredImage, gallery: NewsMedia[]
  viewsCount, likesCount, commentsCount
  comments: NewsComment[]
  interactions: NewsInteraction[]
}
```

## **🔐 AUTHENTIFICATION**

- **Stratégies :** Local, JWT, Google OAuth
- **Guards :** JwtAuthGuard pour protéger les routes
- **Rôles :** USER, ADMIN

## **📦 TECHNOLOGIES UTILISÉES**

- **Framework :** NestJS
- **ORM :** Prisma
- **Base de données :** PostgreSQL
- **Authentification :** Passport.js (Local, JWT, Google)
- **Validation :** Class-validator
- **Documentation :** Swagger (à ajouter)

## **🚀 PROCHAINES ÉTAPES**

1. ✅ Structure complète des modules
2. ✅ Modèles de données Prisma
3. ✅ Controllers et services
4. 🔄 Tests unitaires et d'intégration
5. 🔄 Documentation Swagger
6. 🔄 Middleware de validation
7. 🔄 Système de permissions avancé
8. 🔄 Cache Redis
9. 🔄 Upload de fichiers
10. 🔄 Notifications en temps réel (WebSockets)

## **🔧 COMMANDES UTILES**

```bash
# Installer les dépendances
yarn install

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# Démarrer en développement
yarn start:dev

# Construire pour la production
yarn build

# Démarrer en production
yarn start:prod
``` 