import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'wealth-applet-wallet-payable-info',
  standalone: true,
  imports: [NgxTooltipDirective, PipesModule, NgxButtonComponent],
  templateUrl: './wallet-payable-info.component.html',
  styleUrl: './wallet-payable-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletPayableInfoComponent {
  uncollectible = input.required<number>();
  withdrawalBalance = input.required<number>();
  walletName = input.required<string>();
  tooltipMessage = computed(() => {
    return ` این موجودی شامل دارایی آزاد و سود تخصیص داده شده به کل موجودی ${this.walletName()} شما است.`;
  });
}
