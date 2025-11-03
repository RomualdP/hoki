# Design System Tokens

**Type** : Frontend
**Status** : MANDATORY pour toute modification de style
**Déclencheurs** : couleurs, design, tokens, theme, style, UI consistency

## Philosophie

Un design system cohérent repose sur des **design tokens** : variables réutilisables qui définissent les valeurs de design (couleurs, typographie, spacing, etc.). Les tokens garantissent :
- **Cohérence** : Mêmes valeurs partout dans l'application
- **Maintenabilité** : Changement centralisé
- **Scalabilité** : Facile d'ajouter des variantes (dark mode, thèmes)
- **Sémantique** : Noms qui expriment l'intention, pas la valeur

## Règles MANDATORY

### 1. JAMAIS de valeurs hardcodées

❌ **MAUVAIS** :
```tsx
<div className="bg-[#faf3e0] text-[#fd8150]">
```

✅ **BON** :
```tsx
<div className="bg-background text-accent">
```

### 2. Utiliser des noms sémantiques

Les tokens doivent exprimer leur **usage**, pas leur apparence :

❌ **MAUVAIS** :
```css
--color-beige: #faf3e0;
--color-blue-light: #aedff7;
--color-orange: #fd8150;
```

✅ **BON** :
```css
--color-background: #faf3e0;      /* Fond général de l'app */
--color-surface: #aedff7;         /* Surface interactive (navbar, cards) */
--color-accent: #fd8150;          /* Accent/Active state */
```

### 3. Organisation hiérarchique des tokens

```css
:root {
  /* 1. Primitive tokens (valeurs brutes) */
  --primitive-beige-50: #faf3e0;
  --primitive-cyan-200: #aedff7;
  --primitive-orange-500: #fd8150;

  /* 2. Semantic tokens (usage sémantique) */
  --color-background: var(--primitive-beige-50);
  --color-surface: var(--primitive-cyan-200);
  --color-accent: var(--primitive-orange-500);

  /* 3. Component tokens (spécifiques aux composants) */
  --navbar-background: var(--color-surface);
  --navbar-active: var(--color-accent);
}
```

## Structure des tokens

### Catégories de tokens

1. **Colors** : Couleurs principales, surfaces, accents, états
2. **Typography** : Familles de polices, tailles, poids, hauteurs de ligne
3. **Spacing** : Marges, paddings, gaps
4. **Shadows** : Ombres portées
5. **Borders** : Épaisseurs, rayons, couleurs
6. **Transitions** : Durées, fonctions d'easing

### Tailwind CSS v4 Integration

Tailwind v4 utilise **CSS variables** et **@theme inline** :

```css
/* globals.css */
:root {
  /* Primitive tokens */
  --primitive-beige-50: #faf3e0;
  --primitive-cyan-200: #aedff7;
  --primitive-orange-500: #fd8150;

  /* Semantic tokens */
  --color-background: var(--primitive-beige-50);
  --color-surface: var(--primitive-cyan-200);
  --color-accent: var(--primitive-orange-500);
  --color-accent-foreground: #ffffff;
}

@theme inline {
  /* Expose tokens to Tailwind */
  --color-background: var(--color-background);
  --color-surface: var(--color-surface);
  --color-accent: var(--color-accent);
  --color-accent-foreground: var(--color-accent-foreground);
}
```

Ensuite dans les composants :
```tsx
<div className="bg-background">         {/* Utilise --color-background */}
<div className="bg-surface">            {/* Utilise --color-surface */}
<div className="bg-accent text-accent-foreground"> {/* Utilise --color-accent */}
```

## Workflow pour ajouter/modifier des tokens

### 1. Identifier le besoin

Avant d'ajouter un token, vérifier si un token existant convient.

### 2. Nommer sémantiquement

- **Usage général** : `background`, `foreground`, `surface`, `border`
- **Composants** : `navbar-background`, `card-border`, `button-primary`
- **États** : `hover`, `active`, `disabled`, `focus`

### 3. Ajouter dans globals.css

```css
:root {
  /* Primitive token */
  --primitive-new-color: #hexcode;

  /* Semantic token */
  --color-new-usage: var(--primitive-new-color);
}

@theme inline {
  /* Expose to Tailwind */
  --color-new-usage: var(--color-new-usage);
}
```

### 4. Documenter dans .claude/design-tokens.md

```md
## Colors

### Background
- `background` (`#faf3e0`) : Fond général de l'application
- `surface` (`#aedff7`) : Surfaces interactives (navbar, cards)

### Accent
- `accent` (`#fd8150`) : Couleur d'accent (états actifs, CTA)
- `accent-foreground` (`#ffffff`) : Texte sur accent
```

### 5. Utiliser dans les composants

```tsx
// Remplacer les valeurs hardcodées
- <div className="bg-[#faf3e0]">
+ <div className="bg-background">

- <div className="bg-[#fd8150] text-white">
+ <div className="bg-accent text-accent-foreground">
```

## Cas d'usage typiques

### Ajout d'une nouvelle couleur de surface

```css
/* 1. Ajouter le primitive token */
--primitive-surface-elevated: #ffffff;

/* 2. Créer le semantic token */
--color-surface-elevated: var(--primitive-surface-elevated);

/* 3. Exposer à Tailwind */
@theme inline {
  --color-surface-elevated: var(--color-surface-elevated);
}
```

```tsx
/* 4. Utiliser dans un composant */
<Card className="bg-surface-elevated" />
```

### Support du dark mode

```css
:root {
  --color-background: #faf3e0;
  --color-foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #171717;
    --color-foreground: #fafafa;
  }
}
```

Aucun changement dans les composants nécessaire !

### Thèmes multiples

```css
/* Theme par défaut */
:root {
  --color-accent: #fd8150;
}

/* Theme alternatif */
[data-theme="blue"] {
  --color-accent: #0ea5e9;
}
```

```tsx
<div data-theme="blue">
  <Button className="bg-accent" /> {/* Sera bleu */}
</div>
```

## Erreurs courantes à éviter

### ❌ Hardcoder des couleurs

```tsx
<div className="bg-[#faf3e0]">  {/* NON ! */}
```

### ❌ Nommer par couleur au lieu d'usage

```css
--color-orange: #fd8150;  /* NON ! */
--color-accent: #fd8150;  /* OUI ! */
```

### ❌ Ne pas exposer à @theme inline

```css
:root {
  --color-new: #hexcode;
}
/* MANQUE : */
@theme inline {
  --color-new: var(--color-new);
}
```

### ❌ Mélanger primitive et semantic

```css
/* NON ! */
--color-surface: #aedff7;

/* OUI ! */
--primitive-cyan-200: #aedff7;
--color-surface: var(--primitive-cyan-200);
```

## Checklist avant commit

- [ ] Tous les tokens sont définis dans globals.css
- [ ] Les tokens sont exposés dans @theme inline
- [ ] Les noms sont sémantiques (usage, pas apparence)
- [ ] Aucune valeur hardcodée dans les composants
- [ ] Documentation mise à jour dans design-tokens.md
- [ ] Les tokens existants ont été réutilisés quand possible

## Ressources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Design Tokens Community Group](https://www.w3.org/community/design-tokens/)
- Fichier de référence : `volley-app-frontend/src/app/globals.css`
- Documentation projet : `.claude/design-tokens.md`

---

**IMPORTANT** : Ce skill est MANDATORY. Toute modification de couleur, typographie, spacing doit passer par le design system. JAMAIS de valeurs hardcodées.
