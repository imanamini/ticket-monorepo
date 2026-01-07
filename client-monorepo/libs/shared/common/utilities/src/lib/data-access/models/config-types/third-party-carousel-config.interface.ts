export type ThirdPartyCarouselStoreName = 'tapsi-shop' | 'okala' | 'digikala-jet';
export type ThirdPartyCarouselType = 'amazing' | 'discount';
export interface ThirdPartyCarouselConfig {
  title: string;
  subtitle: string;
  url: string;
  storeName: ThirdPartyCarouselStoreName;
  type: ThirdPartyCarouselType;
}
