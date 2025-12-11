export async function updateAppBadge(count: number): Promise<boolean> {
  if (typeof navigator === "undefined" || !("setAppBadge" in navigator)) {
    return false;
  }

  try {
    if (count > 0) {
      await navigator.setAppBadge(count);
    } else {
      await navigator.clearAppBadge();
    }
    return true;
  } catch {
    return false;
  }
}

export async function clearAppBadge(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("clearAppBadge" in navigator)) {
    return false;
  }

  try {
    await navigator.clearAppBadge();
    return true;
  } catch {
    return false;
  }
}

export function isBadgingSupported(): boolean {
  return typeof navigator !== "undefined" && "setAppBadge" in navigator;
}
