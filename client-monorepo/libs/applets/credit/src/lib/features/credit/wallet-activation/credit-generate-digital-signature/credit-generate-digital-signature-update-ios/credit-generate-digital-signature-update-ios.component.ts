import { ChangeDetectionStrategy, Component, OnInit, output, signal } from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-generate-digital-signature-update-ios',
  standalone: true,
  imports: [NgxStatusResultModule, CreditAppBarComponent],
  templateUrl: './credit-generate-digital-signature-update-ios.component.html',
  styleUrl: './credit-generate-digital-signature-update-ios.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureUpdateIosComponent implements OnInit {
  buttons = signal<Buttons[]>([]);

  back = output<void>();
  next = output<void>();

  ngOnInit() {
    this.buttons.update((buttons) => [
      ...buttons,
      {
        label: 'به‌روز‌رسانی دیجی‌پی',
        id: 'secondary',
        style: 'tinted-on-elevated',
        mode: 'form',
      },
      {
        label: 'به‌روز است',
        id: 'link',
        style: 'link',
        mode: 'form',
      },
    ]);
  }

  onClick(id: string) {
    if (id === 'secondary') {
      window.open('https://www.mydigipay.com/download/', '_blank');
      return;
    }
    if (id === 'link') {
      this.next.emit();
      return;
    }
  }
}
