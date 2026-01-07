export interface HomeFeatureSettings {
  visibleMiniApps: number;
  serviceName: string;
  editDescription: string;
  moreButton: MoreButton;
  focusedCard: string;
}

export interface MoreButton {
  uid: string;
  name: string;
  featureName: string;
  badges: any[];
  status: {
    value: number;
  };
  imageId: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
}
