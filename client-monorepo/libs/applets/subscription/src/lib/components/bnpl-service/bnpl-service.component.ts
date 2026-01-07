import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PlanServices, SERVICE_STATUS, SERVICES_TYPE, SubscriptionApiService } from '@client-monorepo/common/subscription';
import { SubscriptionManagementService } from '../../data-access/services/subscription-management.service';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiStatusComponent } from '../ui-status/ui-status/ui-status.component';
import { SectionTitleComponent } from '../section-title/section-title.component';
import { MessageService } from '@client-monorepo/common/utilities';
import { ActionHandlerService, ActionType, APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'subscription-applet-bnpl-service',
  templateUrl: './bnpl-service.component.html',
  standalone: true,
  styleUrls: ['./bnpl-service.component.scss'],
  imports: [PipesModule, UiStatusComponent, SectionTitleComponent, NgxButtonComponent],
})
export class BnplServiceComponent implements OnInit, OnChanges {
  @Input() service!: PlanServices;

  bnplDetailConfig: any = null;
  retryIsLoading = false;
  hasNextAction = false;

  constructor(
    private actionHandlerService: ActionHandlerService,
    private subscriptionApiService: SubscriptionApiService,
    private subscriptionManagementService: SubscriptionManagementService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    if (
      (this.service.status === SERVICE_STATUS.REJECTED && this.service.nextAction?.nextUrl) ||
      this.service.status === SERVICE_STATUS.USED
    ) {
      this.hasNextAction = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['service'] && changes?.['service'].currentValue) {
      this.setBnplDetailConfig();
    }
  }

  setBnplDetailConfig(): void {
    let config: any;
    switch (this.service.type) {
      case SERVICES_TYPE.BNPL_1PAY:
        config = {
          installmentCount: 1,
          installmentCountString: 'یک',
        };
        break;
      case SERVICES_TYPE.BNPL_4PAY:
        config = {
          installmentCount: 4,
          installmentCountString: 'چهار',
        };
    }
    this.bnplDetailConfig = config;
  }

  goToBnpl(): void {
    if (!this.service?.nextAction?.nextUrl) {
      return;
    }
    if (this.service?.status === SERVICE_STATUS.REJECTED) {
      this.actionHandlerService.handle({
        type: ActionType.REDIRECT,
        // TODO: I'm not sure this is true or not
        payload: {
          url: this.service.nextAction?.nextUrl,
        },
      });
      return;
    }
    this.actionHandlerService.handle({
      type: ActionType.OLD_ACTION,
      payload: {
        action: APP_ACTIONS.BNPL_MAIN,
      },
    });
  }

  handleRetryButton(): void {
    this.retryIsLoading = true;
    this.subscriptionApiService.retryPlanServicesApi(this.service.type).subscribe({
      next: () => {
        this.retryIsLoading = false;
        this.subscriptionManagementService.getUserCurrentPlan().then();
      },
      error: () => {
        this.retryIsLoading = false;
        this.messageService.showErrorMessage('خطایی در انجام درخواست رخ داده است');
      },
    });
  }

  protected readonly SERVICE_STATUS = SERVICE_STATUS;
}
