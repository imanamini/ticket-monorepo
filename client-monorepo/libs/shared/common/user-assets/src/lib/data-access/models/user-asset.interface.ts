import {
  AccountStatus,
  AssetDetailsType,
  AssetPatternColor,
  AssetStatus,
  AssetTypes,
  AssetUnitType,
  UserAssetSubscriptionPlan,
} from '@client-monorepo/common/user-assets';
import { ApiResultInterface } from '@client-monorepo/common/network';
import { Action } from '@client-monorepo/common/action-handler';

export interface UserAssetsToShowModel {
  title: string;
  detail: string;
  detailsType: AssetDetailsType;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  patternColor: AssetPatternColor;
  unit: AssetUnitType;
  action?: Action;
  order?: number;
  isDisabled?: boolean; // When user is blocked
}
export interface UserAssetResponseModel {
  result: ApiResultInterface;
  assets: UserAssetModel[];
}

export interface UserAssetModel {
  type: AssetTypes;
  status: AssetStatus;
  accountStatus?: AccountStatus;
}

export interface WalletAsset extends UserAssetModel {
  type: AssetTypes.WALLET;
  totalBalance: number;
  cashoutableBalance: number;
  nonCashoutableBalance: number;
}

export interface CreditAsset extends UserAssetModel {
  type: AssetTypes.CREDIT;
  creditId: string;
  balance: number;
  initialBalance: number;
  fundProvider: {
    fundProviderCode: number;
    title: string;
    color: string;
    logo: string;
  };
}

export interface BnplAsset extends UserAssetModel {
  type: AssetTypes.BNPL;
  creditId: string;
  fundProvider: {
    fundProviderCode: number;
    title: string;
    color: string;
    logo: string;
  };
  balance: number;
  balance1Pay: number;
  balance4Pay: number;
  initialBalance: number;
  accountStatus1Pay: AccountStatus;
  accountStatus4Pay: AccountStatus;
}

export interface SubscriptionAsset extends UserAssetModel {
  type: AssetTypes.SUBSCRIPTION;
  plan: UserAssetSubscriptionPlan;
  expireTime: number;
}

export interface PayClubAsset extends UserAssetModel {
  type: AssetTypes.PAY_CLUB;
  coinCount: number;
}
