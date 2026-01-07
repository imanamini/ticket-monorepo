import { NgxCard } from '@digipay/ngx-card';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { IBankAccount } from '../../../../components/core/models/bank-account.interface';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'wealth-applet-delete-bank-account',
  standalone: true,
  imports: [NgxCard, NgxButtonComponent],
  templateUrl: './delete-bank-account.component.html',
  styleUrl: './delete-bank-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteBankAccountComponent implements OnInit {
  bottomSheetService = inject<NgxBottomSheetService>(NgxBottomSheetService);

  data = signal<IBankAccount | undefined>(undefined);

  ngOnInit(): void {
    this.data.set(this.bottomSheetService.data());
  }

  deleteBankAccount() {
    this.bottomSheetService.outputData.set(this.data());
    this.bottomSheetService.closeBottomSheet();
  }
}
