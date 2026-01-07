import { CardProfile } from '@client-monorepo/daily-fintech/bank-card';

export interface CardDefinition {
  cardProfile?: CardProfile;
  prefix?: string;
  postfix?: string;
  pan?: string;
  cardIndex?: string;
}
