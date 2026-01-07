import { NgxIcon } from '@digipay/ngx-icon';
import { DecimalPipe } from '@angular/common';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Component, inject, input, output, signal } from '@angular/core';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { IPortfoliosHeadup } from '../../../../components/core/models/customer-schemas';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { PENDING_TRANSACTIONS_ROUTE, PORTFO } from '../../../../data-access/constants/app-routes';
import { PendingTransactionIndicatorComponent } from '../../../../shared/components/pending-transaction-indicator.component';

@Component({
  selector: 'wealth-applet-home-assets',
  templateUrl: './home-assets.component.html',
  styleUrls: ['./home-assets.component.scss'],
  standalone: true,
  imports: [
    NgxSpinnerModule,
    NgxButtonComponent,
    NgxIcon,
    NgxBadgeModule,
    DecimalPipe,
    SpinnerComponent,
    PendingTransactionIndicatorComponent,
  ],
})
export class HomeAssetsComponent {
  isLoading = input<boolean>();
  portfolio = input<IPortfoliosHeadup>();
  isUpdating = input.required<boolean>();

  canSee = signal<boolean>(false);
  hideDetail = signal<boolean>(true);

  handleUpdateData = output();
  private navigationService = inject(WealthNavigationService);

  goToPortfo() {
    this.navigationService.navigate([PORTFO]);
  }

  updateData() {
    this.handleUpdateData.emit();
  }

  pendingTransactions() {
    this.navigationService.navigate([PENDING_TRANSACTIONS_ROUTE], {
      queryParams: {
        status: ['Draft', 'Waiting'],
        type: 'Buy',
      },
    });
  }
}
