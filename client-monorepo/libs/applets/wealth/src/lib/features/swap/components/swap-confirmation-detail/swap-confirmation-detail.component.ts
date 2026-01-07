import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { WalletBalancesOutput } from '../../utils/swap-detail-mapper';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'wealth-applet-swap-confirmation-detail',
  standalone: true,
  imports: [CommonModule, PipesModule, NgxButtonComponent],
  templateUrl: './swap-confirmation-detail.component.html',
  styleUrl: './swap-confirmation-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwapConfirmationDetailComponent {
  detail = input.required<WalletBalancesOutput>();

  uncollectibleCollapsed = signal<boolean>(false);
  collectibleCollapsed = signal<boolean>(false);
}
