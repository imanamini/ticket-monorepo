import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OperatorIds } from '../../../../api/digipay/models/carrier/operator-ids';
import { InternetPackage } from '../../../../api/digipay/models/internet';
import { UiCurrencyComponent } from '../../../ui-components/ui-formatters/ui-currency/currency.component';
import { UiCarrierIconComponent } from '../../../ui-components/ui-cell-number-field/ui-carrier-icon/ui-carrier-icon.component';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-internet-package',
  templateUrl: './ui-internet-package.component.html',
  styleUrls: ['./ui-internet-package.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, UiCarrierIconComponent, UiCurrencyComponent],
})
export class UiInternetPackageComponent {
  @Input()
  carrier: OperatorIds;

  @Input()
  package: InternetPackage;

  @Output()
  clicked = new EventEmitter<InternetPackage>();

  get operatorIds() {
    return OperatorIds;
  }

  onClick(): void {
    this.clicked.emit(this.package);
  }
}
