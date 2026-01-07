export interface CreditCollateralInfoModel {
  collateralAmount: number[];
  hasCollateralAmount: boolean;
  registerType: string[];
  registerCost: (string | undefined)[];
  hasRegisterCost: boolean;
  groupId: string[];
  collateralDetailTitle: string;
  calloutMessage: { title?: string; description: string[] };
  ctaText?: string;
}
