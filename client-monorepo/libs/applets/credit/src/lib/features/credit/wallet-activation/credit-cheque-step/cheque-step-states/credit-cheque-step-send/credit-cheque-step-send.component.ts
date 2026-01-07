import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CreditActionHandlerService } from '../../../../data-access/utils/credit-action-handler.service';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

const contentData: {
  title: string;
  description: string;
  buttonLabel: string;
} = {
  title: 'تصویر چک‌ شما تایید شد.',
  description: 'قدم‌ بعدی تحویل برگه چک ضمانت به ما است.لطفا روش تحویل را در ادامه انتخاب کنید.',
  buttonLabel: 'انتخاب روش تحویل چک',
};

@Component({
  selector: 'app-credit-cheque-step-send',
  templateUrl: './credit-cheque-step-send.component.html',
  styleUrls: ['./credit-cheque-step-send.component.scss'],
  standalone: true,
  imports: [NgxBadgeModule, NgxStatusResultModule, CreditAppBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepSendComponent {
  pickupLink = input<string>();
  close = output();
  next = output();

  data = computed(() => contentData);

  buttonLabel = computed(() => (this.pickupLink() ? contentData.buttonLabel : 'انتخاب روش تحویل چک'));
  buttons = computed<Buttons[]>(() => [
    {
      id: 'creditChequePickupButtonClick',
      mode: 'form',
      style: 'fill',
      label: this.buttonLabel(),
      fullWidth: true,
    },
  ]);
  bottomSheetService = inject(NgxBottomSheetService);
  actionHandler = inject(CreditActionHandlerService);

  onClick() {
    this.next.emit();
  }
}
