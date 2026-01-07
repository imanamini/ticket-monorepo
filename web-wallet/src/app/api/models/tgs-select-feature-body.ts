import { UpgFeatureName } from '../emuns/upg-feature-name.emun';

export interface TgsSelectFeatureBody {
  ticket: string;
  featureName: UpgFeatureName;
}
