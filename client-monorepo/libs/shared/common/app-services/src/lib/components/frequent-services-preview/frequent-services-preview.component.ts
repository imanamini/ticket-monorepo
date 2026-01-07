import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import {
  AppServiceBadge,
  AppServiceStatusEnum,
  FrequentServiceInterface,
  FrequentServicesIdEnum,
  SERVICE_BADGE_MODE_MAPPER,
  SERVICE_BADGE_STATUS_MAPPER,
} from '@client-monorepo/common/service-data';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxRouterLoadingDirective } from '@digipay/ngx-router-loading';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';

@Component({
  selector: 'common-app-services-frequent-services-preview',
  standalone: true,
  imports: [
    CommonModule,
    DpIconComponent,
    NgxSkeletonLoadingComponent,
    NgxBadgeModule,
    NgxSpinnerModule,
    NgxRouterLoadingDirective,
    NgxTrackableIdDirective,
  ],
  templateUrl: './frequent-services-preview.component.html',
  styleUrl: './frequent-services-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrequentServicesPreviewComponent {
  frequentService = input<FrequentServiceInterface>({} as FrequentServiceInterface);
  isClickableFromManagementOrder = input<boolean>(false);
  isEmpty = input<boolean>(false);
  isInvert = input<boolean>(false);
  isLoading = input<boolean>(false);
  darkTitle = input<boolean>(false);
  isBig = input<boolean>(false);
  showTitle = input<boolean>(true);
  doDefaultAction = input<boolean>(true);
  clicked = output<FrequentServiceInterface>();
  actionHandlerService = inject(ActionHandlerService);
  isClickable = computed(() => {
    const status = this.frequentService().status;
    const isEnabledStatus = status !== this.AppServiceStatus.DISABLED && status !== this.AppServiceStatus.NO_ACTION;
    return isEnabledStatus || this.isClickableFromManagementOrder();
  });
  iconboxStyle = computed(() => {
    return {
      background:
        this.frequentService().docked || this.isInvert()
          ? `linear-gradient(224deg, ${this.frequentService().primaryColor} 11.43%, ${this.frequentService().secondaryColor} 92.87%)`
          : 'inherit',
    };
  });
  innerBoxStyle = computed(() => {
    return {
      background:
        !this.frequentService().docked && !this.isInvert()
          ? `linear-gradient(224deg, ${this.frequentService().primaryColor} 11.43%, ${this.frequentService().secondaryColor} 92.87%)`
          : 'transparent',
    };
  });

  disableBoxStyle = computed(() => {
    return {
      background: `#B4B7BD`,
    };
  });

  badge = input<AppServiceBadge>();
  handleClick(): void {
    if (!this.isClickable()) return;
    if (this.frequentService().id === FrequentServicesIdEnum.BUNDLE) {
      const eventData = {
        eventName: 'mini_app_clicked',
        eventData: { miniapp_name: 'internet' },
      };
      // this.eventService.sendEvent(eventData);
    }
    if (this.doDefaultAction()) {
      this.actionHandlerService
        .handle({
          type: ActionType.GO_TO_SERVICE,
          payload: {
            serviceId: this.frequentService().id,
          },
        })
        .then();
    }
    this.clicked.emit(this.frequentService());
  }

  protected readonly FrequentServicesIdEnum = FrequentServicesIdEnum;
  protected readonly AppServiceStatus = AppServiceStatusEnum;
  protected readonly SERVICE_BADGE_STATUS_MAPPER = SERVICE_BADGE_STATUS_MAPPER;
  protected readonly SERVICE_BADGE_MODE_MAPPER = SERVICE_BADGE_MODE_MAPPER;
}
