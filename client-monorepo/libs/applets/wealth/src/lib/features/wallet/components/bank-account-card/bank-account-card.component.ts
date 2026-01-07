import { CommonModule } from '@angular/common';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { IBankAccount } from '../../../../components/core/models/bank-account.interface';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NgxCard } from '@digipay/ngx-card';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { DeleteBankAccountComponent } from '../delete-bank-account/delete-bank-account.component';

@Component({
  selector: 'wealth-applet-bank-account-card',
  standalone: true,
  imports: [CommonModule, NgxRadioButtonComponent, NgxCard],
  templateUrl: './bank-account-card.component.html',
  styleUrl: './bank-account-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankAccountCardComponent {
  bankAccount = input.required<IBankAccount>();
  selectedAccountId = input<number | null>(null);

  selectedAccount = output<IBankAccount>();
  deletedAccount = output<IBankAccount>();

  private bottomSheetService = inject(NgxBottomSheetService);

  onSelectAccount(isChecked: boolean) {
    if (isChecked) {
      this.selectedAccount.emit(this.bankAccount());
    }
  }

  openDeleteBottomSheet() {
    const data: IBankAccount = this.bankAccount();
    this.bottomSheetService.openBottomSheet(DeleteBankAccountComponent, data);

    const closeSubscription = this.bottomSheetService.onClose.subscribe(() => {
      closeSubscription.unsubscribe();
      const bottomSheetOutput = this.bottomSheetService.outputData() as IBankAccount;
      if (bottomSheetOutput.shebaNumberId) {
        this.deletedAccount.emit(bottomSheetOutput);
      }
    });
  }
}
