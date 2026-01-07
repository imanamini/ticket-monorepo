import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FramedIconComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { PREMIUM_SERVICES } from '../../data-access/consts/premium-services.const';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { PremiumServiceInterface } from '../../data-access/models/premium-service.interface';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { NgxRouterLoadingDirective } from '@digipay/ngx-router-loading';

@Component({
  selector: 'common-app-services-premium-services',
  standalone: true,
  imports: [CommonModule, FramedIconComponent, NgxRouterLoadingDirective],
  templateUrl: './premium-services.component.html',
  styleUrl: './premium-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumServicesComponent {
  protected readonly PREMIUM_SERVICES = PREMIUM_SERVICES;
  protected readonly ServiceImagesType = ServiceImagesType;
  private actionHandlerService = inject(ActionHandlerService);
  private eventManagementService = inject(EventManagementService);
  createGradientConfig(primaryColor: string, secondaryColor: string) {
    return {
      start: { color: primaryColor, point: 0 },
      end: { color: secondaryColor, point: 100 },
      degree: 180,
    };
  }

  handleClick(service: PremiumServiceInterface) {
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['hub', 'premium-services'],
      data: {
        target: `premium-service: ${service.title}`,
      },
    });
    this.actionHandlerService
      .handle({
        type: ActionType.GO_TO_SERVICE,
        payload: {
          serviceId: service.id,
        },
      })
      .then();
  }
}
