# 🎯 Workflow de Gestion des Issues

Ce document explique comment utiliser le système de gestion des issues pour ce projet multi-repos (backend + frontend).

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Fichiers clés](#fichiers-clés)
3. [Workflow complet](#workflow-complet)
4. [Utilisation avec Claude Code](#utilisation-avec-claude-code)
5. [Scripts disponibles](#scripts-disponibles)
6. [Templates GitHub](#templates-github)
7. [Système de labels](#système-de-labels)
8. [Bonnes pratiques](#bonnes-pratiques)

---

## Vue d'ensemble

Le système permet de :

1. **Planifier** les issues localement dans un fichier YAML
2. **Créer** automatiquement les issues sur GitHub (backend et frontend)
3. **Synchroniser** l'état des issues entre GitHub et le fichier local
4. **Visualiser** le planning dans Claude Code ou dans le terminal

### Architecture

```
volley_app/
├── ISSUES_PLANNING.yaml          # Source unique de vérité pour le planning
├── LABELS.md                      # Documentation des labels
├── WORKFLOW_ISSUES.md             # Ce fichier (documentation du workflow)
├── package.json                   # Dépendances pour les scripts
│
├── .claude/commands/              # Commandes Claude Code
│   ├── create-issues.md           # /create-issues
│   ├── sync-planning.md           # /sync-planning
│   └── show-planning.md           # /show-planning
│
├── .github/scripts/               # Scripts Node.js
│   ├── sync-labels.js             # Synchroniser les labels GitHub
│   └── show-planning.js           # Afficher le planning dans le terminal
│
├── volley-app-backend/
│   └── .github/ISSUE_TEMPLATE/    # Templates d'issues backend
│       ├── config.yml
│       ├── feature-ddd.yml        # Feature DDD/CQRS
│       ├── bug.yml                # Bug report
│       └── enhancement.yml        # Enhancement technique
│
└── volley-app-frontend/
    └── .github/ISSUE_TEMPLATE/    # Templates d'issues frontend
        ├── config.yml
        ├── feature-nextjs.yml     # Feature Next.js
        ├── bug.yml                # Bug report
        └── refactoring.yml        # Refactoring
```

---

## Fichiers clés

### `ISSUES_PLANNING.yaml`

**Source unique de vérité** pour toutes les issues planifiées. Structure :

```yaml
metadata:
  backend_repo: RomualdP/volley_app_back
  frontend_repo: RomualdP/volley_app_front
  last_sync: null
  version: "1.0"

backend:
  - id: BACK-001
    title: "[Bounded Context] Brief description"
    bounded_context: club-management
    type: feature
    priority: high
    labels: [...]
    description: |
      ...
    status: planned  # planned | ready | in-progress | blocked | completed
    github_issue_number: null
    github_url: null
    # ... autres métadonnées

frontend:
  - id: FRONT-001
    title: "[Feature] Brief description"
    feature: club-management
    type: feature
    # ... similaire au backend

shared:
  - id: SHARED-001
    # ... pour les issues cross-repo
```

---

## Workflow complet

### Étape 1 : Planifier les issues

Éditez `ISSUES_PLANNING.yaml` et ajoutez vos issues :

```yaml
backend:
  - id: BACK-004
    title: "[Training Management] Implement Training Session Creation"
    bounded_context: training-management
    type: feature
    priority: high
    labels:
      - ddd
      - cqrs
      - bounded-context:training-management
      - layer:application
    description: |
      ## Context
      ...
    status: planned
```

**Bonnes pratiques** :
- Utilisez des IDs séquentiels : `BACK-001`, `FRONT-001`, etc.
- Définissez clairement le bounded-context (backend) ou feature (frontend)
- Ajoutez les labels appropriés
- Incluez les Skills à utiliser
- Marquez les dépendances avec `blocked_by` si nécessaire

### Étape 2 : Créer les issues sur GitHub

#### Option A : Avec Claude Code (recommandé)

```bash
# Dans Claude Code
/create-issues
```

Claude Code va :
1. Lire `ISSUES_PLANNING.yaml`
2. Créer les issues avec status `planned` sur GitHub
3. Mettre à jour le fichier avec les numéros d'issues et URLs
4. Afficher un résumé

#### Option B : Manuellement via GitHub UI

Utilisez les templates GitHub directement :
- Backend : https://github.com/RomualdP/volley_app_back/issues/new/choose
- Frontend : https://github.com/RomualdP/volley_app_front/issues/new/choose

### Étape 3 : Visualiser le planning

#### Dans Claude Code

```bash
/show-planning
```

Affiche un dashboard interactif avec :
- Statistiques générales
- Issues par statut (In Progress, Blocked, Ready, etc.)
- Liens vers les issues GitHub
- Suggestions d'actions

#### Dans le terminal

```bash
# Installer les dépendances (une seule fois)
npm install

# Afficher tout le planning
npm run show-planning

# Filtrer par statut
node .github/scripts/show-planning.js --filter=status:in-progress

# Filtrer par repo
node .github/scripts/show-planning.js --repo=backend

# Filtrer par priorité
node .github/scripts/show-planning.js --priority=high
```

### Étape 4 : Synchroniser avec GitHub

```bash
# Dans Claude Code
/sync-planning
```

Synchronise l'état des issues depuis GitHub :
- Met à jour les status (open → in-progress, closed → completed)
- Récupère les assignees
- Met à jour les labels
- Détecte les issues bloquées

### Étape 5 : Mettre à jour manuellement

Éditez `ISSUES_PLANNING.yaml` pour :
- Changer le status d'une issue
- Ajouter des notes
- Marquer des dépendances
- Planifier de nouvelles issues

---

## Utilisation avec Claude Code

### Commandes disponibles

| Commande | Description |
|----------|-------------|
| `/create-issues` | Créer les issues `planned` sur GitHub |
| `/sync-planning` | Synchroniser l'état depuis GitHub |
| `/show-planning` | Afficher le dashboard du planning |

### Workflow recommandé avec Claude Code

1. **Planification de sprint** :
   ```
   User: Je veux planifier les issues pour le sprint prochain
   Claude: [Aide à éditer ISSUES_PLANNING.yaml]
   User: /show-planning
   Claude: [Affiche le dashboard avec les nouvelles issues]
   ```

2. **Création d'issues** :
   ```
   User: /create-issues
   Claude: [Crée les issues sur GitHub et met à jour le fichier]
   ```

3. **Suivi quotidien** :
   ```
   User: /sync-planning
   Claude: [Synchronise l'état depuis GitHub]
   User: /show-planning
   Claude: [Affiche le dashboard mis à jour]
   ```

4. **Implémentation** :
   ```
   User: Je veux travailler sur BACK-001
   Claude: [Lit l'issue, affiche les Skills à utiliser, guide l'implémentation]
   ```

---

## Scripts disponibles

### 1. Synchronisation des labels

**Objectif** : Créer/mettre à jour tous les labels sur les deux repos GitHub.

```bash
# Installer GitHub CLI (si pas déjà fait)
brew install gh  # macOS
# ou voir https://cli.github.com/

# S'authentifier
gh auth login

# Synchroniser les labels
npm run sync-labels
```

Ce script crée :
- **Labels communs** : feature, bug, priority:*, status:*, etc.
- **Labels backend** : ddd, cqrs, bounded-context:*, layer:*
- **Labels frontend** : nextjs, server-components, feature:*, ui, etc.

Voir `LABELS.md` pour la liste complète.

### 2. Affichage du planning

```bash
# Afficher tout
npm run show-planning

# Avec filtres
node .github/scripts/show-planning.js --filter=status:in-progress
node .github/scripts/show-planning.js --repo=backend
node .github/scripts/show-planning.js --priority=high
```

Output coloré dans le terminal avec :
- Dashboard statistiques
- Issues groupées par statut
- Liens cliquables vers GitHub
- Indicateurs visuels (emoji, couleurs)

---

## Templates GitHub

### Backend Templates

#### 🚀 DDD/CQRS Feature (`feature-ddd.yml`)
Pour créer des features suivant l'architecture DDD :
- Bounded Context
- Couche (Domain, Application, Infrastructure, Presentation)
- Exigences techniques par couche
- Skills à utiliser
- Quality checklist

#### 🐛 Bug Report (`bug.yml`)
Pour signaler des bugs backend :
- Bounded Context affecté
- Sévérité
- Comportement actuel vs attendu
- Étapes de reproduction
- Analyse de cause racine
- Debugging checklist

#### ✨ Enhancement (`enhancement.yml`)
Pour améliorations techniques :
- Catégorie (performance, architecture, etc.)
- Situation actuelle vs proposée
- Bénéfices attendus
- Approche technique

### Frontend Templates

#### 🚀 Next.js Feature (`feature-nextjs.yml`)
Pour créer des features frontend :
- Feature Module
- Type de composant
- Architecture compliance check
- Patterns Next.js 16 obligatoires
- Skills à utiliser
- Quality checklist

#### 🐛 Bug Report (`bug.yml`)
Pour signaler des bugs frontend :
- Feature Module affecté
- Type de bug (UI, logic, performance, SSR, etc.)
- Environnement (browser, device, OS)
- Screenshots/recordings
- Debugging checklist

#### ♻️ Refactoring (`refactoring.yml`)
Pour refactoring technique :
- Type de refactoring
- Implémentation actuelle vs cible
- Étapes de refactoring (TDD/BDD)
- Bénéfices attendus
- Risques et considérations

---

## Système de labels

### Structure des labels

Les labels sont organisés en catégories :

#### Communs (Backend + Frontend)
- **Type** : `feature`, `bug`, `enhancement`, `refactoring`, etc.
- **Priority** : `priority:critical`, `priority:high`, `priority:medium`, `priority:low`
- **Status** : `status:planned`, `status:ready`, `status:in-progress`, `status:blocked`, `status:review`
- **Effort** : `effort:small`, `effort:medium`, `effort:large`, `effort:extra-large`
- **Milestone** : `milestone:mvp`, `milestone:v1.1`, etc.

#### Backend spécifiques
- **Architecture** : `ddd`, `cqrs`, `bounded-context`
- **Bounded Contexts** : `bounded-context:club-management`, etc.
- **Layers** : `layer:domain`, `layer:application`, etc.
- **Technical** : `database`, `prisma`, `api`, `swagger`, `auth`

#### Frontend spécifiques
- **Next.js** : `nextjs`, `server-components`, `server-actions`, `view-transitions`, etc.
- **Feature Modules** : `feature:club-management`, `feature:players`, etc.
- **UI/UX** : `ui`, `ux`, `mobile-first`, `responsive`, `a11y`
- **State** : `zustand`, `state-management`

### Combinaisons recommandées

**Backend Feature** :
```
feature + ddd + cqrs + bounded-context:club-management + layer:application + priority:high + effort:medium
```

**Frontend Feature** :
```
feature + nextjs + feature:club-management + server-components + view-transitions + priority:high + effort:medium
```

**Bug** :
```
bug + priority:critical + [bounded-context:* ou feature:*] + status:in-progress
```

---

## Bonnes pratiques

### 1. Planification

✅ **DO** :
- Planifier en batch : ajoutez plusieurs issues à la fois dans `ISSUES_PLANNING.yaml`
- Définir les dépendances avec `blocked_by`
- Utiliser des descriptions détaillées avec contexte métier
- Lister les Skills à utiliser
- Estimer l'effort (small/medium/large)

❌ **DON'T** :
- Créer des issues trop vagues
- Oublier de spécifier les labels
- Créer manuellement sur GitHub sans mettre à jour le fichier YAML

### 2. Création d'issues

✅ **DO** :
- Utiliser `/create-issues` pour créer en batch
- Vérifier que les labels existent (lancer `npm run sync-labels` au début)
- Créer les issues backend d'abord si dépendances frontend

❌ **DON'T** :
- Créer des issues sans avoir synchronisé les labels
- Dupliquer des issues déjà créées

### 3. Suivi

✅ **DO** :
- Lancer `/sync-planning` régulièrement (daily standup)
- Utiliser `/show-planning` pour avoir une vue d'ensemble
- Mettre à jour le status manuellement dans `ISSUES_PLANNING.yaml` si besoin
- Documenter les blocages dans le fichier YAML

❌ **DON'T** :
- Oublier de synchroniser avant de planifier de nouvelles issues
- Modifier les issues sur GitHub sans resynchroniser

### 4. Implémentation

✅ **DO** :
- Consulter les Skills listés dans l'issue
- Respecter les critères d'acceptation
- Mettre à jour l'issue GitHub avec l'avancement
- Lier les PR aux issues

❌ **DON'T** :
- Ignorer les Skills recommandés
- Implémenter sans tests (TDD)
- Fermer une issue sans tous les critères validés

---

## Exemples de workflows

### Workflow 1 : Nouveau sprint

```bash
# 1. Synchroniser l'état actuel
/sync-planning

# 2. Afficher le planning
/show-planning

# 3. Planifier les nouvelles issues (éditer ISSUES_PLANNING.yaml)
# Ajouter BACK-010, BACK-011, FRONT-015, etc. avec status: planned

# 4. Créer les issues sur GitHub
/create-issues

# 5. Vérifier
/show-planning
```

### Workflow 2 : Daily standup

```bash
# 1. Synchroniser depuis GitHub
/sync-planning

# 2. Voir les issues en cours
/show-planning

# 3. Identifier les blocages
# Les issues avec status:blocked sont mises en évidence
```

### Workflow 3 : Implémenter une issue

```bash
# 1. Afficher l'issue spécifique
/show-planning
# Identifier BACK-001 et ses métadonnées

# 2. Consulter les Skills
# Dans ISSUES_PLANNING.yaml, voir la section "skills_to_use"

# 3. Implémenter avec Claude Code
User: "Implémente BACK-001"
Claude: [Lit l'issue, applique les Skills, guide l'implémentation]

# 4. Mettre à jour le status
# Éditer ISSUES_PLANNING.yaml : status: in-progress → completed

# 5. Fermer l'issue sur GitHub
# Via la PR ou manuellement
```

### Workflow 4 : Gérer les dépendances

```yaml
# ISSUES_PLANNING.yaml

backend:
  - id: BACK-005
    title: "API d'invitation"
    status: in-progress
    # ...

frontend:
  - id: FRONT-010
    title: "UI d'invitation"
    status: blocked
    blocked_by:
      - BACK-005  # Bloqué par l'API backend
    # ...
```

Quand BACK-005 est terminé :
1. Marquer `status: completed` pour BACK-005
2. Retirer `blocked_by` de FRONT-010
3. Marquer `status: ready` pour FRONT-010
4. Lancer `/sync-planning` et `/create-issues` si nécessaire

---

## Troubleshooting

### Les labels n'existent pas sur GitHub

```bash
# Synchroniser les labels
npm run sync-labels
```

### Le fichier YAML est invalide

```bash
# Vérifier la syntaxe YAML
node -e "require('js-yaml').load(require('fs').readFileSync('ISSUES_PLANNING.yaml', 'utf8'))"
```

### Les issues ne se créent pas

- Vérifier que GitHub CLI est authentifié : `gh auth status`
- Vérifier que les repos existent : `gh repo view RomualdP/volley_app_back`
- Vérifier les permissions (write access sur les repos)

### Le planning n'est pas à jour

```bash
# Forcer la synchronisation
/sync-planning

# Si problème persiste, vérifier manuellement sur GitHub
```

---

## Ressources

- **GitHub Repos** :
  - Backend : https://github.com/RomualdP/volley_app_back
  - Frontend : https://github.com/RomualdP/volley_app_front

- **Documentation** :
  - `LABELS.md` : Liste complète des labels
  - `CLAUDE.md` : Architecture du projet et Skills
  - `.claude/skills/` : Skills détaillés pour chaque pattern

- **Tools** :
  - GitHub CLI : https://cli.github.com/
  - js-yaml : https://github.com/nodeca/js-yaml

---

## 🔗 Issues Cross-Repo (Shared Issues)

### Qu'est-ce qu'une issue shared ?

Une **issue shared** est une fonctionnalité ou une tâche qui concerne **à la fois le backend ET le frontend**. Par exemple :
- Création de DTOs backend + types TypeScript frontend
- Nouvelle API endpoint + composant React associé
- Modification de contrat d'API

### Comment ça fonctionne ?

1. **Une entrée dans YAML** → **Deux issues GitHub** (une dans chaque repo)
2. Les deux issues sont **automatiquement liées** via commentaires
3. Les deux issues sont ajoutées au **GitHub Project** pour suivi unifié

### Structure YAML pour issues shared

```yaml
shared:
  - id: SHARED-001
    title: "[API Contract] Add Match Statistics DTOs"
    repos: [backend, frontend]

    # Issue backend (créée automatiquement)
    backend_issue:
      title: "[API Contract] Add Match Statistics DTOs (Backend)"
      labels: [api-contracts, layer:presentation]
      github_issue_number: null
      github_url: null

    # Issue frontend (créée automatiquement)
    frontend_issue:
      title: "[API Contract] Add Match Statistics DTOs (Frontend)"
      labels: [api-contracts, feature:shared]
      github_issue_number: null
      github_url: null

    description: |
      ## Context
      (Description commune aux deux issues)

      ## Backend Tasks
      - [ ] Create MatchStatisticsDto
      - [ ] Add Swagger decorators

      ## Frontend Tasks
      - [ ] Generate TypeScript types
      - [ ] Create Zod schemas

    status: planned
```

### Créer une issue shared

#### Étape 1 : Planifier dans YAML

Ajoutez l'issue dans la section `shared:` de `ISSUES_PLANNING.yaml` en suivant la structure ci-dessus.

#### Étape 2 : Créer sur GitHub

```bash
# Dans Claude Code
/create-issues
```

Claude Code va :
1. Créer l'issue backend : `[Title] (Backend)` dans `volley_app_back`
2. Créer l'issue frontend : `[Title] (Frontend)` dans `volley_app_front`
3. **Lier les deux issues** en ajoutant un commentaire dans chacune
4. Mettre à jour le YAML avec les deux numéros d'issues

#### Étape 3 : Synchroniser avec GitHub Project

```bash
# Dans Claude Code
/sync-project
```

Les deux issues seront ajoutées au GitHub Project "RomualdP's Hoki App".

### Visualiser les issues shared

#### Dans Claude Code

```bash
/show-planning
```

Output exemple :
```
📝 PLANNED (1 issue)

📝 SHARED-001 🔗 [API Contract] Add Match Statistics DTOs
│ Repo: shared (backend + frontend)
│ Priority: medium | Effort: N/A
│ Status: planned
│ Backend: Not created
│ Frontend: Not created
└─ cross-repo
```

Après création :
```
✅ READY (1 issue)

✅ SHARED-001 🔗 [API Contract] Add Match Statistics DTOs
│ Repo: shared (backend + frontend)
│ Priority: medium | Effort: N/A
│ Status: ready
│ Backend: #45 https://github.com/RomualdP/volley_app_back/issues/45
│ Frontend: #19 https://github.com/RomualdP/volley_app_front/issues/19
└─ cross-repo
```

#### Dans le terminal

```bash
npm run show-planning
```

### Workflow complet pour issue shared

```mermaid
graph LR
  A[Planifier<br/>YAML] --> B[/create-issues]
  B --> C[Issue Backend créée]
  B --> D[Issue Frontend créée]
  C --> E[Lier les issues]
  D --> E
  E --> F[/sync-project]
  F --> G[GitHub Project]
```

### Scripts disponibles

#### Lier manuellement deux issues

Si vous avez créé les issues manuellement et voulez les lier :

```bash
node .github/scripts/link-issues.js --backend=45 --frontend=19
```

Output :
```
🔗 Linking Issues
═══════════════════

📝 Fetching issue details...
  Backend: [API Contract] Add Match Statistics DTOs (Backend)
  Frontend: [API Contract] Add Match Statistics DTOs (Frontend)

💬 Adding link comments...

✅ Issues successfully linked!

📋 Summary:
  Backend:  RomualdP/volley_app_back#45
  Frontend: RomualdP/volley_app_front#19

🌐 URLs:
  Backend:  https://github.com/RomualdP/volley_app_back/issues/45
  Frontend: https://github.com/RomualdP/volley_app_front/issues/19
```

#### Synchroniser avec GitHub Project

```bash
npm run sync-project

# ou avec URL custom
node .github/scripts/sync-project.js --project-url=https://github.com/users/RomualdP/projects/4
```

### GitHub Project

Les issues shared apparaissent **deux fois** dans le GitHub Project :
- Une fois pour le backend
- Une fois pour le frontend

C'est intentionnel car cela permet de :
- Suivre l'avancement indépendamment (backend peut être done, frontend en cours)
- Assigner différentes personnes
- Filtrer par repo dans le Project

### Bonnes pratiques

#### ✅ DO

- Utiliser des issues shared pour les contrats d'API
- Créer des tasks séparées pour backend et frontend dans la description
- Mentionner les dépendances (backend doit être fait avant frontend)
- Lier les deux issues dès la création

#### ❌ DON'T

- Créer une issue shared pour quelque chose qui concerne qu'un seul repo
- Oublier de lier les issues (utilisez `/create-issues` qui le fait automatiquement)
- Dupliquer la description identique (adaptez backend vs frontend)

### Exemples concrets

#### Exemple 1 : Nouveau DTO

```yaml
shared:
  - id: SHARED-002
    title: "[User Profile] Add Avatar Upload DTO"
    repos: [backend, frontend]
    backend_issue:
      title: "[User Profile] Add Avatar Upload DTO (Backend)"
    frontend_issue:
      title: "[User Profile] Add Avatar Upload DTO (Frontend)"
    description: |
      ## Backend Tasks
      - [ ] Create AvatarUploadDto with file validation
      - [ ] Add Multer interceptor
      - [ ] Store file path in User entity

      ## Frontend Tasks
      - [ ] Create TypeScript type from DTO
      - [ ] Build file upload component
      - [ ] Handle upload progress
```

#### Exemple 2 : Modification d'API existante

```yaml
shared:
  - id: SHARED-003
    title: "[Match API] Add Pagination Support"
    repos: [backend, frontend]
    backend_issue:
      title: "[Match API] Add Pagination Support (Backend)"
      labels: [api, enhancement, bounded-context:match-management]
    frontend_issue:
      title: "[Match API] Add Pagination Support (Frontend)"
      labels: [api, enhancement, feature:matches]
    description: |
      ## Backend Tasks
      - [ ] Add PaginationDto (page, limit, total)
      - [ ] Update ListMatchesQuery handler
      - [ ] Add pagination metadata in response

      ## Frontend Tasks
      - [ ] Update API client to handle pagination
      - [ ] Add pagination UI component
      - [ ] Infinite scroll or page numbers
```

### Troubleshooting

#### Les issues ne se lient pas

Vérifiez que :
- Les deux issues sont bien créées
- Vous avez les permissions d'écriture sur les deux repos
- GitHub CLI est authentifié : `gh auth status`

Solution : Lancer manuellement
```bash
node .github/scripts/link-issues.js --backend=X --frontend=Y
```

#### Les issues n'apparaissent pas dans le Project

```bash
/sync-project
```

ou

```bash
npm run sync-project
```

#### Le YAML n'est pas mis à jour après création

Vérifiez que `/create-issues` a bien terminé sans erreur. Si erreur, mettez à jour manuellement le YAML.

---

## Contribution

Pour améliorer ce workflow :

1. Proposer des modifications dans `WORKFLOW_ISSUES.md`
2. Ajouter de nouveaux templates dans `.github/ISSUE_TEMPLATE/`
3. Créer de nouveaux labels dans `LABELS.md` et `.github/scripts/sync-labels.js`
4. Étendre les commandes Claude Code dans `.claude/commands/`

---

**Happy issue tracking! 🎯**
