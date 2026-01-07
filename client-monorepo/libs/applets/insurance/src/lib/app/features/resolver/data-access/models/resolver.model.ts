import { LandingProviderEnum } from '../../../../data-access/enums/landing-provider.enum';

export interface IResolverModel {
  url: string;
  mobile: string;
  provider: LandingProviderEnum;
}

