import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../components/core/components/base/base.component';
import { ITransaction_V2 } from '../../../data-access/models/transaction.model';
import { HOME_ROUTE, RECEIPT_ROUTE } from '../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { TransactionCardComponent } from '../transaction-card/transaction-card.component';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TransactionCardComponent, NgxSpinnerModule],
})
export class TransactionListComponent extends BaseComponent implements AfterViewInit {
  transactions = input.required<ITransaction_V2[]>();
  lastPage = input.required<number>();
  isLoadingMore = input<boolean>();
  isCardClickable = input<boolean>();
  containerStyle = input<{ [klass: string]: any }>();
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('listContainer') listContainer!: ElementRef;
  scrollEventSubscription: Subscription;
  page = signal<number>(1);

  req = output();
  getNextPage = output<number>();
  private navigationService = inject(WealthNavigationService);

  constructor() {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.scrollContainer.nativeElement.clientHeight > this.listContainer.nativeElement.scrollHeight) {
        const count = Math.ceil(this.scrollContainer.nativeElement.clientHeight / this.listContainer.nativeElement.scrollHeight);
        for (let page = this.page(); page < count && page < this.lastPage(); page++) {
          this.page.set(this.page() + 1);
          this.getNextPage.emit(this.page());
        }
      }
    }, 100);
    this.scrollEventSubscription = fromEvent(this.scrollContainer.nativeElement, 'scroll')
      .pipe(debounceTime(500), takeUntil(this.destroyObservable))
      .subscribe(() => this.onScroll());
  }

  onScroll(): void {
    const element = this.scrollContainer.nativeElement;
    const pos = element.scrollTop + element.clientHeight;
    const maxHeight = element.scrollHeight;
    const maxHeightWithoutLoading = maxHeight - 25;

    if (pos >= maxHeightWithoutLoading && this.page() < this.lastPage()) {
      this.page.set(this.page() + 1);
      this.getNextPage.emit(this.page());
    }
  }

  onBackClicked() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  onTransactionClicked(params: ITransaction_V2) {
    this.navigationService.navigateWithQueryParams([RECEIPT_ROUTE], {
      queryParams: { uniqueId: params.uniqueId },
    });
  }
}
