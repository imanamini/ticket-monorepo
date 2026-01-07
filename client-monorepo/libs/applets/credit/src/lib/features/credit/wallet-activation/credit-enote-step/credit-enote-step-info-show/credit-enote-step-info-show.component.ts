import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { MessageService } from '../../../data-access/services/message.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditEnoteStateType } from '../models/credit-enote-result';
import { CreditEnoteStepErrorComponent } from '../credit-enote-step-error/credit-enote-step-error.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditDigipayImageComponent } from '../../../components/credit-digipay-image/credit-digipay-image.component';

@Component({
  selector: 'app-credit-enote-step-info-show',
  templateUrl: './credit-enote-step-info-show.component.html',
  styleUrls: ['./credit-enote-step-info-show.component.scss'],
  standalone: true,
  imports: [
    NgxButtonComponent,
    PipesModule,
    CreditEnoteStepErrorComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditDigipayImageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEnoteStepInfoShowComponent {
  errorState = signal<CreditEnoteStateType>(null);
  creditId = input.required<string>();

  pageTitle = input<string>();

  imageId = input<string>();

  payAmount = input<number>();

  guaranteeAmount = input<number>();

  switchTypePossible = input<boolean>();

  back = output<void>();

  finish = output<void>();

  changeNoteTypeClicked = output<void>();

  goToSana = output<void>();

  submittingData!: boolean;

  creditApiService = inject(CreditApiService);
  messageService = inject(MessageService);

  onBack(): void {
    this.back.emit();
  }

  onPrimaryButtonClick() {
    this.submittingData = true;
    this.creditApiService.initEnoteStep(this.creditId()).subscribe({
      next: () => {
        this.finish.emit();
      },
      error: (error) => {
        if (this.messageService.isNoServiceError(error)) {
          this.errorState.set('ENOTE_ERROR');
          return;
        } else if (this.messageService.isNoSignUpSana(error)) {
          this.errorState.set('SANA_NOT_REGISTERED');
          return;
        }
        this.messageService.showErrorOfErrorResponse(error);
        this.submittingData = false;
      },
    });
  }

  retry() {
    this.errorState.set(null);
    this.submittingData = false;
  }
}
