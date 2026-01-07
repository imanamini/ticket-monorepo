import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { AccountStatus, AssetStatus, AssetTypes, BnplAsset, UserAssetsApiService } from '@client-monorepo/common/user-assets';
import { TouchPointAssetModel } from '../data-access/model/touch-point-asset.model';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'daily-fintech-touch-point',
  standalone: true,
  imports: [CommonModule, DpIconComponent, PipesModule, NgxSkeletonLoadingComponent],
  templateUrl: './daily-fintech-touch-point.component.html',
  styleUrls: ['./daily-fintech-touch-point.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyFintechTouchPointComponent implements OnInit {
  asset = signal<TouchPointAssetModel | undefined>(undefined);
  hasValidToShow = signal(false);
  isLoading = signal(true);
  private userAssetsService = inject(UserAssetsApiService);

  ngOnInit(): void {
    this.loadUserAsset();
  }
  private loadUserAsset(): void {
    this.userAssetsService.getUserAssets().subscribe({
      next: (data) => {
        const filterBnplAsset = data.assets.find((item: BnplAsset) => item.type === AssetTypes.BNPL) as BnplAsset;
        const isValidToShow: boolean =
          filterBnplAsset?.status == AssetStatus.ACTIVE &&
          filterBnplAsset.accountStatus1Pay == AccountStatus.ACTIVE &&
          filterBnplAsset?.balance1Pay > 0;
        if (isValidToShow) {
          this.asset.set(this.transformBnplUserAsset(filterBnplAsset));
          this.hasValidToShow.set(true);
        } else {
          this.hasValidToShow.set(false);
        }
        this.isLoading.set(false);
      },
    });
  }
  transformBnplUserAsset(asset: BnplAsset): TouchPointAssetModel {
    return {
      title: 'قابل پرداخت با اعتبار ماهانه',
      icon: 'bnpl',
      balance: asset.balance1Pay,
    };
  }
}
