# GitHub Labels System

Système de labels cohérent pour les repos backend et frontend.

## Comment Appliquer les Labels

### Option 1 : Manuellement via GitHub UI
1. Aller sur `https://github.com/RomualdP/[repo]/labels`
2. Créer chaque label avec son nom, description et couleur

### Option 2 : Via GitHub CLI
```bash
# Backend
cd volley-app-backend
gh label create "ddd" --description "DDD Architecture" --color "0052CC"
gh label create "cqrs" --description "CQRS Pattern" --color "0052CC"
# ... (répéter pour tous les labels)

# Frontend
cd volley-app-frontend
gh label create "nextjs" --description "Next.js 16 Patterns" --color "000000"
gh label create "feature" --description "New Feature" --color "0E8A16"
# ... (répéter pour tous les labels)
```

### Option 3 : Script Automatisé (voir ci-dessous)
```bash
cd volley_app
node .github/scripts/sync-labels.js
```

---

## 🏷️ Labels Communs (Backend + Frontend)

### Type
| Label | Description | Color | Repos |
|-------|-------------|-------|-------|
| `feature` | New feature | `#0E8A16` | Both |
| `bug` | Something isn't working | `#D73A4A` | Both |
| `enhancement` | Improvement to existing feature | `#A2EEEF` | Both |
| `refactoring` | Code refactoring | `#FEF2C0` | Both |
| `documentation` | Documentation improvements | `#0075CA` | Both |
| `testing` | Testing improvements | `#BFD4F2` | Both |
| `security` | Security-related | `#EE0701` | Both |
| `performance` | Performance optimization | `#FBCA04` | Both |
| `technical-debt` | Technical debt to address | `#D93F0B` | Both |

### Priority
| Label | Description | Color | Repos |
|-------|-------------|-------|-------|
| `priority:critical` | Critical priority | `#B60205` | Both |
| `priority:high` | High priority | `#D93F0B` | Both |
| `priority:medium` | Medium priority | `#FBCA04` | Both |
| `priority:low` | Low priority | `#0E8A16` | Both |

### Status
| Label | Description | Color | Repos |
|-------|-------------|-------|-------|
| `status:planned` | Planned for future sprint | `#C5DEF5` | Both |
| `status:in-progress` | Currently being worked on | `#FEF2C0` | Both |
| `status:blocked` | Blocked by dependencies | `#D93F0B` | Both |
| `status:review` | Awaiting code review | `#FBCA04` | Both |
| `status:ready` | Ready for development | `#0E8A16` | Both |

### Effort
| Label | Description | Color | Repos |
|-------|-------------|-------|-------|
| `effort:small` | Small effort (1-2 hours) | `#C2E0C6` | Both |
| `effort:medium` | Medium effort (3-6 hours) | `#FEF2C0` | Both |
| `effort:large` | Large effort (1-2 days) | `#FBCA04` | Both |
| `effort:extra-large` | Extra large effort (3+ days) | `#D93F0B` | Both |

### Milestone
| Label | Description | Color | Repos |
|-------|-------------|-------|-------|
| `milestone:mvp` | MVP v1.0 | `#5319E7` | Both |
| `milestone:v1.1` | Version 1.1 | `#5319E7` | Both |
| `milestone:v2.0` | Version 2.0 | `#5319E7` | Both |

---

## 🔙 Labels Backend Spécifiques

### Architecture DDD
| Label | Description | Color |
|-------|-------------|-------|
| `ddd` | DDD Architecture | `#0052CC` |
| `cqrs` | CQRS Pattern | `#0052CC` |
| `bounded-context` | Bounded Context related | `#006B75` |

### Bounded Contexts
| Label | Description | Color |
|-------|-------------|-------|
| `bounded-context:club-management` | Club Management context | `#006B75` |
| `bounded-context:training-management` | Training Management context | `#006B75` |
| `bounded-context:match-management` | Match Management context | `#006B75` |
| `bounded-context:tournament-management` | Tournament Management context | `#006B75` |
| `bounded-context:user-management` | User Management context | `#006B75` |
| `bounded-context:shared` | Shared context | `#006B75` |

### Layers
| Label | Description | Color |
|-------|-------------|-------|
| `layer:domain` | Domain Layer (Entities, VOs) | `#5319E7` |
| `layer:application` | Application Layer (Commands, Queries) | `#5319E7` |
| `layer:infrastructure` | Infrastructure Layer (Repos, Mappers) | `#5319E7` |
| `layer:presentation` | Presentation Layer (Controllers, DTOs) | `#5319E7` |

### Technical Backend
| Label | Description | Color |
|-------|-------------|-------|
| `database` | Database related | `#1D76DB` |
| `prisma` | Prisma ORM | `#1D76DB` |
| `api` | API endpoints | `#0075CA` |
| `swagger` | Swagger documentation | `#0075CA` |
| `auth` | Authentication/Authorization | `#EE0701` |
| `validation` | Validation logic | `#BFD4F2` |

---

## 🎨 Labels Frontend Spécifiques

### Next.js Patterns
| Label | Description | Color |
|-------|-------------|-------|
| `nextjs` | Next.js 16 patterns | `#000000` |
| `server-components` | Server Components | `#000000` |
| `server-actions` | Server Actions | `#000000` |
| `view-transitions` | View Transitions API | `#5319E7` |
| `parallel-routes` | Parallel Routes | `#5319E7` |
| `suspense` | Suspense & Streaming | `#0052CC` |
| `use-optimistic` | useOptimistic hook | `#0052CC` |

