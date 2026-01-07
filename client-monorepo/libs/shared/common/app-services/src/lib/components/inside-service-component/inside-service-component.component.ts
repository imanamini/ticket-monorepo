import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output, ViewChild } from '@angular/core';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { AppServiceCategoryInterface, AppServiceStatusEnum, FrequentServiceInterface } from '@client-monorepo/common/service-data';
import { CategorizedServiceBuilderComponent } from '../categorized-service-builder/categorized-service-builder.component';
import { NgClass } from '@angular/common';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { RecommendedBillTypeInterface } from '../../data-access/models/recommended-bill-type.interface';
import { CategorizedServiceItemInterface } from '../../data-access/models/categorized-service-item.interface';
import { EventManagementService } from '@client-monorepo/common/event-management';

@Component({
  selector: 'common-app-services-inside-service-component',
  standalone: true,
  imports: [DpIconComponent, CategorizedServiceBuilderComponent, NgClass, NgxSkeletonLoadingComponent],
  templateUrl: './inside-service-component.component.html',
  styleUrl: './inside-service-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsideServiceComponentComponent {
  private actionHandlerService = inject(ActionHandlerService);
  @ViewChild('ngContentWrapper', { static: true }) ngContentWrapper!: ElementRef<HTMLDivElement>;

  category = input.required<AppServiceCategoryInterface>();
  services = input<Array<FrequentServiceInterface>>([]);
  hasAction = input(false);
  title = input('');
  subTitle = input('');
  itemsToShow = input<number | null>(null);
  iconSize = input<'XS' | 'SMALL' | 'MEDIUM' | 'LARGE' | 56 | 64 | 40>(64);
  hasDefaultAction = input(true);
  isLoading = input(false);
  iconColor = input<string>('');
  onActionClicked = output<void>();
  onServiceClicked = output<CategorizedServiceItemInterface>();
  doFilter = input<boolean>(true);
  serviceType = input<'service' | 'bill'>('service');
  bills = input<Array<RecommendedBillTypeInterface>>([]);
  private eventManagementService = inject(EventManagementService);

  onActionClick(): void {
    this.onActionClicked.emit();
  }
  onServiceClick(service: CategorizedServiceItemInterface): void {
    this.onServiceClicked.emit(service);
    if (this.hasDefaultAction() && this.serviceType() === 'service') {
      if ('status' in service.data) {
        const status = service.data.status;
        const isClickable = status !== this.AppServiceStatus.DISABLED && status !== this.AppServiceStatus.NO_ACTION;
        if (!isClickable) return;
        this.eventManagementService.triggerEvent({
          eventType: 'click',
          breadCrumbs: ['hub'],
          data: {
            target: `inside-service: ${service.data.title}`,
          },
        });
        this.actionHandlerService
          .handle({
            type: ActionType.GO_TO_SERVICE,
            payload: {
              serviceId: service.data.id,
            },
          })
          .then();
      }
    }
  }
  protected readonly AppServiceStatus = AppServiceStatusEnum;
}
