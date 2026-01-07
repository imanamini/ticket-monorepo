import { Component, input } from '@angular/core';
import { EarlyCheckoutActivation } from '../../../../../../api/clients/models/templates/merchant-credit-v2/merchant-credit-template-data';
import { convertPersianDigitsToEnglish } from '../../../../../../utils/formaters';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'app-merchant-credit-early-checkout-activation',
  templateUrl: './merchant-credit-early-checkout-activation.component.html',
  styleUrls: ['./merchant-credit-early-checkout-activation.component.scss'],
  standalone: true,
  imports: [UiButtonComponent],
})
export class MerchantCreditEarlyCheckoutActivationComponent {
  MerchantCreditEarlyCheckoutActivationData = input<EarlyCheckoutActivation | undefined>();

  handleSupportTell(tel: string) {
    if (tel.length < 12) {
      return '';
    }
    tel = convertPersianDigitsToEnglish(tel);
    tel = tel.replace('-', '');
    tel = tel.substring(0, 11);
    return 'tel:' + tel;
  }
}
