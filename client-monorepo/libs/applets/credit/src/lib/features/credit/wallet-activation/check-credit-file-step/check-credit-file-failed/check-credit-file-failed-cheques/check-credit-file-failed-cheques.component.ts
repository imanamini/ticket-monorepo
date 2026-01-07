import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CheckCreditFileFailedService } from '../services/check-credit-file-failed.service';
import { CheckCreditFileChequeAndLoan } from '../../../../data-access/models/credit/activation/check-credit-file/check-credit-file-status.response';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CheckCreditFileFailedNoData } from '../check-credit-file-failed-result';
import { NgxStateService } from '@digipay/ngx-status-result';

@Component({
  selector: 'app-check-credit-file-failed-cheques',
  standalone: true,
  imports: [PipesModule],
  templateUrl: './check-credit-file-failed-cheques.component.html',
  styleUrl: './check-credit-file-failed-cheques.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckCreditFileFailedChequesComponent implements OnInit {
  checkCreditFileFailedService = inject(CheckCreditFileFailedService);
  ngxStateService = inject(NgxStateService);

  data = signal<CheckCreditFileChequeAndLoan[]>([]);

  ngOnInit() {
    const data = this.checkCreditFileFailedService.failedData.getValue();
    this.data.set(data?.cheques!);
  }

  openDetailBottomSheet(data: CheckCreditFileChequeAndLoan) {
    this.ngxStateService.openBottomSheet(
      {
        title: `تسویه با ${data.bankName} به مبلغ ${data.amount} ریال را انجام دهید و سپس دوباره اقدام به بررسی پرونده اعتباری کنید.`,
        description: 'در غیر این صورت نمی‌توانید فرایند دریافت اعتبار را ادامه دهید.',
        icon: 'info',
        type: 'Status',
        buttons: [
          {
            id: 'checkCreditFileHintButton',
            style: 'fill',
            label: 'متوجه شدم',
            mode: 'form',
            fullWidth: true,
          },
        ],
      },
      { disableClose: true },
    );
  }

  protected readonly CheckCreditFileFailedNoData = CheckCreditFileFailedNoData;
}
