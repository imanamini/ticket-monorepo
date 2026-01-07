import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWallet } from '../../models/wallet.interface';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxAlert } from '@digipay/ngx-alert';

@Component({
  selector: 'wealth-applet-inventory-profit',
  standalone: true,
  imports: [CommonModule, PipesModule, NgxAlert],
  templateUrl: './inventory-profit.component.html',
  styleUrl: './inventory-profit.component.scss',
})
export class InventoryProfitComponent {
  wallet = input.required<IWallet>();

  alertTitle = signal<string>('زمان مشاهده سود');
  alertText = signal<string>('سرمایه‌گذاری شما یک روز بعد از خرید مشمول سود شده و از روز دوم به موجودیتان اضافه خواهد شد.');
}
