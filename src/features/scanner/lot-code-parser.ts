import type { EggSize } from "@/generated/prisma";

export type ParsedEggInfo = {
  layingDate?: Date;
  expirationDate?: Date;
  countryCode?: string;
  farmCode?: string;
  size?: EggSize;
  quantity?: number;
  rawCode: string;
};

/**
 * Parse French egg lot codes and barcodes to extract useful information
 *
 * French egg codes follow several formats:
 * - Farm code: 1FR12345 (1 = breeding type, FR = country, 12345 = farm ID)
 * - Date codes: JJJAA (Julian day of year + year) or DDMMYY
 * - EAN-13 barcodes: 3 prefix = France, contains product info
 *
 * The DCR (Date de Consommation Recommandée) is 28 days after laying
 * So we can calculate: layingDate = DCR - 28 days
 */

/**
 * Parse an EAN-13 barcode (commonly found on French egg boxes)
 */
export function parseEAN13(barcode: string): Partial<ParsedEggInfo> {
  const result: Partial<ParsedEggInfo> = { rawCode: barcode };

  // EAN-13 structure: Country (2-3 digits) + Manufacturer + Product + Check digit
  if (barcode.length !== 13) return result;

  // Check if it's a French product (prefix 30-37)
  const countryPrefix = barcode.substring(0, 2);
  if (countryPrefix >= "30" && countryPrefix <= "37") {
    result.countryCode = "FR";
  }

  // Try to extract quantity from common patterns
  // Many egg boxes encode quantity in the product code
  const quantityPatterns: Record<string, number> = {
    "06": 6,
    "10": 10,
    "12": 12,
    "18": 18,
    "24": 24,
    "30": 30,
  };

  // Check digits 8-9 or 9-10 for quantity hints
  for (const [pattern, qty] of Object.entries(quantityPatterns)) {
    if (barcode.includes(pattern)) {
      result.quantity = qty;
      break;
    }
  }

  return result;
}

/**
 * Parse a French farm/producer code
 * Format: [0-3][A-Z]{2}[0-9]{5,}
 * Example: 1FR12345
 * - First digit: 0=bio, 1=plein air, 2=sol, 3=cage
 * - Next 2 letters: country code
 * - Following digits: farm identification
 */
export function parseFarmCode(code: string): Partial<ParsedEggInfo> {
  const result: Partial<ParsedEggInfo> = { rawCode: code };

  // Match farm code pattern
  const farmPattern = /^([0-3])([A-Z]{2})(\d{5,})$/i;
  const match = code.match(farmPattern);

  if (match) {
    result.countryCode = match[2].toUpperCase();
    result.farmCode = code;
  }

  return result;
}

/**
 * Parse a date code in Julian format (JJJAA or JJJYYYY)
 * JJJ = Day of year (001-366)
 * AA or YYYY = Year
 */
export function parseJulianDate(code: string): Date | null {
  // Try JJJAA format (5 digits)
  if (/^\d{5}$/.test(code)) {
    const dayOfYear = parseInt(code.substring(0, 3), 10);
    let year = parseInt(code.substring(3, 5), 10);

    // Assume 2000s for 2-digit years
    year = year < 50 ? 2000 + year : 1900 + year;

    if (dayOfYear >= 1 && dayOfYear <= 366) {
      const date = new Date(year, 0, dayOfYear);
      return date;
    }
  }

  // Try JJJYYYY format (7 digits)
  if (/^\d{7}$/.test(code)) {
    const dayOfYear = parseInt(code.substring(0, 3), 10);
    const year = parseInt(code.substring(3, 7), 10);

    if (dayOfYear >= 1 && dayOfYear <= 366 && year >= 2000 && year <= 2100) {
      const date = new Date(year, 0, dayOfYear);
      return date;
    }
  }

  return null;
}

/**
 * Parse a date code in DDMMYY or DDMMYYYY format
 */
