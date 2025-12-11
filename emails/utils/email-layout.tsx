import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import type { PropsWithChildren } from "react";

/**
 * EmailLayout is used to create a layout for your email.
 * @param props.children The children of the layout
 * @param props.disableTailwind If true, the children will be rendered without the Tailwind CSS. It's useful when you want use <Markdown /> tag.
 * @returns
 */
export const EmailLayout = (
  props: PropsWithChildren<{ disableTailwind?: boolean }>,
) => {
  let baseUrl = getServerUrl();

  // Email software can't handle localhost URL
  if (baseUrl.startsWith("http://localhost")) {
    baseUrl = SiteConfig.prodUrl;
  }

  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#FDFBF7",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
          margin: "0 auto",
          padding: "20px 0",
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "2px solid #1C1917",
            boxShadow: "4px 4px 0px #1C1917",
            padding: "32px",
          }}
        >
          <Tailwind>
            <table cellPadding={0} cellSpacing={0}>
              <tr>
                <td className="pr-3">
                  <Img
                    src={`${baseUrl}${SiteConfig.appIcon}`}
                    width={32}
                    height={32}
                    className="inline"
                    alt={`${SiteConfig.title}'s logo`}
                  />
                </td>
                <td>
                  <Text className="text-xl font-extrabold tracking-tight text-[#1C1917]">
                    {SiteConfig.title}
                  </Text>
                </td>
              </tr>
            </table>
            <Hr className="mt-6 mb-6 border-2 border-dashed border-[#1C1917]" />
          </Tailwind>
          {props.disableTailwind ? (
            props.children
          ) : (
            <Tailwind>{props.children}</Tailwind>
          )}
          <Tailwind>
            <Hr className="mt-8 mb-6 border-2 border-dashed border-[#1C1917]" />

            <table cellPadding={0} cellSpacing={0}>
              <tr>
                <td className="pr-3">
                  <Img
                    src={`${baseUrl}${SiteConfig.appIcon}`}
                    width={24}
                    height={24}
                    className="inline"
                    alt={`${SiteConfig.title}'s logo`}
                  />
                </td>
                <td>
                  <Text className="text-lg font-bold text-[#1C1917]">
                    {SiteConfig.title}
                  </Text>
                </td>
              </tr>
            </table>
            <Text className="text-sm text-[#57534E]">
              {SiteConfig.company.name}
            </Text>
            <Text className="text-sm text-[#57534E]">
              {SiteConfig.company.address}
            </Text>
          </Tailwind>
        </Container>
      </Body>
    </Html>
  );
};
