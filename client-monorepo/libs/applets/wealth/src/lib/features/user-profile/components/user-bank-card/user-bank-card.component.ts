import { Component, computed, input } from '@angular/core';
import { BankAccountModel } from '../../models/user-info.model';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { ConvertBankName } from '../../../../data-access/constants/banks-code-name';

@Component({
  selector: 'app-user-bank-card',
  standalone: true,
  imports: [NgxBadgeModule],
  templateUrl: './user-bank-card.component.html',
  styleUrl: './user-bank-card.component.scss',
})
export class UserBankCardComponent {
  bankAccountData = input<BankAccountModel>();

  imageUrl = computed(() => {
    return `wealth-assets/bank-icons/${ConvertBankName(this.bankAccountData().shabaNumber)}.svg`;
  });

  formatedShebaNumber = computed(() => {
    const parts = this.bankAccountData().shabaNumber.match(/.{1,4}/g);
    return parts ? parts.join(' ') : '';
  });
}
