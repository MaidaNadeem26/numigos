export const HOME_HORIZONTAL_PADDING = 16;
export const TAB_BAR_CONTENT_HEIGHT = 44;

const SMALL_PHONE_WIDTH = 360;
const AUTH_HERO_MIN_HEIGHT = 164;
const AUTH_HERO_MAX_HEIGHT = 244;
const AUTH_HERO_SMALL_MAX_HEIGHT = 212;

export function isSmallPhone(width: number) {
  return width <= SMALL_PHONE_WIDTH;
}

export function getAuthHeroHeight(viewportHeight: number, viewportWidth: number) {
  const preferredHeight = Math.round(viewportHeight * 0.29);
  const maximumHeight = isSmallPhone(viewportWidth)
    ? AUTH_HERO_SMALL_MAX_HEIGHT
    : AUTH_HERO_MAX_HEIGHT;

  return Math.min(maximumHeight, Math.max(AUTH_HERO_MIN_HEIGHT, preferredHeight));
}

export function getScreenHorizontalPadding(viewportWidth: number) {
  return isSmallPhone(viewportWidth) ? 16 : 24;
}
