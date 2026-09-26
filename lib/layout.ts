export const HOME_HORIZONTAL_PADDING = 16;
export const MIN_TOUCH_TARGET = 44;
export const TAB_BAR_CONTENT_HEIGHT = 60;
export const PHONE_CONTENT_MAX_WIDTH = 680;
export const TABLET_CONTENT_MAX_WIDTH = 960;
export const DETAIL_CONTENT_MAX_WIDTH = 760;

export const responsiveBreakpoints = {
  compact: 360,
  largePhone: 480,
  tablet: 768,
  desktop: 1024,
} as const;

const AUTH_HERO_MIN_HEIGHT = 144;
const AUTH_HERO_MAX_HEIGHT = 244;
const AUTH_HERO_SMALL_MAX_HEIGHT = 212;
const SHORT_VIEWPORT_HEIGHT = 640;

export function isSmallPhone(width: number) {
  return width <= responsiveBreakpoints.compact;
}

export function isTablet(width: number) {
  return width >= responsiveBreakpoints.tablet;
}

export function getAuthHeroHeight(viewportHeight: number, viewportWidth: number) {
  const preferredHeight = Math.round(
    viewportHeight * (viewportHeight <= SHORT_VIEWPORT_HEIGHT ? 0.24 : 0.29),
  );
  const maximumHeight = isSmallPhone(viewportWidth)
    ? AUTH_HERO_SMALL_MAX_HEIGHT
    : AUTH_HERO_MAX_HEIGHT;

  return Math.min(maximumHeight, Math.max(AUTH_HERO_MIN_HEIGHT, preferredHeight));
}

export function getScreenHorizontalPadding(viewportWidth: number) {
  if (viewportWidth >= responsiveBreakpoints.desktop) return 32;
  if (viewportWidth >= responsiveBreakpoints.tablet) return 24;
  return 16;
}

export function getContentMaxWidth(
  viewportWidth: number,
  kind: 'standard' | 'detail' = 'standard',
) {
  if (kind === 'detail') return DETAIL_CONTENT_MAX_WIDTH;
  return viewportWidth >= responsiveBreakpoints.desktop
    ? TABLET_CONTENT_MAX_WIDTH
    : PHONE_CONTENT_MAX_WIDTH;
}

export function getGridColumnCount(viewportWidth: number, minimumCardWidth = 280) {
  const availableWidth = Math.max(0, viewportWidth - getScreenHorizontalPadding(viewportWidth) * 2);
  if (viewportWidth < responsiveBreakpoints.tablet) return 1;
  return Math.max(1, Math.min(3, Math.floor((availableWidth + 16) / (minimumCardWidth + 16))));
}

export function getTabBarHeight(bottomInset: number) {
  return TAB_BAR_CONTENT_HEIGHT + bottomInset;
}