### Feature Modules
| Label | Description | Color |
|-------|-------------|-------|
| `feature:club-management` | Club Management feature | `#006B75` |
| `feature:training-management` | Training Management feature | `#006B75` |
| `feature:match-management` | Match Management feature | `#006B75` |
| `feature:tournament-management` | Tournament Management feature | `#006B75` |
| `feature:players` | Players feature | `#006B75` |
| `feature:teams` | Teams feature | `#006B75` |
| `feature:profile` | User Profile feature | `#006B75` |
| `feature:shared` | Shared components/utilities | `#006B75` |

### UI/UX
| Label | Description | Color |
|-------|-------------|-------|
| `ui` | UI Components | `#D4C5F9` |
| `ux` | User Experience | `#D4C5F9` |
| `mobile-first` | Mobile-first design | `#F9D0C4` |
| `responsive` | Responsive design | `#F9D0C4` |
| `a11y` | Accessibility | `#EE0701` |
| `design-system` | Design system / shadcn/ui | `#D4C5F9` |

### State Management
| Label | Description | Color |
|-------|-------------|-------|
| `zustand` | Zustand state management | `#0052CC` |
| `state-management` | State management related | `#0052CC` |

---

## 🔗 Labels Cross-Repo

| Label | Description | Color | Repos |
|-------|-------------|-------|-------|
| `api-contracts` | API contracts sync (DTOs, Types) | `#FBCA04` | Both |
| `breaking-change` | Breaking change | `#D73A4A` | Both |
| `dependencies` | Dependencies between repos | `#C5DEF5` | Both |
| `question` | Further information requested | `#D876E3` | Both |
| `wontfix` | Won't be fixed | `#FFFFFF` | Both |
| `duplicate` | Duplicate issue | `#CFD3D7` | Both |
| `good-first-issue` | Good for newcomers | `#7057FF` | Both |
| `help-wanted` | Extra attention needed | `#008672` | Both |

---

## 📋 Usage Guidelines

### Label Combinations

**Backend Feature Example:**
```
feature + ddd + cqrs + bounded-context:club-management + layer:application + priority:high + effort:medium
```

**Frontend Feature Example:**
```
feature + nextjs + feature:club-management + server-components + view-transitions + priority:high + effort:medium
```

**Bug Example:**
```
bug + priority:critical + bounded-context:club-management + status:in-progress
```

**Cross-Repo Example:**
```
api-contracts + dependencies + feature:club-management + priority:high
```

### Best Practices

1. **Toujours inclure un label de type** : `feature`, `bug`, `enhancement`, etc.
2. **Ajouter une priorité** : `priority:low/medium/high/critical`
3. **Spécifier le scope** :
   - Backend : `bounded-context:*` + `layer:*`
   - Frontend : `feature:*`
4. **Optionnel mais recommandé** : `effort:*`, `status:*`, `milestone:*`
5. **Cross-repo** : Utiliser `api-contracts` quand les deux repos sont concernés

### Automation

Les labels `status:*` peuvent être automatisés via GitHub Actions :
- Assigner `status:review` automatiquement lors de la création d'une PR
- Assigner `status:blocked` si la PR a des conflits
- Assigner `status:in-progress` lors du premier commit sur une branche

---

## 🚀 Script de Synchronisation

Créez un script pour synchroniser les labels automatiquement :

```javascript
// .github/scripts/sync-labels.js
// À exécuter avec : node .github/scripts/sync-labels.js

const { execSync } = require('child_process');

const repos = {
  backend: 'RomualdP/volley_app_back',
  frontend: 'RomualdP/volley_app_front'
};

const commonLabels = [
  { name: 'feature', description: 'New feature', color: '0E8A16' },
  { name: 'bug', description: "Something isn't working", color: 'D73A4A' },
  // ... ajouter tous les labels communs
];

const backendLabels = [
  { name: 'ddd', description: 'DDD Architecture', color: '0052CC' },
  { name: 'cqrs', description: 'CQRS Pattern', color: '0052CC' },
  // ... ajouter tous les labels backend
];

const frontendLabels = [
  { name: 'nextjs', description: 'Next.js 16 patterns', color: '000000' },
  { name: 'server-components', description: 'Server Components', color: '000000' },
  // ... ajouter tous les labels frontend
];

function createLabels(repo, labels) {
  labels.forEach(label => {
    try {
      execSync(
        `gh label create "${label.name}" --repo "${repo}" --description "${label.description}" --color "${label.color}" --force`,
        { stdio: 'inherit' }
      );
    } catch (error) {
      console.error(`Error creating label ${label.name} for ${repo}`);
    }
  });
}

// Apply common labels to both repos
createLabels(repos.backend, commonLabels);
createLabels(repos.frontend, commonLabels);

// Apply specific labels
createLabels(repos.backend, backendLabels);
createLabels(repos.frontend, frontendLabels);

console.log('✅ Labels synchronized!');
```

---

## 📝 Notes

- Les couleurs sont en format HEX sans le `#`
- Les labels peuvent être modifiés après création
- Utiliser `--force` avec `gh label create` pour mettre à jour un label existant
- Pour supprimer un label : `gh label delete "label-name" --repo "owner/repo"`
