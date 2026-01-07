import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OkalaCarousel } from '../../data-access/models/okala.model';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { ProductPreviewComponent } from '@client-monorepo/stores';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { OkalaService } from '../../data-access/services/okala-service';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';

@Component({
  selector: 'stores-applet-okala-carousel',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent, ProductPreviewComponent, HorizontalScrollComponent, TitleSummaryComponent],
  templateUrl: './okala-carousel.component.html',
  styleUrl: './okala-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OkalaCarouselComponent {
  carousel = input<Partial<OkalaCarousel> | undefined>(undefined);
  isLoading = computed(() => !this.carousel());
  products = computed(() => this.okalaService.mapOkalaProductsToOurProducts(this.carousel()?.products));
  navigationLink = input<string | undefined>(undefined);
  okalaService = inject(OkalaService);
  actionHandler = inject(ActionHandlerService);
  rangeCreator = rangeCreator;

  goToProductPage(externalId: number | undefined) {
    if (externalId) {
      this.actionHandler.handle({
        type: ActionType.REDIRECT,
        payload: {
          type: RedirectionTypeEnum.blank,
          url: 'https://www.okala.com/product/' + externalId,
          params: {
            external: true,
          },
        },
      });
    }
  }
}
