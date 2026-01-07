export interface HomeFeed {
  value: string;
  fireBaseEvent: string;
  featureName: string;
  url: string;
  ratio: number;
  type: HomeFeedTypes;
}

export enum HomeFeedTypes {
  IMAGE = 0,
  ANIMATION = 1,
}
