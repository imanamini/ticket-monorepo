import { Component, inject, Input } from '@angular/core';
import { SectionTitleComponent } from '../section-title/section-title.component';
import { PlanServices, SERVICES_TYPE } from '@client-monorepo/common/subscription';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'subscription-applet-dp-card-service',
  standalone: true,
  imports: [SectionTitleComponent, NgxButtonComponent],
  templateUrl: './dp-card-service.component.html',
  styleUrl: './dp-card-service.component.scss',
})
export class DpCardServicesComponent {
  @Input() service!: PlanServices;
  actionHandlerService = inject(ActionHandlerService)

  SERVICES_TYPE = SERVICES_TYPE;

  onNextActionClicked() {
    this.actionHandlerService.handle({
      type: ActionType.REDIRECT,
      payload: { url: 'transactions', type: RedirectionTypeEnum.self },
    });
  }
}
