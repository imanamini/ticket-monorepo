import { Component, inject, input } from '@angular/core';

import { ITransaction_V2 } from '../../../../data-access/models/transaction.model';
import { TransactionTypeEnum } from '../../../../data-access/enums/transaction-type.enum';
import { ImageComponent } from '../../../../shared/components/image/image.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { RECEIPT_ROUTE } from '../../../../data-access/constants/app-routes';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'wealth-applet-pending-transaction-card',
  standalone: true,
  imports: [ImageComponent, PipesModule, DecimalPipe],
  templateUrl: './pending-transaction-card.component.html',
  styleUrl: './pending-transaction-card.component.scss',
})
export class PendingTransactionCardComponent {
  transaction = input<ITransaction_V2>();
  from = input<string>();
  protected readonly transactionType = TransactionTypeEnum;
  navigationService = inject(WealthNavigationService);
  canSee = input<boolean>();

  onClick() {
    this.navigationService.navigate([RECEIPT_ROUTE], {
      queryParams: { uniqueId: this.transaction().uniqueId, from: this.from() },
    });
  }
}
