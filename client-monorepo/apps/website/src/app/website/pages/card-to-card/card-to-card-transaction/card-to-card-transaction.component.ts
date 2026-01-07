import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StyledSwitchOption } from '../../../../ui/models/switch-option.model';
import { SimType } from '../../../../api/digipay/models/common/sim-type';
import { CTCSectionBankTransaction } from '../../../../api/clients/models/templates/card-to-card/card-to-card-template-data';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiAnimatedSwitchComponent } from '../../../../ui/ui-components/ui-switch/ui-animated-switch/ui-animated-switch.component';
import { NgIf, NgStyle, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-card-to-card-transaction',
  templateUrl: './card-to-card-transaction.component.html',
  styleUrls: ['./card-to-card-transaction.component.scss'],
  standalone: true,
  imports: [NgIf, UiAnimatedSwitchComponent, NgStyle, NgFor, NgClass, PipesModule],
})
export class CardToCardTransactionComponent implements OnInit {
  options: StyledSwitchOption[] = [];

  selectedOption: StyledSwitchOption;

  expand = false;

  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  value: SimType;

  @Output()
  changed = new EventEmitter<SimType>();

  @Input()
  sectionBankTransaction: CTCSectionBankTransaction;

  ngOnInit(): void {
    if (this.sectionBankTransaction.transactionLimit.title) {
      const transactionLimit = {
        label: this.sectionBankTransaction.transactionLimit.title,
        value: 'transactionLimit',
      };
      this.options.push(transactionLimit);
    }
    if (this.sectionBankTransaction.fee.title) {
      const fee = {
        label: this.sectionBankTransaction.fee.title,
        value: 'fee',
      };
      this.options.push(fee);
    }

    const o = this.options.filter((op) => op.value === 'transactionLimit');
    if (o.length > 0) {
      this.selectedOption = o[0];
    }
  }

  onChange(option: StyledSwitchOption): void {
    this.selectedOption = option;
    this.changed.emit(option.value);
  }

  expandTable() {
    this.expand = !this.expand;
  }
}
