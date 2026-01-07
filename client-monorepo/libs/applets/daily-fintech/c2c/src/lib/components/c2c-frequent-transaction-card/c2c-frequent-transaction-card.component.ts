import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { OnHoldDirective } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ModifiedC2cFrequentTransaction } from '../../data-access/models/c2c-frequent-transaction-response';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { C2C_FREQUENT_TRANSACTION_ICON_NAME_MAPPING } from '../../data-access/constants/c2c-frequent-transaction-icons-mapping';

@Component({
  selector: 'c2c-applet-c2c-frequent-transaction-card',
  standalone: true,
  imports: [CommonModule, ApiImageModule, PipesModule, OnHoldDirective, NgxButtonComponent, DpIconComponent],
  templateUrl: './c2c-frequent-transaction-card.component.html',
  styleUrls: ['./c2c-frequent-transaction-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cFrequentTransactionCardComponent {
  // Outputs
  moreAction = output();
  clickCard = output();

  // Inputs
  mode = input<'preview' | 'transaction'>('transaction'); // mode=preview uses for view without actions
  transaction = input<ModifiedC2cFrequentTransaction>();

  clickable = computed(() => this.mode() === 'transaction');
  editable = computed(() => this.mode() === 'transaction');

  moreActions() {
    if (!this.editable()) {
      return;
    }
    this.moreAction.emit();
  }

  handleClick(event: Event) {
    event.stopPropagation();
    this.clickCard.emit();
  }

  protected readonly C2C_FREQUENT_TRANSACTION_ICON_NAME_MAPPING = C2C_FREQUENT_TRANSACTION_ICON_NAME_MAPPING;
}
