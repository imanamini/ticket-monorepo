import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { Buttons, IconStateType } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-account-block-message',
  templateUrl: './credit-account-block-message.component.html',
  styleUrls: ['./credit-account-block-message.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, CreditScrollableViewComponent, NgxStatusResultModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditAccountBlockMessageComponent implements OnInit {
  pageTitle = input<string>();
  title = input<string>();
  ctaLabel = input<string>();
  secondaryCtaLabel = input<string>();
  errorType = input.required<IconStateType>();
  subtitle = input<string>();
  ctaClick = output();
  secondaryCtaClick = output();
  close = output();
  buttons = signal<Buttons[]>([]);

  ngOnInit(): void {
    this.generateButtons();
  }

  generateButtons() {
    if (this.ctaLabel()) {
      this.buttons.update((buttons) => [
        ...buttons,
        {
          id: this.ctaLabel()!,
          label: this.ctaLabel()!,
          style: 'tinted-on-elevated',
          mode: 'form',
        },
      ]);
    }
    if (this.secondaryCtaLabel()) {
      this.buttons.update((buttons) => [
        ...buttons,
        {
          id: this.secondaryCtaLabel()!,
          label: this.secondaryCtaLabel()!,
          style: 'link',
          mode: 'form',
        },
      ]);
    }
  }

  onButtonClick(id: string) {
    if (id === this.ctaLabel()) {
      this.ctaClick.emit();
    }
    if (id === this.secondaryCtaLabel()) {
      this.secondaryCtaClick.emit();
    }
  }
}
