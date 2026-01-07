export interface CampaignConfig {
  name: string;
  startDate: number;
  endDate: number;
  assetScript: string;
  banner: {
    image: string;
    textBackground: string;
    title: {
      text: string;
      class: string;
    };
    subtitle: {
      text: string;
      class: string;
    };
  };
  assetsPrefix?: string;
  promotionsBackgroundImage?: string;
}
