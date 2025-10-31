# Design Tokens - VolleyApp

Documentation des design tokens utilisés dans l'application VolleyApp.

## Source

Les couleurs principales sont extraites du design Figma du projet (LrxTAFgGFwQs54ErPmxR1V).
**Note** : Seules les couleurs, pictos et logo sont repris du Figma. La structure et l'organisation sont indépendantes.

## Tokens disponibles

### Colors

#### Background

| Token | Valeur | Usage | Classe Tailwind |
|-------|--------|-------|-----------------|
| `--color-background` | `#faf3e0` | Fond général de l'application | `bg-background` |
| `--color-foreground` | `#171717` | Texte principal | `text-foreground` |

**Exemple** :
```tsx
<div className="bg-background text-foreground">
  Contenu de la page
</div>
```

#### Surface

| Token | Valeur | Usage | Classe Tailwind |
|-------|--------|-------|-----------------|
| `--color-surface` | `#aedff7` | Surfaces interactives (navbar, cards) | `bg-surface` |
| `--color-surface-elevated` | `#ffffff` | Surfaces surélevées (modals, popovers) | `bg-surface-elevated` |

**Exemple** :
```tsx
<aside className="bg-surface">
  {/* Sidebar navigation */}
</aside>

<Card className="bg-surface-elevated">
  {/* Elevated card content */}
</Card>
```

#### Accent

| Token | Valeur | Usage | Classe Tailwind |
|-------|--------|-------|-----------------|
| `--color-accent` | `#fd8150` | Couleur d'accent (états actifs, CTA, liens importants) | `bg-accent`, `text-accent`, `border-accent` |
| `--color-accent-foreground` | `#ffffff` | Texte sur fond accent | `text-accent-foreground` |

**Exemple** :
```tsx
<button className="bg-accent text-accent-foreground">
  Action principale
</button>

<Link className={isActive ? "bg-accent text-accent-foreground" : "text-neutral-700"}>
  Navigation active
</Link>
```

#### Borders

| Token | Valeur | Usage | Classe Tailwind |
|-------|--------|-------|-----------------|
| `--color-border` | `#e5e5e5` | Bordures standards | `border-border` |
| `--color-border-emphasis` | `#ffffff` | Bordures emphases (lignes de terrain, séparateurs importants) | `border-border-emphasis` |

**Exemple** :
```tsx
<aside className="border-r-[12px] border-border-emphasis">
  {/* Sidebar avec bordure blanche épaisse style terrain */}
</aside>
```

#### States

| Token | Valeur | Usage | Classe Tailwind |
|-------|--------|-------|-----------------|
| `--color-success` | `#22c55e` | États de succès, validations | `bg-success`, `text-success` |
| `--color-error` | `#ef4444` | États d'erreur, alertes | `bg-error`, `text-error` |
| `--color-warning` | `#f59e0b` | Avertissements | `bg-warning`, `text-warning` |

#### Neutrals

Couleurs neutres pour les éléments UI génériques (textes secondaires, backgrounds subtils, etc.).

| Token | Classe Tailwind | Usage |
|-------|-----------------|-------|
| `--color-neutral-50` | `bg-neutral-50` | Background le plus clair |
| `--color-neutral-100` | `bg-neutral-100` | Hover states légers |
| `--color-neutral-200` | `bg-neutral-200` | Bordures, séparateurs |
| `--color-neutral-300` | `text-neutral-300` | Texte désactivé |
| `--color-neutral-400` | `text-neutral-400` | Texte tertiaire |
| `--color-neutral-500` | `text-neutral-500` | Texte secondaire |
| `--color-neutral-600` | `text-neutral-600` | Texte secondaire foncé |
| `--color-neutral-700` | `text-neutral-700` | Texte principal alternatif |
| `--color-neutral-800` | `bg-neutral-800` | Backgrounds foncés |
| `--color-neutral-900` | `text-neutral-900` | Texte le plus foncé |

### Typography

