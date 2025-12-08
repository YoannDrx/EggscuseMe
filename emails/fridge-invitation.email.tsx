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

type FridgeInvitationEmailProps = {
  inviterName: string;
  fridgeName: string;
  inviteToken: string;
  expiresAt: Date;
};

export default function FridgeInvitationEmail({
  inviterName = "Marie",
  fridgeName = "Mon Frigo",
  inviteToken = "abc123def456",
  expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
}: FridgeInvitationEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const inviteUrl = `${baseUrl}/fridge/invite/${inviteToken}`;
  const expiresFormatted = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(expiresAt);

  return (
    <Html>
      <Head />
      <Preview>
        {inviterName} vous invite a rejoindre son frigo sur EggscuseMe
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
                Invitation a rejoindre un frigo
              </Heading>
            </Section>

            <Hr className="my-4 border-[#FFC800]/30" />

            {/* Greeting */}
            <Text className="text-base text-[#2D2D2D]">Bonjour,</Text>

            <Text className="text-base text-[#2D2D2D]">
              <strong>{inviterName}</strong> vous invite a rejoindre son frigo{" "}
              <strong>&quot;{fridgeName}&quot;</strong> sur EggscuseMe.
            </Text>

            {/* Benefits */}
            <Section className="my-6 rounded-lg bg-[#FFC800]/10 p-4">
              <Heading className="m-0 mb-3 text-lg font-semibold text-[#2D2D2D]">
                En tant qu&apos;invite, vous pourrez :
              </Heading>
              <Section className="mb-2 rounded-md bg-white p-3">
                <Text className="m-0 text-sm text-[#2D2D2D]">
                  Voir les boites d&apos;oeufs et leur fraicheur
                </Text>
              </Section>
              <Section className="mb-2 rounded-md bg-white p-3">
                <Text className="m-0 text-sm text-[#2D2D2D]">
                  Consommer des oeufs et enregistrer vos repas
                </Text>
              </Section>
              <Section className="mb-2 rounded-md bg-white p-3">
                <Text className="m-0 text-sm text-[#2D2D2D]">
                  Acceder aux recettes et suggestions de cuisson
                </Text>
              </Section>
              <Section className="rounded-md bg-white p-3">
                <Text className="m-0 text-sm text-[#2D2D2D]">
                  Utiliser le minuteur intelligent
                </Text>
              </Section>
            </Section>

            {/* CTA Button */}
            <Section className="my-6 text-center">
              <Button
                href={inviteUrl}
                className="rounded-lg bg-[#FFC800] px-6 py-3 text-center text-base font-semibold text-[#2D2D2D]"
              >
                Rejoindre le frigo
              </Button>
            </Section>

            <Text className="text-center text-sm text-[#666666]">
              Cette invitation expire le {expiresFormatted}
            </Text>

            <Hr className="my-4 border-[#FFC800]/30" />

            {/* Footer */}
            <Text className="text-center text-xs text-[#999999]">
              Si vous n&apos;attendiez pas cette invitation, vous pouvez ignorer
              cet email.
            </Text>
            <Text className="text-center text-xs text-[#999999]">
              {SiteConfig.company.name} - {SiteConfig.company.address}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
