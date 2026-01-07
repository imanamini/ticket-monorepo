import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAccountBlockMessageComponent } from '../credit-account-block-message/credit-account-block-message.component';

@Component({
  selector: 'app-credit-account-block-init',
  templateUrl: './credit-account-block-init.component.html',
  styleUrls: ['./credit-account-block-init.component.scss'],
  standalone: true,
  imports: [CreditAccountBlockMessageComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditAccountBlockInitComponent {
  creditId = input.required<string>();
  finish = output();
  close = output();
  sendingData = signal<boolean | null>(null);

  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);

  submit(): void {
    this.sendingData.set(true);
    this.creditApiService.blockAccount(this.creditId()).subscribe({
      next: () => {
        this.sendingData.set(false);
        this.finish.emit();
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.close.emit();
      },
    });
  }
}
