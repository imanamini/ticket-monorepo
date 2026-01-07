import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Installment } from '../../data-access/models/credit/installment/installment';
import { CreditInstallmentItemComponent } from '../credit-installment-item/credit-installment-item.component';
import { CreditCheckboxComponent } from '../../components/credit-checkbox/credit-checkbox.component';
import { NgClass } from '@angular/common';

export interface CheckedChangeEvent {
  value: boolean;
  id: string;
}

@Component({
  selector: 'app-credit-installment-item-select',
  templateUrl: './credit-installment-item-select.component.html',
  styleUrl: './credit-installment-item-select.component.scss',
  standalone: true,
  imports: [CreditCheckboxComponent, CreditInstallmentItemComponent, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditInstallmentItemSelectComponent {
  installment = input<Installment>();
  isLocked = input<boolean>(false);
  checked = input(false);
  uniqId = computed(() => {
    if (this.installment()?.trackingCode) {
      return this.installment()!.trackingCode! + this.installment()?.order;
    } else {
      return this.installment()?.order.toString();
    }
  });

  lockedClick = output<void>();
  checkedChange = output<CheckedChangeEvent>();

  handleCheckbox($event: boolean) {
    this.checkedChange.emit({
      value: $event,
      id: this.uniqId()!,
    });
  }

  handleLockedClick() {
    this.lockedClick.emit();
  }
}
