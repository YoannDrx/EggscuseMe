import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

type DeviceType = "mobile" | "tablet" | "desktop";

type UseDeviceResult = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  isReady: boolean;
};

/**
 * Hook to detect device type based on screen width
 * @returns Object with boolean flags for mobile/tablet/desktop and the device type
 */
export function useDevice(): UseDeviceResult {
  const [state, setState] = React.useState<{
    width: number | undefined;
    isReady: boolean;
  }>({
    width: undefined,
    isReady: false,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setState({
        width: window.innerWidth,
        isReady: true,
      });
    };

    // Initial check
    handleResize();

    // Listen for resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = state.width !== undefined && state.width < MOBILE_BREAKPOINT;
  const isTablet =
    state.width !== undefined &&
    state.width >= MOBILE_BREAKPOINT &&
    state.width < TABLET_BREAKPOINT;
  const isDesktop =
    state.width !== undefined && state.width >= TABLET_BREAKPOINT;

  const deviceType: DeviceType = isMobile
    ? "mobile"
    : isTablet
      ? "tablet"
      : "desktop";

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    isReady: state.isReady,
  };
}

/**
 * Simple hook to check if device is mobile
 * @returns boolean indicating if screen is mobile width
 */
export function useIsMobile(): boolean {
  const { isMobile } = useDevice();
  return isMobile;
}

/**
 * Hook to get a media query match result
 * @param query Media query string (e.g., "(min-width: 768px)")
 * @returns boolean indicating if query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(query);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Initial check
    setMatches(mql.matches);

    // Listen for changes
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
