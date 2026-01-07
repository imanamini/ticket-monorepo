import { Injectable } from '@angular/core';
import { AccountStatus, AssetStatus, AssetTypes, BnplAsset, CreditAsset, WalletAsset } from '@client-monorepo/common/user-assets';
import { AssetSubtitleType, ModifiedAsset } from '../models/modified-asset.interface';
import { AssetBuilder } from '../../utils/asset-builder';
import { Action, ActionType, APP_ACTIONS } from '@client-monorepo/common/action-handler';

@Injectable({
  providedIn: 'root',
})
export class AssetModifierService {
  modifyCreditAsset(baseAsset: ModifiedAsset, originalAsset: CreditAsset, installmentsData?: any): ModifiedAsset {
    if (originalAsset.status !== AssetStatus.ACTIVE) {
      return baseAsset;
    }

    const hasBalance = originalAsset.balance > 0;
    const installmentInfo = AssetBuilder.findInstallmentInfo(originalAsset.creditId, installmentsData);
    const isDisabled = originalAsset.accountStatus === AccountStatus.BLOCK;
    return {
      ...baseAsset,
      balance: originalAsset.balance,
      subtitle: hasBalance ? originalAsset.balance : 'استفاده شده!',
      subtitleType: hasBalance ? baseAsset.subtitleType : AssetSubtitleType.TEXT,
      subtitleColor: hasBalance ? baseAsset.subtitleColor : '#DFAE00',
      isDisabled,
      actionText: AssetBuilder.createCreditActionText(baseAsset.actionText, isDisabled, installmentInfo),
      action: AssetBuilder.createCreditAction(originalAsset.creditId, isDisabled, installmentInfo),
    };
  }

  modifyBnplAsset(baseAsset: ModifiedAsset, originalAsset: BnplAsset, installmentsData?: any): ModifiedAsset {
    if (originalAsset.status !== AssetStatus.ACTIVE) {
      return baseAsset;
    }

    const hasBalance = originalAsset.balance > 0;
    const installmentInfo = AssetBuilder.findInstallmentInfo(originalAsset.creditId, installmentsData);
    const isDisabled = originalAsset.accountStatus === AccountStatus.BLOCK;

    return {
      ...baseAsset,
      balance: originalAsset.balance,
      subtitle: hasBalance ? originalAsset.balance : 'اتمام موجودی!',
      subtitleType: hasBalance ? baseAsset.subtitleType : AssetSubtitleType.TEXT,
      subtitleColor: hasBalance ? baseAsset.subtitleColor : '#F9441F',
      isDisabled,
      actionText: AssetBuilder.createCreditActionText(baseAsset.actionText, isDisabled, installmentInfo),
      action: AssetBuilder.createCreditAction(originalAsset.creditId, isDisabled, installmentInfo?.payload),
    };
  }

  modifyWalletAsset(baseAsset: ModifiedAsset, originalAsset: WalletAsset): ModifiedAsset {
    const needsCharging = originalAsset.totalBalance === 0;
    const needsChargingAction = {
      type: ActionType.OLD_ACTION,
      payload: { action: APP_ACTIONS.WALLET_CASH_IN },
    } as Action;

    return {
      ...baseAsset,
      balance: originalAsset.totalBalance ?? 0,
      subtitle: originalAsset.totalBalance ?? 0,
      actionText: needsCharging ? 'شارژ کیف' : baseAsset.actionText,
      action: needsCharging ? needsChargingAction : baseAsset.action,
    };
  }

  modifyWealthAsset(baseAsset: ModifiedAsset, originalAsset: any): ModifiedAsset {
    const hasZeroBalance = originalAsset.balance === 0;

    return {
      ...baseAsset,
      type: AssetTypes.WEALTH,
      balance: originalAsset.balance,
      subtitle: originalAsset.balance,
      actionText: hasZeroBalance ? 'سرمایه‌گذاری' : baseAsset.actionText,
      action: hasZeroBalance ? AssetBuilder.createInvestmentAction(originalAsset.name) : baseAsset.action,
    };
  }
}
