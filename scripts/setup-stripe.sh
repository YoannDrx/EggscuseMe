#!/bin/bash

# =============================================================================
# EggscuseMe - Script de configuration Stripe automatique
# =============================================================================
# Ce script configure automatiquement :
# - Le produit EggscuseMe Premium
# - Les prix mensuel (2.99€) et annuel (29.99€)
# - Met à jour le fichier .env avec les IDs
# =============================================================================

set -e

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  EggscuseMe - Setup Stripe${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Vérifier que Stripe CLI est installé
if ! command -v stripe &> /dev/null; then
    echo -e "${RED}Erreur: Stripe CLI n'est pas installé.${NC}"
    echo "Installez-le avec: brew install stripe/stripe-cli/stripe"
    exit 1
fi

# Vérifier la connexion Stripe
echo -e "${YELLOW}Vérification de la connexion Stripe...${NC}"
if ! stripe config --list &> /dev/null; then
    echo -e "${RED}Vous n'êtes pas connecté à Stripe.${NC}"
    echo "Exécutez d'abord: stripe login"
    exit 1
fi

# Obtenir les clés API
echo -e "${YELLOW}Récupération des clés API...${NC}"
STRIPE_CONFIG=$(stripe config --list 2>/dev/null)

# Extraire les clés test
STRIPE_SECRET_KEY=$(echo "$STRIPE_CONFIG" | grep "test_mode_api_key" | cut -d "'" -f 2)
STRIPE_PUBLISHABLE_KEY=$(echo "$STRIPE_CONFIG" | grep "test_mode_pub_key" | cut -d "'" -f 2)

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo -e "${RED}Impossible de récupérer la clé secrète Stripe.${NC}"
    echo "Veuillez vous reconnecter: stripe login"
    exit 1
fi

echo -e "${GREEN}Clés API récupérées !${NC}"

# Vérifier si le produit existe déjà
echo ""
echo -e "${YELLOW}Recherche d'un produit existant...${NC}"
EXISTING_PRODUCT=$(stripe products list --limit 100 2>/dev/null | grep -A5 '"name": "EggscuseMe Premium"' | head -1 || true)

if [ -n "$EXISTING_PRODUCT" ]; then
    echo -e "${YELLOW}Un produit EggscuseMe Premium existe déjà.${NC}"
    PRODUCT_ID=$(stripe products list --limit 100 2>/dev/null | grep -B10 '"name": "EggscuseMe Premium"' | grep '"id":' | head -1 | cut -d '"' -f 4)
    echo "Product ID: $PRODUCT_ID"
else
    # Créer le produit
    echo ""
    echo -e "${YELLOW}Création du produit EggscuseMe Premium...${NC}"
    PRODUCT_RESPONSE=$(stripe products create \
        --name="EggscuseMe Premium" \
        --description="Boîtes illimitées, notifications personnalisées, historique complet" \
        --metadata[app]="eggscuseme" \
        2>/dev/null)

    PRODUCT_ID=$(echo "$PRODUCT_RESPONSE" | grep '"id":' | head -1 | cut -d '"' -f 4)
    echo -e "${GREEN}Produit créé: $PRODUCT_ID${NC}"
fi

# Vérifier si les prix existent déjà
echo ""
echo -e "${YELLOW}Vérification des prix existants...${NC}"
EXISTING_MONTHLY=$(stripe prices list --product="$PRODUCT_ID" --limit 10 2>/dev/null | grep -B5 '"unit_amount": 299' | grep '"id":' | head -1 | cut -d '"' -f 4 || true)
EXISTING_YEARLY=$(stripe prices list --product="$PRODUCT_ID" --limit 10 2>/dev/null | grep -B5 '"unit_amount": 2999' | grep '"id":' | head -1 | cut -d '"' -f 4 || true)

# Créer le prix mensuel si nécessaire
if [ -n "$EXISTING_MONTHLY" ]; then
    MONTHLY_PRICE_ID="$EXISTING_MONTHLY"
    echo -e "${YELLOW}Prix mensuel existant: $MONTHLY_PRICE_ID${NC}"
else
    echo ""
    echo -e "${YELLOW}Création du prix mensuel (2.99€/mois)...${NC}"
    MONTHLY_RESPONSE=$(stripe prices create \
        --product="$PRODUCT_ID" \
        --unit-amount=299 \
        --currency=eur \
        --recurring[interval]=month \
        --metadata[plan]="premium" \
        --metadata[billing]="monthly" \
        2>/dev/null)

    MONTHLY_PRICE_ID=$(echo "$MONTHLY_RESPONSE" | grep '"id":' | head -1 | cut -d '"' -f 4)
    echo -e "${GREEN}Prix mensuel créé: $MONTHLY_PRICE_ID${NC}"
fi

# Créer le prix annuel si nécessaire
if [ -n "$EXISTING_YEARLY" ]; then
    YEARLY_PRICE_ID="$EXISTING_YEARLY"
    echo -e "${YELLOW}Prix annuel existant: $YEARLY_PRICE_ID${NC}"
else
    echo ""
    echo -e "${YELLOW}Création du prix annuel (29.99€/an)...${NC}"
    YEARLY_RESPONSE=$(stripe prices create \
        --product="$PRODUCT_ID" \
        --unit-amount=2999 \
        --currency=eur \
        --recurring[interval]=year \
        --metadata[plan]="premium" \
        --metadata[billing]="yearly" \
        2>/dev/null)

    YEARLY_PRICE_ID=$(echo "$YEARLY_RESPONSE" | grep '"id":' | head -1 | cut -d '"' -f 4)
    echo -e "${GREEN}Prix annuel créé: $YEARLY_PRICE_ID${NC}"
fi

# Mettre à jour le fichier .env
echo ""
echo -e "${YELLOW}Mise à jour du fichier .env...${NC}"

ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Fichier .env non trouvé !${NC}"
    exit 1
fi

# Fonction pour mettre à jour une variable dans .env
update_env() {
    local key=$1
    local value=$2
    if grep -q "^${key}=" "$ENV_FILE"; then
        # macOS sed syntax
        sed -i '' "s|^${key}=.*|${key}=\"${value}\"|" "$ENV_FILE"
    else
        echo "${key}=\"${value}\"" >> "$ENV_FILE"
    fi
}

update_env "STRIPE_SECRET_KEY" "$STRIPE_SECRET_KEY"
update_env "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "$STRIPE_PUBLISHABLE_KEY"
update_env "STRIPE_PREMIUM_PLAN_ID" "$MONTHLY_PRICE_ID"
update_env "STRIPE_PREMIUM_YEARLY_PLAN_ID" "$YEARLY_PRICE_ID"

echo -e "${GREEN}Fichier .env mis à jour !${NC}"

# Résumé
echo ""
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Configuration terminée !${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""
echo -e "${GREEN}Variables configurées :${NC}"
echo "  STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY:0:20}..."
echo "  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${STRIPE_PUBLISHABLE_KEY:0:20}..."
echo "  STRIPE_PREMIUM_PLAN_ID: $MONTHLY_PRICE_ID"
echo "  STRIPE_PREMIUM_YEARLY_PLAN_ID: $YEARLY_PRICE_ID"
echo ""
echo -e "${YELLOW}Pour configurer le webhook local, exécutez dans un autre terminal :${NC}"
echo "  stripe listen --forward-to localhost:3000/api/webhooks/stripe"
echo ""
echo "Puis copiez le webhook secret (whsec_...) dans STRIPE_WEBHOOK_SECRET de votre .env"
echo ""
echo -e "${GREEN}Configuration Stripe terminée avec succès !${NC}"
