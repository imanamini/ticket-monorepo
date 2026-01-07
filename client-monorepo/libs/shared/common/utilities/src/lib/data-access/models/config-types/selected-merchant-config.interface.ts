export type SelectedMerchantsType = 'large-logo-h' | 'listing';
export type SelectedMerchantsGap = 'extra' | 'normal';

export interface SelectedMerchantConfig {
  type?: SelectedMerchantsType; // default: large-logo-h
  gap?: SelectedMerchantsGap; // default: normals
  title?: string;
  stores: string[];
}
