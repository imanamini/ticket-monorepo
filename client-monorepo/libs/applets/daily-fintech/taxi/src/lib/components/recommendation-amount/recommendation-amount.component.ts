import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxiAmountDetails } from '../../data-access/models/pay-taxi.model';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'taxi-applet-recommendation-amount',
  standalone: true,
  imports: [CommonModule, PipesModule],
  templateUrl: './recommendation-amount.component.html',
  styleUrl: './recommendation-amount.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationAmountComponent implements OnInit {
  @Input() amounts!: TaxiAmountDetails[];
  @Output() amountClickedNumber = new EventEmitter<TaxiAmountDetails>();
  selectedItem?: TaxiAmountDetails;

  ngOnInit() {
    this.selectedItem = this.amounts.find((item) => item.highlighted);
  }

  amountClicked(item: TaxiAmountDetails) {
    this.selectedItem = item;
    this.amountClickedNumber.emit(item);
  }
}
