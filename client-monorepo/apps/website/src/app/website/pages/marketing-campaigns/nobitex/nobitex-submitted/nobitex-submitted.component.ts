import { Component } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'app-nobitex-submitted',
  templateUrl: './nobitex-submitted.component.html',
  styleUrls: ['./nobitex-submitted.component.scss'],
  standalone: true,
  imports: [UiButtonComponent],
})
export class NobitexSubmittedComponent {
  openMyDigiPay() {
    window.open(`${environment.appUrl}/hub?rt=service/credit/wallet`, '_blank');
  }
}
