import { Action, ActionType } from '@client-monorepo/common/action-handler';
import { ModifiedAsset } from '../data-access/models/modified-asset.interface';
import { AccountStatus } from '@client-monorepo/common/user-assets';
import { FundTypeNames } from '../data-access/consts/fund-type-names';
import { SERVICE_TYPE } from '@client-monorepo/payment/transactions';

export class AssetBuilder {
  static findInstallmentInfo(creditId: string, installmentsData?: any): any {
    if (!installmentsData?.paymentList?.length || !creditId) {
      return null;
    }
    try {
      return installmentsData.paymentList.find((installment: any) => installment.payload?.creditId === creditId) || null;
    } catch (error) {
      console.warn('Error processing installment data:', error);
      return null;
    }
  }

  static createCreditAction(creditId: string, isDisabled: boolean, installmentInfo?: any): Action {
    if (installmentInfo && !isDisabled) {
      return {
        type: ActionType.PAY_INSTALLMENT,
        payload: {
          params: {
            rfr: 'hub',
            utm_source: 'hub',
            utm_medium: 'assets',
          },
          serviceType: installmentInfo?.serviceType ?? SERVICE_TYPE.BNPL,
          creditId: installmentInfo.creditId,
          ticketDetail: installmentInfo.contractDebts?.ticketDetail,
        },
      };
    }

    return {
      type: ActionType.REDIRECT,
      payload: {
        url: `service/credit/go-to-wallet/${creditId}`,
      },
    };
  }

  static createCreditActionText(defaultActionText = '', isDisabled: boolean, installmentInfo?: any): string {
    if (isDisabled) return '';
    return installmentInfo ? 'پرداخت قسط' : defaultActionText;
  }

  static buildDetailedAssets(
    assets: any[],
    mapper: Record<string, any>,
    additionalData?: any,
    assetModifiers?: Record<string, (baseAsset: ModifiedAsset, asset: any, additionalData?: any) => ModifiedAsset>,
    assetTypeKey = 'type', // propertyName which is unique among items
  ): ModifiedAsset[] {
    const eligibleAssets = assets.filter((asset) => this.isSupportedByCategory(asset[assetTypeKey], mapper));

    return eligibleAssets.map((asset) => {
      const baseAsset = this.createBaseAsset(asset, mapper, assetTypeKey);
      const modifier = assetModifiers?.[asset[assetTypeKey]];
      return modifier ? modifier(baseAsset, asset, additionalData) : baseAsset;
    });
  }

  static createBaseAsset(asset: any, mapper: Record<string, any>, assetTypeKey = 'type'): ModifiedAsset {
    const assetType = asset[assetTypeKey];
    return {
      ...asset,
      ...mapper[assetType],
      id: asset.id || asset.creditId || asset.name,
      balance: asset.balance || asset.totalBalance || 0,
      ...(asset.name && { subtitle: asset.balance }),
    };
  }

  static isSupportedByCategory(assetType: string, mapper: Record<string, any>): boolean {
    return assetType in mapper;
  }

  static calculateTotalBalance(assets: any[]): number {
    return assets
      .filter((asset) => !(asset?.accountStatus === AccountStatus.BLOCK))
      .reduce((total, asset) => {
        const balance = asset.balance || asset.totalBalance || 0;
        return total + Number(balance);
      }, 0);
  }

  static createInvestmentAction(fundType: string): Action {
    const investmentUrls: Record<string, string> = {
      [FundTypeNames.GOLD]: 'mini-app/wealth/investments?type=Gold',
      [FundTypeNames.FIXED_INCOME]: 'mini-app/wealth/investments?type=FixedIncome',
      [FundTypeNames.CROWD_FUND]: 'mini-app/wealth/crowd-list',
      [FundTypeNames.WALLET]: 'mini-app/wealth/wallets/treasury',
      [FundTypeNames.INDEX]: 'mini-app/wealth/investments?type=Index',
    };

    return {
      type: ActionType.REDIRECT,
      payload: {
        url: investmentUrls[fundType],
        params: {
          referrer: 'dpxapp',
          utm_medium: 'Assets-Details',
          utm_source: 'hub',
        },
      },
    } as Action;
  }
}
