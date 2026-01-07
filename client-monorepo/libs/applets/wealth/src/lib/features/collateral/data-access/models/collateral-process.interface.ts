export interface ICollateralProcess {
  action?: string;
  data: ICollateralProcessData;
}

export interface ICollateralProcessData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  nationalId?: string;
  nextAction?: string;

  pageName?: string;
  coordinatorAction?: string;
  instrumentTitle?: string;
  collateralAmount?: string;
  phoneNumber?: string;
  message?: string;
  maxAmount?: string;
  minAmount?: string;
  countdownInSeconds?: string;

  maxUnits?: number;
  minUnits?: number;
  today?: string;
  instrumentNav?: {
    purchaseNav?: number;
    saleNav?: number;
    statisticNav?: number;
    latestUpdate?: string;
  };
}
