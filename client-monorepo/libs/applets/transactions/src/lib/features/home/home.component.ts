import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { UpcomingTransactionsSummaryComponent } from '@client-monorepo/payment/transactions';
import { FrequentTransactionsSummaryComponent } from '../../components/frequent-transactions-summary/frequent-transactions-summary.component';
import { PendingTransactionsSummaryComponent } from '../../components/pending-transactions-summary/pending-transactions-summary.component';
import { PastTransactionsSummaryComponent } from '../../components/past-transactions-summary/past-transactions-summary.component';
import { CardActionsComponent } from '../../components/card-actions/card-actions.component';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { Router } from '@angular/router';

@Component({
  selector: 'transactions-applet-home',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    UpcomingTransactionsSummaryComponent,
    FrequentTransactionsSummaryComponent,
    PendingTransactionsSummaryComponent,
    PastTransactionsSummaryComponent,
    CardActionsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  backHandler = inject(BackHandlerService);
  router = inject(Router);
}
