import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'ui-wallet-card',
  templateUrl: './wallet-card.component.html',
  styleUrls: ['./wallet-card.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, PipesModule],
})
export class WalletCardComponent {
  @Input()
  balance!: number;

  @Input()
  value: any;

  @Input()
  style = {};

  @Input()
  patternImageId!: string;

  @Input()
  color: string[] = [];

  @Input()
  retryState = false;

  @Input()
  loadingState = false;

  @Output()
  retryClick = new EventEmitter();

  @Input()
  ownerName!: string;

  onRetryClick() {
    this.retryClick.emit();
  }
}