export function parseEuropeanDate(code: string): Date | null {
  // DDMMYY format
  if (/^\d{6}$/.test(code)) {
    const day = parseInt(code.substring(0, 2), 10);
    const month = parseInt(code.substring(2, 4), 10) - 1; // 0-indexed
    let year = parseInt(code.substring(4, 6), 10);

    year = year < 50 ? 2000 + year : 1900 + year;

    if (day >= 1 && day <= 31 && month >= 0 && month <= 11) {
      return new Date(year, month, day);
    }
  }

  // DDMMYYYY format
  if (/^\d{8}$/.test(code)) {
    const day = parseInt(code.substring(0, 2), 10);
    const month = parseInt(code.substring(2, 4), 10) - 1;
    const year = parseInt(code.substring(4, 8), 10);

    if (
      day >= 1 &&
      day <= 31 &&
      month >= 0 &&
      month <= 11 &&
      year >= 2000 &&
      year <= 2100
    ) {
      return new Date(year, month, day);
    }
  }

  return null;
}

/**
 * Calculate laying date from expiration date (DCR)
 * In France, DCR = laying date + 28 days
 */
export function calculateLayingDateFromDCR(dcr: Date): Date {
  const layingDate = new Date(dcr);
  layingDate.setDate(layingDate.getDate() - 28);
  return layingDate;
}

/**
 * Try to parse any code and extract as much information as possible
 */
export function parseAnyCode(code: string): ParsedEggInfo {
  const cleanCode = code.trim().toUpperCase();
  const result: ParsedEggInfo = { rawCode: cleanCode };

  // Try EAN-13 barcode
  if (/^\d{13}$/.test(cleanCode)) {
    Object.assign(result, parseEAN13(cleanCode));
  }

  // Try farm code
  if (/^[0-3][A-Z]{2}\d{5,}$/i.test(cleanCode)) {
    Object.assign(result, parseFarmCode(cleanCode));
  }

  // Look for date patterns in the code
  const datePatterns = cleanCode.match(/\d{5,8}/g) ?? [];
  for (const pattern of datePatterns) {
    const julianDate = parseJulianDate(pattern);
    if (julianDate) {
      // If date is in the future, it's likely a DCR
      if (julianDate > new Date()) {
        result.expirationDate = julianDate;
        result.layingDate = calculateLayingDateFromDCR(julianDate);
      } else {
        result.layingDate = julianDate;
      }
      break;
    }

    const europeanDate = parseEuropeanDate(pattern);
    if (europeanDate) {
      if (europeanDate > new Date()) {
        result.expirationDate = europeanDate;
        result.layingDate = calculateLayingDateFromDCR(europeanDate);
      } else {
        result.layingDate = europeanDate;
      }
      break;
    }
  }

  // Try to detect size from common codes
  if (/\bS\b/.test(cleanCode)) result.size = "S";
  else if (/\bXL\b/.test(cleanCode)) result.size = "XL";
  else if (/\bL\b/.test(cleanCode)) result.size = "L";
  else if (/\bM\b/.test(cleanCode)) result.size = "M";

  // Try to detect quantity
  const qtyMatch = cleanCode.match(/\b(6|10|12|18|24|30)\b/);
  if (qtyMatch) {
    result.quantity = parseInt(qtyMatch[1], 10);
  }

  return result;
}

/**
 * Format parsed info for display
 */
export function formatParsedInfo(
  info: ParsedEggInfo,
  locale = "en",
): string[] {
  const lines: string[] = [];
  const isFr = locale.startsWith("fr");

  if (info.layingDate) {
    lines.push(
      `${isFr ? "Date de ponte" : "Laying date"}: ${info.layingDate.toLocaleDateString(locale)}`,
    );
  }
  if (info.expirationDate) {
    lines.push(`DCR: ${info.expirationDate.toLocaleDateString(locale)}`);
  }
  if (info.countryCode) {
    lines.push(`${isFr ? "Origine" : "Origin"}: ${info.countryCode}`);
  }
  if (info.size) {
    const sizeLabels: Record<EggSize, string> = {
      S: isFr ? "Petit (S)" : "Small (S)",
      M: isFr ? "Moyen (M)" : "Medium (M)",
      L: isFr ? "Gros (L)" : "Large (L)",
      XL: isFr ? "Très gros (XL)" : "Extra large (XL)",
    };
    lines.push(`${isFr ? "Taille" : "Size"}: ${sizeLabels[info.size]}`);
  }
  if (info.quantity) {
    const label = isFr ? "Quantité" : "Quantity";
    const eggsLabel =
      info.quantity > 1
        ? isFr ? "œufs" : "eggs"
        : isFr ? "œuf" : "egg";
    lines.push(`${label}: ${info.quantity} ${eggsLabel}`);
  }

  return lines;
}
