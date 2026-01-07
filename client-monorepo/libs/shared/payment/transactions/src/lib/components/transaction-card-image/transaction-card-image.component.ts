import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionIcon, TransactionImage } from '@client-monorepo/payment/transactions';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { ApiImageModule } from '@digipay/ng-ui-api-image';

@Component({
  selector: 'payment-transactions-transaction-card-image',
  standalone: true,
  imports: [CommonModule, DpIconComponent, ApiImageModule],
  templateUrl: './transaction-card-image.component.html',
  styleUrl: './transaction-card-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionCardImageComponent implements OnInit {
  imageConfig = input.required<TransactionImage>();
  icon: Required<TransactionIcon> = {
    icon: '',
    classes: '',
    iconType: 'linear',
    iconSize: '32',
  };
  fallback = 'assets/fallback/digipay-logo-24x24-fallback.svg';

  ngOnInit(): void {
    if (this.imageConfig().type === 'icon') {
      const icon = this.imageConfig().icon;
      this.icon.icon = icon?.icon as string;
      this.icon.iconType = icon?.iconType ? icon?.iconType : 'bold';
      this.icon.iconSize = icon?.iconSize ? icon?.iconSize : '24';
      this.icon.classes = icon?.classes ? icon?.classes : '';
    }
  }
}
