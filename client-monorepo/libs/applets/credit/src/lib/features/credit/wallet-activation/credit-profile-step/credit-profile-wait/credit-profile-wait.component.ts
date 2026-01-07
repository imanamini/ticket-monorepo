import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreditProfileStatusBaseComponent } from '../credit-profile-status-base/credit-profile-status-base.component';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { CreditStepStatusMessageComponent } from '../../credit-step-status-message/credit-step-status-message.component';

@Component({
  selector: 'app-credit-profile-wait',
  templateUrl: './credit-profile-wait.component.html',
  styleUrls: ['./credit-profile-wait.component.scss'],
  standalone: true,
  imports: [CreditStepStatusMessageComponent, NgxCountDownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditProfileWaitComponent extends CreditProfileStatusBaseComponent {}
