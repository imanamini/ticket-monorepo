import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { AssetsPromotionsComponent } from '../assets-promotions/assets-promotions.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { AssetPromotionInterface } from '../../data-access/models/asset-promotion.interface';

@Component({
  selector: 'common-user-assets-assets-promotions-detail',
  standalone: true,
  imports: [CommonModule, PipesModule, AssetsPromotionsComponent],
  templateUrl: './assets-promotions-detail.component.html',
  styleUrls: ['./assets-promotions-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsPromotionsDetailComponent {
  bottomSheetService = inject(NgxBottomSheetService);

  availablePromotions = computed<AssetPromotionInterface[]>(() => {
    return this.bottomSheetService.data().data;
  });
}
