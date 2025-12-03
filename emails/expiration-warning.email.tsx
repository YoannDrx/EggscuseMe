import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type ExpiringEgg = {
  name: string;
  daysLeft: number;
  quantity: number;
};

type ExpirationWarningEmailProps = {
  userName: string;
  eggs: ExpiringEgg[];
  organizationName: string;
  organizationSlug: string;
};

export default function ExpirationWarningEmail({
  userName = "Chef",
  eggs = [
    { name: "Ferme du Coin", daysLeft: 2, quantity: 4 },
    { name: "Marché bio", daysLeft: 3, quantity: 6 },
  ],
  organizationName = "Mon Frigo",
  organizationSlug = "mon-frigo",
}: ExpirationWarningEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const fridgeUrl = `${baseUrl}/orgs/${organizationSlug}`;
  const totalEggs = eggs.reduce((sum, egg) => sum + egg.quantity, 0);

  return (
    <Html>
      <Head />
      <Preview>
        {`${totalEggs} oeufs vont bientôt expirer dans ${organizationName}`}
      </Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-[#FDFBF7] font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded-xl border border-solid border-[#FFC800] bg-white p-8">
            {/* Header with logo */}
            <Section className="text-center">
              <Img
                src={`${baseUrl}${SiteConfig.appIcon}`}
                width={48}
                height={48}
                alt={`${SiteConfig.title}'s logo`}
                className="mx-auto"
              />
              <Heading className="mx-0 my-4 text-2xl font-bold text-[#2D2D2D]">
                Alerte Fraîcheur
              </Heading>
            </Section>

            <Hr className="my-4 border-[#FFC800]/30" />

            {/* Greeting */}
            <Text className="text-base text-[#2D2D2D]">
              Bonjour {userName},
            </Text>

            <Text className="text-base text-[#2D2D2D]">
              Certains oeufs de votre frigo <strong>{organizationName}</strong>{" "}
              arrivent bientôt à expiration. Il est temps de les cuisiner !
            </Text>

            {/* Eggs list */}
            <Section className="my-6 rounded-lg bg-[#FFC800]/10 p-4">
              <Heading className="m-0 mb-3 text-lg font-semibold text-[#2D2D2D]">
                Oeufs à consommer rapidement :
              </Heading>
              {eggs.map((egg) => (
                <Section
                  key={egg.name}
                  className="mb-2 rounded-md bg-white p-3"
                  style={{
                    borderLeft: `4px solid ${egg.daysLeft <= 1 ? "#EF4444" : egg.daysLeft <= 3 ? "#F97316" : "#FFC800"}`,
                  }}
                >
                  <Text className="m-0 text-sm font-medium text-[#2D2D2D]">
                    {egg.name || "Boîte d'oeufs"}
                  </Text>
                  <Text className="m-0 text-sm text-[#666666]">
                    {egg.quantity} oeufs restants •{" "}
                    <strong
                      style={{
                        color:
                          egg.daysLeft <= 1
                            ? "#EF4444"
                            : egg.daysLeft <= 3
                              ? "#F97316"
                              : "#2D2D2D",
                      }}
                    >
                      {egg.daysLeft === 0
                        ? "Expire aujourd'hui"
                        : egg.daysLeft === 1
                          ? "1 jour restant"
                          : `${egg.daysLeft} jours restants`}
                    </strong>
                  </Text>
                </Section>
              ))}
            </Section>

            {/* Cooking tips */}
            <Text className="text-sm text-[#666666]">
              Idées de recettes : oeufs durs, quiche, omelette, ou pâtisserie
              sont parfaits pour utiliser des oeufs proches de l&apos;expiration
              !
            </Text>

            {/* CTA Button */}
            <Section className="my-6 text-center">
              <Button
                href={fridgeUrl}
                className="rounded-lg bg-[#FFC800] px-6 py-3 text-center text-base font-semibold text-[#2D2D2D]"
              >
                Voir mon frigo
              </Button>
            </Section>

            <Hr className="my-4 border-[#FFC800]/30" />

            {/* Footer */}
            <Text className="text-center text-xs text-[#999999]">
              Vous recevez cet email car les notifications sont activées dans
              vos préférences.
            </Text>
            <Text className="text-center text-xs text-[#999999]">
              {SiteConfig.company.name} • {SiteConfig.company.address}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
