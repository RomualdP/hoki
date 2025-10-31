# Configuration Stripe - Variables d'Environnement

## Ajoutez ces variables à votre fichier `.env`

```bash
# ============================================
# STRIPE PAYMENTS
# ============================================
# Stripe API Keys (use test keys for development)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# Stripe Product Price IDs
STRIPE_PRICE_ID_STARTER="price_xxxxx_starter_5eur"
STRIPE_PRICE_ID_PRO="price_xxxxx_pro_15eur"

# Beta Mode (set to true to skip Stripe and create subscriptions directly)
BETA_MODE_ENABLED="true"
```

## Instructions

### 1. Mode BETA (Recommandé pour commencer)
Si vous voulez tester l'application sans Stripe :
- Mettez `BETA_MODE_ENABLED="true"`
- Les autres clés Stripe peuvent rester vides

### 2. Mode Stripe Test
Si vous voulez tester avec Stripe :
- Allez sur https://dashboard.stripe.com/test/apikeys
- Copiez votre clé secrète de test (`sk_test_...`) dans `STRIPE_SECRET_KEY`
- Copiez votre clé publique de test (`pk_test_...`) dans `STRIPE_PUBLISHABLE_KEY`
- Créez vos produits et prix dans Stripe Dashboard
- Copiez les price IDs dans `STRIPE_PRICE_ID_STARTER` et `STRIPE_PRICE_ID_PRO`
- Pour le webhook secret, voir section suivante

### 3. Configuration des Webhooks Stripe

#### En local (développement)
Utilisez Stripe CLI pour tester les webhooks :
```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Écouter les webhooks en local
stripe listen --forward-to localhost:3000/webhooks/stripe
# Copiez le webhook secret (whsec_...) dans STRIPE_WEBHOOK_SECRET
```

#### En production
1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez "Add endpoint"
3. URL : `https://your-domain.com/webhooks/stripe`
4. Sélectionnez ces événements :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copiez le webhook secret dans `STRIPE_WEBHOOK_SECRET`

## Création des Produits Stripe

### Produit 1 : Starter Plan
- Prix : 5€/mois
- Nombre d'équipes : 3

### Produit 2 : Pro Plan
- Prix : 15€/mois
- Nombre d'équipes : Illimité

Dans le Stripe Dashboard :
1. Produits → Créer un produit
2. Nom : "Volley App - Starter"
3. Prix : 5 EUR / mois
4. Copiez le Price ID (commence par `price_...`)
5. Répétez pour le plan Pro (15 EUR / mois)
