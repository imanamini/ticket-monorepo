import { Component, Input } from '@angular/core';
import { CreditKeyValues } from '../../../../../api/clients/models/templates/credit-v3/credit-config.response';
import { UiValueSimpleComponent } from '../../../../../ui/ui-components/ui-value-cards/ui-value-simple/ui-value-simple.component';

@Component({
  selector: 'app-credit-key-values',
  templateUrl: './credit-key-values.component.html',
  styleUrls: ['./credit-key-values.component.scss'],
  standalone: true,
  imports: [UiValueSimpleComponent],
})
export class CreditKeyValuesComponent {
  @Input()
  creditKeyValues: CreditKeyValues;
}
