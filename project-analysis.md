# Analyse du projet EggscuseMe

## Compréhension globale
- App Next.js 15 (App Router) en TypeScript strict avec Tailwind v4 et design system maison “Sunny Side UI” (`app/globals.css`). i18n via next-intl (fr par défaut), state côté client limité (Zustand pour le frigo courant, TanStack Query pour les données côté client ponctuelles).
- Authentification Better Auth, Prisma PostgreSQL, Resend pour l’emailing, Stripe prévu pour la facturation. Architecture multi-tenant simplifiée : 1 frigo par utilisateur + invités via liens de partage.
- Domaine : suivi de boîtes d’œufs, calcul de fraîcheur, recommandations recettes/minuteur, stats anti-gaspi, partage familial et notifications d’expiration.

## Fonctionnalités existantes (principales)
- **Frigo & boîtes** : CRUD + consommation avec règles de plan (2 boîtes max en gratuit) via `src/features/fridge/fridge.action.ts` et UI `app/(logged-in)/fridge/page.tsx` + `egg-box-grid.tsx`. Calcul fraîcheur/indicatifs couleur dans `src/features/eggs/lib/freshness-calculator.ts`.
- **Recommandations & recettes** : suggestions basées sur fraîcheur et urgences dans `app/(logged-in)/fridge/recipes/page.tsx` avec logique `src/features/recipes/get-suggestions.ts` et dataset `recipes-data.ts`.
- **Minuteur intelligent** : minuteur interactif avec ajustements taille/température/texture (`src/features/timer/egg-timer.tsx`, page `app/(logged-in)/fridge/timer/page.tsx`).
- **Partage** : liens d’invitation, gestion des membres, jointure invité, bannière propriétaire/invité dans la sidebar (`src/features/fridge/sharing.action.ts`, UI `app/(logged-in)/fridge/settings/sharing/page.tsx`, route join `app/(logged-in)/join/[code]/page.tsx`).
- **Stats & anti-gaspi** : cartes récapitulatives (œufs suivis, extra-frais, consommés, économies estimées) `app/(logged-in)/fridge/fridge-stats-cards.tsx`.
- **Notifications d’expiration** : détection quotidienne + envoi email (Resend) `src/features/notifications/*`, déclenchée par route CRON `app/api/cron/expiration-check/route.ts`.
- **Scanner code-barres** : expérimental via BarcodeDetector API avec parsing des codes/lot (`src/features/scanner/barcode-scanner.tsx` + `lot-code-parser.ts`), utilisé dans le formulaire d’ajout `add-egg-box-form.tsx`.
- **Landing & pricing** : page marketing riche `app/page.tsx`, section pricing `src/features/plans/pricing-section.tsx` (plans encore génériques).

## Points manquants / dettes notables
- **Abonnement non branché** : UI “Premium” statique, Stripe checkout/portal absents (`app/(logged-in)/fridge/settings/billing/page.tsx` TODO). `src/lib/auth/stripe/auth-plans.ts` contient des limites génériques (projects/storage) qui ne reflètent pas le produit (boîtes, notifications…).
- **Paramètres frigo incomplets** : changement de nom et suppression du frigo non implémentés (`app/(logged-in)/fridge/settings/page.tsx` TODO). Pas de page pour préférences de notifications anti-gaspi (seulement actions côté serveur).
- **Actions doublonnées** : deux modules pour les boîtes (`src/features/eggs/egg-box.action.ts` et `src/features/fridge/fridge.action.ts`) avec logique proche mais divergente (limites, accès). Risque de maintenance et d’incohérences.
- **Thème** : design notes annoncent dark par défaut, mais `app/providers.tsx` fixe `defaultTheme="light"`. Tokens light/dark présents, cohérence à trancher.
- **Cron/ops** : route CRON en place mais aucune config `vercel.json`/scheduler versionnée ; prévoir la mise en place + secret `CRON_SECRET`.
- **Tests** : peu/pas de tests métiers (fraîcheur, notifications, sharing). Terrain propice à des tests unitaires/vitest sur le calcul de fraîcheur et les limites de plan.
- **Redirection landing** : `SiteConfig.features.enableLandingRedirection` annoncé mais pas utilisé (pas de `middleware.ts` correspondant).

## Idées de nouvelles features avec pistes d’implémentation
1) **Historique & journal de consommation**
   - Stockage déjà présent (`egg_consumption`). Ajouter page “Historique” (menu Frigo) listant consommations + filtres (type de cuisson, période). Server action de listing paginé, UI en cartes/timeline. Permettra aussi des stats plus fines (goût, source).
2) **Checklist courses & prédiction de pénurie**
   - Calculer seuil (ex: <4 œufs restants ou expiration <5j) et proposer “À acheter” avec export ou envoi email. Action côté serveur s’appuyant sur `eggBox.remaining` + `calculateFreshness`; UI badge dans `egg-box-grid.tsx` et nouvelle section “Courses” dans `settings` ou `fridge`.
3) **Notifications enrichies (push + in-app)**
   - Ajouter préférences dans UI (slider `notifyDaysBefore`, toggle push) et stocker dans `user_preferences`. Implémenter Web Push (Service Worker + VAPID) et/ou sonner toast planifié côté client (TanStack Query + background refetch). Étendre email `ExpirationWarningEmail` avec recettes urgentes.
4) **Planification repas / recettes guidées**
   - Sélecteur de boîte -> propose recettes compatibles (fraîcheur + quantité) et crée “plan repas” avec rappel calendrier. Ajouter modèle Prisma `PlannedMeal` (boxId, recipeId, date). UI côté `recipes/page.tsx` avec bouton “Planifier” qui ouvre un dialog.
5) **Amélioration scanner & saisie rapide**
   - Ajouter fallback manuel: détecter le lot/code imprimé (format EU 0FR123...). Enrichir `lot-code-parser.ts` pour estimer date de ponte à partir du code lot + pays. Pré-remplir `CreateEggBoxSchema` avec `barcode`/`source`.

## Recos UI/UX
- Clarifier la hiérarchie “Urgent” : mettre un onglet/filtre “À consommer vite” et badge dans la sidebar pour les boîtes `daysRemaining <= 3` (`egg-box-grid.tsx` calc déjà là).
- Ajouter un onboarding dans le frigo vide (CTA scanner + vidéo GIF) et indiquer le plafond du plan gratuit directement sur le bouton “Ajouter”.
- Harmoniser le thème (décider light vs dark par défaut) et réduire l’usage de blobs/gradients sur la landing si on suit les design notes sobres.
- Surface “Notifications” et “Abonnement” dans la navigation (actuellement caché derrière Paramètres) avec états plus explicites (ex: bandeau “Premium verrouillé” sur actions qui dépassent la limite).
- Accessibilité : vérifier contrastes des badges fraîcheur (notamment `bg-fresh` sur fond clair), ajouter labels/aria pour le scanner et les sélecteurs du minuteur.

## Chantiers techniques rapides
- Dédupliquer les actions boîtes en centralisant dans `src/features/fridge/fridge.action.ts` ou en supprimant l’ancienne version `src/features/eggs/egg-box.action.ts`.
- Brancher réellement Stripe : créer endpoints checkout/session + portal, stocker `stripeSubscriptionId`/status dans `user_subscription`, et rafraîchir `useCurrentFridge.isPremium`.
- Ajouter tests unitaires pour `calculateFreshness`, `getRecipeSuggestions` et les limites de consommation (quantités négatives, boîtes invitées).
- Versionner la config CRON (Vercel/cron) et documenter les variables (`CRON_SECRET`, `RESEND_AUDIENCE_ID`, `STRIPE_*`).
