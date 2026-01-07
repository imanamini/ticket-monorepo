import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-signing-documents-digital-signature-revoked',
  templateUrl: './credit-signing-documents-digital-signature-revoked.component.html',
  styleUrl: './credit-signing-documents-digital-signature-revoked.component.scss',
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentsDigitalSignatureRevokedComponent {
  buttons: Buttons[] = [
    {
      label: 'متوجه شدم',
      id: 'primary',
      style: 'fill',
      mode: 'form',
      fullWidth: true,
    },
  ];
  errorDescription =
    'اگر در آینده نیاز به امضای اسناد داشتید، می‌توانید یک امضای جدید ایجاد کنید. اطلاعات مربوط به امضای قبلی به‌صورت کامل پاک شده است.';
  errorText = 'امضای دیجیتال شما حذف شد.';
  close = output<void>();
}
