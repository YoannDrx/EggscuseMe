"use client";

import {
  NeoAccordion,
  NeoAccordionContent,
  NeoAccordionItem,
  NeoAccordionTrigger,
  NeoAlert,
  NeoAvatar,
  NeoBadge,
  NeoButton,
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardFooter,
  NeoCardHeader,
  NeoCardTitle,
  NeoCheckbox,
  NeoDivider,
  NeoInput,
  NeoModal,
  NeoProgress,
  NeoRadio,
  NeoRadioGroup,
  NeoSelect,
  NeoSelectItem,
  NeoSkeleton,
  NeoSlider,
  NeoTabs,
  NeoTabsContent,
  NeoTabsList,
  NeoTabsTrigger,
  NeoTitle,
  NeoToast,
  NeoToastContainer,
  NeoToggle,
  NeoTooltip,
} from "@/components/neo";
import { cn } from "@/lib/utils";
import {
  Bell,
  Egg,
  Heart,
  Home,
  Mail,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

// Noop function to avoid ESLint empty function error
const noop = () => undefined;

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-6", className)}>
      <NeoTitle size="lg" underline="solid">
        {title}
      </NeoTitle>
      {children}
    </section>
  );
}

function ComponentRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-neo-text-muted text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

export default function DesignSystemPage() {
  const { theme, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [toggleState, setToggleState] = React.useState(false);
  const [checkboxState, setCheckboxState] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState("option1");
  const [selectValue, setSelectValue] = React.useState("");
  const [sliderValue, setSliderValue] = React.useState(50);
  const [showToast, setShowToast] = React.useState(false);

  return (
    <div className="bg-neo-bg min-h-screen">
      {/* Header */}
      <header className="border-neo-border/20 bg-neo-card sticky top-0 z-50 border-b-[2px]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-neo-accent border-neo-border flex size-10 items-center justify-center rounded-full border-[2px]">
              <Egg className="text-neo-accent-foreground size-5" />
            </div>
            <NeoTitle size="md">Design System Neo</NeoTitle>
          </div>
          <NeoButton
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </NeoButton>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-16 px-6 py-12">
        {/* Introduction */}
        <div className="space-y-4 text-center">
          <NeoTitle size="xl" className="text-neo-text">
            Neo-Soft-Brutalisme
          </NeoTitle>
          <p className="text-neo-text-muted mx-auto max-w-2xl text-lg">
            Une palette de composants UI ludiques et tactiles avec des ombres
            dures, des bordures epaisses et des coins tres arrondis.
          </p>
        </div>

        {/* Buttons */}
        <Section title="Boutons">
          <ComponentRow label="Variantes">
            <NeoButton variant="primary">Primary</NeoButton>
            <NeoButton variant="secondary">Secondary</NeoButton>
            <NeoButton variant="outline">Outline</NeoButton>
            <NeoButton variant="ghost">Ghost</NeoButton>
            <NeoButton variant="destructive">Destructive</NeoButton>
            <NeoButton variant="success">Success</NeoButton>
          </ComponentRow>
          <ComponentRow label="Tailles">
            <NeoButton size="sm">Small</NeoButton>
            <NeoButton size="md">Medium</NeoButton>
            <NeoButton size="lg">Large</NeoButton>
            <NeoButton size="xl">Extra Large</NeoButton>
          </ComponentRow>
          <ComponentRow label="Avec icones">
            <NeoButton variant="primary">
              <Mail size={18} />
              Envoyer
            </NeoButton>
            <NeoButton variant="secondary">
              <Heart size={18} />
              Favoris
            </NeoButton>
            <NeoButton variant="icon" size="icon">
              <Settings size={20} />
            </NeoButton>
            <NeoButton variant="icon" size="icon" rounded="full">
              <Bell size={20} />
            </NeoButton>
          </ComponentRow>
          <ComponentRow label="Etats">
            <NeoButton disabled>Desactive</NeoButton>
            <NeoButton loading>Chargement</NeoButton>
          </ComponentRow>
        </Section>

        {/* Cards */}
        <Section title="Cartes">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <NeoCard variant="default">
              <NeoCardHeader>
                <NeoCardTitle>Carte Default</NeoCardTitle>
                <NeoCardDescription>
                  Une carte simple avec ombre subtile.
                </NeoCardDescription>
              </NeoCardHeader>
              <NeoCardContent>
                <p className="text-neo-text-muted">Contenu de la carte ici.</p>
              </NeoCardContent>
              <NeoCardFooter>
                <NeoButton size="sm">Action</NeoButton>
              </NeoCardFooter>
            </NeoCard>

            <NeoCard variant="elevated">
              <NeoCardHeader>
                <NeoCardTitle>Carte Elevated</NeoCardTitle>
                <NeoCardDescription>
                  Avec une ombre plus prononcee.
                </NeoCardDescription>
              </NeoCardHeader>
              <NeoCardContent>
                <p className="text-neo-text-muted">
                  Parfait pour mettre en avant.
                </p>
              </NeoCardContent>
            </NeoCard>

            <NeoCard variant="interactive">
              <NeoCardHeader>
                <NeoCardTitle>Carte Interactive</NeoCardTitle>
                <NeoCardDescription>
                  Effet au survol et au clic.
                </NeoCardDescription>
              </NeoCardHeader>
              <NeoCardContent>
                <p className="text-neo-text-muted">Cliquez-moi !</p>
              </NeoCardContent>
            </NeoCard>

            <NeoCard variant="accent">
              <NeoCardHeader>
                <NeoCardTitle>Carte Accent</NeoCardTitle>
                <NeoCardDescription>
                  Avec la couleur d accent.
                </NeoCardDescription>
              </NeoCardHeader>
            </NeoCard>

            <NeoCard variant="dashed">
              <NeoCardHeader>
                <NeoCardTitle>Carte Dashed</NeoCardTitle>
                <NeoCardDescription>Bordure en pointilles.</NeoCardDescription>
              </NeoCardHeader>
            </NeoCard>

            <NeoCard variant="outline">
              <NeoCardHeader>
                <NeoCardTitle>Carte Outline</NeoCardTitle>
                <NeoCardDescription>
                  Sans ombre, juste la bordure.
                </NeoCardDescription>
              </NeoCardHeader>
            </NeoCard>
          </div>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <div className="grid max-w-xl gap-6">
            <NeoInput
              label="Email"
              placeholder="nom@exemple.com"
              type="email"
            />
            <NeoInput
              label="Recherche"
              placeholder="Rechercher..."
              icon={<Search size={18} />}
            />
            <NeoInput
              label="Avec erreur"
              placeholder="Entrez votre nom"
              error
              errorMessage="Ce champ est requis"
            />
            <NeoInput label="Desactive" placeholder="Non modifiable" disabled />
          </div>
        </Section>

        {/* Toggle */}
        <Section title="Toggle">
          <ComponentRow label="Etats">
            <div className="flex items-center gap-3">
              <NeoToggle
                checked={toggleState}
                onCheckedChange={setToggleState}
              />
              <span className="text-neo-text">
                {toggleState ? "Active" : "Inactif"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <NeoToggle checked={true} onCheckedChange={noop} disabled />
              <span className="text-neo-text-muted">Desactive (on)</span>
            </div>
            <div className="flex items-center gap-3">
              <NeoToggle checked={false} onCheckedChange={noop} disabled />
              <span className="text-neo-text-muted">Desactive (off)</span>
            </div>
          </ComponentRow>
        </Section>

        {/* Badges */}
        <Section title="Badges">
          <ComponentRow label="Variantes">
            <NeoBadge variant="default">Default</NeoBadge>
            <NeoBadge variant="success">Success</NeoBadge>
            <NeoBadge variant="warning">Warning</NeoBadge>
            <NeoBadge variant="destructive">Destructive</NeoBadge>
            <NeoBadge variant="secondary">Secondary</NeoBadge>
          </ComponentRow>
          <ComponentRow label="Fraicheur des oeufs">
            <NeoBadge variant="fresh-extra">Extra-frais (0-9j)</NeoBadge>
            <NeoBadge variant="fresh">Frais (10-21j)</NeoBadge>
            <NeoBadge variant="fresh-cook">A cuire (22-28j)</NeoBadge>
            <NeoBadge variant="expired">Perime (+28j)</NeoBadge>
          </ComponentRow>
          <ComponentRow label="Avec rotation (sticker)">
            <NeoBadge variant="success" rotate>
              Nouveau
            </NeoBadge>
            <NeoBadge variant="warning" rotate>
              Promo
            </NeoBadge>
            <NeoBadge variant="destructive" rotate>
              Urgent
            </NeoBadge>
          </ComponentRow>
        </Section>

        {/* Modal */}
        <Section title="Modal">
          <NeoButton onClick={() => setIsModalOpen(true)}>
            Ouvrir la Modal
          </NeoButton>
          <NeoModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title="Titre de la Modal"
          >
            <div className="space-y-4">
              <p className="text-neo-text-muted">
                Ceci est le contenu de la modal. Elle apparait avec une
                animation slide-up et une legere rotation.
              </p>
              <NeoInput label="Votre nom" placeholder="Jean Dupont" />
              <div className="flex justify-end gap-3">
                <NeoButton
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </NeoButton>
                <NeoButton onClick={() => setIsModalOpen(false)}>
                  Confirmer
                </NeoButton>
              </div>
            </div>
          </NeoModal>
        </Section>

        {/* Typography */}
        <Section title="Typographie">
          <div className="space-y-4">
            <NeoTitle size="xl">Titre XL - Display</NeoTitle>
            <NeoTitle size="lg">Titre LG - Heading</NeoTitle>
            <NeoTitle size="md">Titre MD - Subheading</NeoTitle>
            <NeoTitle size="sm">Titre SM - Caption</NeoTitle>
          </div>
          <div className="space-y-4">
            <NeoTitle size="lg" underline="solid">
              Avec soulignement solid
            </NeoTitle>
            <NeoTitle size="lg" underline="dashed">
              Avec soulignement dashed
            </NeoTitle>
          </div>
        </Section>

        {/* Form Components */}
        <Section title="Composants de Formulaire">
          <div className="grid max-w-xl gap-8">
            {/* Checkbox */}
            <div className="space-y-3">
              <p className="text-neo-text font-medium">Checkbox</p>
              <NeoCheckbox
                checked={checkboxState}
                onCheckedChange={setCheckboxState}
                label="J accepte les conditions"
              />
              <NeoCheckbox
                checked={true}
                onCheckedChange={noop}
                disabled
                label="Desactive (coche)"
              />
              <NeoCheckbox
                checked={false}
                onCheckedChange={noop}
                disabled
                label="Desactive (non coche)"
              />
            </div>

            {/* Radio */}
            <div className="space-y-3">
              <p className="text-neo-text font-medium">Radio Group</p>
              <NeoRadioGroup value={radioValue} onValueChange={setRadioValue}>
                <NeoRadio value="option1" label="Option 1" />
                <NeoRadio value="option2" label="Option 2" />
                <NeoRadio value="option3" label="Option 3" disabled />
              </NeoRadioGroup>
            </div>

            {/* Select */}
            <div className="space-y-3">
              <p className="text-neo-text font-medium">Select</p>
              <NeoSelect
                value={selectValue}
                onValueChange={setSelectValue}
                placeholder="Choisir une option"
                label="Categorie"
              >
                <NeoSelectItem value="eggs">Oeufs</NeoSelectItem>
                <NeoSelectItem value="recipes">Recettes</NeoSelectItem>
                <NeoSelectItem value="tips">Astuces</NeoSelectItem>
              </NeoSelect>
            </div>

            {/* Slider */}
            <div className="space-y-3">
              <p className="text-neo-text font-medium">
                Slider: {sliderValue}%
              </p>
              <NeoSlider
                value={sliderValue}
                onValueChange={setSliderValue}
                min={0}
                max={100}
              />
            </div>
          </div>
        </Section>

        {/* Alerts */}
        <Section title="Alertes">
          <div className="space-y-4">
            <NeoAlert variant="info" title="Information">
              Vos oeufs sont stockes de maniere optimale.
            </NeoAlert>
            <NeoAlert variant="success" title="Succes">
              Boite d oeufs ajoutee avec succes !
            </NeoAlert>
            <NeoAlert variant="warning" title="Attention">
              Certains oeufs arrivent bientot a expiration.
            </NeoAlert>
            <NeoAlert variant="destructive" title="Erreur">
              Impossible de synchroniser vos donnees.
            </NeoAlert>
          </div>
        </Section>

        {/* Progress */}
        <Section title="Barres de Progression">
          <div className="max-w-xl space-y-6">
            <div className="space-y-2">
              <p className="text-neo-text-muted text-sm">Default (25%)</p>
              <NeoProgress value={25} />
            </div>
            <div className="space-y-2">
              <p className="text-neo-text-muted text-sm">Success (50%)</p>
              <NeoProgress value={50} color="success" />
            </div>
            <div className="space-y-2">
              <p className="text-neo-text-muted text-sm">Warning (75%)</p>
              <NeoProgress value={75} color="warning" />
            </div>
            <div className="space-y-2">
              <p className="text-neo-text-muted text-sm">Destructive (90%)</p>
              <NeoProgress value={90} color="destructive" />
            </div>
            <div className="space-y-2">
              <p className="text-neo-text-muted text-sm">Avec etiquette</p>
              <NeoProgress value={65} showValue />
            </div>
          </div>
        </Section>

        {/* Tooltip */}
        <Section title="Tooltips">
          <ComponentRow label="Positions">
            <NeoTooltip content="Tooltip en haut" side="top">
              <NeoButton variant="outline">Top</NeoButton>
            </NeoTooltip>
            <NeoTooltip content="Tooltip en bas" side="bottom">
              <NeoButton variant="outline">Bottom</NeoButton>
            </NeoTooltip>
            <NeoTooltip content="Tooltip a gauche" side="left">
              <NeoButton variant="outline">Left</NeoButton>
            </NeoTooltip>
            <NeoTooltip content="Tooltip a droite" side="right">
              <NeoButton variant="outline">Right</NeoButton>
            </NeoTooltip>
          </ComponentRow>
        </Section>

        {/* Toast */}
        <Section title="Toast">
          <NeoButton onClick={() => setShowToast(true)}>
            Afficher un Toast
          </NeoButton>
          <NeoToastContainer position="bottom-right">
            {showToast && (
              <NeoToast
                variant="success"
                title="Succes !"
                description="L operation a ete effectuee avec succes."
                onClose={() => setShowToast(false)}
                duration={3000}
              />
            )}
          </NeoToastContainer>
        </Section>

        {/* Tabs */}
        <Section title="Onglets">
          <NeoTabs defaultValue="tab1">
            <NeoTabsList>
              <NeoTabsTrigger value="tab1">Apercu</NeoTabsTrigger>
              <NeoTabsTrigger value="tab2">Details</NeoTabsTrigger>
              <NeoTabsTrigger value="tab3">Parametres</NeoTabsTrigger>
            </NeoTabsList>
            <NeoTabsContent value="tab1">
              <NeoCard>
                <NeoCardContent className="pt-6">
                  <p className="text-neo-text-muted">
                    Contenu de l onglet Apercu. L animation de transition est
                    fluide grace a Framer Motion.
                  </p>
                </NeoCardContent>
              </NeoCard>
            </NeoTabsContent>
            <NeoTabsContent value="tab2">
              <NeoCard>
                <NeoCardContent className="pt-6">
                  <p className="text-neo-text-muted">
                    Contenu de l onglet Details. Chaque onglet peut contenir n
                    importe quel contenu.
                  </p>
                </NeoCardContent>
              </NeoCard>
            </NeoTabsContent>
            <NeoTabsContent value="tab3">
              <NeoCard>
                <NeoCardContent className="pt-6">
                  <p className="text-neo-text-muted">
                    Contenu de l onglet Parametres. L indicateur suit la
                    selection avec une animation spring.
                  </p>
                </NeoCardContent>
              </NeoCard>
            </NeoTabsContent>
          </NeoTabs>
        </Section>

        {/* Accordion */}
        <Section title="Accordeon">
          <NeoAccordion type="single" defaultValue="item-1">
            <NeoAccordionItem value="item-1">
              <NeoAccordionTrigger>
                Comment conserver mes oeufs ?
              </NeoAccordionTrigger>
              <NeoAccordionContent>
                Conservez vos oeufs au refrigerateur, pointe vers le bas, dans
                leur boite d origine. Ils se gardent jusqu a 28 jours apres la
                date de ponte.
              </NeoAccordionContent>
            </NeoAccordionItem>
            <NeoAccordionItem value="item-2">
              <NeoAccordionTrigger>
                Comment savoir si un oeuf est frais ?
              </NeoAccordionTrigger>
              <NeoAccordionContent>
                Plongez l oeuf dans un verre d eau. S il coule, il est frais. S
                il flotte, il n est plus bon. S il reste au milieu, consommez-le
                rapidement.
              </NeoAccordionContent>
            </NeoAccordionItem>
            <NeoAccordionItem value="item-3">
              <NeoAccordionTrigger>
                Quelle cuisson pour quel oeuf ?
              </NeoAccordionTrigger>
              <NeoAccordionContent>
                Les oeufs extra-frais (0-9j) sont parfaits pour les preparations
                crues. Les oeufs frais (10-21j) conviennent a toutes les
                cuissons. Au-dela, preferez les oeufs durs.
              </NeoAccordionContent>
            </NeoAccordionItem>
          </NeoAccordion>
        </Section>

        {/* Divider */}
        <Section title="Separateurs">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-neo-text-muted text-sm">Solid</p>
              <NeoDivider variant="solid" />
            </div>
            <div className="space-y-4">
              <p className="text-neo-text-muted text-sm">Dashed</p>
              <NeoDivider variant="dashed" />
            </div>
            <div className="space-y-4">
              <p className="text-neo-text-muted text-sm">Dotted</p>
              <NeoDivider variant="dotted" />
            </div>
            <div className="space-y-4">
              <p className="text-neo-text-muted text-sm">Avec label</p>
              <NeoDivider label="ou" />
            </div>
            <div className="space-y-4">
              <p className="text-neo-text-muted text-sm">Avec icone</p>
              <NeoDivider icon={<Egg size={16} />} label="Oeufs" />
            </div>
          </div>
        </Section>

        {/* Avatar */}
        <Section title="Avatars">
          <ComponentRow label="Tailles">
            <NeoAvatar size="xs" fallback="JD" />
            <NeoAvatar size="sm" fallback="JD" />
            <NeoAvatar size="md" fallback="JD" />
            <NeoAvatar size="lg" fallback="JD" />
            <NeoAvatar size="xl" fallback="JD" />
            <NeoAvatar size="2xl" fallback="JD" />
          </ComponentRow>
          <ComponentRow label="Formes">
            <NeoAvatar shape="circle" fallback="AB" />
            <NeoAvatar shape="rounded" fallback="CD" />
            <NeoAvatar shape="square" fallback="EF" />
          </ComponentRow>
          <ComponentRow label="Avec statut">
            <NeoAvatar fallback="ON" status="online" />
            <NeoAvatar fallback="AW" status="away" />
            <NeoAvatar fallback="BS" status="busy" />
            <NeoAvatar fallback="OF" status="offline" />
          </ComponentRow>
        </Section>

        {/* Skeleton */}
        <Section title="Skeletons">
          <div className="grid gap-6 sm:grid-cols-2">
            <NeoCard>
              <NeoCardHeader>
                <NeoCardTitle>Chargement de carte</NeoCardTitle>
              </NeoCardHeader>
              <NeoCardContent>
                <div className="space-y-4">
                  <NeoSkeleton variant="rectangular" className="h-32 w-full" />
                  <NeoSkeleton variant="text" className="w-3/4" />
                  <NeoSkeleton variant="text" className="w-1/2" />
                </div>
              </NeoCardContent>
            </NeoCard>
            <NeoCard>
              <NeoCardHeader>
                <NeoCardTitle>Chargement d avatar</NeoCardTitle>
              </NeoCardHeader>
              <NeoCardContent>
                <div className="flex items-center gap-4">
                  <NeoSkeleton variant="circular" className="size-12" />
                  <div className="flex-1 space-y-2">
                    <NeoSkeleton variant="text" className="w-32" />
                    <NeoSkeleton variant="text" className="w-24" />
                  </div>
                </div>
              </NeoCardContent>
            </NeoCard>
          </div>
        </Section>

        {/* Color Palette */}
        <Section title="Palette de Couleurs">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="bg-neo-accent border-neo-border h-20 rounded-xl border-[2px]" />
              <p className="text-neo-text text-sm font-medium">Accent</p>
              <p className="text-neo-text-muted text-xs">--neo-accent</p>
            </div>
            <div className="space-y-2">
              <div className="bg-neo-bg border-neo-border h-20 rounded-xl border-[2px]" />
              <p className="text-neo-text text-sm font-medium">Background</p>
              <p className="text-neo-text-muted text-xs">--neo-bg</p>
            </div>
            <div className="space-y-2">
              <div className="bg-neo-card border-neo-border h-20 rounded-xl border-[2px]" />
              <p className="text-neo-text text-sm font-medium">Card</p>
              <p className="text-neo-text-muted text-xs">--neo-card</p>
            </div>
            <div className="space-y-2">
              <div className="bg-neo-border h-20 rounded-xl" />
              <p className="text-neo-text text-sm font-medium">Border</p>
              <p className="text-neo-text-muted text-xs">--neo-border</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <div className="bg-fresh-extra h-12 rounded-xl" />
              <p className="text-neo-text text-sm font-medium">Extra-frais</p>
            </div>
            <div className="space-y-2">
              <div className="bg-fresh h-12 rounded-xl" />
              <p className="text-neo-text text-sm font-medium">Frais</p>
            </div>
            <div className="space-y-2">
              <div className="bg-fresh-cook h-12 rounded-xl" />
              <p className="text-neo-text text-sm font-medium">A cuire</p>
            </div>
            <div className="space-y-2">
              <div className="bg-expired h-12 rounded-xl" />
              <p className="text-neo-text text-sm font-medium">Perime</p>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="border-neo-border/20 border-t-[2px] pt-8">
          <div className="flex items-center justify-between">
            <p className="text-neo-text-muted text-sm">
              Design System Neo-Soft-Brutalisme pour EggscuseMe
            </p>
            <div className="flex items-center gap-2">
              <NeoButton variant="ghost" size="icon">
                <Home size={18} />
              </NeoButton>
              <NeoButton variant="ghost" size="icon">
                <User size={18} />
              </NeoButton>
              <NeoButton variant="ghost" size="icon">
                <Settings size={18} />
              </NeoButton>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
