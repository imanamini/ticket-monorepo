import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'c2c-applet-c2c-transfer-summery',
  standalone: true,
  imports: [CommonModule, ApiImageModule, PipesModule],
  templateUrl: './c2c-transfer-summery.component.html',
  styleUrl: './c2c-transfer-summery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cTransferSummeryComponent {
  // Inputs
  amount = input();
  destCardPan = input<string>('');
  destCardOwner = input<string>('');
  destBankLogo = input<string>('');
  sourceCardPan = input<string>('');
  sourceBankLogo = input<string>('');

  rows = computed(() => {
    return [
      {
        value: this.amount(),
        label: 'مبلغ انتقال',
        type: 'amount',
        currency: 'ريال',
      },
      {
        value: this.sourceCardPan(),
        label: 'انتقال از کارت',
        type: 'card',
        logo: this.sourceBankLogo(),
        maskCard: true,
      },
    ];
  });

  protected readonly String = String;
}
