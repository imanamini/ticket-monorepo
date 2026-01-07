export interface CreditBackHandlerInterface {
  init: () => void;
  setCustomBackUrl: (url: string) => void;
  goBack: () => void;
  shouldSkipDeferLoading: (url: string) => void;
  setRestrictedUrls: (restrictedUrls: string[]) => void;
  setRedirectForRestrictedUrls: (redirectUrl: string) => void;
  disableAutoScroll: () => void;
  enableAutoScroll: () => void;
  removeLeadingSlash: (url: string) => string;
  destroy: () => void;
}