| Token | Valeur | Usage | Classe Tailwind |
|-------|--------|-------|-----------------|
| `--font-sans` | `Roboto` | Police par défaut pour le corps de texte | `font-sans` |
| `--font-heading` | `Anime Ace 2.0 BB` | Police pour les h1 uniquement (et usage manuel via classe) | `font-heading` |

#### Hiérarchie des headings

| Heading | Police | Weight | Usage automatique |
|---------|--------|--------|-------------------|
| `h1` | Anime Ace | 400 | ✅ Automatique |
| `h2, h3, h4, h5, h6` | Roboto | 700 (Bold) | ✅ Automatique |

**Par défaut**, seuls les `h1` utilisent Anime Ace. Les autres headings (h2-h6) utilisent Roboto Bold pour maintenir une hiérarchie claire sans surcharger visuellement.

**Classe `.font-heading`** : Disponible pour forcer Anime Ace sur un élément si nécessaire (usage rare).

**Exemple** :
```tsx
{/* h1 utilise automatiquement Anime Ace */}
<h1 className="text-4xl">Titre principal</h1>

{/* h2-h6 utilisent automatiquement Roboto Bold */}
<h2 className="text-3xl">Sous-titre</h2>
<h3 className="text-2xl">Section</h3>

{/* Usage manuel de Anime Ace (rare) */}
<p className="font-heading text-lg">Texte spécial</p>

{/* Corps de texte standard */}
<p className="font-sans">Corps de texte</p>
```

### Icons

**Bibliothèque** : [Lucide React](https://lucide.dev) (v0.546.0)

#### Pourquoi Lucide ?
- 1,500+ icônes modernes et cohérentes
- Tree-shaking natif (bundle ultra-léger)
- API simple et intuitive
- Stroke width personnalisable
- Parfait pour React 19 + Tailwind v4

#### Tailles recommandées

| Usage | Size (px) | Classe Tailwind équivalente |
|-------|-----------|------------------------------|
| Small (inline text) | `16` | Similar to `text-base` |
| Medium (buttons, nav) | `20` | Similar to `text-lg` |
| Large (headers, features) | `24` | Similar to `text-xl` |
| XLarge (hero sections) | `32` | Similar to `text-2xl` |

#### Stroke Width

| Weight | strokeWidth | Usage |
|--------|-------------|-------|
| Light | `1.5` | Textes légers, UI subtile |
| Regular | `2` | **Par défaut** - Navigation, boutons |
| Bold | `2.5` | Emphasis, CTA importants |

#### Utilisation

```tsx
import { Home, User, Calendar } from 'lucide-react';

// Taille par défaut (24px)
<Home />

// Taille personnalisée
<Home size={20} />

// Stroke width personnalisé
<Home size={20} strokeWidth={2} />

// Avec classes Tailwind (couleurs depuis tokens)
<Home size={20} strokeWidth={2} className="text-accent" />

// Icon active/inactive
<Home
  size={20}
  strokeWidth={2}
  className={isActive ? "text-accent-foreground" : "text-neutral-700"}
/>
```

#### Exemples de composants

**Navigation avec icônes** :
```tsx
import { LayoutDashboard, Users, Calendar } from 'lucide-react';

<nav>
  <Link className="flex items-center gap-3 bg-accent text-accent-foreground">
    <LayoutDashboard size={20} strokeWidth={2} />
    <span>Dashboard</span>
  </Link>
  <Link className="flex items-center gap-3 text-neutral-700">
    <Users size={20} strokeWidth={2} />
    <span>Équipes</span>
  </Link>
</nav>
```

**Boutons avec icônes** :
```tsx
import { Plus, Trash2, Edit } from 'lucide-react';

<button className="bg-accent text-accent-foreground">
  <Plus size={20} strokeWidth={2} />
  <span>Créer</span>
</button>

<button className="text-error">
  <Trash2 size={18} strokeWidth={2} />
  <span>Supprimer</span>
</button>
```

**Icônes décoratives** :
```tsx
import { Trophy, Star, Heart } from 'lucide-react';

<div className="text-accent">
  <Trophy size={32} strokeWidth={2} />
</div>
```

#### Icônes utilisées dans l'app

| Composant | Icône Lucide | Usage |
|-----------|--------------|-------|
| Navigation Dashboard | `LayoutDashboard` | Lien vers dashboard |
| Navigation Club | `Building2` | Lien vers mon club |
| Navigation Équipes | `Users` | Lien vers mes équipes |
| Navigation Joueurs | `UserCircle2` | Lien vers mes joueurs |
| Navigation Matchs | `Calendar` | Lien vers matchs |
| Navigation Abonnement | `CreditCard` | Lien vers abonnement |
| Déconnexion | `LogOut` | Bouton déconnexion |

#### Ressources Lucide

- **Documentation** : https://lucide.dev
- **Recherche d'icônes** : https://lucide.dev/icons
- **GitHub** : https://github.com/lucide-icons/lucide

### Autres tokens

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-input` | `#fafafa` | Background des inputs |
| `--color-ring` | `var(--color-accent)` | Focus ring (outline) |

## Comment utiliser les tokens

### ✅ BON : Utiliser les classes Tailwind

```tsx
// Bon - Utilise les tokens sémantiques
<div className="bg-background text-foreground">
<aside className="bg-surface border-border-emphasis">
<button className="bg-accent text-accent-foreground">
```

### ❌ MAUVAIS : Hardcoder les couleurs

```tsx
// Mauvais - Valeurs hardcodées
<div className="bg-[#faf3e0] text-[#171717]">
<aside className="bg-[#aedff7] border-[#ffffff]">
<button className="bg-[#fd8150] text-white">
```

### Pourquoi ?

1. **Cohérence** : Tous les composants utilisent les mêmes valeurs
2. **Maintenabilité** : Changement centralisé dans `globals.css`
3. **Thèmes** : Support facile du dark mode ou thèmes alternatifs
4. **Sémantique** : Le nom exprime l'intention (`accent` vs `orange`)

## Dark Mode

Le dark mode est configuré mais désactivé par défaut. Pour l'activer, les tokens sont automatiquement swappés :

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #171717;
    --color-foreground: #fafafa;
    --color-border: #262626;
  }
}
```

Aucune modification des composants nécessaire !

## Ajouter de nouveaux tokens

### 1. Définir le primitive token dans `globals.css`

```css
:root {
  /* Primitive token (valeur brute) */
  --primitive-blue-500: #3b82f6;
}
```

### 2. Créer un semantic token

```css
:root {
  /* Semantic token (usage) */
  --color-primary: var(--primitive-blue-500);
  --color-primary-foreground: #ffffff;
}
```

### 3. Exposer à Tailwind

```css
@theme inline {
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-primary-foreground);
}
```

### 4. Utiliser dans les composants

```tsx
<button className="bg-primary text-primary-foreground">
  Primary Action
