import { Component, input, output } from '@angular/core';
import { ITransaction_V2 } from '../../../data-access/models/transaction.model';
import { OrderStatus } from '../../../data-access/enums/order-status';
import { TransactionTypeEnum } from '../../../data-access/enums/transaction-type.enum';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { ImageComponent } from '../image/image.component';
import { TransactionStatusDataPipe } from '../../pipes/transaction-status-data.pipe';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss'],
  standalone: true,
  imports: [NgxBadgeModule, ImageComponent, TransactionStatusDataPipe, DecimalPipe],
})
export class TransactionCardComponent {
  transaction = input<ITransaction_V2>();
  clickable = input<boolean>();
  onCardClicked = output<ITransaction_V2>();

  statusType = OrderStatus;
  transactionType = TransactionTypeEnum;

  onClick() {
    this.onCardClicked.emit(this.transaction());
  }
}
