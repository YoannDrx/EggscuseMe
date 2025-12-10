import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import { Heading, Preview, Section, Text } from "@react-email/components";
import {
  EMAIL_COLORS,
  EggscuseMeEmailLayout,
  EmailInfoBox,
  EmailLanguageSeparator,
} from "./utils/eggscuseme-email-layout";

type DeleteAccountEmailProps = {
  user: {
    name?: string | null;
    email: string;
  };
  url: string;
};

export default function DeleteAccountEmail({
  user = { name: "Utilisateur", email: "utilisateur@example.com" },
  url = "https://eggscuseme.app/auth/confirm-delete?token=abc123",
}: DeleteAccountEmailProps) {
  let baseUrl = getServerUrl();

  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  const userName = user.name ?? "Utilisateur";

  return (
    <EggscuseMeEmailLayout eggyMood="sad">
      <Preview>
        Confirmation de suppression de compte / Account deletion confirmation -{" "}
        {SiteConfig.title}
      </Preview>

      {/* ==================== FRENCH VERSION ==================== */}
      <Heading
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: EMAIL_COLORS.text,
          textAlign: "center",
          margin: "0 0 24px 0",
        }}
      >
        Confirmation de suppression de compte
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Bonjour {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Nous avons recu une demande de suppression de votre compte{" "}
        {SiteConfig.title}. Nous sommes tristes de vous voir partir !
      </Text>

      <EmailInfoBox>
        <Text
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: EMAIL_COLORS.expired,
            margin: "0 0 12px 0",
          }}
        >
          Attention : Cette action est irreversible
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.text,
            margin: "0 0 8px 0",
          }}
        >
          En supprimant votre compte, vous perdrez :
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "4px 0",
          }}
        >
          • Toutes vos boites d&apos;oeufs et leur historique
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "4px 0",
          }}
        >
          • Vos statistiques anti-gaspillage
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "4px 0",
          }}
        >
          • L&apos;acces aux frigos partages
        </Text>
      </EmailInfoBox>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Si vous etes sur de vouloir supprimer votre compte :
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <a
          href={url}
          style={{
            display: "inline-block",
            backgroundColor: EMAIL_COLORS.expired,
            color: "#FFFFFF",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px",
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          Supprimer mon compte
        </a>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.text,
          textAlign: "center",
        }}
      >
        Change d&apos;avis ? Ignorez cet email.
      </Text>

      {/* ==================== SEPARATOR ==================== */}
      <EmailLanguageSeparator />

      {/* ==================== ENGLISH VERSION ==================== */}
      <Heading
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: EMAIL_COLORS.text,
          textAlign: "center",
          margin: "0 0 24px 0",
        }}
      >
        Account Deletion Confirmation
      </Heading>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        Hello {userName},
      </Text>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        We received a request to delete your {SiteConfig.title} account.
        We&apos;re sad to see you go!
      </Text>

      <EmailInfoBox>
        <Text
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: EMAIL_COLORS.expired,
            margin: "0 0 12px 0",
          }}
        >
          Warning: This action is irreversible
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.text,
            margin: "0 0 8px 0",
          }}
        >
          By deleting your account, you will lose:
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "4px 0",
          }}
        >
          • All your egg boxes and their history
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "4px 0",
          }}
        >
          • Your anti-waste statistics
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: EMAIL_COLORS.textMuted,
            margin: "4px 0",
          }}
        >
          • Access to shared fridges
        </Text>
      </EmailInfoBox>

      <Text style={{ fontSize: "16px", color: EMAIL_COLORS.text }}>
        If you&apos;re sure you want to delete your account:
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <a
          href={url}
          style={{
            display: "inline-block",
            backgroundColor: EMAIL_COLORS.expired,
            color: "#FFFFFF",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "16px",
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          Delete my account
        </a>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: EMAIL_COLORS.text,
          textAlign: "center",
        }}
      >
        Changed your mind? Just ignore this email.
      </Text>
    </EggscuseMeEmailLayout>
  );
}
