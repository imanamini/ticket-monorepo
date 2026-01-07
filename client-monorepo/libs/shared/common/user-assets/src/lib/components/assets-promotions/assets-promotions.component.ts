import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { ButtonStyle, NgxButtonComponent } from '@digipay/ngx-button';
import { ActionHandlerService } from '@client-monorepo/common/action-handler';
import { AssetPromotionInterface } from '../../data-access/models/asset-promotion.interface';
import { FramedIconComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { EventManagementService } from '@client-monorepo/common/event-management';

@Component({
  selector: 'common-user-assets-assets-promotions',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxButtonComponent, FramedIconComponent],
  templateUrl: './assets-promotions.component.html',
  styleUrls: ['./assets-promotions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsPromotionsComponent {
  private eventManagementService = inject(EventManagementService);
  actionHandlerService = inject(ActionHandlerService);

  hasIcon = input(false);
  classes = input('');
  mode = input<'NEW_USER' | 'INTERNAL' | 'WIDGET'>('INTERNAL');
  promotions = input.required<AssetPromotionInterface[]>();

  titleClasses = computed(() => {
    switch (this.mode()) {
      case 'NEW_USER':
        return 'c-1';
      default:
        return 'st-7';
    }
  });

  cardClasses = computed(() => {
    switch (this.mode()) {
      case 'NEW_USER':
        return 'py-medium';
      default:
        return 'py-minus';
    }
  });

  modeMapper: Record<string, { buttonStyle: ButtonStyle; backgroundColor: string }> = {
    INTERNAL: { buttonStyle: 'fill', backgroundColor: 'surface-back' },
    WIDGET: { buttonStyle: 'fill', backgroundColor: 'surface-back' },
    NEW_USER: { buttonStyle: 'tinted-on-elevated', backgroundColor: 'surface-elevated' },
  };

  handleClick(promotion: any): void {
    this.trackPromotionClick(promotion);
    if (promotion && promotion.action) {
      this.actionHandlerService.handle(promotion.action);
    }
  }

  private trackPromotionClick(promotion: AssetPromotionInterface): void {
    const mode = this.mode();
    const title = promotion.title ?? '';
    const type = promotion?.type?.toString() ?? '';
    const target = `promotion-${type}: ${title}`;
    const metaMode = mode === 'INTERNAL' ? 'INTERNAL_V2' : mode;
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: mode === 'WIDGET' ? ['hub'] : ['assets'],
      data: { target },
      meta: `mode: ${metaMode}`,
    });
  }

  protected readonly ServiceImagesType = ServiceImagesType;
}
