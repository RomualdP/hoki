# Club Management - Récapitulatif Métier

## Vue d'ensemble

Le bounded context **Club Management** gère l'ensemble du cycle de vie des clubs de volleyball, leurs abonnements, et l'organisation de leurs membres. C'est le cœur organisationnel de l'application qui permet aux entraîneurs de créer et gérer leurs structures sportives.

## Concepts Métier Clés

### 1. Club

Un **Club** représente une structure organisationnelle de volleyball créée et gérée par un entraîneur principal.

**Caractéristiques:**
- Nom (unique, maximum 100 caractères)
- Description (optionnelle)
- Logo (optionnel)
- Localisation (optionnelle)
- Propriétaire (l'entraîneur COACH qui a créé le club)

**Règles métier:**
- Seul un utilisateur avec le rôle COACH peut créer un club
- Le nom du club doit être unique dans le système
- Un club ne peut être supprimé que par son propriétaire (COACH)
- Un club est toujours associé à un abonnement actif

### 2. Abonnement (Subscription)

Un **Abonnement** définit les capacités et limites d'un club selon le plan choisi. Il gère l'intégration avec le système de paiement Stripe.

**Plans disponibles:**

| Plan | Prix | Nombre d'équipes | Statut | Stripe |
|------|------|------------------|--------|--------|
| **BETA** | Gratuit | Illimité | Beta testers uniquement | ❌ Non |
| **STARTER** | 5€/mois | 1 équipe | Production | ✅ Oui |
| **PRO** | 15€/mois | 5 équipes | Production | ✅ Oui |

**États de l'abonnement:**
- `PENDING`: En attente de confirmation de paiement Stripe
- `ACTIVE`: Abonnement actif et fonctionnel
- `INACTIVE`: Abonnement inactif (période expirée après annulation)
- `CANCELED`: Abonnement annulé
- `PAYMENT_FAILED`: Échec du paiement

**Règles métier:**

**Création d'équipes:**
- Un club peut créer des équipes tant qu'il n'a pas atteint sa limite d'abonnement
- Les abonnements inactifs, annulés ou en échec de paiement ne peuvent pas créer d'équipes
- Le plan BETA permet la création illimitée d'équipes

**Upgrade d'abonnement:**
- Un upgrade est toujours possible vers un plan supérieur (STARTER → PRO)
- Les downgrades ne sont PAS autorisés pour préserver les données
- On ne peut pas "upgrader" vers le même plan actuel
- Les abonnements BETA ne peuvent pas être upgradés (nécessitent une nouvelle souscription)
- Lors d'un upgrade, le changement est immédiat via Stripe

**Annulation:**
- Les abonnements BETA sont annulés immédiatement
- Les abonnements payants restent actifs jusqu'à la fin de la période payée
- Après annulation, l'abonnement passe à `INACTIVE` à la fin de la période

**Réactivation:**
- Un abonnement peut être réactivé après un échec de paiement
- La réactivation annule également tout flag d'annulation en attente

### 3. Invitation

Une **Invitation** est un token unique permettant d'inviter de nouveaux membres à rejoindre le club.

**Types d'invitation:**
- `PLAYER`: Invitation pour un joueur
- `ASSISTANT_COACH`: Invitation pour un assistant entraîneur

**Caractéristiques:**
- Token unique et sécurisé
- Durée de validité: 7 jours par défaut
- Lien de signup personnalisé selon le type:
  - Joueur: `/signup/player?token=xxx`
  - Assistant: `/signup/assistant?token=xxx`
- Créateur: Le COACH ou ASSISTANT_COACH qui a généré l'invitation

**États de l'invitation:**
- `valid`: Invitation non utilisée et non expirée
- `expired`: Invitation expirée (> 7 jours)
- `used`: Invitation déjà utilisée par un utilisateur

**Règles métier:**
- Seuls les COACH et ASSISTANT_COACH peuvent générer des invitations
- Une invitation ne peut être utilisée qu'une seule fois
- Une invitation expirée ne peut plus être utilisée
- Le créateur de l'invitation ne peut pas l'utiliser lui-même
- Après utilisation, l'invitation est marquée avec l'utilisateur qui l'a acceptée

### 4. Membre (Member)

Un **Membre** représente la relation entre un utilisateur et un club avec un rôle spécifique.

**Rôles disponibles:**

| Rôle | Description | Permissions principales |
|------|-------------|------------------------|
| **COACH** | Entraîneur principal | Tous les droits sur le club |
| **ASSISTANT_COACH** | Entraîneur assistant | Gestion équipes et membres |
| **PLAYER** | Joueur | Participation aux activités |

**Hiérarchie des permissions:**

```
COACH (Niveau 3)
├─ Gérer les paramètres du club ✅
├─ Gérer l'abonnement ✅
├─ Supprimer le club ✅
├─ Transférer la propriété ✅
├─ Retirer des membres ✅
├─ Gérer les équipes ✅
└─ Inviter des membres ✅

ASSISTANT_COACH (Niveau 2)
├─ Gérer les paramètres du club ❌
├─ Gérer l'abonnement ❌
├─ Supprimer le club ❌
├─ Transférer la propriété ❌
├─ Retirer des membres ❌
├─ Gérer les équipes ✅
└─ Inviter des membres ✅

PLAYER (Niveau 1)
├─ Gérer les paramètres du club ❌
├─ Gérer l'abonnement ❌
├─ Supprimer le club ❌
├─ Transférer la propriété ❌
├─ Retirer des membres ❌
├─ Gérer les équipes ❌
└─ Inviter des membres ❌
```

**Statut du membre:**
- `ACTIVE`: Membre actif dans le club
- `INACTIVE`: Membre ayant quitté le club (historique)

**Règles métier:**
- Un utilisateur ne peut être membre actif que d'un seul club à la fois
- Le propriétaire du club (COACH créateur) ne peut pas être retiré
- Les joueurs peuvent changer de club (transfert)
- Les COACH et ASSISTANT_COACH doivent d'abord quitter leur club avant d'en rejoindre un autre

## Cas d'Usage Métier

### 1. Création d'un club

**Acteur:** Utilisateur avec rôle COACH

**Flux:**
1. Le COACH crée un club (nom, description, logo, localisation)
2. Le système crée automatiquement un abonnement BETA gratuit
3. Le COACH devient le propriétaire et premier membre du club
4. Le club peut immédiatement créer des équipes (illimité en BETA)

**Règles:**
- Le nom du club doit être unique
- Le COACH devient automatiquement membre avec le rôle COACH

### 2. Souscription à un plan d'abonnement

**Acteur:** COACH du club

**Flux:**
1. Le COACH sélectionne un plan (STARTER ou PRO)
2. Le système redirige vers Stripe Checkout
3. Après paiement, Stripe notifie le système via webhook
4. L'abonnement est créé avec le statut ACTIVE
5. Les limites du plan sont appliquées immédiatement

**Règles:**
- Seul le COACH peut souscrire à un abonnement
- Le paiement est géré par Stripe
- L'abonnement remplace l'abonnement BETA

### 3. Upgrade d'abonnement

**Acteur:** COACH du club

**Flux:**
1. Le COACH demande un upgrade (ex: STARTER → PRO)
2. Le système valide l'upgrade (pas de downgrade)
3. Le système met à jour l'abonnement Stripe
4. Les nouvelles limites s'appliquent immédiatement
5. Le prorata est géré automatiquement par Stripe

**Règles:**
- Seuls les upgrades sont autorisés (pas de downgrade)
- Les abonnements BETA ne peuvent pas être upgradés
- L'upgrade est immédiat sans interruption de service
- Le montant est ajusté au prorata

### 4. Génération d'invitation

**Acteur:** COACH ou ASSISTANT_COACH

**Flux:**
1. L'entraîneur sélectionne le type d'invitation (PLAYER ou ASSISTANT_COACH)
2. Le système génère un token unique sécurisé
3. Le système crée une invitation avec expiration à 7 jours
4. Un lien de signup est généré automatiquement
5. L'entraîneur partage le lien avec la personne à inviter

**Règles:**
- Seuls COACH et ASSISTANT_COACH peuvent créer des invitations
- Chaque invitation a une durée de validité de 7 jours
- Le lien varie selon le type (player vs assistant)

### 5. Acceptation d'invitation

**Acteur:** Nouvel utilisateur (non inscrit)

**Flux:**
1. L'utilisateur clique sur le lien d'invitation
2. Le système valide l'invitation (token, expiration, non utilisée)
3. L'utilisateur s'inscrit via le formulaire approprié
4. Après inscription, l'utilisateur rejoint automatiquement le club
5. Le rôle est attribué selon le type d'invitation
6. L'invitation est marquée comme utilisée

**Règles:**
- L'invitation doit être valide (non expirée, non utilisée)
- Le créateur de l'invitation ne peut pas l'utiliser lui-même
- L'utilisateur devient membre actif du club avec le rôle approprié
- Une invitation ne peut être utilisée qu'une seule fois

### 6. Retrait d'un membre

**Acteur:** COACH du club

**Flux:**
1. Le COACH sélectionne le membre à retirer
2. Le système vérifie que ce n'est pas le propriétaire
3. Le membre est marqué comme INACTIVE
4. Le membre est retiré de toutes les équipes du club
5. Les statistiques du membre sont conservées (historique)

**Règles:**
- Seul le COACH peut retirer des membres
- Le propriétaire du club ne peut pas être retiré
- Les statistiques historiques sont préservées
- Le membre peut rejoindre un autre club par la suite

### 7. Changement de club (Transfert de joueur)

**Acteur:** Joueur (PLAYER)

**Flux:**
1. Le joueur souhaite rejoindre un nouveau club
2. Le système valide l'éligibilité au transfert
3. Le joueur est marqué INACTIVE dans son club actuel
4. Le joueur est retiré de toutes les équipes actuelles
5. Le joueur rejoint le nouveau club avec le rôle PLAYER
6. Les statistiques restent associées au club précédent

**Règles:**
- Seuls les PLAYER peuvent transférer (pas les coaches)
- Le joueur doit être membre actif
- Le joueur ne peut pas transférer vers son club actuel
- Les statistiques restent liées au club d'origine
- Le joueur perd son accès aux équipes du club précédent

### 8. Annulation d'abonnement

**Acteur:** COACH du club

**Flux:**
1. Le COACH demande l'annulation de l'abonnement
2. Pour les plans payants: le système marque l'annulation à la fin de période
3. Pour le plan BETA: l'annulation est immédiate
4. Le club reste fonctionnel jusqu'à la fin de la période payée
5. À la fin de période, l'abonnement passe à INACTIVE

**Règles:**
- Seul le COACH peut annuler l'abonnement
- Les abonnements payants restent actifs jusqu'à la fin de période
- Les abonnements BETA sont annulés immédiatement
- Le club ne peut plus créer d'équipes après expiration

## Services Métier (Domain Services)

### SubscriptionLimitService

Gère la vérification et l'application des limites d'abonnement.

**Responsabilités:**
- Vérifier si un club peut créer une nouvelle équipe
- Calculer le nombre d'équipes restantes disponibles
- Valider la création de N équipes simultanées
- Générer des recommandations d'upgrade
- Calculer le pourcentage d'utilisation du plan

**Règles d'affaires:**
- Un abonnement inactif ne peut créer aucune équipe
- Un plan avec `maxTeams = null` est illimité (BETA)
- Le calcul des équipes restantes: `max(0, maxTeams - currentTeamCount)`
- Recommandation d'upgrade si `remaining === 0` ou `remaining === 1`

### ClubTransferService

Gère le processus de transfert de joueurs entre clubs.

**Responsabilités:**
- Valider l'éligibilité au transfert d'un joueur
- Exécuter le processus de transfert
- Gérer les avertissements et messages de confirmation
- Calculer les jours avant éligibilité (règle: 30 jours minimum)

**Règles d'affaires:**
- Seuls les PLAYER actifs peuvent transférer
- Les COACH et ASSISTANT_COACH ne peuvent pas transférer
- Le joueur est retiré de toutes ses équipes actuelles
- Les statistiques restent associées au club d'origine
- Un délai minimum de 30 jours peut être imposé (extensible)

## Intégrations Externes

### Stripe

Le système s'intègre avec Stripe pour la gestion des paiements et abonnements.

**Flux d'intégration:**

1. **Checkout Session:**
   - Création d'une session de paiement Stripe
   - Redirection vers Stripe Checkout
   - Gestion du succès/échec du paiement

2. **Webhooks:**
   - `checkout.session.completed`: Confirmation du paiement initial
   - `invoice.payment_succeeded`: Renouvellement réussi
   - `invoice.payment_failed`: Échec de paiement
   - `customer.subscription.updated`: Changement d'abonnement
   - `customer.subscription.deleted`: Suppression d'abonnement

3. **Customer Portal:**
   - Gestion des moyens de paiement
   - Consultation des factures
   - Annulation d'abonnement

**Notes:**
- Les webhooks ne sont pas traités en mode BETA
- Chaque club a un `stripeCustomerId` unique
- Les abonnements ont un `stripeSubscriptionId`

## Indicateurs Métier (KPIs)

### Métriques à suivre

1. **Adoption des plans:**
   - Nombre de clubs par plan (BETA, STARTER, PRO)
   - Taux de conversion BETA → Plans payants
   - Taux d'upgrade STARTER → PRO

2. **Santé des abonnements:**
   - Taux de renouvellement mensuel
   - Taux d'annulation (churn)
   - Taux d'échec de paiement

3. **Engagement des clubs:**
   - Nombre moyen d'équipes par plan
   - Utilisation des limites (% de clubs à la limite)
   - Taux d'invitation envoyées vs acceptées

4. **Croissance des membres:**
   - Nombre de membres par club
   - Répartition par rôle (COACH / ASSISTANT / PLAYER)
   - Taux de transfert de joueurs

5. **Conversion des invitations:**
   - Taux d'acceptation des invitations
   - Taux d'expiration des invitations
   - Délai moyen d'acceptation

## Limites et Contraintes Métier

### Contraintes Techniques

1. **Noms de club:**
   - Unique dans tout le système
   - Maximum 100 caractères
   - Ne peut pas être vide

2. **Invitations:**
   - Durée de validité: 7 jours (configurable)
   - Token unique et non réutilisable
   - Lien de signup spécifique au type

3. **Abonnements:**
   - Un seul abonnement actif par club
   - Les prix sont stockés en centimes (EUR)
   - Les dates de période sont gérées par Stripe

### Règles de Gestion

1. **Hiérarchie des rôles:**
   - COACH > ASSISTANT_COACH > PLAYER
   - Les permissions sont cumulatives vers le haut
   - Un rôle ne peut pas gérer un rôle supérieur

2. **Propriété du club:**
   - Le COACH créateur est le propriétaire
   - Le propriétaire ne peut pas être retiré
   - Le propriétaire peut transférer la propriété (future)

3. **Limites d'équipes:**
   - Appliquées strictement lors de la création d'équipe
   - Vérification en temps réel du quota
   - Recommandation d'upgrade automatique

### Contraintes Métier

1. **Un utilisateur, un club actif:**
   - Un utilisateur ne peut être membre actif que d'un seul club
   - Les anciens clubs restent en historique (INACTIVE)
   - Le transfert requiert de quitter l'ancien club

2. **Pas de downgrade:**
   - Protection des données utilisateur
   - Évite la perte d'équipes en cas de downgrade accidentel
   - Seul l'annulation + nouvelle souscription est possible

3. **Persistance des données:**
   - Les statistiques de match restent liées au club d'origine
   - L'historique des membres est conservé
   - Les invitations expirées restent en base (audit)

## Évolutions Futures Possibles

### Court terme
- Notifications par email pour les invitations
- Rappel d'expiration d'invitation (J-2, J-1)
- Dashboard de métriques pour les COACH

### Moyen terme
- Transfert de propriété du club
- Plans d'abonnement personnalisés (Enterprise)
- Gestion des fenêtres de transfert (mercato)
- Multi-clubs pour les joueurs (prêt temporaire)

### Long terme
- Gestion des contrats de joueurs
- Intégration avec fédérations sportives
- Validation des transferts par les deux clubs
- Historique complet des transferts

## Glossaire

- **Bounded Context:** Contexte délimité en DDD, ici le périmètre de gestion des clubs
- **Aggregate:** Entité racine qui garantit la cohérence (ex: Club, Subscription)
- **Value Object:** Objet immuable défini par ses valeurs (ex: ClubRole, InvitationType)
- **Domain Service:** Service qui encapsule une logique métier ne relevant pas d'une seule entité
- **CQRS:** Pattern séparant les opérations d'écriture (Commands) et de lecture (Queries)
- **Stripe:** Plateforme de paiement pour gérer les abonnements et transactions
- **Webhook:** Notification automatique envoyée par Stripe lors d'événements

---

**Document créé le:** 2025-10-20
**Version:** 1.0
**Auteur:** Équipe Technique
**Destination:** Équipes Produit, Marketing, Support Client
