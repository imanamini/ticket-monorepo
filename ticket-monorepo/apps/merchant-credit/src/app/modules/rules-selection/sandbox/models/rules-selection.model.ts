export interface Rules{
  rules: Rule[];
}

export interface Rule {
  uid: string;
  profileId: string;
  fundProviderId: string;
  fundProviderName: string;
  merchantType: number;
  logoImageId: string;
  label: string;
  details: {
    [key: string]: {
      value: string
    }
  };
  visibleItems: number;
  ruleDetails: {
    label: string;
    value: string;
  }[];
}
