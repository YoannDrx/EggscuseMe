import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { defaultLocale, locales, type Locale } from "./config";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

async function getLocaleFromRequest(): Promise<Locale> {
  // 1. Try to get locale from cookie
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. Try to get locale from Accept-Language header
  const headersList = await headers();
  const acceptLanguage = headersList.get("Accept-Language");
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().substring(0, 2))
      .find((lang) => locales.includes(lang as Locale));

    if (preferredLocale) {
      return preferredLocale as Locale;
    }
  }

  // 3. Fall back to default locale
  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await getLocaleFromRequest();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