</button>
```

### 5. Documenter ici

Ajouter le token dans ce fichier avec son usage et exemples.

## Exemples de composants

### Navigation active

```tsx
<Link
  className={`px-4 py-3 rounded-lg transition-colors ${
    isActive
      ? "bg-accent text-accent-foreground"
      : "text-neutral-700 hover:bg-neutral-100"
  }`}
>
  Dashboard
</Link>
```

### Card avec surface élevée

```tsx
<div className="bg-surface-elevated border border-border rounded-lg p-6">
  <h2 className="font-heading text-xl mb-4">Titre</h2>
  <p className="text-neutral-600">Description</p>
</div>
```

### Button primaire

```tsx
<button className="bg-accent text-accent-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
  Action
</button>
```

## Ressources

- **Skill** : `.claude/skills/design-system-tokens/skill.md`
- **Configuration** : `volley-app-frontend/src/app/globals.css`
- **Figma** : `LrxTAFgGFwQs54ErPmxR1V` (couleurs uniquement)

## Checklist avant commit

- [ ] Aucune valeur hardcodée (`bg-[#hexcode]`)
- [ ] Utilisation de tokens sémantiques (`bg-accent` vs `bg-orange-500`)
- [ ] Nouveaux tokens documentés ici
- [ ] Tests visuels OK (light et dark mode si applicable)

---

**Dernière mise à jour** : Décembre 2024
