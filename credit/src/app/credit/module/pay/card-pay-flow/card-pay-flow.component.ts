import { Component, OnInit } from '@angular/core';
import { CreditApiService } from '../../../api/credit-api.service';
import { StandardCard } from '../../../api/purchase/get-standard-cards.response';
import { StorageService } from '../../../core/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CancelService } from '../../../shared/services/cancel.service';

@Component({
  selector: 'app-card-pay-flow',
  templateUrl: './card-pay-flow.component.html',
  styleUrls: ['./card-pay-flow.component.scss']
})
export class CardPayFlowComponent implements OnInit {

  gettingData: boolean;
  cards: StandardCard[];
  selectedIndex = -1;
  routing: boolean;

  constructor(
    private creditApiService: CreditApiService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cancelService: CancelService,
  ) {
  }

  ngOnInit(): void {
    const ticket = this.activatedRoute.snapshot.paramMap.get('ticket');
    this.storageService.set({
      ticket,
    });
    this.getData();
  }

  getData() {
    this.gettingData = true;
    this.creditApiService.getStandardCards().subscribe(response => {
      this.cards = response.fundProviders;
      this.gettingData = false;
    });
  }

  onConfirm() {
    if (!this.cards[this.selectedIndex]) {
      return;
    }
    this.routing = true;
    this.router.navigate([
      'pay/card/details',
      this.storageService.get('ticket'),
      this.cards[this.selectedIndex].fundProviderBusinessId,
      '',
    ]).then(() => {
      this.routing = false;
    });
  }

  cancelPay() {
    this.cancelService.confirmBottomSheet();
  }
}
