import { Component, inject, Input, OnInit } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { BalancesInterface } from '../../../../../api/models/wallet-management/balance.interface';

interface giftCard extends BalancesInterface {
  serialNumber: string;
}

@Component({
  selector: 'app-gift-information',
  templateUrl: './gift-information.component.html',
  styleUrls: ['./gift-information.component.scss']
})
export class GiftInformationComponent implements OnInit {
  @Input() balances: BalancesInterface[];
  mode: ProgressBarMode = 'determinate';
  private generateSerialNumber = inject(GenerateSerialNumberService);
  public giftCards: giftCard[] = [];

  ngOnInit() {
    this.setSerialNumber();
  }

  setSerialNumber(): void {
    if (this.balances.length < 1) {
      return;
    }
    for (const balance of this.balances) {
      if (balance.expirationDate) {
        const serialNumber: string = this.generateSerialNumber.generate(balance.walletName);
        this.giftCards.push({...balance, serialNumber: serialNumber});
      }
    }

  }
}
function GenerateSerialNumberService(GenerateSerialNumberService: any) {
    throw new Error('Function not implemented.');
}

