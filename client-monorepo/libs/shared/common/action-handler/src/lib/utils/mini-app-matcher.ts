import { UrlMatchResult, UrlSegment } from '@angular/router';

export const miniAppMatcher = (
  segments: UrlSegment[],
): UrlMatchResult | null => {
  if (
    segments.length > 0 &&
    segments[0].path === 'mini-app' &&
    segments[1].path === 'insurance'
  ) {
    return { consumed: segments };
  }
  return null;
};
