import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PlanServices, SERVICE_STATUS } from '@client-monorepo/common/subscription';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiStatusComponent } from '../ui-status/ui-status/ui-status.component';
import { CreditRegistrationComponent } from './credit-registration/credit-registration.component';
import { ActionHandlerService, ActionType, APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'subscription-applet-credit-service',
  templateUrl: './credit-service.component.html',
  standalone: true,
  styleUrls: ['./credit-service.component.scss'],
  imports: [PipesModule, UiStatusComponent, CreditRegistrationComponent, NgxButtonComponent],
})
export class CreditServiceComponent implements OnChanges {
  @Input() service!: PlanServices;

  hasReminder = false;

  buttonText = 'مشاهده‌ی جزییات';

  constructor(private actionHandlerService: ActionHandlerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['service'] && changes?.['service'].currentValue) {
      this.initializePageConfig();
    }
  }

  initializePageConfig(): void {
    this.setButtonConfig();
    this.checkHasReminder();
  }

  setButtonConfig(): void {
    let text = '';
    switch (this.service.status) {
      case SERVICE_STATUS.INITIATED:
        text = 'اقدام برای دریافت وام';
        break;
      default:
        text = 'مشاهده‌ی جزییات';
    }
    this.buttonText = text;
  }

  checkHasReminder(): void {
    this.hasReminder = this.service.status === SERVICE_STATUS.INITIATED;
  }

  clickButton(): void {
    // TODO
    this.actionHandlerService.handle({
      type: ActionType.OLD_ACTION,
      payload: { action: APP_ACTIONS.CREDIT_MAIN },
    });
  }
}
