import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { AssetPreviewComponent } from '../asset-preview/asset-preview.component';
import {
  BnplAsset,
  CreditAsset,
  PayClubAsset,
  SubscriptionAsset,
  UserAssetsToShowModel,
  WalletAsset,
} from '../../data-access/models/user-asset.interface';
import { UserAssetsApiService } from '../../data-access/services/user-assets-api.service';
import { rangeCreator } from '@client-monorepo/common/utilities';
import {
  AccountStatus,
  AssetDetailsType,
  AssetPatternColor,
  AssetStatus,
  AssetTypes,
  AssetUnitType,
  BnplAssetStatusMapper,
  CreditAssetStatusMapper,
  UserAssetSubscriptionPlanToColorMapper,
  UserAssetSubscriptionPlanToTextMapper,
  UserAssetTypesMapper,
} from '../../data-access/consts/user-assets.const';
import { ActionType } from '@client-monorepo/common/action-handler';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';

@Component({
  selector: 'common-user-assets-assets-slider',
  standalone: true,
  imports: [CommonModule, HorizontalScrollComponent, AssetPreviewComponent],
  templateUrl: './assets-slider.component.html',
  styleUrl: './assets-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsSliderComponent implements OnInit {
  userAssetsService = inject(UserAssetsApiService);
  isLoading = signal(true);
  assetsToShow = signal<UserAssetsToShowModel[]>([]);
  displayableAssetTypes = [AssetTypes.CREDIT, AssetTypes.BNPL, AssetTypes.WALLET];
  rangeCreator = rangeCreator;

  ngOnInit() {
    this.getAssets();
  }

  private getAssets() {
    this.userAssetsService.getUserAssets().subscribe({
      next: (data) => {
        const toShow: UserAssetsToShowModel[] = data.assets
          .filter((item) => {
            return this.displayableAssetTypes.includes(item.type);
          })
          .map((serverAsset) => {
            switch (serverAsset.type) {
              case AssetTypes.WALLET:
                return this.transformWalletUserAsset(serverAsset as WalletAsset);
              case AssetTypes.CREDIT:
                return this.transformCreditUserAsset(serverAsset as CreditAsset);
              case AssetTypes.BNPL:
                return this.transformBnplUserAsset(serverAsset as BnplAsset);
              case AssetTypes.SUBSCRIPTION:
                return this.transformSubscriptionUserAsset(serverAsset as SubscriptionAsset);
              case AssetTypes.PAY_CLUB:
                return this.transformPayClubUserAsset(serverAsset as PayClubAsset);
              default:
                throw new Error(`Unsupported asset type: ${serverAsset.type}`);
            }
          })
          .sort((first: UserAssetsToShowModel, second: UserAssetsToShowModel) => {
            if (!first.order || !second.order) {
              return 0;
            } else if (first.order < second.order) {
              return -1;
            } else if (first.order > second.order) {
              return 1;
            } else {
              return 0;
            }
          });
        toShow.push({
          title: 'کیف ثروت',
          detail: 'مشاهده',
          detailsType: AssetDetailsType.CTA,
          icon: 'bag-of-wealth',
          primaryColor: '#9CE5A7',
          secondaryColor: '#2FBE72',
          patternColor: AssetPatternColor.BLUE,
          unit: AssetUnitType.NONE,
          action: {
            type: ActionType.REDIRECT,
            payload: {
              url: 'mini-app/wealth/wallets/treasury',
              params: {
                referrer: 'dpxapp',
              },
            },
          },
        } as UserAssetsToShowModel);
        this.assetsToShow.set([...toShow]);
        this.isLoading.set(false);
      },
    });
  }

  transformWalletUserAsset(asset: WalletAsset): UserAssetsToShowModel {
    return {
      title: UserAssetTypesMapper[AssetTypes.WALLET],
      icon: 'wallet',
      detail: asset.totalBalance === 0 ? 'شارژ' : String(asset.totalBalance),
      detailsType: asset.totalBalance === 0 ? AssetDetailsType.CTA : AssetDetailsType.PRICE,
      primaryColor: '#0F53ED',
      secondaryColor: '#94BFFF',
      patternColor: AssetPatternColor.BLUE,
      unit: AssetUnitType.RIAL,
      order: 1,
      action: {
        type: ActionType.REDIRECT,
        payload: {
          url: '/wallet-management',
        },
      },
    };
  }

  transformCreditUserAsset(asset: CreditAsset): UserAssetsToShowModel {
    return {
      title: UserAssetTypesMapper[AssetTypes.CREDIT],
      icon: 'credit',
      detail: asset.status !== AssetStatus.ACTIVE ? CreditAssetStatusMapper[asset.status].subTitle : String(asset.balance),
      detailsType: CreditAssetStatusMapper[asset.status].detailsType,
      primaryColor: '#0F53ED',
      secondaryColor: '#94BFFF',
      patternColor: AssetPatternColor.BLUE,
      unit: CreditAssetStatusMapper[asset.status].unit,
      isDisabled: asset.status === AssetStatus.ACTIVE && asset.accountStatus === AccountStatus.BLOCK,
      order: 3,
      action: {
        type: ActionType.GO_TO_SERVICE,
        payload: {
          serviceId: FrequentServicesIdEnum.CREDIT,
        },
      },
    };
  }

  transformBnplUserAsset(asset: BnplAsset): UserAssetsToShowModel {
    const accountStatuses = this.getAccountStatuses(asset);
    const { title, detail } = this.getAssetDisplayInfo(asset, accountStatuses);

    return {
      title,
      icon: 'bnpl',
      detail,
      detailsType: CreditAssetStatusMapper[asset.status].detailsType,
      primaryColor: '#8643F3',
      secondaryColor: '#C7AAF7',
      patternColor: AssetPatternColor.PURPLE,
      unit: CreditAssetStatusMapper[asset.status].unit,
      order: 2,
      isDisabled: this.isAssetDisabled(asset, accountStatuses),
      action: {
        type: ActionType.GO_TO_SERVICE,
        payload: {
          serviceId: FrequentServicesIdEnum.BNPL,
        },
      },
    };
  }

  private getAccountStatuses(asset: BnplAsset) {
    return {
      is1PayBlocked: asset.accountStatus1Pay === AccountStatus.BLOCK,
      is4PayBlocked: asset.accountStatus4Pay === AccountStatus.BLOCK,
    };
  }

  private getAssetDisplayInfo(asset: BnplAsset, statuses: any) {
    if (asset.status !== AssetStatus.ACTIVE) {
      return {
        title: UserAssetTypesMapper[AssetTypes.BNPL],
        detail: BnplAssetStatusMapper[asset.status].subTitle,
      };
    }

    // Asset is active - determine title and detail based on account statuses
    const { is1PayBlocked, is4PayBlocked } = statuses;

    if (!is1PayBlocked && !is4PayBlocked) {
      return {
        title: UserAssetTypesMapper[AssetTypes.BNPL],
        detail: String(asset.balance),
      };
    }

    if (is1PayBlocked && !is4PayBlocked) {
      return {
        title: 'اعتبار ۴قسطه',
        detail: String(asset.balance4Pay),
      };
    }

    if (!is1PayBlocked && is4PayBlocked) {
      return {
        title: 'اعتبار ۱قسطه',
        detail: String(asset.balance1Pay),
      };
    }

    // Both are blocked - fallback to default
    return {
      title: 'اعتبار',
      detail: String(asset.balance),
    };
  }

  private isAssetDisabled(asset: BnplAsset, statuses: any): boolean {
    return asset.status === AssetStatus.ACTIVE && statuses.is1PayBlocked && statuses.is4PayBlocked;
  }

  transformSubscriptionUserAsset(asset: SubscriptionAsset): UserAssetsToShowModel {
    return {
      title: UserAssetTypesMapper[AssetTypes.SUBSCRIPTION],
      icon: 'gem',
      detail: asset.plan ? UserAssetSubscriptionPlanToTextMapper[asset.plan] : 'خرید',
      detailsType: asset.plan ? AssetDetailsType.TEXT : AssetDetailsType.CTA,
      primaryColor: asset.plan ? UserAssetSubscriptionPlanToColorMapper[asset.plan]['primaryColor'] : '#0F53ED',
      secondaryColor: asset.plan ? UserAssetSubscriptionPlanToColorMapper[asset.plan]['secondaryColor'] : '#94BFFF',
      patternColor: asset.plan
        ? (UserAssetSubscriptionPlanToColorMapper[asset.plan]['patternColor'] as AssetPatternColor)
        : AssetPatternColor.BLUE,
      unit: AssetUnitType.NONE,
      order: 4,
      action: {
        type: ActionType.REDIRECT,
        payload: {
          url: '/subscription',
        },
      },
    };
  }

  transformPayClubUserAsset(asset: PayClubAsset): UserAssetsToShowModel {
    return {
      title: UserAssetTypesMapper[AssetTypes.PAY_CLUB],
      icon: 'coins',
      detail: asset.coinCount ? String(asset.coinCount) + ' سکه' : '0',
      detailsType: AssetDetailsType.TEXT,
      primaryColor: '#FDA016',
      secondaryColor: '#FFDB59',
      patternColor: AssetPatternColor.GOLD,
      unit: AssetUnitType.NONE,
      order: 5,
      action: {
        type: ActionType.REDIRECT,
        payload: {
          url: '/pay-club',
        },
      },
    };
  }
}
