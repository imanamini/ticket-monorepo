import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IWalletActionButton } from '../../models/wallet-action-button.interface';

@Component({
  selector: 'wealth-applet-wallet-actions',
  standalone: true,
  imports: [NgxIcon, CommonModule, NgxButtonComponent],
  templateUrl: './wallet-actions.component.html',
  styleUrl: './wallet-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletActionsComponent {
  buttons = input.required<IWalletActionButton[]>();
  actionHandler = output<string>();

  actionClick(id: string) {
    this.actionHandler.emit(id);
  }
}
