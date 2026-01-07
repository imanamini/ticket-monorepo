import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { AssetCategoryInterface } from '../../data-access/models/asset-category.interface';
import { UiLoadingDotsComponent } from '@client-monorepo/common/ui-components';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'common-user-assets-asset-preview-v2',
  standalone: true,
  imports: [CommonModule, PipesModule, UiLoadingDotsComponent, NgxIcon],
  templateUrl: './asset-preview-v2.component.html',
  styleUrl: './asset-preview-v2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetPreviewV2Component {
  asset = input.required<AssetCategoryInterface>();
  isNewUser = input<boolean>(false);
  showInfoIcon = input<boolean>(false);
  assetIsHidden = input<boolean>(false);
  clicked = output<AssetCategoryInterface>();

  openDetail(asset: AssetCategoryInterface) {
    this.clicked.emit(asset);
  }
}
