import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-generate-digital-signature-password-expired',
  templateUrl: './credit-generate-digital-signature-password-expired.component.html',
  styleUrl: './credit-generate-digital-signature-password-expired.component.scss',
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignaturePasswordExpiredComponent {
  initiative = input(false);
  errorDescription = input<string>();
  errorText = input<string>();

  buttons = computed<Buttons[]>(() => {
    const buttons: Buttons[] = [
      {
        id: 'signatureExpiredConfirmButton',
        style: 'fill',
        mode: 'form',
        fullWidth: true,
        label: 'متوجه شدم',
      },
    ];
    if (this.initiative()) {
      buttons.unshift({
        id: 'signatureExpiredGenerateButton',
        style: 'tinted-on-elevated',
        mode: 'form',
        fullWidth: true,
        label: 'ساخت امضای دیجیتال',
      });
    }
    return buttons;
  });

  goBack = output<void>();
  init = output<void>();
  protected readonly onclick = onclick;

  onClick(id: string) {
    if (id === 'signatureExpiredConfirmButton') {
      this.goBack.emit();
    }
    if (id === 'signatureExpiredGenerateButton') {
      this.init.emit();
    }
  }
}
