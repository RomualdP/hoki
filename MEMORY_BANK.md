# MEMORY BANK - Volley App

## 🧠 Contexte Actuel du Projet
- **État**: Développement actif - Application de gestion d'équipes de volley-ball
- **Dernière session**: 18 septembre 2025 - Création du système de memory bank
- **Prochaines priorités**:
  - Finalisation de l'architecture backend/frontend
  - Implémentation des fonctionnalités core (auth, équipes, matches)
  - Configuration de la base de données PostgreSQL
  - Tests et déploiement

## 📝 Décisions Techniques Importantes

### Architecture Full-Stack (Septembre 2025)
- **Contexte**: Besoin d'une application complète pour gérer les équipes de volley-ball
- **Solution adoptée**: NestJS (backend) + Next.js 15 (frontend) + PostgreSQL (DB)
- **Impact**: Architecture moderne, scalable, avec séparation claire des responsabilités

### Authentification Multi-Provider (Septembre 2025)
- **Contexte**: Support de différents modes d'authentification pour les utilisateurs
- **Solution adoptée**: Google OAuth + Local auth + JWT tokens
- **Impact**: Flexibilité pour les utilisateurs, sécurité renforcée

### State Management Frontend (Septembre 2025)
- **Contexte**: Gestion d'état complexe pour les données d'équipes et matches
- **Solution adoptée**: Zustand pour la simplicité et performance
- **Impact**: État global cohérent, facile à maintenir

## 🐛 Problèmes Résolus

### Configuration Prisma PostgreSQL
- **Symptômes**: Erreurs de connexion à la base de données
- **Cause**: Configuration manquante des variables d'environnement
- **Solution**: Ajout des variables dans `.env` et configuration Prisma
- **Prévention**: Toujours vérifier la configuration DB avant les migrations

### Dépendances Frontend
- **Symptômes**: Erreurs de build Next.js
- **Cause**: Versions incompatibles de React/TypeScript
- **Solution**: Alignement des versions dans package.json
- **Prévention**: Utiliser `yarn install` systématiquement après changements de dépendances

## 🔧 Patterns & Solutions Réutilisables

### Authentification avec Guards
- **Usage**: Protection des routes API
- **Implémentation**: `@UseGuards(JwtAuthGuard)` sur les contrôleurs
- **Fichiers concernés**: `src/auth/guards/jwt-auth.guard.ts`

### Gestion d'État avec Zustand
- **Usage**: État global partagé entre composants
- **Implémentation**: Store avec actions et sélecteurs
- **Fichiers concernés**: `src/store/`

### Intercepteurs de Réponse
- **Usage**: Formatage uniforme des réponses API
- **Implémentation**: Intercepteur global NestJS
- **Fichiers concernés**: `src/common/interceptors/`

## 🚧 Travail en Cours

### Système d'Authentification
- **État**: 70% complété
- **Fichiers modifiés**: `src/auth/`, `src/users/`
- **Blocages**: Configuration OAuth Google en attente
- **Notes**: JWT implémenté, Google OAuth à finaliser

### Gestion des Équipes
- **État**: 40% complété
- **Fichiers modifiés**: `src/teams/`
- **Blocages**: Aucun
- **Notes**: Modèle de base créé, contrôleur en cours

### Base de Données
- **État**: 50% complété
- **Fichiers modifiés**: `prisma/schema.prisma`
- **Blocages**: Migration initiale à appliquer
- **Notes**: Schéma complet défini, prêt pour migration

## 💡 Apprentissages & Astuces

### NestJS Module Structure
- Les modules doivent être importés dans le module principal
- Utiliser `@Module` decorator pour définir les dépendances
- Les services sont automatiquement injectés via le constructeur

### Next.js 15 App Router
- Les routes sont définies par la structure de dossiers dans `app/`
- `page.tsx` pour les pages, `layout.tsx` pour les layouts
- API routes dans `app/api/`

### Prisma Best Practices
- Toujours régénérer le client après modification du schéma
- Utiliser les types générés pour le typage TypeScript
- Les migrations doivent être versionnées

## 🔗 Dépendances Critiques

### Backend Core
- **Dépend de**: Node.js, PostgreSQL
- **Utilisé par**: Tous les modules API
- **Notes**: NestJS framework principal

### Authentification
- **Dépend de**: Passport.js, JWT
- **Utilisé par**: Users, Teams, Matches
- **Notes**: Module transversal, utilisé partout

### Base de Données
- **Dépend de**: Prisma, PostgreSQL
- **Utilisé par**: Tous les services de données
- **Notes**: Single source of truth pour les données

## 📊 Métriques du Projet

- **Couverture de tests**: 0% (tests à implémenter)
- **Modules complétés**: 3/10 (Auth, Users partiellement, Teams partiellement)
- **Dette technique identifiée**:
  - Tests unitaires manquants
  - Documentation API incomplète
  - Configuration CI/CD à mettre en place
  - Gestion d'erreurs à améliorer

## 🔄 Évolution du Projet

### Phase 1: Fondation (Actuelle)
- ✅ Architecture définie
- ✅ Authentification de base
- 🔄 Base de données configurée
- ⏳ Modules core implémentés

### Phase 2: Fonctionnalités Core
- ⏳ Gestion complète des équipes
- ⏳ Système de matches
- ⏳ Statistiques joueurs
- ⏳ Interface utilisateur

### Phase 3: Fonctionnalités Avancées
- ⏳ Tournois
- ⏳ News et contenu
- ⏳ Notifications
- ⏳ Mobile responsive

---

*Dernière mise à jour: 18 septembre 2025*