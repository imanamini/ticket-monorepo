import { ChangeDetectionStrategy, Component, AfterViewInit, computed, inject, signal, input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { PerformanceTierService } from '@client-monorepo/common/utilities';
import { ASSETS_PROMOTIONS_WIDGET, ASSETS_PROMOTIONS_WIDGET_SIMPLE } from '../../data-access/consts/assets-promotions-widget.const';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { AssetsPromotionsDetailComponent } from '../assets-promotions-detail/assets-promotions-detail.component';
import { AssetPromotionInterface } from '../../data-access/models/asset-promotion.interface';
import { EventManagementService } from '@client-monorepo/common/event-management';

@Component({
  selector: 'common-user-assets-assets-promotions-widget',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, PipesModule],
  templateUrl: './assets-promotions-widget.component.html',
  styleUrls: ['./assets-promotions-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsPromotionsWidgetComponent implements AfterViewInit, OnDestroy {
  private readonly performanceTierService = inject(PerformanceTierService);
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  private readonly eventManagementService = inject(EventManagementService);

  availablePromotions = input.required<AssetPromotionInterface[]>(); // All available asset promotions used for the detailed view

  isPaused = signal(true);

  animationEffect = computed(() => this.performanceTierService.tier() !== 'low');
  displayPromotions = computed(() => {
    // Duplicate items to make the carousel loop smoothly without a jump
    return this.animationEffect() ? [...ASSETS_PROMOTIONS_WIDGET, ...ASSETS_PROMOTIONS_WIDGET] : ASSETS_PROMOTIONS_WIDGET_SIMPLE;
  });

  ngAfterViewInit(): void {
    if (this.animationEffect()) {
      this.isPaused.set(false);
    }
  }

  ngOnDestroy(): void {
    this.isPaused.set(true);
  }

  handleCta(): void {
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['hub'],
      data: {
        target: 'promotion-new-user',
      },
      meta: 'mode: WIDGET',
    });
    this.bottomSheetService.openBottomSheet(AssetsPromotionsDetailComponent, { data: this.availablePromotions() });
  }
}
