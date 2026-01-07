import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { ASSETS_PROMOTIONS } from '../../data-access/consts/assets-promotions.const';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ModifiedAsset } from '../../data-access/models/modified-asset.interface';

@Component({
  selector: 'common-user-assets-asset-detail-items',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxButtonComponent, PipesModule],
  templateUrl: './asset-detail-items.component.html',
  styleUrls: ['./asset-detail-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetDetailItemsComponent {
  assetsDetail = input.required<ModifiedAsset[]>();
  clickedItem = output<ModifiedAsset>();
  protected readonly ASSETS_PROMOTIONS = ASSETS_PROMOTIONS;

  handleCta(asset: ModifiedAsset): void {
    this.clickedItem.emit(asset);
  }
}
