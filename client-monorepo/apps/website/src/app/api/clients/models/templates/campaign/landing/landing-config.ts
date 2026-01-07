export interface LandingConfig {
  title: string;
  bannerImageId: string;
  campaignInfo: CampaignInfo;
  tacInfo: {
    title: string;
    url: string;
    isEnable: boolean;
  };
  description: {
    note: string;
    keywords: Array<string>;
  };
}

export interface CampaignInfo {
  title: string;
  type: number;
  isEnable: boolean;
}
