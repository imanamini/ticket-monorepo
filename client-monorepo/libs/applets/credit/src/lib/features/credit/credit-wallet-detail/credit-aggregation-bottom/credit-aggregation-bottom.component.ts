import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-credit-aggregation-bottom',
  templateUrl: './credit-aggregation-bottom.component.html',
  styleUrls: ['./credit-aggregation-bottom.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, PipesModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditAggregationBottomComponent implements OnInit {
  aggregationTotalAmount = input<number>();

  amountTitle = input<string>();

  actionTitle = input<string>();

  tooltipEnabled = input<boolean>();

  surpassPadding = input<boolean>();

  actionClicked = output<void>();

  showAggregationTooltip = signal(false);

  ngOnInit(): void {
    if (this.tooltipEnabled()) {
      this.runAggregationTooltip(200, 5000);
    }
  }

  runAggregationTooltip(startTime: number, duration: number) {
    setTimeout(() => this.showAggregationTooltip.set(true), startTime);

    setTimeout(() => {
      this.showAggregationTooltip.set(false);
    }, startTime + duration);
  }

  onActionClick() {
    this.actionClicked.emit();
  }
}
