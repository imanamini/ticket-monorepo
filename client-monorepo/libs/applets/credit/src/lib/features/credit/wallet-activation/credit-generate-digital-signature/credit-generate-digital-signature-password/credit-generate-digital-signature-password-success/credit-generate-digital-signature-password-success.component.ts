import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { MessageService } from '../../../../data-access/services/message.service';
import Clipboard from '../../../../data-access/utils/clipboard';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';

@Component({
  selector: 'app-credit-generate-digital-signature-password-success',
  templateUrl: './credit-generate-digital-signature-password-success.component.html',
  styleUrl: './credit-generate-digital-signature-password-success.component.scss',
  imports: [FormsModule, NgxButtonComponent, NgxCheckboxComponent, NgxTrackableIdDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignaturePasswordSuccessComponent {
  password = input('');
  loading = input(false);
  confirmed = output<void>();
  accepted = signal(false);
  private ms = inject(MessageService);

  onSubmit() {
    this.confirmed.emit();
  }

  copy() {
    Clipboard.copy(this.password());
    this.ms.showSuccessMessage('کپی شد.');
  }
}
