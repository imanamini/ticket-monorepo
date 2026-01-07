import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CreditApiService } from '../../../api/credit-api.service';
import { StandardCard } from '../../../api/purchase/get-standard-cards.response';
import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-standard-cards-bottom-sheet',
  templateUrl: './standard-cards-bottom-sheet.component.html',
  styleUrls: ['./standard-cards-bottom-sheet.component.scss']
})
export class StandardCardsBottomSheetComponent implements OnInit {

  cards: StandardCard[];
  selectedIndex = -1;
  gettingData: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ref: MatBottomSheetRef<StandardCardsBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private creditApiService: CreditApiService,
    private storageService: StorageService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.gettingData = true;
    this.creditApiService.getStandardCards().subscribe(response => {
      this.cards = response.fundProviders;
      this.gettingData = false;
      this.changeDetectorRef.detectChanges();
      setTimeout(() => {
        this.changeDetectorRef.detectChanges();
      }, 200);
    });
  }

  onConfirm() {
    if (!this.cards[this.selectedIndex]) {
      return;
    }
    this.router.navigate([
      'pay/credit/details',
      this.storageService.get('ticket'),
      this.cards[this.selectedIndex].fundProviderCode
    ]).then(() => {
      this.ref.dismiss();
    });
  }
}
